from django.urls import path
from . import views

app_name = "courses"
urlpatterns = [
    path("api/courses/", views.course_list_api, name="api_course_list"),
    path("api/courses/<int:pk>/", views.course_detail_api, name="api_course_detail"),
    path("api/enroll/", views.enroll_in_course_api, name="api_enroll_course"),
    path("api/modules/", views.module_list_api, name='api_module_list'),
    path("api/modules/<int:pk>/", views.module_detail_api, name='api_module_detail'),
    path("api/lessons/", views.lesson_list_api, name='api_lesson_list'),
    path("api/lessons/<int:pk>/", views.lesson_detail_api, name='api_lesson_detail'),
    path("enrolled/", views.StudentDashboardView.as_view(), name="student_dashboard"),
    path("mycourses/", views.InstructorDashboardView.as_view(), name="instructor_dashboard"),
    path("<int:course_pk>/modules/create/", views.ModuleCreateView.as_view(), name='create_module'),
    path("<int:course_pk>/modules/<int:module_pk>/lessons/create/", views.LessonCreateView.as_view(), name='create_lesson'),
]