# Generated by Django 4.0.5 on 2022-07-04 10:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0006_alter_department_designation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='department',
            name='designation',
            field=models.ManyToManyField(blank=True, related_name='designation_to_department', to='tasks.designation'),
        ),
    ]
