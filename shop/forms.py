from django import forms
from .models import Order, Review


class OrderForm(forms.ModelForm):
    """Form for placing an order"""
    class Meta:
        model = Order
        fields = [
            'first_name', 'last_name', 'email', 
            'address', 'city', 'state', 'zip_code'
        ]
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-input', 'required': True}),
            'last_name': forms.TextInput(attrs={'class': 'form-input', 'required': True}),
            'email': forms.EmailInput(attrs={'class': 'form-input', 'required': True}),
            'address': forms.TextInput(attrs={'class': 'form-input', 'required': True}),
            'city': forms.TextInput(attrs={'class': 'form-input', 'required': True}),
            'state': forms.TextInput(attrs={'class': 'form-input', 'required': True}),
            'zip_code': forms.TextInput(attrs={'class': 'form-input', 'required': True}),
        }


class ReviewForm(forms.ModelForm):
    """Form for product reviews"""
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        widgets = {
            'rating': forms.Select(attrs={'class': 'form-input'}),
            'comment': forms.Textarea(attrs={'class': 'form-input', 'rows': 4}),
        }
