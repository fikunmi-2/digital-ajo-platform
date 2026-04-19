import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

# Models for the Accounts app

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    tenant = models.ForeignKey(
        "tenant.Tenant",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="users"
    )

    class Role(models.TextChoices):
        TENANT_ADMIN = "tenant_admin", "Tenant Admin"
        CUSTOMER = "customer", "Customer"
        AGENT = "agent", "Agent"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER
    )

    username = None
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    is_platform_admin = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["tenant"]),
            models.Index(fields=["email"]),
            models.Index(fields=["role"]),
            models.Index(fields=["tenant", "role"])
        ]

    def __str__(self):
        return self.email