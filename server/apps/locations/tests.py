from django.test import TestCase
from .models import *

class GolfLocationModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # 테스트를 위한 GolfLocation 데이터 생성
        GolfLocation.objects.create(
            golf_name='Golfy',
            golf_address='Bakery',
            golf_holes=18,
            golf_latitude=37.5665,
            golf_longitude=126.9780,
            golf_rate=4.5,
            golf_rate_num=10,
        )

    def test_golf_name_content(self):
        golf_course = GolfLocation.objects.get(id=1)
        expected_golf_name = f'{golf_course.golf_name}'
        self.assertEqual(expected_golf_name, 'Golfy')

class ReviewModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # 테스트를 위한 User, GolfLocation, Review 데이터 생성
        test_user = User.objects.create_user(username='testuser', password='12345')
        test_golf = GolfLocation.objects.create(
            golf_name='Golfy',
            golf_address='Baker',
            golf_holes=18,
            golf_latitude=37.5665,
            golf_longitude=126.9780,
            golf_rate=4.5,
            golf_rate_num=10,
        )
        Review.objects.create(
            ground=test_golf,
            reviewer=test_user,
            content='Great golf course!',
            rating=4.5,
            rate_tag='four',
        )

    def test_review_content(self):
        review = Review.objects.get(id=1)
        expected_review_content = f'{review.content}'
        self.assertEqual(expected_review_content, 'Great golf course!')
