from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.mixins import PermissionByActionMixin
from accounts.permissions import (
    IsPlatformAdminOrTenantAdmin,
    IsTenantAdmin,
)
from accounts.models import User
from .models import Customer
from .serializers import (
    CustomerSerializer,
    CustomerCreateSerializer,
    CustomerUpdateSerializer,
)


class CustomerViewSet(
    PermissionByActionMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    Customer onboarding and management.

    Creates both:
    - User account with role=customer
    - Customer profile

    Delete is intentionally blocked.
    """

    queryset = (
        Customer.objects.select_related("tenant", "user")
        .order_by("-created_at")
    )
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    permission_classes_by_action = {
        "list": [IsAuthenticated, IsPlatformAdminOrTenantAdmin],
        "create": [IsAuthenticated, IsTenantAdmin],
        "retrieve": [IsAuthenticated],
        "update": [IsAuthenticated, IsPlatformAdminOrTenantAdmin],
        "partial_update": [IsAuthenticated, IsPlatformAdminOrTenantAdmin],
        "activate": [IsAuthenticated, IsPlatformAdminOrTenantAdmin],
        "deactivate": [IsAuthenticated, IsPlatformAdminOrTenantAdmin],
        "suspend": [IsAuthenticated, IsPlatformAdminOrTenantAdmin],
        "me": [IsAuthenticated],
    }

    def get_serializer_class(self):
        if self.action == "create":
            return CustomerCreateSerializer

        if self.action in ["update", "partial_update"]:
            return CustomerUpdateSerializer

        return CustomerSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if not user.is_authenticated:
            return queryset.none()

        if user.role == User.Role.PLATFORM_ADMIN:
            return queryset

        if user.role == User.Role.TENANT_ADMIN:
            return queryset.filter(tenant=user.tenant)

        if user.role == User.Role.CUSTOMER:
            return queryset.filter(user=user)

        return queryset.none()

    def perform_update(self, serializer):
        actor = self.request.user
        customer = serializer.instance

        if actor.role == User.Role.PLATFORM_ADMIN:
            serializer.save()
            return

        if actor.role == User.Role.TENANT_ADMIN:
            if customer.tenant_id != actor.tenant_id:
                raise PermissionDenied("You cannot update customers outside your tenant.")

            serializer.save()
            return

        raise PermissionDenied("You do not have permission to update this customer.")

    def destroy(self, request, *args, **kwargs):
        raise PermissionDenied(
            "Customers cannot be deleted. Use deactivate or suspend instead."
        )

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        customer = self.get_object()
        self._set_customer_status(
            customer=customer,
            customer_status=Customer.Status.ACTIVE,
            user_is_active=True,
        )

        serializer = CustomerSerializer(customer, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        customer = self.get_object()
        self._set_customer_status(
            customer=customer,
            customer_status=Customer.Status.INACTIVE,
            user_is_active=False,
        )

        serializer = CustomerSerializer(customer, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def suspend(self, request, pk=None):
        customer = self.get_object()
        self._set_customer_status(
            customer=customer,
            customer_status=Customer.Status.SUSPENDED,
            user_is_active=False,
        )

        serializer = CustomerSerializer(customer, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def me(self, request):
        if request.user.role != User.Role.CUSTOMER:
            raise NotFound("No customer profile found for this user.")

        customer = self.get_queryset().filter(user=request.user).first()

        if not customer:
            raise NotFound("No customer profile found for this user.")

        serializer = CustomerSerializer(customer, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def _set_customer_status(self, customer, customer_status, user_is_active):
        actor = self.request.user

        if actor.role == User.Role.PLATFORM_ADMIN:
            customer.status = customer_status
            customer.user.is_active = user_is_active

            customer.save(update_fields=["status"])
            customer.user.save(update_fields=["is_active"])
            return

        if actor.role == User.Role.TENANT_ADMIN:
            if customer.tenant_id != actor.tenant_id:
                raise PermissionDenied(
                    "You cannot manage customers outside your tenant."
                )

            customer.status = customer_status
            customer.user.is_active = user_is_active

            customer.save(update_fields=["status"])
            customer.user.save(update_fields=["is_active"])
            return

        raise PermissionDenied("You do not have permission to manage this customer.")