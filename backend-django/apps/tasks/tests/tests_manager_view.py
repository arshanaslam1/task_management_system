""" Test module provides endpoint tests for Manager view test"""
import datetime
import json
import uuid
from django.utils.timezone import make_aware
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.tasks.models.department_models import Department, Designation
from apps.tasks.models.task_models import Task


class ManagerTaskBaseTest(APITestCase):
    """ Test base class for authenticating and providing
     some support for Manager view test"""

    def setUp(self):
        """ Test function for setup test"""

        desi_manager = Designation.objects.create(title="Manager",
                                                  is_manager=True)
        desi_sa = Designation.objects.create(title="software Engineer")
        department = Department.objects.create(title="Development")
        department.designation.add(desi_manager)
        department.designation.add(desi_sa)
        self.emp_1 = User.objects.create(email=uuid.uuid4().hex[:30] + "@gmail.com",
                                         username=uuid.uuid4().hex[:30],
                                         password=uuid.uuid4().hex[:30],
                                         department=department,
                                         designation=desi_sa)
        emp_2 = User.objects.create(email=uuid.uuid4().hex[:30] + "@gmail.com",
                                    username=uuid.uuid4().hex[:30],
                                    password=uuid.uuid4().hex[:30],
                                    department=department,
                                    designation=desi_sa)
        self.user_data = {
            "username": "root",
            "email": "arshan.aslam94@gmail.com",
            "password1": "HPDELll786.",
            "password2": "HPDELll786."
        }
        User.objects.create_user(email=self.user_data.get("email"),
                                 username=self.user_data.get("username"),
                                 password=self.user_data.get("password1"),
                                 department=department,
                                 designation=desi_manager)

        auth_url = reverse("rest_login")
        self.logged_in_user = self.client.post(auth_url, {
            "email": self.user_data.get("email"),
            "password": self.user_data.get("password1")
        }).data

        # get access_token for authorization
        self.access_token = self.logged_in_user.get("access_token")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        user_objs = {"emp_1": self.emp_1, "emp_2": emp_2}
        emp_1_task = []
        for i in range(2):
            for key, value in user_objs.items():
                task = Task.objects.create(
                    title=" uuid.uuid4().hex[:30]",
                    body=" uuid.uuid4().hex[:30]",
                    start_time=make_aware(datetime.datetime.now()),
                    end_time=make_aware(datetime.datetime.now()),
                    owner_id=value.id,
                    assigned=value,
                )
                if key == "emp_1":
                    emp_1_task.append(task)

        self.task = emp_1_task[0]

        self.valid_patch_payload = {
            'title': 'test created 1st task valid_payload',
            'body': "test created 1st task",
            'start_time': '2022-06-22 12:53:47.168065+00:00',
        }
        self.invalid_patch_payload = {
            'body': "test created 1st task invalid_payload",
            'start_time': '2022-06-22 12:53:47.168065+00:00',
            'end_time': '2022-0'
        }
        self.valid_create_payload = {
            'title': 'test created 1st task valid_payload',
            'body': "test created 1st task",
            'start_time': '2022-06-22 12:53:47.168065+00:00',
            'end_time': '2022-06-22 12:53:47.168065+00:00'
        }
        self.invalid_create_payload = {
            'body': "test created 1st task invalid_payload",
            'start_time': '2022-06-22 12:53:47.168065+00:00',
            'end_time': '2022-06-22 12:53:47.168065+00:00'
        }


