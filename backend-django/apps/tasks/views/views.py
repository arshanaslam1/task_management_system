"""this module provides functionally to employee for task"""
import datetime
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from dateutil.parser import *
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.tasks.filters import TaskFilter, UserFilter
from apps.tasks.permissions.permissions import IsManager

from apps.tasks.serializers.serializers import \
    ManagerUserReportsSerializer, ManagerUserAndTaskSerializer, UserSerializer, TaskSerializer
from apps.tasks.models.task_models import Task


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
        A view set that provides the standard actions
    """
    serializer_class = UserSerializer

    def get_queryset(self):
        """provide objects related to his department"""
        queryset = self.request.user.department.department_to_users.all()
        return queryset


class TaskReportMultipleUserCombineView(APIView):
    """
        Provide report of all department
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        """
        Return a list of all users.
        """
        usernames = Task.combine_report(request.user, request.query_params)
        return Response(usernames)


class TaskViewSet(viewsets.ModelViewSet):
    """
    A view set that provides the standard actions
    """

    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = TaskFilter
    filterset_fields = ('owner', 'status', 'assigned', 'end_time',)

    def get_queryset(self):
        """provide objects related to his department"""
        if self.request.user.designation.is_manager:
            queryset = Task.objects.filter(
                assigned__in=self.request.user.department.department_to_users.all())
        else:
            queryset = Task.objects.filter(
                assigned__id=self.request.user.id)

        return queryset

    def perform_create(self, serializer):
        if self.request.user.designation.is_manager:
            serializer.save(owner=self.request.user)
        else:
            serializer.save(owner=self.request.user, assigned=self.request.user)


class ManagerUserAndTaskViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A simple ViewSet for viewing reports.
    """
    serializer_class = ManagerUserAndTaskSerializer
    permission_classes = (IsAuthenticated, IsManager,)
    filter_backends = (OrderingFilter,)
    ordering_fields = ('id', 'first_name', 'last_name',
                       'username', 'email', 'designation')

    def get_queryset(self):
        """provide objects related to his department"""
        queryset = self.request.user.department.department_to_users.all()
        return queryset


class ManagerUserReportsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A simple ViewSet for viewing reports.
    """
    serializer_class = ManagerUserReportsSerializer
    permission_classes = (IsAuthenticated, IsManager,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = UserFilter
    filterset_fields = ('id',)

    def get_queryset(self):
        """provide objects related to his department"""
        queryset = self.request.user.department.department_to_users.all()
        return queryset
