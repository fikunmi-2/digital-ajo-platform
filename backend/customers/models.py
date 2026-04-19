# Models for the Customer app

import uuid
from django.db import models


class Customer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relationships
    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.CASCADE,
        related_name="customers"
    )

    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="customer_profile"
    )

    agent = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assigned_customers",
        limit_choices_to={"role": "agent"}
    )

    # Personal Info
    surname = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    date_joined = models.DateTimeField()
    address = models.CharField(max_length=255)
    date_of_birth = models.DateField()

    profile_picture = models.ImageField(
        upload_to="customer_profiles/",
        null=True,
        blank=True
    )

    # Enums
    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"

    gender = models.CharField(max_length=20, choices=Gender.choices)

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"
        SUSPENDED = "suspended", "Suspended"

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)

    # Identity & Banking
    nin = models.CharField(max_length=11, unique=True)

    bank_name = models.CharField(max_length=100, blank=True)
    account_number = models.CharField(max_length=20, blank=True)
    account_name = models.CharField(max_length=150, blank=True)

    class Channel(models.TextChoices):
        REFERRAL = "referral", "Referral"
        AGENT = "agent", "Agent"
        SOCIAL_MEDIA = "social_media", "Social Media"
        ADVERTISEMENT = "advertisement", "Advertisement"
        OTHER = "other", "Other"

    channel = models.CharField(max_length=20, choices=Channel.choices, default=Channel.REFERRAL)

    # Next of Kin
    next_of_kin_name = models.CharField(max_length=150, blank=True)
    next_of_kin_address = models.CharField(max_length=255, blank=True)
    next_of_kin_phone = models.CharField(max_length=20, blank=True)
    next_of_kin_relationship = models.CharField(max_length=100, blank=True)

    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["tenant"]),
            models.Index(fields=["user"]),
            models.Index(fields=["agent"]),
            models.Index(fields=["status"]),
            models.Index(fields=["tenant", "status"]),
        ]

    def __str__(self):
        return f"{self.first_name} {self.surname}"