from django import forms

class GameSetupForm(forms.Form):
    game_name = forms.CharField(label='게임이름', max_length = 9)
    