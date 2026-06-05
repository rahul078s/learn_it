from rest_framework import serializers
from .models import Course, Enrollment, Module, Lesson

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [ 'id' ,'name', 'description', 'instructor']

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'enroll_date', 'user', 'course']
        read_only_fields = ['id', 'user', 'enroll_date']