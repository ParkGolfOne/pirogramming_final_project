from django import forms
from .models import Board, Post, Comment
from tinymce.widgets import TinyMCE

# 객체명 :  BoardForm
# 목적 : Board 객체의 name, admin 속성을 모두 받아 Form 을 만든다.
class BoardForm(forms.ModelForm):
    class Meta():
        model = Board
        fields = ('__all__')


# 객체명 :  PostForm
# 목적 : Post 객체의 title, content, photo 를 입력받아 Form 을 만든다.
class PostForm(forms.ModelForm):
    content = forms.CharField(widget=TinyMCE())

    class Meta:
        model = Post
        fields = ['title','content', 'photo']

