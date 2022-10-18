"""this module provides serializer function to the manager views"""
import datetime
from django.utils.timezone import make_aware
from dateutil.parser import *
from apps.tasks.models.department_models import Designation, Department
from rest_framework import serializers
from apps.accounts.models import User
from apps.tasks.models.task_models import Task


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = ('id', 'first_name', 'last_name')
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    """this class requires to make many make query
         to nested serializer EmployeeViewSet"""
    owner_data = UserSerializer(read_only=True, source='owner')
    assigned_data = UserSerializer(read_only=True, source='assigned')
    consumed_hours = serializers.SerializerMethodField()

    class Meta:
        """this class provide meta information to the base class"""

        model = Task
        read_only_fields = ('id', 'created_on', 'updated_on', 'owner',)
        fields = ('id', 'start_time', 'end_time', 'title', 'body',
                  'created_on', 'updated_on', 'owner', 'assigned',
                  'status', 'owner_data', 'assigned_data', 'consumed_hours',
                  )
        extra_kwargs = {'title': {'required': True},
                        'body': {'required': True}
                        }

    def get_consumed_hours(self, obj):
        return (obj.end_time - obj.start_time).total_seconds() / 3600


class DepartmentSerializer(serializers.ModelSerializer):
    """this class requires to make many relation with manager views"""

    class Meta:
        """this class provide meta information to the base class"""
        model = Department
        fields = ('title',)


class DesignationSerializer(serializers.ModelSerializer):
    """this class requires to make many relation with manager views"""

    class Meta:
        """this class provide meta information to the base class"""
        model = Designation
        fields = ('title', 'is_manager')


class ManagerUserAndTaskListSerializer(serializers.ListSerializer):
    """this class requires to make many make query to nested serializer for ManagerUserAndTaskSerializer"""

    def to_representation(self, data):
        """this class provide meta information to the base class"""
        # Dealing with nested relationships, data can be a Manager,
        # so, first get a queryset from the Manager if needed
        raw_to_date = self.context['request'].query_params.get("to_date", None)
        raw_from_date = self.context['request'].query_params.get("from_date", None)
        try:
            to_date = parse(raw_to_date)
        except:
            to_date = make_aware(parse("2000-01-01"))
        try:
            from_date = parse(raw_from_date)
        except:
            from_date = make_aware(datetime.datetime.now())
        data = data.filter(end_time__range=[to_date, from_date])
        return super(ManagerUserAndTaskListSerializer, self).to_representation(data)


class ManagerUserAndTaskTaskSerializer(serializers.ModelSerializer):
    """this class requires to make many make query
     to nested serializer ManagerUserAndTaskSerializer"""

    class Meta:
        """this class provide meta information to the base class"""
        list_serializer_class = ManagerUserAndTaskListSerializer
        model = Task
        fields = ('id', 'start_time', 'end_time', 'title', 'body',
                  'created_on', 'updated_on', 'owner', 'assigned',
                  'status',)
        read_only_fields = ('id', 'created_on', 'updated_on', 'owner',)
        extra_kwargs = {'title': {'required': True},
                        'body': {'required': True}
                        }


class ManagerUserAndTaskSerializer(serializers.ModelSerializer):
    """this class requires to ManagerUserAndTaskViews Set"""

    designation = DesignationSerializer(many=False, read_only=True)
    assigned = ManagerUserAndTaskTaskSerializer(many=True, read_only=True)

    class Meta:
        """this class provide meta information to the base class"""
        model = User
        fields = ('id', 'first_name', 'last_name', 'username',
                  'email', 'designation', 'assigned',)
        read_only_fields = ('id', 'first_name', 'last_name',
                            'username', 'email', 'designation', 'assigned',)


class ManagerUserReportsListSerializer(serializers.ListSerializer):
    """this class requires to make many make query and reports for ManagerUserTaskReportSerializer"""

    def to_representation(self, data):
        """this class provide meta information to the base class"""
        # Dealing with nested relationships, data can be a Manager,
        # so, first get a queryset from the Manager if needed
        raw_to_date = self.context['request'].query_params.get("after_date", None)
        raw_from_date = self.context['request'].query_params.get("before_date", None)
        try:
            to_date = parse(raw_to_date)
        except:
            to_date = make_aware(parse("2000-01-01"))
        try:
            from_date = parse(raw_from_date)
        except:
            from_date = make_aware(datetime.datetime(datetime.MAXYEAR, 12, 1))
        data = data.filter(end_time__range=[to_date, from_date])
        upcomingdeadline = data.filter(
            status=Task.Status.PENDING.value,
            end_time__range=[make_aware(datetime.datetime.now()
                                        ),
                                    make_aware(datetime.datetime.now() + datetime.timedelta(7))]).count()
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
            if serialized_task_obj['status'] == Task.Status.COMPLETE.value:
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


class ManagerUserTaskReportSerializer(serializers.ModelSerializer):
    """this class requires to make many make query
         to nested serializer ManagerUserReportsSerializer"""

    class Meta:
        """this class provide meta information to the base class"""
        list_serializer_class = ManagerUserReportsListSerializer
        model = Task
        fields = ('start_time', 'end_time', 'assigned',
                  'status',)
        read_only_fields = ('start_time', 'end_time', 'assigned',
                            'status',)


class ManagerUserReportsSerializer(serializers.ModelSerializer):
    """this class requires to ManagerUserReportsViews Set"""
    designation = DesignationSerializer(many=False, read_only=True)
    assigned = ManagerUserTaskReportSerializer(many=True, read_only=True)
    department = DepartmentSerializer(many=False, read_only=True)

    class Meta:
        """this class provide meta information to the base class"""
        model = User
        fields = ('id', 'first_name', 'last_name', 'username',
                  'email', 'designation', 'assigned', 'department',)
        read_only_fields = ('start_time', 'end_time', 'assigned',
                            'status',)
