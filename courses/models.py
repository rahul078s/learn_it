from django.db import models
from django.conf import settings
from datetime import date

from django.urls import reverse

# Create your models here.
class Course(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=300)
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)

    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('courses:course_detail', kwargs={'pk': self.id})
    
class Module(models.Model):
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.order}. {self.title}"
    
    def get_absolute_url(self):
        return reverse('courses:course_detail', kwargs={'pk': self.course.id})
    
class Lesson(models.Model):
    module = models.ForeignKey(Module, related_name="lessons", on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    video_url = models.URLField(blank=True)
    pdf = models.FileField(upload_to="lessons/pdfs/", blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.order}. {self.title}"
    
    def get_absolute_url(self):
        return reverse('courses:course_detail', kwargs={'pk': self.module.course.id})

class Enrollment(models.Model):
    enroll_date = models.DateField(default=date.today)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='enrollments', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='enrollments', on_delete=models.CASCADE)
