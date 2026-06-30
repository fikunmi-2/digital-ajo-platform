from rest_framework import serializers

from backend.accounts.models import User
from .models import Customer


class CustomerUserInputSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")

        return value

    class CustomerSerializer(serializers.Serializer):
        user_id = serializers.UUIDField(source="user.id", read_only=True)
        email = serializers.EmailField(source="user.email", read_only=True)
        is_active = serializers.BooleanField(source="user.is_active", read_only=True)

        tenant_id = serializers.UUIDField(source="user.tenant_id", read_only=True)
        tenant_name = serializers.CharField(source="user.tenant_name", read_only=True)

        class Meta:
            model = Customer
            fields = [
                "id",

            ]