from django.db import models
from django.conf import settings
from datetime import date

from django.urls import reverse

# Create your models here.
class Course(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=300)
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('courses:course_detail', kwargs={'course_id': self.id})

class Enrollment(models.Model):
    enroll_date = models.DateField(default=date.today)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
