from django.contrib.admindocs.utils import ROLES
from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class PlatformAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "tenant",
            "role",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "role",
            "tenant",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User(
            email=validated_data['email'],
            role=User.Role.PLATFORM_ADMIN,
            tenant=None
        )
        user.set_password(password)
        user.save()

        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adding Custom Claims
        token["user_id"] = str(user.id)
        token["role"] = user.role
        token["tenant_id"] = str(user.tenant_id if user.tenant_id else None)

        return token