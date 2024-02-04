from django import forms

class GameSetupForm(forms.Form):
    player_count = forms.IntegerField(label='인원 수', min_value=1, max_value=4)  # 최소 1명, 최대 4명으로 설정
    round_count = forms.IntegerField(label='라운드 수', min_value=1, max_value=9)  # 최대 9라운드로 설정
    # 골프장은 나중에
    # ground = 