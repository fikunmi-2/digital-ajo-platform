from tokenize import TokenError

from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserCreateSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

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
            secure=settings.DEBUG is False,
            samesite="Lax",
            path="/api/auth/refresh/",
        )

        return response

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

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
                               path="/api/auth/refresh/",)

        return response

class CustomTokenRefreshView(TokenRefreshView):

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

        response.set_cookie(
            key="refresh_token",
            value=refresh_new,
            httponly=True,
            secure=settings.DEBUG is False,
            samesite="Lax",
            path="/api/auth/refresh/",
        )

        return response

class MeView(APIView):
    permissions_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": str(user.id),
            "email": user.email,
            "role": user.role,
            "tenant_id": str(user.tenant_id if user.tenant_id else None),
            "tenant_name": user.tenant if user.tenant else None,
        })