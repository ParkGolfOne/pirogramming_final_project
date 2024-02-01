from django import forms
from .models import Score


# 객체명 :  BoardForm
# 목적 : Board 객체의 name, admin 속성을 모두 받아 Form 을 만든다.
class ScoreForm(forms.ModelForm):
    class Meta():
        model = Score
        fields = ['ground', 'par', 'score']
