from django.http import JsonResponse
import os
import sys
import urllib.request
import environ
import json

client_id = os.environ.get('NAVER_BLOG_SEARCH_CLIENT_ID').strip()
client_secret = os.environ.get('NAVER_BLOG_SEARCH_SECRET').strip()


def search_blog(request):
    search_value = request.GET.get('input')
    encText = urllib.parse.quote(search_value)
    url = "https://openapi.naver.com/v1/search/blog?query=" + encText + "&display=5"  # JSON 결과

    # 네이버 api request 보내기
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", client_id)
    request.add_header("X-Naver-Client-Secret", client_secret)
    response = urllib.request.urlopen(request)
    rescode = response.getcode()

    if (rescode == 200):
        response_body = response.read()
        response_body.decode('utf-8')
        data = json.loads(response_body.decode('utf-8'))
        return JsonResponse({'result': 'success', 'output': data['items']})

    else:
        print("Error Code:" + rescode)
        return JsonResponse({'result': 'fail', 'output': None})
