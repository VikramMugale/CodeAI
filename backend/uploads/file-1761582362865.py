from django.urls import path
from .views import *
from . import views
urlpatterns = [ 
    #Courses
    path('courses/',CourseListCreateView.as_view(),name="course-list"),
    path('course/<int:course_id>/<slug:slug>/',views.course_details,name='course-details'),
    
    #Chapters 
    path('course/<int:course_id>/chapters/',views.all_chapters,name='All_chapters'),
    path('chapter/<int:chapter_id>/',views.chapter_detail,name='Content-of-chapter'),
    path('course/<int:course_id>/chapter/<int:chapter_id>/topic/<int:topic_id>/', views.chapter_detail, name='topic_detail'),
    
    #Enrollment in course 
    path('course/<int:course_id>/enroll-in-course/',views.enroll_in_course,name='enroll-in-course'),
    
    #Quiz Submission
    path('chapter/<int:chapter_id>/attempt-quiz/',views.submit_quiz,name='attempt-quiz'),
    
    #Final Task or Assignment 
    path('course/<int:course_id>/final-assignment/',views.access_final_assignment,name='final-task-assignment'),
    path('course/<int:course_id>/submit-final-assignment/<int:assignment_id>/',views.submit_assignment,name='submit-final-assignment')
    
]