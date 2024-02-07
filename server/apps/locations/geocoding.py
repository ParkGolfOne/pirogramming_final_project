# 주소를 통해 좌표를 가져오는 함수 구현 -> geopy 라이브러리 설치 필요 (pip install geopy)
import requests
from .models import *
from geopy.geocoders import Nominatim

#헤버사인 공식을 사용해서 두 좌표간의 거리를 구해보기 -> gdal 라이브러리를 사용해서 하려고 했지만 너무 방대한 용량 ㅠ
import math

#골프장 모델의 인스턴스의 주소 필드를 받아와 경도와 위도를 불러오는 함수 정의 (네이버 지도 api 공식문서 참조)
# def get_location_by_address(address):

#     locations = GolfLocation.objects.filter(golf_address = address)

#     endpoint = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode"

#     for location in locations:
#         client_id = "mzbzbj8tit"
#         client_secret = "L77KOOKg5jnwg8IAcy7Ekpp0d0ToR9BpRpVHPUcl"

#         url = f"{endpoint}?query={location.golf_address}"
#         headers = {
#             "X-NCP-APIGW-API-KEY-ID" : client_id,
#             "X-NCP-APIGW-API-KEY" : client_secret,
#         }
#         response = requests.get(url, headers=headers)
#         data = response.json()
#         if data['addresses']:
#             first_address = data['addresses'][0]
#             longitude = first_address['x']
#             latitude = first_address['y']
#             return (latitude, longitude)
#         else:
#             return ('000', '000')
        

# 골프장 인스턴스들과의 거리를 계산하기 위해 사용자가 입력한 주소를 좌표로 바꾸는 함수
def get_location_by_address(address, timeout=300):
    geolocator = Nominatim(user_agent="locations_distance", timeout=timeout)
    coordinate = geolocator.geocode(address)
    return (coordinate.latitude, coordinate.longitude)

#헤버사인 공식을 적용 (인스턴스의 좌표와 입력한 주소의 좌표를 매개변수로 줌)
def haversine(lon1, lat1, lon2, lat2):
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371
    return c * r

# 헤버사인 공식을 통해 얻은 거리들을 오름차순으로 sort한 후 그 중 첫 5개만 제시하고자 하는 로직 (구현중..)
def find_nearest_golf(user_address, instances):
    user_lat, user_lon = get_location_by_address(user_address)
    distances = []
    
    #views.py location_distance 함수에서 보낸 instance 들을 기반으로 작동
    for instance in instances:
        instance_lat = instance.golf_latitude
        instance_lon = instance.golf_longitude

        distance = haversine(user_lon, user_lat, instance_lon, instance_lat)
        rounded_distance = round(distance, 2) #구한 거리를 소수점 2자리 수로 변환

        instance_tuple = (instance, rounded_distance) #특정 골프장 모델과 유저의 주소의 거리를 튜플로 묶기
        distances.append(instance_tuple) #그 튜플을 하나의 리스트에 저장
        
    sorted_distances = sorted(distances, key = lambda x : x[1]) #리스트에 저장된 골프장 객체와 거리를 거리 순서로 오름차순 정렬

    five_instances = sorted_distances[:5] #그 중 상위 5개만 따로 저장

    #골프장 객체의 이름은 이름끼리, 거리는 거리끼리 리스트에 저장
    golf_names = [instance[0].golf_name for instance in five_instances]

    golf_distance = [instance[1] for instance in five_instances]

    #골프장 객체와 이름을 매칭해서 저장
    golf_lists = list(zip(golf_names, golf_distance))
    return golf_lists