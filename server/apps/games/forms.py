from django import forms

class GameSetupForm(forms.Form):
    game_name = forms.CharField(label='게임이름', max_length = 9)
    round_count = forms.IntegerField(label='코스 수', min_value=1, max_value=9 )  # 최대 9라운드로 설정