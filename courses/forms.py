from django import forms
from .models import Course, Module, Lesson

class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['name', 'description']

class ModuleForm(forms.ModelForm):
    class Meta:
        model = Module
        fields = ['title', 'description', 'order']