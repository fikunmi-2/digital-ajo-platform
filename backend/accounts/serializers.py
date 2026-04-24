from django.contrib.admindocs.utils import ROLES
from rest_framework import serializers
from .models import User

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "tenant",
            "role"
        ]

        read_only_fields = ["id"]

    def validate(self, data):
        role = data.get('role')
        tenant = data.get('tenant')

        is_platform_admin = role == "platform_admin"

        print("Role: ", role)

        # Enforcing that Users that are not platform admin must belong to
        # a tenant

        if not is_platform_admin and not tenant:
            raise serializers.ValidationError(
                "Users must belong to a tenant (company)"
            )

        if is_platform_admin and tenant:
            raise serializers.ValidationError(
                "Platform admins cannot belong to a tenant (company)"
            )

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user