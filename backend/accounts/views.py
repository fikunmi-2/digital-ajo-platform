from tokenize import TokenError

from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .permissions import IsPlatformAdmin
from .serializers import CustomTokenObtainPairSerializer, PlatformAdminSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings

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