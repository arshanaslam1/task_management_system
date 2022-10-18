"""this module is required for the register app config to django framework"""
from django.apps import AppConfig


class TrackingConfig(AppConfig):
    """this function configures basic config for the tasks app"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.tasks'

    def ready(self):
        from apps.tasks.signals import post_email_sender, pre_email_sender
