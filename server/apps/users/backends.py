# yourapp/backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # 여기서 원하는 필드로 사용자 찾기
        user = User.objects.filter(phone=username).first()

        if user and user.check_password(password):
            return user
        else:
            return None
