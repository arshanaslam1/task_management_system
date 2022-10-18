"""this module provides functionally to filters for task app"""
import django_filters

from apps.accounts.models import User
from apps.tasks.models.task_models import Task


class TaskFilter(django_filters.FilterSet):
    """overriding filter to add date range filter"""
    def __init__(self, *args, **kwargs):
        """required to add custom filter"""
        super(TaskFilter, self).__init__(*args, **kwargs)
        self.form.initial['end_time'] = django_filters.IsoDateTimeFromToRangeFilter()
    # end_time_after=2022-07-05T12:53:47.168065Z&end_time_before=2022-07-18T12:53:47.168065Z
    end_time = django_filters.IsoDateTimeFromToRangeFilter()
    owner = django_filters.AllValuesMultipleFilter()
    status = django_filters.AllValuesFilter()
    assigned = django_filters.AllValuesMultipleFilter()

    class Meta:
        """this class provide meta information to the base class"""
        model = Task
        fields = ('owner', 'status', 'assigned', 'end_time', )


class UserFilter(django_filters.FilterSet):
    """overriding filter tor"""
    def __init__(self, *args, **kwargs):
        """required to add custom filter"""
        super(UserFilter, self).__init__(*args, **kwargs)
    id = django_filters.AllValuesMultipleFilter()

    class Meta:
        """this class provide meta information to the base class"""
        model = User
        fields = ('id',)

