# Generated by Django 4.2.9 on 2024-02-01 16:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GolfLocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('golf_image', models.ImageField(blank=True, upload_to='locations/images/')),
                ('golf_scale', models.TextField(blank=True)),
                ('golf_name', models.CharField(max_length=50)),
                ('golf_address', models.CharField(max_length=50)),
                ('golf_latitude', models.DecimalField(decimal_places=8, max_digits=9)),
                ('golf_longitude', models.DecimalField(decimal_places=8, max_digits=9)),
                ('golf_detail', models.TextField(max_length=200)),
                ('golf_holes', models.IntegerField()),
            ],
        ),
    ]