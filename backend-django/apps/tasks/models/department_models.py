"""Providing Organizational structural functional models """
from django.db import models


class Designation(models.Model):
    """implements designation of employees"""
    is_manager = models.BooleanField(default=False, null=False, blank=False)
    title = models.CharField(unique=True, max_length=150, blank=False,
                             null=False
                             )

    def __str__(self):
        """object title"""
        return f'{self.title}'

    class Meta:
        """this class provide meta information to the base class"""
        ordering = ("-title",)
        verbose_name_plural = "Designation"


class Department(models.Model):
    """implements department of organization"""
    designation = models.ManyToManyField(Designation, related_name="designation_to_department", blank=True)
    title = models.CharField(unique=True, max_length=150, blank=False,
                             null=False
                             )

    def __str__(self):
        """object title"""
        return f'{self.title}'

    class Meta:
        """this class provide meta information to the base class"""
        ordering = ("-title",)
        verbose_name_plural = "Departments"
