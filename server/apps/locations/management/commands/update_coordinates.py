from django.core.management.base import BaseCommand
from apps.locations.models import *
from ...geocoding import get_location_by_address

#GolfLocation 모델의 주소 필드 값을 좌표로 변환 후 그 좌표 값을 다시 모델의 경도와 위도 값으로 저장하는 함수

class Command(BaseCommand):
    help = 'Update Coordinates with address field'

    def handle(self, *args, **kwargs):
        locations = GolfLocation.objects.all()

        for location in locations:
            if location.golf_address:
                latitude, longitude = get_location_by_address(location.golf_address)
                if latitude and longitude:
                    location.golf_latitude = latitude
                    location.golf_longitude = longitude
                    location.save()