from django.urls import path
from . import views

app_name = "courses"
urlpatterns = [
    path("", views.CourseListView.as_view(), name="home"),
    path("<int:pk>/", views.CourseDetailView.as_view(), name="course_detail"),
    path("<int:course_id>/enroll/", views.enroll, name="enroll"),
    path("create/", views.CourseCreateView.as_view(), name='create_course'),
    path("<int:pk>/edit/", views.CourseUpdateView.as_view(), name='edit_course'),
    path("<int:pk>/delete/", views.CourseDeleteView.as_view(), name="delete_course"),
    path("enrolled/", views.StudentDashboardView.as_view(), name="student_dashboard"),
    path("mycourses/", views.InstructorDashboardView.as_view(), name="instructor_dashboard"),
]