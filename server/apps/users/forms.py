from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class SignupForm(UserCreationForm):
    username = forms.CharField(
        label='아이디',
        widget=forms.TextInput(
            attrs={
                'class': 'signup-input'
            }
        )
    )
    nickname = forms.CharField(
        label='닉네임',
        widget=forms.TextInput(
            attrs={
                'class': 'signup-input'
            }
        )
    )
    password1 = forms.CharField(
        label='비밀번호',
        widget=forms.PasswordInput(
            attrs={
                'class': 'signup-input'
            }
        )
    )
    password2 = forms.CharField(
        label='비밀번호 확인',
        widget=forms.PasswordInput(
            attrs={
                'class': 'signup-input'
            }
        )
    )
    birth = forms.DateField(
        label='생일',
        required=False
    )
    phone = forms.CharField(
        label='전화번호',
        required=False
    )
    email = forms.CharField(
        label='이메일',
        widget=forms.TextInput(
            attrs={
                'class': 'signup-input'
            }
        )
    )
    address = forms.CharField()

    class Meta:
        model = User
        fields = ['username', 'nickname', 'password1',
                  'password2', 'birth', 'phone', 'email', 'address']


class UpdateForm(forms.ModelForm):
    username = forms.CharField(
        label='아이디',
        widget=forms.TextInput(
            attrs={
                'class': 'signup-input'
            }
        )
    )

    nickname = forms.CharField(
        label='닉네임',
        widget=forms.TextInput(
            attrs={
                'class': 'signup-input'
            }
        )
    )
    birth = forms.CharField(
        label='생일',
        widget=forms.TextInput(
            attrs={
                'class': 'signup-input'
            }
        )
    )
    phone = forms.CharField(
        label='전화번호',
        widget=forms.TextInput(
            attrs={
                'class': 'signup-input'
            }
        )
    )
    email = forms.CharField(
        label='이메일',
        widget=forms.TextInput(
            attrs={
                'class': 'signup-input'
            }
        )
    )

    class Meta:
        model = User
        fields = ["nickname", "birth", "phone"]
        fields = ['username', 'nickname', 'birth', 'phone', 'email']
