from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic import ListView, DetailView

from django.views.decorators.http import require_POST
from .models import Course, Module, Lesson, Enrollment
from django.contrib import messages

from .forms import CourseForm, ModuleForm, LessonForm
from django.urls import reverse_lazy, reverse

from django.db.models import Count

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.http import HttpResponse
from rest_framework.response import Response
from .serializers import CourseSerializer, EnrollmentSerializer
from courses import serializers

from rest_framework.permissions import IsAuthenticated

@api_view(['GET', 'POST'])
def course_list_api(request):
    
    if request.method == 'GET':
        course = Course.objects.all()
        serializer = CourseSerializer(course, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'DELETE'])
def course_detail_api(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return HttpResponse(status=404)
    
    if request.method == 'GET':
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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


""" class CourseListView(ListView):
        model = Course
        template_name = 'courses/home.html'
        context_object_name = 'course_list'

        def get_queryset(self):
            queryset = Course.objects.all()
            
            search_query = self.request.GET.get('q')

            if search_query:
                queryset = queryset.filter(name__icontains=search_query)

            return queryset """

''' class CourseDetailView(DetailView):
        model = Course
        template_name = "courses/course_detail.html"

        def get_context_data(self, **kwargs):
            context = super().get_context_data(**kwargs)

            if self.request.user.is_authenticated:
                context['is_enrolled'] = Enrollment.objects.filter(
                    user = self.request.user,
                    course = self.object
                ).exists()
            else:
                context['is_enrolled'] = False

            return context '''

@login_required
@require_POST
def enroll(request, course_id):
    course = get_object_or_404(Course, pk=course_id)

    # get_or_create returns the two things a Model Instance and a True/False
    enrollment, created = Enrollment.objects.get_or_create(
        user=request.user, 
        course=course
    )

    # Check the flag to trigger messages!
    if created:
        messages.success(request, f"You have successfully enrolled in {course.name}!")
    else:
        messages.warning(request, "You are already enrolled in this course.")

    return redirect('courses:course_detail', pk=course.id)

class CourseCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Course
    form_class = CourseForm
    template_name = 'courses/create_course.html'

    # Verify if user is an instructor
    def test_func(self):
        return self.request.user.is_instructor
    
    # Attach instructor to the course
    def form_valid(self, form):
        form.instance.instructor = self.request.user
        return super().form_valid(form)
    
class CourseUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Course
    form_class = CourseForm
    template_name_suffix = '_update_form'

    def test_func(self):
        course = self.get_object()
        return course.instructor == self.request.user
    
class CourseDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Course
    success_url = reverse_lazy('courses:home')

    def test_func(self):
        course = self.get_object()
        return course.instructor == self.request.user
    
class StudentDashboardView(LoginRequiredMixin, ListView):
    model = Course
    template_name = "courses/student_dashboard.html"
    context_object_name = 'enrolled_courses'

    def get_queryset(self):
        return Course.objects.filter(enrollments__user=self.request.user)
    
class InstructorDashboardView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    model = Course
    template_name = "courses/instructor_dashboard.html"
    context_object_name = "my_courses"

    def test_func(self):
        return self.request.user.is_instructor

    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user).annotate(
            total_students = Count('enrollments')
        )

class ModuleCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Module
    form_class = ModuleForm
    template_name = 'courses/module_create.html'

    def get_course(self):
        return get_object_or_404(Course, pk=self.kwargs['course_pk'])

    def test_func(self):
        return self.get_course().instructor == self.request.user

    def form_valid(self, form):
        form.instance.course = self.get_course()
        return super().form_valid(form)

class LessonCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Lesson
    form_class = LessonForm
    template_name = 'courses/lesson_create.html'

    def get_course(self):
        return get_object_or_404(Course, pk=self.kwargs['course_pk'])
    
    def get_module(self):
        return get_object_or_404(Module, pk=self.kwargs['module_pk'], course=self.get_course())
    
    def test_func(self):
        return self.get_course().instructor == self.request.user
    
    def form_valid(self, form):
        form.instance.module = self.get_module()
        return super().form_valid(form)
    