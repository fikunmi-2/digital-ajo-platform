from tokenize import TokenError

from rest_framework import status, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .permissions import IsPlatformAdmin, IsPlatformAdminOrTenantAdmin
from .serializers import CustomTokenObtainPairSerializer, PlatformAdminSerializer, UserAccountSerializer, \
    UserAccountUpdateSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from .mixins import PermissionByActionMixin, TenantScopedQuerySetMixin

REFRESH_COOKIE_PATH = "/api/auth/"
REFRESH_COOKIE_MAX_AGE = 24 * 60 * 60 # 1 day

class PlatformAdminViewSet(ModelViewSet):
    queryset = User.objects.filter(role=User.Role.PLATFORM_ADMIN)
    serializer_class = PlatformAdminSerializer

    permission_classes = [IsPlatformAdmin]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        refresh = response.data.get('refresh')
        access = response.data.get('access')

        # Removing refresh token from body
        response.data = {
            "access": access,
        }

        # Setting the refresh token in HttpOnly Cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
            path=REFRESH_COOKIE_PATH,
            max_age=REFRESH_COOKIE_MAX_AGE,
        )

        return response

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        response = Response(
            {"detail": "Logged out successfully"},
            status=status.HTTP_200_OK)

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass

        response.delete_cookie(key="refresh_token",
                               path=REFRESH_COOKIE_PATH,)

        return response

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response(
                {"detail": "Refresh token not found"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = TokenRefreshSerializer(data={"refresh": refresh_token})

        serializer.is_valid(raise_exception=True)

        access = serializer.validated_data.get('access')
        refresh_new = serializer.validated_data.get('refresh')

        response = Response({'access': access,}, status=status.HTTP_200_OK)

        # Setting new refresh token in cookie

        if refresh_new:
            response.set_cookie(
                key="refresh_token",
                value=refresh_new,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path=REFRESH_COOKIE_PATH,
                max_age=REFRESH_COOKIE_MAX_AGE,
            )

        return response

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": str(user.id),
            "email": user.email,
            "role": user.role,
            "tenant_id": str(user.tenant_id) if user.tenant_id else None,
            "tenant_name": user.tenant.name if user.tenant else None,
        })

# User = get_user_model()

class UserViewSet(
    PermissionByActionMixin,
    TenantScopedQuerySetMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    Controlled account management

    This ViewSet does not create users.
    This ViewSet does not delete users.

    """

    serializer_class = UserAccountSerializer
    permission_classes = [IsAuthenticated]

    permission_classes_by_action = {
        "list": [IsAuthenticated, IsPlatformAdminOrTenantAdmin],
        "retrieve": [IsAuthenticated],
        "update": [IsAuthenticated],
        "partial_update": [IsAuthenticated],
        "activate": [IsAuthenticated, IsPlatformAdminOrTenantAdmin],
        "deactivate": [IsAuthenticated, IsPlatformAdminOrTenantAdmin],
    }

    tenant_field = "tenant"

    queryset = (
        User.objects.select_related("tenant")
        .exclude(role=User.Role.PLATFORM_ADMIN)
        .order_by("-created_at")
    )

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return UserAccountUpdateSerializer

        return UserAccountSerializer

    def get_queryset(self):
        """
        Tenant isolation rules:
            - platform_admin can see all tenant-owned users
            - tenant_admin can see users in their own tenant only
            - customer can only see their own account
            - platform_admin accounts are excluded from this ViewSet
        """

        queryset = super().get_queryset()
        user = self.request.user

        if not user.is_authenticated:
            return queryset.none()

        if user.role == User.Role.PLATFORM_ADMIN:
            return queryset

        if user.role == User.Role.TENANT_ADMIN:
            return queryset.filter(tenant=user.tenant)

        if user.role == User.Role.CUSTOMER:
            return queryset.filter(id=user.id)

        return queryset.none()

    def perform_update(self, serializer):
        actor = self.request.user
        target_user = serializer.instance

        if target_user.role == User.Role.PLATFORM_ADMIN:
            raise PermissionDenied(
                "Platform admin accounts must be managed through the platform admin endpoint."
            )

        if actor.role == User.Role.PLATFORM_ADMIN:
            serializer.save()
            return

        if actor.role == User.Role.TENANT_ADMIN:
            if target_user.tenant_id != actor.tenant_id:
                raise PermissionDenied(
                    "You cannot manage users outside your tenant."
                )

            if target_user.role == User.Role.TENANT_ADMIN and target_user.id != actor.id:
                raise PermissionDenied(
                    "Tenant admins cannot update other tenant admin accounts."
                )

            serializer.save()
            return

        @action(detail=True, methods=["post"])
        def activate(self, request, pk=None):
            user = self.get_object()
            self._set_active_status(user=user, is_active=True)

            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        @action(detail=True, methods=["post"])
        def deactivate(self, request, pk=None):
            user = self.get_object()
            self._set_active_status(user=user, is_active=False)

            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        def _set_active_status(self, user, is_active):
            actor = self.request.user

            if user.role == "platform_admin":
                raise PermissionDenied(
                    "Platform admin accounts must be managed through the platform admin endpoint."
                )

            if actor.role == "platform_admin":
                user.is_active = is_active
                user.save(update_fields=["is_active"])
                return

            if actor.role == "tenant_admin":
                if user.tenant_id != actor.tenant_id:
                    raise PermissionDenied("You cannot manage users outside your tenant.")

                if user.role != "customer":
                    raise PermissionDenied(
                        "Tenant admins can only activate or deactivate customer accounts."
                    )

                user.is_active = is_active
                user.save(update_fields=["is_active"])
                return

            raise PermissionDenied("You do not have permission to change this account status.")



