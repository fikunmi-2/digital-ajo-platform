# Models for the services app

import uuid
from django.db import models


class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.CASCADE,
        related_name="transactions"
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        related_name="transactions"
    )

    customer_package = models.ForeignKey(
        "services.CustomerPackage",
        on_delete=models.CASCADE,
        related_name="transactions"
    )

    class TransactionType(models.TextChoices):
        CONTRIBUTION = "contribution", "Contribution"
        WITHDRAWAL = "withdrawal", "Withdrawal"
        COMMISSION = "commission", "Commission"

    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices
    )

    class EntryType(models.TextChoices):
        DEBIT = "debit", "Debit"
        CREDIT = "credit", "Credit"

    entry_type = models.CharField(
        max_length=10,
        choices=EntryType.choices
    )

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    reference = models.CharField(max_length=100, unique=True)

    # Links to source
    contribution_request = models.ForeignKey(
        "services.ContributionRequest",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="transactions"
    )

    withdrawal_request = models.ForeignKey(
        "services.WithdrawalRequest",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="transactions"
    )

    description = models.CharField(max_length=255, blank=True)

    balance_after = models.DecimalField(max_digits=12, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["tenant"]),
            models.Index(fields=["customer"]),
            models.Index(fields=["customer_package"]),
            models.Index(fields=["transaction_type"]),
            models.Index(fields=["entry_type"]),
            models.Index(fields=["reference"]),
            models.Index(fields=["tenant", "customer"]),
        ]

    def __str__(self):
        return f"{self.customer} - {self.amount} ({self.entry_type})"

from django.conf import settings


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.CASCADE,
        related_name="audit_logs"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs"
    )

    class Action(models.TextChoices):
        CREATE = "CREATE", "Create"
        UPDATE = "UPDATE", "Update"
        DELETE = "DELETE", "Delete"
        APPROVE = "APPROVE", "Approve"
        REJECT = "REJECT", "Reject"
        LOGIN = "LOGIN", "Login"
        LOGOUT = "LOGOUT", "Logout"

    action = models.CharField(max_length=20, choices=Action.choices)

    class EntityType(models.TextChoices):
        CUSTOMER = "CUSTOMER", "Customer"
        AGENT = "AGENT", "Agent"
        SAVINGS_PACKAGE = "SAVINGS_PACKAGE", "Savings Package"
        CUSTOMER_PACKAGE = "CUSTOMER_PACKAGE", "Customer Package"
        CONTRIBUTION_REQUEST = "CONTRIBUTION_REQUEST", "Contribution Request"
        WITHDRAWAL_REQUEST = "WITHDRAWAL_REQUEST", "Withdrawal Request"
        TRANSACTION = "TRANSACTION", "Transaction"

    entity_type = models.CharField(max_length=50, choices=EntityType.choices)

    entity_id = models.UUIDField()

    metadata = models.JSONField(null=True, blank=True)

    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class UserRole(models.TextChoices):
        PLATFORM_ADMIN = "PLATFORM_ADMIN", "Platform Admin"
        TENANT_ADMIN = "TENANT_ADMIN", "Tenant Admin"
        CUSTOMER = "CUSTOMER", "Customer"
        AGENT = "AGENT", "Agent"

    user_role = models.CharField(max_length=20, choices=UserRole.choices)

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["tenant"]),
            models.Index(fields=["user"]),
            models.Index(fields=["action"]),
            models.Index(fields=["entity_type"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.action} - {self.entity_type} ({self.created_at})"