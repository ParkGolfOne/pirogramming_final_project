from django import forms
from .models import *

#골프장 모델 CRUD용 폼
class NewField (forms.ModelForm):
    class Meta():
        model = GolfLocation
        fields = ('__all__')