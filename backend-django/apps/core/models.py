from django.db import models


class TimeStampedModel(models.Model):
    """Model for timestamp"""
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        """Meta class for timestamp Model for timestamp"""
        abstract = True
