import requests
import pandas as pd
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.locations.models import *

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

df = pd.read_csv('data/course.csv')

latitudes = []
longitudes = []

for address in df['golf_address']:
    lat, lon = get_location_by_address(address)
    latitudes.append(lat)
    longitudes.append(lon)

df['golf_latitude'] = latitudes
df['golf_longitude'] = longitudes

df.to_csv('updated_course.csv', index = False)