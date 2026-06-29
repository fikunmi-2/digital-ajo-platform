from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers
from .models import Tenant
from accounts.models import User


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

class TenantAdminInputSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email=value).exits():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )

        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as error:
            raise serializers.ValidationError(list(error.messages))

        return value

class TenantOnboardingSerializer(serializers.Serializer):
    tenant = TenantSerializer()
    admin = TenantAdminInputSerializer(write_only=True)

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]

        tenant_data = validated_data.pop("tenant")
        admin_data = validated_data.pop("admin")

        tenant = Tenant.objects.create(
            created_by=request.user,
            **tenant_data
        )

        tenant_admin = User(
            email=admin_data["email"],
            role=User.Role.TENANT_ADMIN,
            tenant=tenant,
            is_staff=False,
            is_superuser=False,
        )

        tenant_admin.set_password(admin_data["password"])
        tenant_admin.save()

        return {
            "tenant": tenant,
            "admin": tenant_admin,
        }
    def to_representation(self, instance):
        tenant = instance["tenant"]
        admin = instance["admin"]

        return {
            "tenant": TenantSerializer(tenant, context=self.context).data,
            "admin": {
                "id": str(admin.id),
                "email": admin.email,
                "role": admin.role,
                "tenant_id": str(admin.tenant_id),
            },
        }