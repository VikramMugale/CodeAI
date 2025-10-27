# your_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('changepassword/', views.change_password, name='change_password'),
    path('profile/', views.profile_view, name='profile'),  
    path('editProfile/',views.edit_profile,name='edit_profile'),
    path('get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),   
]
