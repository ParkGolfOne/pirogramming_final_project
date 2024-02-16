from django.urls import reverse
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Score, GolfLocation
from django.utils import timezone

# 모델 테스트 코드
User = get_user_model()

class ScoreModelTests(TestCase):

    def setUp(self):
        # 테스트에 사용될 사용자와 골프장 인스턴스 생성
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.golf_location = GolfLocation.objects.create(
            golf_name='Golfy',
            golf_address='Bakery',
            golf_holes=18,
            golf_latitude=37.5665,
            golf_longitude=126.9780,
            golf_rate=4.5,
            golf_rate_num=10,
        )
        self.score_data = {
            "hole1": 3, "hole2": 4, "hole3": 5, "hole4": 4, "hole5": 3,
            "hole6": 4, "hole7": 5, "hole8": 4, "hole9": 3
        }

    def test_score_creation(self):
        score = Score.objects.create(
            player=self.user,
            ground=self.golf_location,
            scores=self.score_data,
            total_score=36,
            par=self.score_data,
            date=timezone.now()
        )
        self.assertEqual(score.total_score, sum(self.score_data.values()))

# 뷰 테스트 코드
class ScoreViewTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.golf_location = GolfLocation.objects.create(
            golf_name='Golfy',
            golf_address='Bakery',
            golf_holes=18,
            golf_latitude=37.5665,
            golf_longitude=126.9780,
            golf_rate=4.5,
            golf_rate_num=10,
        )
        self.score_data = {
            "hole1": 3, "hole2": 4, "hole3": 5, "hole4": 4, "hole5": 3,
            "hole6": 4, "hole7": 5, "hole8": 4, "hole9": 3
        }
        self.client.login(username='testuser', password='12345')

    def test_score_input_get(self):
        # GET 요청으로 스코어 입력 페이지 접근
        response = self.client.get(reverse('score:score_input', args=[self.user.id]))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'score/score_create.html')

    def test_score_input_post(self):
        # POST 요청으로 스코어 생성
        response = self.client.post(reverse('score:score_input', args=[self.user.id]), {
            'location': self.golf_location.golf_name,
            'par1': 3, 'score1': 4,  # 예시 데이터
            # 나머지 필드 데이터
        })
        self.assertEqual(response.status_code, 302)  # 리다이렉션 확인
        self.assertTrue(Score.objects.exists())  # 스코어 객체 생성 확인
