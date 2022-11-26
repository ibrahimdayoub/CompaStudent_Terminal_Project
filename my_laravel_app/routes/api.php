<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\HallController;
use App\Http\Controllers\API\YearController;
use App\Http\Controllers\API\GroupController;
use App\Http\Controllers\API\TeacherController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\SubjectController;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\ProgramController;
use App\Http\Controllers\API\TimeController; 
use App\Http\Controllers\API\AdminNotificationController;
use App\Http\Controllers\API\EventController;
use App\Http\Controllers\API\TaskController;
use Illuminate\Support\Facades\Route;

/* ----------Start Of Public Routes------------ */

//Register Student
Route::post('register',[AuthController::class,'register']);

//Login All
Route::post('login',[AuthController::class,'login']);

//Forgot Password All
Route::post('forgot',[AuthController::class,'forgot']);

//Reset Password All
Route::post('reset',[AuthController::class,'reset']);

//View Years When Rigester Student
Route::get('view_years',[YearController::class,'view_years']);

/* -----------End Of Public Routes------------- */

/* ----------Start Custom Middlewares---------- */ 

//If Is Authenticated Means It's Role Is Student Or Teacher Or Admin
Route::middleware(['auth:sanctum'])->group(function(){

    //Logout all
    Route::post('logout',[AuthController::class,'logout']);

    //Events
    Route::get('view_events_mine',[EventController::class,'view_events_mine']);
    Route::get('count_events_mine',[EventController::class,'count_events_mine']);

    //Admin Notifications (Ex: Means Contact Us)
    Route::delete('delete_admin_notification/{id}',[AdminNotificationController::class,'delete_admin_notification']);

    //Programs
    Route::get('view_programs',[ProgramController::class,'view_programs']);
    Route::get('group_programs/{id}',[ProgramController::class,'group_programs']);
    Route::get('day_programs/{id}',[ProgramController::class,'day_programs']);
    //Route::get('some_informations',[ProgramController::class,'some_informations']);

    //Times
    Route::get('view_times',[TimeController::class,'view_times']);
    Route::get('view_time/{id}',[TimeController::class,'view_time']);

    //Teachers
    Route::get('view_teacher/{id}',[TeacherController::class,'view_teacher']);

    //Halls
    Route::get('view_hall/{id}',[HallController::class,'view_hall']);

    //Subjects
    Route::get('view_subject/{id}',[SubjectController::class,'view_subject']);

    //Years
    Route::get('view_year/{id}',[YearController::class,'view_year']);

    //Groups
    Route::get('view_group/{id}',[GroupController::class,'view_group']);

    //Tasks 
    Route::get('view_tasks_mine',[TaskController::class,'view_tasks_mine']);
    Route::post('add_task',[TaskController::class,'add_task']);
    Route::delete('delete_task/{id}',[TaskController::class,'delete_task']);
    Route::get('view_task/{id}',[TaskController::class,'view_task']);
    Route::put('update_task/{id}',[TaskController::class,'update_task']);
});

