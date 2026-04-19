import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

# Models for the Accounts app

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    ROLE_CHOICES = (
        ("tenant_admin", "Tenant Admin"),
        ("customer", "Customer"),
        ("agent", "Agent")
    )

    tenant = models.ForeignKey(
        "Tenant",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="users"
    )


    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

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



class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    logo = models.ImageField(upload_to="tenant_logos/", null=True, blank=True)

    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("suspended", "Suspended")
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    created_by = models.ForeignKey("User",
                                   null=True,
                                   blank=True,
                                   on_delete=models.SET_NULL,
                                   related_name="created_tenants")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
