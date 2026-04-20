# Models for the Services app

import uuid
from django.db import models
from django.utils.text import slugify


class SavingsPackage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.CASCADE,
        related_name="savings_packages"
    )

    name = models.CharField(max_length=150)
    slug = models.SlugField()

    description = models.TextField(blank=True)

    # Contribution Type
    class ContributionType(models.TextChoices):
        DAILY = "daily", "Daily"
        MONTHLY = "monthly", "Monthly"
        FLEXIBLE = "flexible", "Flexible"

    contribution_type = models.CharField(
        max_length=20,
        choices=ContributionType.choices
    )

    fixed_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    currency = models.CharField(max_length=10, default="NGN")

    target_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    lock_period_days = models.PositiveIntegerField(default=0)

    # Commission
    class CommissionType(models.TextChoices):
        FIXED = "fixed", "Fixed"
        FIRST_CONTRIBUTION = "first_contribution", "First Contribution"
        PERCENTAGE = "percentage", "Percentage"

    commission_type = models.CharField(
        max_length=30,
        choices=CommissionType.choices
    )

    commission_value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["tenant"]),
            models.Index(fields=["is_active"]),
            models.Index(fields=["contribution_type"]),
            models.Index(fields=["tenant", "is_active"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["tenant", "slug"],
                name="unique_package_slug_per_tenant"
            )
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            while SavingsPackage.objects.filter(
                    tenant=self.tenant,
                    slug=slug
            ).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class CustomerPackage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.CASCADE,
        related_name="customer_packages"
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        related_name="packages"
    )

    savings_package = models.ForeignKey(
        "services.SavingsPackage",
        on_delete=models.CASCADE,
        related_name="customer_packages"
    )

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"
        DEFAULTED = "defaulted", "Defaulted"

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )

    custom_contribution_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["customer", "savings_package"],
                name="unique_customer_savings_package"
            )
        ]
        indexes = [
            models.Index(fields=["tenant"]),
            models.Index(fields=["customer"]),
            models.Index(fields=["savings_package"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"{self.customer} - {self.savings_package}"

class ContributionRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.CASCADE,
        related_name="contribution_requests"
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        related_name="contributions"
    )

    customer_package = models.ForeignKey(
        "services.CustomerPackage",
        on_delete=models.CASCADE,
        related_name="contributions"
    )

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    class PaymentMethod(models.TextChoices):
        MANUAL = "manual", "Manual"
        TRANSFER = "transfer", "Transfer"
        POS = "pos", "POS"
        USSD = "ussd", "USSD"
        ONLINE = "online", "Online"
        OTHER = "other", "Other"

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices
    )

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    notes = models.TextField(blank=True, null=True)

    reference = models.CharField(max_length=100, unique=True)

    recorded_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="recorded_contributions"
    )

    approved_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_contributions"
    )

    confirmed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["tenant"]),
            models.Index(fields=["customer"]),
            models.Index(fields=["customer_package"]),
            models.Index(fields=["status"]),
            models.Index(fields=["reference"]),
            models.Index(fields=["tenant", "status"]),
        ]

    def __str__(self):
        return f"{self.customer} - {self.amount}"

class WithdrawalRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.CASCADE,
        related_name="withdrawal_requests"
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        related_name="withdrawals"
    )

    customer_package = models.ForeignKey(
        "services.CustomerPackage",
        on_delete=models.CASCADE,
        related_name="withdrawals"
    )

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        CANCELLED = "cancelled", "Cancelled"

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    reference = models.CharField(max_length=100, unique=True)

    requested_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="requested_withdrawals"
    )

    processed_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="processed_withdrawals"
    )

    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["tenant"]),
            models.Index(fields=["customer"]),
            models.Index(fields=["customer_package"]),
            models.Index(fields=["status"]),
            models.Index(fields=["reference"]),
            models.Index(fields=["tenant", "status"]),
        ]

    def __str__(self):
        return f"{self.customer} - {self.amount}"