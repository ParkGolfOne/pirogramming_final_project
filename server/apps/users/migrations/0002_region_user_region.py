# Generated by Django 5.0.1 on 2024-02-04 06:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('region', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('city', models.CharField(max_length=31, verbose_name='시/도')),
                ('town', models.CharField(max_length=31, verbose_name='군/구')),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='region',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='region.region'),
        ),
    ]