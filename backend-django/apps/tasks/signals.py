"""this module provides signals functionality for the tasks app"""
from django.core.exceptions import ObjectDoesNotExist
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django_q.tasks import async_task
from apps.tasks.models.task_models import Task


@receiver(pre_save, sender=Task)
def pre_email_sender(sender, instance, **kwargs):
    """send notification email to sender in the result of modified and creation of task"""
    try:
        old_instance = Task.objects.get(id=instance.id)
        if instance.assigned != old_instance.assigned:
            async_task('apps.core.helper.email_sender.EmailSender', instance, "Task Assigned")
        if instance.status != old_instance.status and instance.status:
            async_task('apps.core.helper.email_sender.EmailSender', instance, "Task Completed")
        elif instance.status != old_instance.status:
            async_task('apps.core.helper.email_sender.EmailSender', instance, "Task Reopened")
    except ObjectDoesNotExist:
        pass


@receiver(post_save, sender=Task)
def post_email_sender(sender, instance, created, **kwargs):
    """send notification email to sender in the result of modified and creation of task"""
    if created:
        if instance.assigned is not None:
            async_task('apps.core.helper.email_sender.EmailSender',
                       instance, "Task Assigned", sync=False)
        if instance.status == Task.Status.COMPLETE.value:
            async_task('apps.core.helper.email_sender.EmailSender',
                       instance, "Task Completed")
