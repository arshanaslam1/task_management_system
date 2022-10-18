""" Test module provides endpoint tests for Employee view test"""
import datetime
import json
from django.utils.timezone import make_aware
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from apps.tasks.models.task_models import Task


class EmployeeTaskBaseTest(APITestCase):
    """ Test module base class for authenticating
     and providing some support for Employee view test"""

    def setUp(self):
        """ Test function for setup test"""
        self.register_url = "http://0.0.0.0/dj-rest-auth/registration/"
        self.user_data = {
            "username": "root",
            "email": "arshan.aslam94@gmail.com",
            "password1": "HIDELll786.",
            "password2": "HIDELll786."
        }
        self.client.post(self.register_url, self.user_data)  # user created
        auth_url = reverse("rest_login")
        self.logged_in_user = self.client.post(auth_url, {
            "email": self.user_data.get("email"),
            "password": self.user_data.get("password1")
        }).data

        # get access_token for authorization
        self.access_token = self.logged_in_user.get("access_token")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        user_id = self.logged_in_user.get("user").get("pk")
        self.task = Task.objects.create(
            title="test_task_valid_detail",
            body="test_task_valid_detail",
            start_time=make_aware(datetime.datetime.now()),
            end_time=make_aware(datetime.datetime.now()),
            owner_id=user_id,
            assigned_id=user_id,
        )

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


class CreateNewTaskTest(EmployeeTaskBaseTest):
    """ Test module for creating a new task """

    def test_create_valid_task(self):
        """ Test functions for valid test create TimelineViewSet """
        response = self.client.post(reverse('tasks-list'),
                                    data=json.dumps(self.valid_create_payload),
                                    content_type='application/json'
                                    )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_task(self):
        """ Test functions for invalid test create TimelineViewSet """
        response = self.client.post(reverse('tasks-list'),
                                    data=json.dumps(self.invalid_create_payload),
                                    content_type='application/json'
                                    )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_task_list(self):
        """ Test functions for valid test task TimelineViewSet """
        for i in range(5):
            self.test_create_valid_task()
        response = self.client.get(reverse('tasks-list')
                                   )
        self.assertEqual(len(response.data), 6)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class DetailTaskTest(EmployeeTaskBaseTest):
    """ Test class provides testing
    functionality for detail MTimelineViewSet """

    def test_task_valid_detail(self):
        """ Test functions for valid test detail TimelineViewSet """
        response = self.client.get(reverse('tasks-detail',
                                           kwargs={'pk': self.task.id})
                                   )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_task_invalid_detail(self):
        """ Test functions for invalid test detail TimelineViewSet """
        response = self.client.get(reverse('tasks-detail', kwargs={'pk': 430})
                                   )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class PutTaskTest(EmployeeTaskBaseTest):
    """ Test class provides testing
       functionality for Put TimelineViewSet """

    def test_valid_put_task(self):
        """ Test functions for valid test Put TimelineViewSet """
        response = self.client.put(
            reverse('tasks-detail', kwargs={'pk': self.task.pk}),
            data=json.dumps(self.valid_create_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_put_task(self):
        """ Test functions for invalid test Put TimelineViewSet """
        response = self.client.put(
            reverse('tasks-detail', kwargs={'pk': self.task.pk}),
            data=json.dumps(self.invalid_create_payload),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PatchTaskTest(EmployeeTaskBaseTest):
    """ Test class provides testing
       functionality for Patch TimelineViewSet """

    def test_valid_patch_task(self):
        """ Test functions for valid test Patch TimelineViewSet """
        response = self.client.patch(
            reverse('tasks-detail', kwargs={'pk': self.task.pk}),
            data=json.dumps(self.valid_patch_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_patch_task(self):
        """ Test functions for invalid test Patch TimelineViewSet """
        response = self.client.patch(
            reverse('tasks-detail', kwargs={'pk': self.task.pk}),
            data=json.dumps(self.invalid_patch_payload),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DeleteTaskTest(EmployeeTaskBaseTest):
    """ Test class provides testing functionality for
         deleting TimelineViewSet """

    def test_valid_delete_task(self):
        """ Test functions for valid test delete TimelineViewSet """
        response = self.client.delete(
            reverse('tasks-detail', kwargs={'pk': self.task.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_task(self):
        """ Test functions for invalid test delete TimelineViewSet """
        response = self.client.delete(
            reverse('tasks-detail', kwargs={'pk': 30}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
