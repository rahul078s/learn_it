from django.contrib import admin
from .models import Course, Module, Lesson ,Enrollment

# Register your models here.
class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    inlines = [ModuleInline]

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    inlines = [LessonInline]

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    pass

admin.site.register(Enrollment)