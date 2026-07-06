from webbrowser import get

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic.edit import CreateView, UpdateView, DeleteView

from django.views.decorators.http import require_POST
from .models import Course, Module, Lesson, Enrollment
from django.contrib import messages

from django.db.models import Count
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.http import HttpResponse
from rest_framework.response import Response
from .serializers import CourseSerializer, EnrollmentSerializer, LessonSerializer, ModuleSerializer

from rest_framework.permissions import IsAuthenticated
from .permissons import IsInstructorOrReadOnly
from rest_framework import generics

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsInstructorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsInstructorOrReadOnly]

class InstructorCourseListView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsInstructorOrReadOnly]

    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

@api_view(['GET'])
def enrolled_courses_api(request):
    my_enrollments = Enrollment.objects.filter(user=request.user)

    serializer = EnrollmentSerializer(my_enrollments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['POST'])
def enroll_in_course_api(request):
    course_id = request.data.get('course')

    already_enrolled = Enrollment.objects.filter(
        user = request.user,
        course_id = course_id
    ).exists()

    if already_enrolled:
        return Response(
            {'detail': 'Already enrolled in this course'},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = EnrollmentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsInstructorOrReadOnly])
def module_list_api(request):
    if request.method == 'GET':
        modules = Module.objects.all()
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        course_id = request.data.get('course')
        course = get_object_or_404(Course, pk=course_id)

        """
        # Verify if the instructor owns the course
        if course.instructor != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        """
        serializer = ModuleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course=course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsInstructorOrReadOnly])
def module_detail_api(request, pk):
    module = get_object_or_404(Module, pk=pk)

    if request.method == 'GET':
        serializer = ModuleSerializer(module)
        return Response(serializer.data)

    """
    # Verify instructor
    if module.course.instructor != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)
    """

    if request.method == 'PUT':
        serializer = ModuleSerializer(module, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        module.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsInstructorOrReadOnly])
def lesson_list_api(request):
    if request.method == 'GET':
        lesson = Lesson.objects.all()
        serializer = LessonSerializer(lesson, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        module_id = request.data.get('module')
        module = get_object_or_404(Module, pk=module_id)

        """
        # Verify if the instructor owns the course
        if module.course.instructor != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        """

        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(module=module)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsInstructorOrReadOnly])
def lesson_detail_api(request, pk):
    lesson = get_object_or_404(Lesson, pk=pk)

    if request.method == 'GET':
        serializer = LessonSerializer(lesson)
        return Response(serializer.data, status=status.HTTP_200_OK)

    """
    # Verify instructor before update and delete
    if lesson.module.course.instructor != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)
    """

    if request.method == 'PUT':
        lesson = get_object_or_404(Lesson, pk=pk)
        serializer = LessonSerializer(lesson, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        lesson.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