class CreateNewTaskTest(ManagerTaskBaseTest):
    """ Test class provides testing
    functionality for create ManagerUserTaskViewSet """

    def test_create_valid_task(self):
        """ Test functions for valid test create ManagerUserTaskViewSet """
        response = self.client.post(reverse('manager_view_set-list'),
                                    data=json.dumps(self.valid_create_payload),
                                    content_type='application/json'
                                    )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_task(self):

        """ Test functions for invalid test create ManagerUserTaskViewSet """
        response = self.client.post(reverse('manager_view_set-list'),
                                    data=json.dumps(self.invalid_create_payload),
                                    content_type='application/json'
                                    )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ListTaskTest(ManagerTaskBaseTest):
    """ Test class provides testing
    functionality for list ManagerUserTaskViewSet """

    def test_task_list(self):
        """ Test functions for valid test list ManagerUserTaskViewSet """
        response = self.client.get(reverse('manager_view_set-list'))
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class DetailTaskTest(ManagerTaskBaseTest):
    """ Test class provides testing
    functionality for detail ManagerUserTaskViewSet """

    def test_task_valid_detail(self):
        """ Test functions for valid test detail ManagerUserTaskViewSet """
        response = self.client.get(reverse('manager_view_set-detail',
                                           kwargs={'pk': self.task.id})
                                   )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_task_invalid_detail(self):
        """ Test functions for invalid test detail ManagerUserTaskViewSet """
        response = self.client.get(reverse('manager_view_set-detail',
                                           kwargs={'pk': 430})
                                   )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class PutTaskTest(ManagerTaskBaseTest):
    """ Test class provides testing
    functionality for Put ManagerUserTaskViewSet """

    def test_valid_put_task(self):
        """ Test functions for valid test Put ManagerUserTaskViewSet """
        response = self.client.put(
            reverse('manager_view_set-detail', kwargs={'pk': self.task.pk}),
            data=json.dumps(self.valid_create_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_put_task(self):
        """ Test functions for invalid test Put ManagerUserTaskViewSet """
        response = self.client.put(
            reverse('manager_view_set-detail', kwargs={'pk': self.task.pk}),
            data=json.dumps(self.invalid_create_payload),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PatchTaskTest(ManagerTaskBaseTest):
    """ Test class provides testing
    functionality for Patch ManagerUserTaskViewSet """
    def test_valid_patch_task(self):
        """ Test functions for valid test Patch ManagerUserTaskViewSet """
        response = self.client.patch(
            reverse('manager_view_set-detail', kwargs={'pk': self.task.pk}),
            data=json.dumps(self.valid_patch_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_patch_task(self):
        """ Test functions for invalid test Patch ManagerUserTaskViewSet """
        response = self.client.patch(
            reverse('manager_view_set-detail', kwargs={'pk': self.task.pk}),
            data=json.dumps(self.invalid_patch_payload),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DeleteTaskTest(ManagerTaskBaseTest):
    """ Test class provides testing functionality for
     deleting ManagerUserTaskViewSet """

    def test_valid_delete_task(self):
        """ Test functions for valid test delete ManagerUserTaskViewSet """
        response = self.client.delete(
            reverse('manager_view_set-detail', kwargs={'pk': self.task.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_task(self):
        """ Test functions for invalid test delete ManagerUserTaskViewSet """
        response = self.client.delete(
            reverse('manager_view_set-detail', kwargs={'pk': 2000}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ListEmployeeWithTaskTest(ManagerTaskBaseTest):
    """ Test class for list ManagerUserAndTaskViewSet """

    def test_task_list(self):
        """ Test functions for valid test list of ManagerUserAndTaskViewSet """
        user = User.objects.all().count()
        response = self.client.get(reverse('manager_employee_view_set-list'))
        self.assertEqual(len(response.data), user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class DetailEmployeeWithTaskTest(ManagerTaskBaseTest):
    """ Test class for detail ManagerUserAndTaskViewSet """

    def test_task_valid_detail(self):
        """ Test functions for valid test detail ManagerUserAndTaskViewSet """
        response = self.client.get(reverse('manager_employee_view_set-detail',
                                           kwargs={'pk': self.emp_1.pk})
                                   )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_task_invalid_detail(self):
        """ Test functions for invalid test detail ManagerUserAndTaskViewSet """
        user = User.objects.all().count()
        response = self.client.get(reverse('manager_employee_view_set-detail',
                                           kwargs={'pk': user + 1})
                                   )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ListEmployeeTaskReportTest(ManagerTaskBaseTest):
    """ Test class testing ManagerUserReportsViewSet """

    def test_task_list(self):
        """ Test functions for valid test list of ManagerUserReportsViewSet """
        user = User.objects.all().count()
        response = self.client.get(reverse('manager_employee_view_set-list'))
        self.assertEqual(len(response.data), user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class DetailEmployeeTaskReportTest(ManagerTaskBaseTest):
    """ Test class testing for detail ManagerUserReportsViewSet """

    def test_task_valid_detail(self):
        """ Test functions for valid test detail of employee with his report """
        response = self.client.get(reverse('manager_report_view_set-detail',
                                           kwargs={'pk': self.emp_1.pk})
                                   )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_task_invalid_detail(self):
        """ Test functions for invalid test detail of employee with his report """
        user = User.objects.all().count()
        response = self.client.get(reverse('manager_report_view_set-detail',
                                           kwargs={'pk': user + 1})
                                   )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

