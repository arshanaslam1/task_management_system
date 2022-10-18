"""this module adding functionality of permission in task app"""
from rest_framework.permissions import BasePermission


class IsManager(BasePermission):
    """
    Allows access only to Managers users.
    """

    def has_permission(self, request, view):
        return request.user.designation.is_manager
