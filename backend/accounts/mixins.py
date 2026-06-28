from typing import ClassVar

from rest_framework.permissions import BasePermission


class PermissionByActionMixin:
    """
    Allows a ViewSet to define different permission classes
    for different actions: list, retrieve, create, update, destroy, etc.
    """

    permission_classes_by_action: ClassVar[dict[str, list[type[BasePermission]]]] = {}

    def get_permissions(self):
        action = getattr(self, "action", None)
        default_permission_classes = getattr(self, "permission_classes", [])

        permission_classes = self.permission_classes_by_action.get(
            action,
            default_permission_classes
        )

        return [permission() for permission in permission_classes]


class TenantScopedQuerySetMixin:
    """
    Filters queryset based on the authenticated user's tenant.
    """

    platform_admin_can_view_all = True

    def get_queryset(self):
        queryset = super().get_queryset()  # type: ignore[attr-defined]
        request = getattr(self, "request", None)
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated:
            return queryset.none()

        if user.role == "platform_admin":
            if self.platform_admin_can_view_all:
                return queryset
            return queryset.none()

        if not user.tenant_id:
            return queryset.none()

        model = queryset.model
        model_field_names = [field.name for field in model._meta.fields]

        if "tenant" in model_field_names:
            return queryset.filter(tenant_id=user.tenant_id)

        return queryset.none()