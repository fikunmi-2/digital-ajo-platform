from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from backend.accounts.models import User
from .models import Customer

# Validate helper functions
def validate_ngn_phone(value):
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
            "Phone number must start with '234'."
        )

    if len(value) != 13:
        raise serializers.ValidationError(
            "Phone number must contain exactly 13 digits."
        )

    return value

def validate_nin(value):
    value = value.strip()

    if not value.isdigit():
        raise serializers.ValidationError(
            "NIN number must contain digits only."
        )

    if len(value) != 11:
        raise serializers.ValidationError(
            "NIN number must be exactly 11 digits."
        )

    return value

def validate_profile_picture(value):
    max_image_size = 2 * 1024 * 1024 #2MB
    allowed_image_types = ["image/jpeg", "image/png", "image/webp"]

    if not value:
        return value

    if value.size > max_image_size:
        raise serializers.ValidationError(
            "Image size must not exceed 2MB."
        )

    content_type = getattr(value, "content_type", None)

    if content_type not in allowed_image_types:
        raise serializers.ValidationError(
            "Only JPEG, PNG and WEBP images are allowed."
        )

    return value

class CustomerUserInputSerializer(serializers.Serializer):
    """
    Handles email/password for the customer login account
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")

        return value

    def validate_password(self, value):

        # An already existing password validator
        validate_password(value)
        return value

class CustomerSerializer(serializers.Serializer):
    """
    Handles normal output/list/retrieve response
    """
    user_id = serializers.UUIDField(source="user.id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    is_active = serializers.BooleanField(source="user.is_active", read_only=True)

    tenant_id = serializers.UUIDField(source="tenant_id", read_only=True)
    tenant_name = serializers.CharField(source="tenant_name", read_only=True)

    class Meta:
        model = Customer
        fields = [
            "id",

            # linked account
            "user_id",
            "email",
            "is_active",

            # tenant
            "tenant_id",
            "tenant_name",

            # personal info
            "surname",
            "first_name",
            "phone",
            "date_joined",
            "address",
            "date_of_birth",
            "profile_picture",
            "gender",
            "status",

            # identity and banking
            "nin",
            "bank_name",
            "account_number",
            "account_name",
            "channel",

            # next of kin
            "next_of_kin_name",
            "next_of_kin_address",
            "next_of_kin_phone",
            "next_of_kin_relationship",

            #audit
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user_id",
            "email",
            "is_active",
            "tenant_id",
            "tenant_name",
            "status",
            "created_at",
            "updated_at",
        ]