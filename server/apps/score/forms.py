from django import forms
from .models import Score


# 객체명 :  ScoreForm
# 목적 : Score 의 par 와 score 값을 받아온다.
class ScoreForm(forms.ModelForm):
    par1 = forms.IntegerField(
        label='par1',
        min_value=3,
        max_value=5,
        widget=forms.TextInput(
            attrs={
                'class': 'parInput'
            }
        )
    )
    par2 = forms.IntegerField(
        label='par2',
        min_value=3,
        max_value=5,
        widget=forms.TextInput(
            attrs={
                'class': 'parInput'
            }
        )
    )
    par3 = forms.IntegerField(
        label='par3',
        min_value=3,
        max_value=5,
        widget=forms.TextInput(
            attrs={
                'class': 'parInput'
            }
        )
    )
    par4 = forms.IntegerField(
        label='par4',
        min_value=3,
        max_value=5,
        widget=forms.TextInput(
            attrs={
                'class': 'parInput'
            }
        )
    )
    par4 = forms.IntegerField(
        label='par4',
        min_value=3,
        max_value=5,
        widget=forms.TextInput(
            attrs={
                'class': 'parInput'
            }
        )
    )

    par5 = forms.IntegerField(
            label='par5',
            min_value=3,
            max_value=5,
            widget=forms.TextInput(
                attrs={
                    'class': 'parInput'
                }
            )
        )

    par6 = forms.IntegerField(
            label='par6',
            min_value=3,
            max_value=5,
            widget=forms.TextInput(
                attrs={
                    'class': 'parInput'
                }
            )
        )

    par7 = forms.IntegerField(
            label='par7',
            min_value=3,
            max_value=5,
            widget=forms.TextInput(
                attrs={
                    'class': 'parInput'
                }
            )
        )

    par8 = forms.IntegerField(
            label='par9',
            min_value=3,
            max_value=5,
            widget=forms.TextInput(
                attrs={
                    'class': 'parInput'
                }
            )
        )
    par9 = forms.IntegerField(
            label='par9',
            min_value=3,
            max_value=5,
            widget=forms.TextInput(
                attrs={
                    'class': 'parInput'
                }
            )
        )
    score1 = forms.IntegerField(
            label='score1',
            min_value=0,
            max_value=10,
            widget=forms.TextInput(
                attrs={
                    'class': 'scoreInput'
                }
            )
        )
    score2 = forms.IntegerField(
            label='score2',
            min_value=0,
            max_value=10,
            widget=forms.TextInput(
                attrs={
                    'class': 'scoreInput'
                }
            )
        )
    score3 = forms.IntegerField(
            label='score3',
            min_value=0,
            max_value=10,
            widget=forms.TextInput(
                attrs={
                    'class': 'scoreInput'
                }
            )
        )
    score4 = forms.IntegerField(
            label='score4',
            min_value=0,
            max_value=10,
            widget=forms.TextInput(
                attrs={
                    'class': 'scoreInput'
                }
            )
        )
    score5 = forms.IntegerField(
            label='score5',
            min_value=0,
            max_value=10,
            widget=forms.TextInput(
                attrs={
                    'class': 'scoreInput'
                }
            )
        )
    score6 = forms.IntegerField(
            label='score6',
            min_value=0,
            max_value=10,
            widget=forms.TextInput(
                attrs={
                    'class': 'scoreInput'
                }
            )
        )
    score7 = forms.IntegerField(
            label='score7',
            min_value=0,
            max_value=10,
            widget=forms.TextInput(
                attrs={
                    'class': 'scoreInput'
                }
            )
        )
    score8 = forms.IntegerField(
            label='score8',
            min_value=0,
            max_value=10,
            widget=forms.TextInput(
                attrs={
                    'class': 'scoreInput'
                }
            )
        )
    score9 = forms.IntegerField(
            label='score9',
            min_value=0,
            max_value=10,
            widget=forms.TextInput(
                attrs={
                    'class': 'scoreInput'
                }
            )
        )


    class Meta():
        model = Score
        fields = ['par1', 'par2','par3','par4','par5','par6','par7','par8','par9','score1', 'score2','score3','score4','score5','score6','score7','score8','score9']
