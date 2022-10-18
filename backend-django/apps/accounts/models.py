from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.tasks.models.department_models import Designation, Department


class User(AbstractUser):
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE,
                                    related_name="designation_to_users", null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE,
                                   related_name="department_to_users", blank=True, null=True)
