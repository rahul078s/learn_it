from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

app_name = 'users'

urlpatterns = [
    path('api/register/', views.register_api_view, name="api_register"),
    path('api/login/', views.CustomTokenObtainPairView.as_view(), name="api_login"),
    path('api/token/refresh/', TokenRefreshView().as_view(), name="token_refresh"),
    path('api/me/', views.me_api_view, name="api_me"),
]
