from social_core.pipeline.user import create_user
from django.shortcuts import redirect

def set_username(strategy, details, response, user=None, *args, **kwargs):
    # 카카오 프로필에서 닉네임 가져오기
    nickname = details.get('username', {})

    if user:
        # 사용자가 이미 존재하는 경우, username 업데이트
        if nickname:
            user.nickname = nickname
            user.save()
            print("username 업데이트 완료!")
        else:
            print("카카오 프로필에서 닉네임을 찾을 수 없습니다.")

