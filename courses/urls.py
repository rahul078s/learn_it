from django.urls import path
from . import views

app_name = "courses"
urlpatterns = [
    path("api/courses/", views.CourseListCreateView.as_view(), name="course_list"),
    path("api/courses/<int:pk>/", views.CourseDetailView.as_view(), name="course_detail"),
    path("api/instructor/courses/", views.InstructorCourseListView.as_view(), name="instructor_courses"),
    path('api/mycourses/', views.enrolled_courses_api, name="api_mycourses"),
    path("api/enroll/", views.enroll_in_course_api, name="api_enroll_course"),
    path("api/modules/", views.module_list_api, name='api_module_list'),
    path("api/modules/<int:pk>/", views.module_detail_api, name='api_module_detail'),
    path("api/lessons/", views.lesson_list_api, name='api_lesson_list'),
    path("api/lessons/<int:pk>/", views.lesson_detail_api, name='api_lesson_detail'),
]