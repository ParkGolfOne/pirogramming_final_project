# from geopy.geocoders import Nominatim

# # 주소를 통해 좌표를 가져오는 함수 구현 -> geopy 라이브러리 설치 필요 (pip install geopy)
# def get_location_by_address (golf_address):
#     geolocator = Nominatim(user_agent='locations')
#     location = geolocator.geocode(golf_address, timeout=300)
#     if location:
#         return (location.latitude, location.longitude)
#     else:
#         return (None, None)

import requests
from .models import *

def get_location_by_address(address):
    locations = GolfLocation.objects.filter(golf_address = address)

    endpoint = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode"

    for location in locations:
        client_id = "mzbzbj8tit"
        client_secret = "L77KOOKg5jnwg8IAcy7Ekpp0d0ToR9BpRpVHPUcl"

        url = f"{endpoint}?query={location.golf_address}"
        headers = {
            "X-NCP-APIGW-API-KEY-ID" : client_id,
            "X-NCP-APIGW-API-KEY" : client_secret,
        }
        response = requests.get(url, headers=headers)
        data = response.json()
        if data['addresses']:
            first_address = data['addresses'][0]
            longitude = first_address['x']
            latitude = first_address['y']
            return (latitude, longitude)
        else:
            return ('000', '000')