from rest_framework.decorators import action
from rest_framework import viewsets, status, generics
from rest_framework.response import Response

from .models import Tenant
from .serializers import TenantSerializer, TenantOnboardingSerializer
from accounts.permissions import IsPlatformAdmin


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all().order_by('-created_at')
    serializer_class = TenantSerializer
    permission_classes = [IsPlatformAdmin]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        return Response(
            {
                "detail": "Tenants cannot be deleted, Use deactivate or suspend instead.",
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        tenant = self.get_object()
        tenant.status = Tenant.Status.ACTIVE
        tenant.save(update_fields=['status', 'updated_at'])

        serializer = self.get_serializer(tenant)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        tenant = self.get_object()
        tenant.status = Tenant.Status.SUSPENDED
        tenant.save(update_fields=['status', 'updated_at'])

        serializer = self.get_serializer(tenant)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        tenant = self.get_object()
        tenant.status = Tenant.Status.INACTIVE
        tenant.save(update_fields=['status', 'updated_at'])

        serializer = self.get_serializer(tenant)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TenantOnboarding(generics.CreateAPIView):
    serializer_class = TenantOnboardingSerializer
    permission_classes = [IsPlatformAdmin]

