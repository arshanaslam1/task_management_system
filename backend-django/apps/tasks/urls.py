"""this module provides urls routing for task app"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import views

# Create a router and register our view sets with it.
router = DefaultRouter()
router.register('dep/tasks', views.TaskViewSet,
                basename="manager_view_set")
router.register('dep/employee', views.ManagerUserAndTaskViewSet,
                basename="manager_employee_view_set")
router.register('dep/reports', views.ManagerUserReportsViewSet,
                basename="manager_report_view_set")
router.register('dep/user', views.UserViewSet,
                basename="dep_user_view_set")


# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('dep/combine/report/', views.TaskReportMultipleUserCombineView.as_view()),
]