//If Is Authenticated And It's Role Is Admin
Route::middleware(['auth:sanctum','isAdmin'])->group(function(){

    //Admin Notifications (Ex: Means Contact Us)
    Route::get('view_admin_notifications',[AdminNotificationController::class,'view_admin_notifications']);
    Route::get('count_admin_notifications',[AdminNotificationController::class,'count_admin_notifications']);
    Route::put('accept_admin_notification/{id}',[AdminNotificationController::class,'accept_admin_notification']);
    Route::put('reject_admin_notification/{id}',[AdminNotificationController::class,'reject_admin_notification']);
    Route::put('add_notification_answer/{id}',[AdminNotificationController::class,'add_notification_answer']);
    Route::get('clear_all_notifications',[AdminNotificationController::class,'clear_all_notifications']);

    //Halls
    Route::post('add_hall',[HallController::class,'add_hall']);
    Route::delete('delete_hall/{id}',[HallController::class,'delete_hall']);
    Route::put('update_hall/{id}',[HallController::class,'update_hall']);

    //Years
    Route::post('add_year',[YearController::class,'add_year']);
    Route::delete('delete_year/{id}',[YearController::class,'delete_year']);
    Route::put('update_year/{id}',[YearController::class,'update_year']);

    //Groups
    Route::post('add_group',[GroupController::class,'add_group']);
    Route::delete('delete_group/{id}',[GroupController::class,'delete_group']);
    Route::put('update_group/{id}',[GroupController::class,'update_group']);
    Route::get('view_groups',[GroupController::class,'view_groups']);
    Route::get('year_groups/{id}',[GroupController::class,'year_groups']);

    //Students
    Route::post('add_student',[StudentController::class,'add_student']);
    Route::get('view_students',[StudentController::class,'view_students']);
    Route::get('group_students/{id}',[StudentController::class,'group_students']);

    //Teachers
    Route::post('add_teacher',[TeacherController::class,'add_teacher']);
    Route::get('view_teachers',[TeacherController::class,'view_teachers']);
    Route::delete('delete_teacher/{id}',[TeacherController::class,'delete_teacher']);

    //Subjects
    Route::post('add_subject',[SubjectController::class,'add_subject']);
    Route::put('update_subject/{id}',[SubjectController::class,'update_subject']);
    Route::delete('delete_subject/{id}',[SubjectController::class,'delete_subject']);
    Route::get('view_subjects',[SubjectController::class,'view_subjects']);
    Route::get('teacher_subjects/{id}',[SubjectController::class,'teacher_subjects']);
    Route::get('year_subjects/{id}',[SubjectController::class,'year_subjects']);

    //Admins
    Route::post('add_admin',[AdminController::class,'add_admin']);
    Route::put('update_admin/{id}',[AdminController::class,'update_admin']);
    Route::delete('delete_admin/{id}',[AdminController::class,'delete_admin']);
    Route::get('view_admins',[AdminController::class,'view_admins']);
    Route::get('view_admin/{id}',[AdminController::class,'view_admin']);
    
    //Times
    Route::post('add_time',[TimeController::class,'add_time']);
    Route::put('update_time/{id}',[TimeController::class,'update_time']);
    Route::delete('delete_time/{id}',[TimeController::class,'delete_time']);

    //Programs
    Route::get('hall_programs/{id}',[ProgramController::class,'hall_programs']);
    Route::get('time_programs/{id}',[ProgramController::class,'time_programs']);
    Route::get('subject_programs/{id}',[ProgramController::class,'subject_programs']); 

    //Events
    Route::get('clear_all_events',[EventController::class,'clear_all_events']);

    //Authenticated Admin
    Route::get('authenticated_admin',function(){
        return response()->json(['status'=>200,'message'=>'You Are Authenticated','id'=>auth()->user()->id]);
    });
});

//If Is Authenticated And It's Role Is Teacher
Route::middleware(['auth:sanctum','isTeacher'])->group(function(){

    //Programs
    Route::get('teacher_programs_mine',[ProgramController::class,'teacher_programs_mine']);
    Route::post('request_swap_programs',[ProgramController::class,'request_swap_programs']);
    Route::post('delete_request_swap_programs',[ProgramController::class,'delete_request_swap_programs']);
    Route::post('swap_programs',[ProgramController::class,'swap_programs']);

    //Authenticated Teacher
    Route::get('authenticated_teacher',function(){
        return response()->json(['status'=>200,'message'=>'You Are Authenticated','id'=>auth()->user()->id]);
    });
});

//If Is Authenticated And It's Role Is Student
Route::middleware(['auth:sanctum','isStudent'])->group(function(){

    //Programs
    Route::get('student_programs_mine',[ProgramController::class,'student_programs_mine']);

    //Authenticated Student
    Route::get('authenticated_student',function(){
        return response()->json(['status'=>200,'message'=>'You Are Authenticated','id'=>auth()->user()->id]);
    });
});

//If Is Authenticated And It's Role Is Admin Or Teacher
Route::middleware(['auth:sanctum','isAdminOrTeacher'])->group(function(){

    //Programs
    Route::post('add_program',[ProgramController::class,'add_program']);
    Route::put('update_program/{id}',[ProgramController::class,'update_program']);
    Route::delete('delete_program/{id}',[ProgramController::class,'delete_program']);
    Route::get('view_program/{id}',[ProgramController::class,'view_program']);
    Route::get('teacher_programs/{id}',[ProgramController::class,'teacher_programs']);
    Route::post('data_status',[ProgramController::class,'data_status']);

    //Teachers
    Route::put('update_teacher/{id}',[TeacherController::class,'update_teacher']);

    //Halls
    Route::get('view_halls',[HallController::class,'view_halls']);
});

//If Is Authenticated And It's Role Is Admin Or Student
Route::middleware(['auth:sanctum','isAdminOrStudent'])->group(function(){

    //Students 
    Route::put('update_student/{id}',[StudentController::class,'update_student']);
    Route::delete('delete_student/{id}',[StudentController::class,'delete_student']);
    Route::get('view_student/{id}',[StudentController::class,'view_student']);
});

//If Is Authenticated And It's Role Is Teacher Or Student 
Route::middleware(['auth:sanctum','isTeacherOrStudent'])->group(function(){
    
    //Admin Notifications (Ex: Means Contact Us)
    Route::get('view_admin_notifications_mine',[AdminNotificationController::class,'view_admin_notifications_mine']);
    Route::post('add_admin_notification',[AdminNotificationController::class,'add_admin_notification']);
}); 

/* ----------End Custom Middlewares------------ */