from django.urls import path
from . import views

app_name = "courses"
urlpatterns = [
    path("courses/", views.course_list_api, name="api_course_list"),
    path("<int:pk>/", views.CourseDetailView.as_view(), name="course_detail"),
    path("<int:course_id>/enroll/", views.enroll, name="enroll"),
    path("create/", views.CourseCreateView.as_view(), name='create_course'),
    path("<int:pk>/edit/", views.CourseUpdateView.as_view(), name='edit_course'),
    path("<int:pk>/delete/", views.CourseDeleteView.as_view(), name="delete_course"),
    path("enrolled/", views.StudentDashboardView.as_view(), name="student_dashboard"),
    path("mycourses/", views.InstructorDashboardView.as_view(), name="instructor_dashboard"),
    path("<int:course_pk>/modules/create/", views.ModuleCreateView.as_view(), name='create_module'),
    path("<int:course_pk>/modules/<int:module_pk>/lessons/create/", views.LessonCreateView.as_view(), name='create_lesson'),
]