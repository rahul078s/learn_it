from re import T
import token

from rest_framework import serializers
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    # Define the pass fields so that they won't sent back in API response
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'is_instructor']

    # Override validate for password match 
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    # Override the create method to make sure hashed password is saved
    def create(self, validated_data):
        validated_data.pop('password_confirm') # Don't save password_confirm to database as it don't accept it
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # use get for non-mandatory fields
            password=validated_data['password'],
            is_instructor=validated_data.get('is_instructor', False)
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['is_instructor'] = user.is_instructor

        return token