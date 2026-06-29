from rest_framework import serializers
from .models import Tenant

class TenantSerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(
        source='created_by.email',
        read_only=True
    )

    class Meta:
        model = Tenant
        fields = [
            "id",
            "name",
            "slug",
            "email",
            "phone",
            "logo",
            "status",
            "created_by",
            "created_by_email",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "slug",
            "created_by",
            "created_by_email",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long")

        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        value = (value.strip()
                 .replace(" ", "")
                 .replace("-", "")
                 .replace("+", "")
                 .replace("(", "")
                 .replace(")", ""))

        if not value.isdigit():
            raise serializers.ValidationError(
                "Phone number must contain digits only."
            )

        if not value.startswith("234"):
            raise serializers.ValidationError(
                "Phone number must start with '234'. Example: 2348012345678"
            )

        if len(value) != 13:
            raise serializers.ValidationError(
                "Phone number must be 13 digits. Example: 2348012345678"
            )

        return value

    def validate_logo(self, value):
        if not value:
            return value

        max_size = 2 * 1024 * 1024 # 2MB

        if value.size > max_size:
            raise serializers.ValidationError(
                "Logo file size cannot exceed 2MB."
            )

        allowed_content_types = ['image/jpeg', 'image/png', 'image/webp']

        if hasattr(value, "content_type") and value.content_type not in allowed_content_types:
            raise serializers.ValidationError(
                "Logo must be a JPEG, PNG, or WEBP image."
            )

        return value