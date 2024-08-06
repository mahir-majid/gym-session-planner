from django.contrib.auth.models import User
from rest_framework import serializers
from .models import WorkoutSection, Exercise

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Links to id of workout section it belongs to
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "workout_section", "content", "completed"]

# Serializes exercises in each workout-section, links to id of user it belongs to
class WorkoutSectionSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many = True, read_only = True)
    class Meta:
        model = WorkoutSection
        fields = ["id", "author", "title", "exercises", "chosen"]
        extra_kwargs = {"author": {"read_only": True}}

    