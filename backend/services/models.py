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