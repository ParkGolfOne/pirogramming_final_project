# Generated by Django 5.0.1 on 2024-02-13 04:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0002_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='game',
            old_name='create_by',
            new_name='created_by',
        ),
    ]
