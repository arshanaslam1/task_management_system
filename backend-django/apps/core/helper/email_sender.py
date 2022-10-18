""""This module for email sending"""
import json
import os
import environ
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from django.core.mail import EmailMessage
from apps.tasks.models.department_models import Designation


env = environ.Env()
# reading env file
environ.Env.read_env(os.path.join(settings.BASE_DIR, 'env'))


class EmailSender:
    """This class take instance of task and flag and
    then send email to task assigned user and his manager"""

    def __init__(self, task_instance, subject):
        self.task_instance = task_instance
        self.subject = subject
        if task_instance.assigned:
            self.employee = task_instance.assigned
            if Designation.objects.get(is_manager=True) and self.employee.department.department_to_users.filter(
                    designation=Designation.objects.get(is_manager=True)).first():
                self.manager = self.employee.department.department_to_users.filter(
                    designation=Designation.objects.get(is_manager=True)).first()
                self.__send()

    def __send(self):
        """This function send email and run when object is class initialized"""
        employee_email = self.employee.email
        manager_email = self.manager.email
        email_to = [employee_email, manager_email]
        email_from = settings.EMAIL_HOST_USER
        msg = EmailMessage(from_email=email_from, to=email_to)
        msg.template_id = env("template_id_tasks")
        msg.dynamic_template_data = {
            'subject': self.subject,
            'employee_name': self.employee.first_name,
            'employee_username': self.employee.username,
            'task_title': self.task_instance.title,
            'task_body': self.task_instance.body,
            'task_status': self.task_instance.status,
            'task_creation_date': json.dumps(self.task_instance.created_on,
                                             sort_keys=True, default=str),
            'task_start': json.dumps(self.task_instance.start_time, sort_keys=True, default=str),
            'task_deadline': json.dumps(self.task_instance.end_time, sort_keys=True, default=str),
            'manager_name': self.manager.first_name,
            'manager_username': self.manager.username,
        }
        msg.send(fail_silently=False)
