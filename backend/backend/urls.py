"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# Add any specific views function here
from api.views import CreateUserView, ListUserView, WorkoutSectionView, WorkoutSectionDelete, UpdateExerciseComplete
from api.views import ExerciseView, ExerciseDeleteView, MakeDefaultWorkoutSectionChosen, UpdateWorkoutSectionChosen, MakeDefaultExercise

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

   # User authentication specific urls
   path('user-register/', CreateUserView.as_view(), name="register"),
   path('user-list/', ListUserView.as_view(), name="list"),
   path('api/token/', TokenObtainPairView.as_view(), name="get_token"),
   path('api/token/refresh/', TokenRefreshView.as_view(), name="refresh"),
   
   path('workout-sections/', WorkoutSectionView.as_view(), name="workout_section"),
   path('workout-section/delete/<int:pk>/', WorkoutSectionDelete.as_view(), name="workout_section_delete"),
   
   path('exercises/<int:workout_section_id>/', ExerciseView.as_view(), name="exercise"),
   path('exercises/delete/<int:pk>/', ExerciseDeleteView.as_view(), name="exercise_delete"),

   path('workout-section-chosen/<int:pk>/', UpdateWorkoutSectionChosen.as_view(), name="workout_select"),
   path('workout-section-default/<int:pk>/', MakeDefaultWorkoutSectionChosen.as_view(), name="workout_default"),

   path('exercises/complete/<int:pk>/', UpdateExerciseComplete.as_view(), name="exercise_complete"),
   path('exercises/default/<int:pk>/', MakeDefaultExercise.as_view(), name="exercise_default"),

   # connects to api urls
   path('api-auth/', include ("rest_framework.urls"))
]
