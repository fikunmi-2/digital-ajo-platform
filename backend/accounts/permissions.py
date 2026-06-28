from rest_framework.permissions import BasePermission

class IsPlatformAdmin(BasePermission):
    """
    Allows access only to platform admins.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "platform_admin"
        )

class IsTenantAdmin(BasePermission):
    """
    Allows access only to tenant admins.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "tenant_admin"
            and request.user.tenant_id is not None
        )

class IsAgent(BasePermission):
    """
    Allows access only to agents.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "agent"
            and request.user.tenant_id is not None
        )

class IsCustomer(BasePermission):
    """
    Allows access only to customers.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "customer"
            and request.user.tenant_id is not None
        )

class IsTenantUser(BasePermission):
    """
    Allows access only to users who belong to a tenant:
    tenant_admin, agent, customer
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ["tenant_admin", "agent", "customer"]
            and request.user.tenant_id is not None
        )

class IsPlatformAdminOrTenantAdmin(BasePermission):
    """
    Allows access only to tenants or platform admins.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.role == "platform_admin":
            return True

        return (
                request.user.role == "tenant_admin"
                and request.user.tenant_id is not None
        )

class IsTenantAdminOrCustomer(BasePermission):
    """
    Allows access to tenant admins and customers.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ["tenant_admin", "customer"]
            and request.user.tenant_id is not None
        )

class IsSameTenantObject(BasePermission):
    """
    Object-level permission.
    Ensures tenants can only access objects belonging to their tenant.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.role == "platform_admin":
            return True

        if not user.tenant_id:
            return False

        if hasattr(obj, "tenant"):
            return obj.tenant_id == user.tenant_id

        # Fallback for objects connected through customer.
        if hasattr(obj, "customer") and hasattr(obj.customer, "tenant_id"):
            return obj.customer.tenant_id == user.tenant_id

        # Fallback for customer package-like objects.
        if hasattr(obj, "customer_package") and hasattr(obj.customer_package, "tenant_id"):
            return obj.customer_package.tenant_id == user.tenant_id

        return False

class IsCustomerOwner(BasePermission):
    """
    Allows a customer to access only their own customer-related objects.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.role != "customer":
            return False

        # Customer object itself
        if hasattr(obj, "user_id"):
            return obj.user_id == user.id

        # Objects related to customer:
        # CustomerPackage, ContributionRequest, WithdrawalRequest, Transaction
        if hasattr(obj, "customer") and hasattr(obj.customer, "user_id"):
            return obj.customer.user_id == user.id

        return False