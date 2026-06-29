from django.contrib.admindocs.utils import ROLES
from django.contrib.auth import get_user_model
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

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        if "email" in validated_data:
            instance.email = validated_data["email"]

        instance.role = User.Role.PLATFORM_ADMIN
        instance.tenant = None

        if password:
            instance.set_password(password)

        instance.save()

        return instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adding Custom Claims
        token["user_id"] = str(user.id)
        token["role"] = user.role
        token["tenant_id"] = str(user.tenant_id if user.tenant_id else None)

        return token

# User = get_user_model()

class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "role",
            "tenant_id",
            "tenant_name",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "role",
            "tenant_id",
            "tenant_name",
            "is_active",
            "created_at",
            "updated_at",
        ]

class UserAccountUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=False)
    class Meta:
        model = User
        fields = [
            "email",
            "password",
        ]

    def validate_email(self, value):
        value = value.strip().lower()

        queryset = User.objects.filter(email=value)

        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)

        if queryset.exists():
            raise serializers.ValidationError("A user with this email already exists.")

        return value.strip().lower()

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance