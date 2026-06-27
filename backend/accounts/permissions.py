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