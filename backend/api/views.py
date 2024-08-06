from django.shortcuts import render

# Django specific built in model for user authentication
from django.contrib.auth.models import User

# Allows for readable api operations that are "generic" including "List" and "Create"
from rest_framework import generics

# Necessary for converting data into json format; add any file serializers that you are trying to connect into here
from .serializers import UserSerializer, WorkoutSectionSerializer, ExerciseSerializer
from .models import WorkoutSection, Exercise

from rest_framework.permissions import AllowAny, IsAuthenticated

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    # Queryset is used to get all instances
    queryset = User.objects.all()

    # Converts data into json
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ListUserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class WorkoutSectionDelete(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkoutSectionSerializer

    def get_queryset(self):
        user = self.request.user
        
        # Return all workout sections created by this user
        return WorkoutSection.objects.filter(author=user)
    
class WorkoutSectionView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkoutSectionSerializer

    def get_queryset(self):
        user = self.request.user
        return WorkoutSection.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class UpdateWorkoutSectionChosen(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkoutSectionSerializer

    def get_queryset(self):
        user = self.request.user
        return WorkoutSection.objects.filter(author=user)
    
    def perform_update(self, serializer):
        serializer.instance.chosen = True
        serializer.save()

class MakeDefaultWorkoutSectionChosen(generics.UpdateAPIView):
     permission_classes = [IsAuthenticated]
     serializer_class = WorkoutSectionSerializer

     def get_queryset(self):
        user = self.request.user
        return WorkoutSection.objects.filter(author=user)
    
     def perform_update(self, serializer):
        serializer.instance.chosen = False
        serializer.save()
    
    
class ExerciseView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ExerciseSerializer

    def get_queryset(self):
        workout_section_id = self.kwargs.get('workout_section_id')
        return Exercise.objects.filter(workout_section_id = workout_section_id)
    
    def perform_create(self, serializer):
        workout_section_id = self.kwargs.get('workout_section_id')
        workout_section = WorkoutSection.objects.get(id = workout_section_id)
        serializer.save(workout_section=workout_section)
  
class ExerciseDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ExerciseSerializer

    def get_queryset(self):
        exercise_id = self.kwargs.get('pk')
        return Exercise.objects.filter(id=exercise_id)
    
class UpdateExerciseComplete(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ExerciseSerializer

    def get_queryset(self):
        exercise_id = self.kwargs.get('pk')
        return Exercise.objects.filter(id=exercise_id)
    
    def perform_update(self, serializer):
        serializer.instance.completed = True
        serializer.save()

class MakeDefaultExercise(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ExerciseSerializer

    def get_queryset(self):
        exercise_id = self.kwargs.get('pk')
        return Exercise.objects.filter(id=exercise_id)
    
    def perform_update(self, serializer):
        serializer.instance.completed = False
        serializer.save()
