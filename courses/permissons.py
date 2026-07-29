from rest_framework import permissions

class IsInstructorOrReadOnly(permissions.BasePermission):
    ''' Custom permissions to allow anyone to read and only instructor can
        create/edit.
    '''
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_instructor
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if hasattr(obj, 'instructor'):
            return obj.instructor == request.user

        elif hasattr(obj, 'course'):
            return obj.course.instructor == request.user

        elif hasattr(obj, 'module'):
            return obj.module.course.instructor == request.user

        return False