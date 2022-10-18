"""Providing tasks models """
from config.settings import AUTH_USER_MODEL
from django.db import models
import datetime
from django.utils.timezone import make_aware
from dateutil.parser import *
from apps.core.models import TimeStampedModel


class Task(TimeStampedModel):
    """implements task data"""

    class Status(models.TextChoices):
        """implements Choices for status field"""
        PENDING = 'pending', 'Pending'
        COMPLETE = 'complete', 'Complete'

    owner = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE,
                              related_name='tasks')
    assigned = models.ForeignKey(AUTH_USER_MODEL, models.SET_NULL,
                                 blank=True, null=True, related_name='assigned')
    '''assigned = models.ForeignKey(AUTH_USER_MODEL, models.SET_NULL,
                                 blank=True, null=True, related_name='assigned')'''
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, null=False)
    title = models.CharField(max_length=150, blank=False, null=False)
    body = models.CharField(max_length=2000, blank=True, null=True)
    start_time = models.DateTimeField(blank=False, null=False)
    end_time = models.DateTimeField(blank=False, null=False)

    def __str__(self):
        """object title"""
        return f'{self.assigned}{self.created_on}'

    class Meta:
        """this class provide meta information to the base class"""
        ordering = ("-created_on",)
        verbose_name_plural = "Tasks"

    @classmethod
    def combine_report(cls, user, query_params):
        raw_assigned = query_params.getlist('assigned',default=list)
        raw_end_date_after = query_params.get("end_date_after", None)
        raw_end_date_before = query_params.get("end_date_before", None)

        if user.designation.is_manager:
            try:
                assigned = list(map(int, raw_assigned))
            except:
                assigned = ''
        else:
            assigned = [user.id]

        try:
            end_date_after = parse(raw_end_date_after)
        except:
            end_date_after = make_aware(parse("2000-01-01"))
        try:
            end_date_before = parse(raw_end_date_before)
        except:
            end_date_before = make_aware(datetime.datetime(datetime.MAXYEAR, 12, 1))
        """take parameter for query and return report"""

        if assigned:
            data = cls.objects.filter(
                assigned__in=user.department.department_to_users.filter(id__in=assigned),
                end_time__gte=end_date_after, end_time__lte=end_date_before,)
            upcomingdeadline = cls.objects.filter(
                assigned__in=user.department.department_to_users.filter(
                    id__in=assigned),
                status=cls.Status.PENDING.value,
                end_time__gte=make_aware(datetime.datetime.now()),
                end_time__lte=make_aware(datetime.datetime.now() + datetime.timedelta(7)),).count()
        else:
            data = cls.objects.filter(
                assigned__in=user.department.department_to_users.all(), end_time__gte=end_date_after,
                end_time__lte=end_date_before, )
            upcomingdeadline = cls.objects.filter(
                assigned__in=user.department.department_to_users.all(),
                status=cls.Status.PENDING.value,
                end_time__gte=make_aware(datetime.datetime.now()),
                end_time__lte=make_aware(datetime.datetime.now() + datetime.timedelta(7)), ).count()
        pending = 0
        complete = 0
        total_time = datetime.timedelta()
        report = {}
        for task_obj in data:
            serialized_task_obj = {
                'start_time': task_obj.start_time,
                'end_time': task_obj.end_time,
                'status': task_obj.status,
            }
            if serialized_task_obj['status'] == cls.Status.COMPLETE.value:
                complete += 1
                total_time += (serialized_task_obj['end_time'] - serialized_task_obj['start_time'])
            else:
                pending += 1

        report["Worked Hours"] = total_time // datetime.timedelta(hours=1)
        report["Pending Tasks"] = pending
        report["Complete Tasks"] = complete
        report["Total Tasks"] = complete + pending
        report["Upcoming Deadline"] = upcomingdeadline
        return report
