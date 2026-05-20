from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from .models import Course, Enrollment
from django.contrib import messages
# Create your views here.

def home(request):
    course_list = Course.objects.all()
    return render(request, "courses/home.html", {"course_list": course_list})

def detail(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    return render(request, "courses/course_detail.html", {"course": course})

@login_required
@require_POST
def enroll(request, course_id):
    course = get_object_or_404(Course, pk=course_id)

    already_enrolled = Enrollment.objects.filter(
        user = request.user,
        course = course
    ).exists()

    if not already_enrolled:
        Enrollment.objects.create(user=request.user, course=course)

        # Add a temporary success message to the request
        messages.success(request, f"You have successfully enrolled in {course.name}!")
    else:
        messages.warning(request, "You are already enrolled in this course.")

    return redirect('courses:course_detail', course_id=course.id)
