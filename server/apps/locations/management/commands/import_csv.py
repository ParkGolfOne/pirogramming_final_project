import csv
from typing import Any
from django.core.management.base import BaseCommand, CommandParser
import os
from django.core.files import File
from apps.locations.models import *

# csv 파일로 변환된 골프장 정보들을 DB에 migrate하는 과정을 자동화
# 장고의 custom command 기능 -> 내가 임의로 만들고 싶은 명령어를 만들 수 있음

# 커스텀 커맨드의 클래스는 항상 BaseCommand를 상속 받는 command
class Command(BaseCommand):
    help = 'Import Park Golf CSV file into the database'

    def add_arguments(self, parser):
        parser.add_argument('/data/course.csv',type=str, help='CSV file path')

    def handle(self, *args, **kwargs):
        csv_file_path = kwargs['/data/course.csv']
        
        if not os.path.isfile(csv_file_path):
            self.stdout.write(self.style.ERROR("File does not exist"))
            return
        
        with open (csv_file_path, 'r', encoding='utf-8') as csv_file:
            reader = csv.DictReader(csv_file)

            for row in reader:
                GolfLocation.objects.create(
                    golf_scale=row.get('golf_scale', ''),
                    golf_name=row['golf_name'],
                    golf_address=row.get('golf_address', ''),
                    golf_holes=int(row['golf_holes']) if row.get('golf_holes') else 0,
                    golf_latitude=float(row.get('golf_latitude', 0.0)),
                    golf_longitude=float(row.get('golf_longitude', 0.0)),
                    golf_reservation=row.get('golf_reservation', ''),
                    golf_running_date=row.get('golf_running_date', ''),
                    golf_fee=row.get('golf_fee', ''),
                    golf_phone=row.get('golf_phone', ''),
                    golf_homepage=row.get('golf_homepage', ''),
                    golf_running_time=row.get('golf_running_time', ''),
                )