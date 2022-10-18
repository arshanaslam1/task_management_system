"""this module registering task app to django admin panel"""
import csv
from io import TextIOWrapper
from django.contrib import admin
from django.forms import forms
from django.shortcuts import redirect, render
from django.urls import path
from django.http import HttpResponse
from apps.tasks.management.commands.load_task_data import task_csv
from apps.tasks.models.department_models import Designation, Department
from apps.tasks.models.task_models import Task


admin.site.register(Designation)
admin.site.register(Department)


class ExportCsvMixin:
    """this class provides functionality to export data as cvs file from django panel"""
    def export_as_csv(self, request, queryset):
        """this function provides functionally of exporting csv"""
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            writer.writerow([getattr(obj, field) for field in field_names])
        return response
    export_as_csv.short_description = "Export Selected"


class CsvImportForm(forms.Form):
    """this file required for import data from admin panel to django models"""
    csv_file = forms.FileField()


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin, ExportCsvMixin):
    """this class provides functional for Task model"""
    actions = ["export_as_csv"]
    list_display = ("title", "body", "status", "start_time", "end_time", "assigned", "owner")
    list_filter = ("status", "start_time", "end_time", "assigned", "owner")
    change_list_template = "task/admin/task_change_list.html"

    def get_urls(self):
        """provides functionality for csv file urls """
        urls = super().get_urls()
        my_urls = [
            path('import-csv/', self.import_csv),
        ]
        return my_urls + urls

    def import_csv(self, request):
        """provides functionally of importing data from csv to task model"""
        if request.method == "POST":
            csv_file = TextIOWrapper(request.FILES["csv_file"].file, encoding='utf-8')
            task_csv(csv_file)
            self.message_user(request, "Your csv file has been imported")
            return redirect("..")
        form = CsvImportForm()
        payload = {"form": form}
        return render(
            request, "task/admin/task_csv_form.html", payload
        )
