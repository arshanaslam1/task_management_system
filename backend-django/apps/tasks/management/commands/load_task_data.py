"""this module providing data upload csv to
 task model by command line and admin panel"""
import _io
import csv
import uuid
from django.core.management import BaseCommand
from django.utils import timezone
from apps.accounts.models import User
from apps.tasks.models.task_models import Task


def task_csv(csv_file: _io.TextIOWrapper) -> str:
    """take opened csv file and save data in task model"""
    start_t = timezone.now()
    data = csv.DictReader(csv_file, delimiter=",")
    tasks = []
    for row in data:
        try:
            status = row['status']
            title = row['title']
            body = row['body']
            start_time = row['start_time']
            end_time = row['end_time']
            created_on = row['created_on']
            updated_on = row['updated_on']
            assigned = row['assigned']
            owner = row['owner']
        except:
            return "Header are must be named as status, title," \
                   " body, start_time, end_time, created_on, updated_on, " \
                   "assigned, owner and all Columns ara required "

        user, user_created = User.objects.get_or_create(email=assigned,
                                                        defaults={'username': uuid.uuid4().hex[:30],
                                                                  'password': uuid.uuid4().hex[:30]}, )
        if assigned[0] != owner[0]:
            owner, owner_created = User.objects.get_or_create(email=owner,
                                                              defaults={'username': uuid.uuid4().hex[:30],
                                                                        'password': uuid.uuid4().hex[:30]}, )
        else:
            owner = user
        task = Task(status=status,
                    title=title,
                    body=body,
                    start_time=start_time,
                    end_time=end_time,
                    created_on=created_on,
                    updated_on=updated_on,
                    assigned=user,
                    owner=owner
                    )

        tasks.append(task)
        if len(tasks) > 5000:
            Task.objects.bulk_create(tasks)
            tasks = []
    if tasks:
        Task.objects.bulk_create(tasks)
    end_t = timezone.now()
    total_seconds = (end_t - start_t).total_seconds()
    return f'{total_seconds}'


class Command(BaseCommand):
    """this class provide to register module to data upload command"""
    help = "Loads Task and user from CSV file."

    def add_arguments(self, parser):
        """takes parser and set file path as temporary file"""
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **options):
        """take file path and call task cvs to save data"""
        file_path = options["file_path"]
        with open(file_path, "r") as csv_file:
            total_seconds = task_csv(csv_file)

        self.stdout.write(
            self.style.SUCCESS(
                f"Loading CSV took: {total_seconds} seconds."
            )
        )
