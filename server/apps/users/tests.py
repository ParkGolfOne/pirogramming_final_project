from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.region.models import Region
from django.urls import reverse
from apps.users.models import User as CustomUser
from datetime import date
from apps.users.forms import SignupForm

# 모델 테스트
CustomUser = get_user_model()

class UserTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # 테스트에 사용될 Region 객체 생성
        cls.test_region = Region.objects.create(city="서울", town="영등포구")
        # 사용자 생성을 위한 테스트 데이터
        cls.user_data = {
            'username': 'testuser',
            'nickname': '테스트유저',
            'birth': date(1990, 1, 1),
            'phone': '01012345678',
            'email': 'test@example.com',
            'address': '서울시 영등포구',
            'detail_address': '당산동',
            'region': cls.test_region,
        }
        cls.user = CustomUser.objects.create_user(**cls.user_data, password='testpassword123')

    def test_user_fields(self):
        """
        생성된 사용자의 필드 값이 기대한 대로 저장되었는지 확인
        """
        self.assertEqual(self.user.username, self.user_data['username'])
        self.assertEqual(self.user.nickname, self.user_data['nickname'])
        self.assertEqual(self.user.birth, self.user_data['birth'])
        self.assertEqual(self.user.phone, self.user_data['phone'])
        self.assertEqual(self.user.email, self.user_data['email'])
        self.assertEqual(self.user.address, self.user_data['address'])
        self.assertEqual(self.user.detail_address, self.user_data['detail_address'])
        self.assertEqual(self.user.region, self.user_data['region'])

    def test_user_str(self):
        """
        User 모델의 __str__ 메서드가 올바르게 작동하는지 확인
        """
        self.assertEqual(str(self.user), self.user.nickname)

    def test_user_save(self):
        """
        User 모델의 save 메서드가 올바르게 작동하는지 확인
        """
        self.user.nickname = '변경된 닉네임'
        self.user.save()
        updated_user = CustomUser.objects.get(id=self.user.id)
        self.assertEqual(updated_user.nickname, '변경된 닉네임')

    def test_user_friends(self):
        """
        User 모델의 친구 추가 및 조회 기능이 올바르게 작동하는지 확인
        """
        friend_user = CustomUser.objects.create_user(username='frienduser', email='friend@example.com', password='friendpassword123', nickname='친구유저')
        self.user.friends.add(friend_user)
        self.assertIn(friend_user, self.user.friends.all())
        self.assertEqual(self.user.friends.count(), 1)

    def test_user_auth(self):
        """
        생성된 사용자로 로그인이 가능한지 확인
        """
        login_successful = self.client.login(username=self.user.username, password='testpassword123')
        self.assertTrue(login_successful)

# 뷰 테스트
class UserViewTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        # 필요한 테스트용 Region 객체 생성
        cls.test_region = Region.objects.create(city="서울", town="영등포구")
        # 테스트용 사용자 생성
        cls.user = CustomUser.objects.create_user(
            username='testuser', password='12345', email='test@example.com')
        cls.user.region = cls.test_region
        cls.user.save()

    def setUp(self):
        # 각 테스트가 실행되기 전에 호출됩니다.
        self.client.login(username='testuser', password='12345')

    def test_home_view_status_code(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)

    def test_home_view_uses_correct_template(self):
        response = self.client.get(reverse('home'))
        self.assertTemplateUsed(response, 'main.html')

    def test_main_view_status_code(self):
        response = self.client.get(reverse('users:main', args=[self.user.pk]))
        self.assertEqual(response.status_code, 200)

    def test_main_view_context_data(self):
        response = self.client.get(reverse('users:main', args=[self.user.pk]))
        self.assertIn('my_posts', response.context)
        self.assertIn('my_comments', response.context)

    def test_signup_view_post_success(self):
        response = self.client.post(reverse('users:signup'), data={
            'username': 'newuser',
            'nickname' : '장풍이',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
            'email': 'newuser@example.com',
            'address': '서울시 영등포구', # 도로명 주소에서 선택한게 합쳐져서 저장???
            'street_address': '테헤란로',
            'detail_address': '파르나스타워',
        })
        self.assertEqual(response.status_code, 200) # ****302(성공 후 리다이렉트)가 아닌 이유 : 리다이렉트가 뷰가 아닌 응답후에 처리됨****
        self.assertTrue(CustomUser.objects.filter(username ='newuser').exists())

    def test_signup_view_post_failure(self):
        response = self.client.post(reverse('users:signup'), data={}) # Empty data
        self.assertEqual(response.status_code, 200) # Stay on signup page
        form = SignupForm(data={})
        self.assertFalse(form.is_valid()) 
        self.assertTrue(form.errors)

    def test_login_view_post_success(self):
        response = self.client.post(reverse('users:login'), data={
            'username': 'testuser',
            'password': '12345',
        })
        self.assertEqual(response.status_code, 302) # Redirect after login

    def test_logout_view(self):
        response = self.client.get(reverse('users:logout'))
        self.assertEqual(response.status_code, 302) # Redirect to login page
