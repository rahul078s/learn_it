from django.urls import path
from . import views

app_name = "courses"
urlpatterns = [
    path("", views.home, name="home"),
    path("<int:course_id>/", views.detail, name="course_detail"),
    path("<int:course_id>/enroll/", views.enroll, name="enroll"),
]