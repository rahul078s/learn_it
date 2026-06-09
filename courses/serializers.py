from dataclasses import field

from rest_framework import serializers
from .models import Course, Enrollment, Module, Lesson

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'pdf', 'video_url', 'order']
        read_only = ['id', 'pdf']

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order', 'lessons']
        read_only = ['id']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = [ 'id' ,'name', 'description', 'instructor', 'modules']
        read_only = ['id']

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'enroll_date', 'user', 'course']
        read_only_fields = ['id', 'user', 'enroll_date']