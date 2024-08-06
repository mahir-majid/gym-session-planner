from django.db import models
from django.contrib.auth.models import User

class WorkoutSection(models.Model):
    author = models.ForeignKey(User, on_delete = models.CASCADE)
    title = models.CharField(max_length = 250)

    # Tracks if section was chosen for MyWorkout page
    chosen = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
class Exercise(models.Model):
    workout_section = models.ForeignKey(WorkoutSection, related_name='exercises', on_delete = models.CASCADE)
    content = models.CharField(max_length = 250)

    # Tracks if exercise was marked as completed for MyWorkout page
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.content
