# Generated by Django 5.0.1 on 2024-02-06 05:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0002_golflocation_golf_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='golflocation',
            name='golf_user',
        ),
    ]