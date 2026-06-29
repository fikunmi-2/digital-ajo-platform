from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Tenant
from .serializers import TenantSerializer
from ..accounts.permissions import IsPlatformAdmin


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all().order_by('-created_at')
    serializer_class = TenantSerializer
    permission_classes = [IsPlatformAdmin]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

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

