<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Event;
use App\Models\Group;
use App\Models\Student;

class EventController extends Controller
{
    //01 View My Events
    public function view_events_mine()
    {
        $events=Event::all();
        $response=[];

        if(auth()->user()->tokenCan('server:admin'))
        {
            $admins_=Admin::all();

            foreach ($events as $event)
            {
                $event->sender=json_decode($event->sender,true); 
                $event->info=json_decode($event->info,true); 
                $event->receiver=json_decode($event->receiver,true);
                $event->shown=json_decode($event->shown,true);
                $isNew="No";
                $admins=[];

                if(   
                    $event->event==="Add Program"     ||
                    $event->event==="Update Program"  ||
                    $event->event==="Delete Program"  ||
                    $event->event==="Refresh Program"
                )
                {
                    foreach($admins_ as $admin)
                    {
                        if($admin->id==auth()->user()->id && array_key_exists($admin->id,$event->shown["admins"]))
                        {
                            if($event->shown["admins"][auth()->user()->id]==0)
                            {
                                $isNew="Yes";
                            }
                            else
                            {
                                $isNew="No";
                            }
                            $admins[$admin->id]=1;
                        }
                        else if(array_key_exists($admin->id,$event->shown["admins"]))
                        {
                            $admins[$admin->id]=$event->shown["admins"][$admin->id];
                        }
                    }

                    $event->shown=json_encode([
                        "admins"=>$admins,
                        "teacher"=>$event->shown["teacher"],
                        "students_group"=>$event->shown["students_group"],
                    ]);

                    $event->save();
                    $event->new=$isNew;
                    $event->shown=json_decode($event->shown,true);
                    array_push($response,$event);
                }
                else if($event->event==="Swap Programs" || $event->event==="Not Swap Programs")
                {
                    foreach($admins_ as $admin)
                    {
                        if($admin->id==auth()->user()->id && array_key_exists($admin->id,$event->shown["admins"]))
                        {
                            if($event->shown["admins"][auth()->user()->id]==0)
                            {
                                $isNew="Yes";
                            }
                            else
                            {
                                $isNew="No";
                            }
                            $admins[$admin->id]=1;
                        }
                        else if(array_key_exists($admin->id,$event->shown["admins"]))
                        {
                            $admins[$admin->id]=$event->shown["admins"][$admin->id];
                        }
                    }
                    
                    $event->shown=json_encode([
                        "admins"=>$admins,
                        "teacher_one"=>$event->shown["teacher_one"],
                        "teacher_two"=>$event->shown["teacher_two"],
                        "students_one_group"=>$event->shown["students_one_group"],
                        "students_two_group"=>$event->shown["students_two_group"],
                    ]);

                    $event->save();
                    $event->new=$isNew;
                    $event->shown=json_decode($event->shown,true);
                    array_push($response,$event);
                }
            }
        }//What Are Important Events For Admin? Add, Update, Delete, Refresh, Swap, Not Swap
        else if(auth()->user()->tokenCan('server:teacher'))
        {  
            foreach ($events as $event)
            {
                $event->sender=json_decode($event->sender,true); 
                $event->info=json_decode($event->info,true); 
                $event->receiver=json_decode($event->receiver,true);
                $event->shown=json_decode($event->shown,true);
                $isNew="No";

                if(
                    (
                        $event->event==="Add Program"     ||
                        $event->event==="Update Program"  ||
                        $event->event==="Delete Program"  ||
                        $event->event==="Refresh Program"
                    ) &&
                    auth()->user()->id===$event->receiver["teacher"]
                )
                {
                    if($event->shown["teacher"]===0)
                    {
                        $isNew="Yes";
                    }
                    else
                    {
                        $isNew="No";
                    }

                    $event->shown=json_encode([
                        "admins"=>$event->shown["admins"],
                        "teacher"=>1,
                        "students_group"=>$event->shown["students_group"],
                    ]);

                    $event->save();
                    $event->new=$isNew;
                    $event->shown=json_decode($event->shown,true);
                    array_push($response,$event);
                }
                else if(
                    ($event->event==="Swap Programs" || $event->event==="Not Swap Programs") &&
                    auth()->user()->id===$event->receiver["teacher_one"])
                {
                    if($event->shown["teacher_one"]===0)
                    {
                        $isNew="Yes";
                    }
                    else
                    {
                        $isNew="No";
                    }

                    $event->shown=json_encode([
                        "admins"=>$event->shown["admins"],
                        "teacher_one"=>1 ,
                        "teacher_two"=>$event->shown["teacher_two"],
                        "students_one_group"=>$event->shown["students_one_group"],
                        "students_two_group"=>$event->shown["students_two_group"],
                    ]);

                    $event->save();
                    $event->new=$isNew;
                    $event->shown=json_decode($event->shown,true);
                    array_push($response,$event);
                }
                else if(
                    ($event->event==="Swap Programs" || $event->event==="Not Swap Programs") &&
                    auth()->user()->id===$event->receiver["teacher_two"])
                {
                    if($event->shown["teacher_two"]===0)
                    {
                        $isNew="Yes";
                    }
                    else
                    {
                        $isNew="No";
                    }

                    $event->shown=json_encode([
                        "admins"=>$event->shown["admins"],
                        "teacher_one"=>$event->shown["teacher_one"],
                        "teacher_two"=>1,
                        "students_one_group"=>$event->shown["students_one_group"],
                        "students_two_group"=>$event->shown["students_two_group"],
                    ]);

                    $event->save();
                    $event->new=$isNew;
                    $event->shown=json_decode($event->shown,true);
                    array_push($response,$event);
                }
                else if(
                    ($event->event==="Request Swap" || $event->event==="Delete Request Swap") &&
                    auth()->user()->id===$event->receiver["teacher_two"])
                {
                    if($event->shown["teacher_two"]===0)
                    {
                        $isNew="Yes";
                    }
                    else
                    {
                        $isNew="No";
                    }

                    $event->shown=json_encode([
                        "teacher_two"=>1
                    ]);

                    $event->save();
                    $event->new=$isNew;
                    $event->shown=json_decode($event->shown,true);
                    array_push($response,$event);
                }
                else if(
                    (
                        $event->event==="Answer Notification" ||
                        $event->event==="Accept Notification" ||
                        $event->event==="Reject Notification" ||
                        $event->event==="Delete Notification"
                    )&& 
                    array_key_exists("teacher",$event->receiver)
                )
                {
                    if($event->receiver["teacher"]==auth()->user()->id)
                    {
                        if($event->shown["teacher"]===0)
                        {
                            $isNew="Yes";
                        }
                        else
                        {
                            $isNew="No";
                        }
    
                        $event->shown=json_encode([
                            "teacher"=>1,
                        ]);
    
                        $event->save();
                        $event->new=$isNew;
                        $event->shown=json_decode($event->shown,true);
                        array_push($response,$event);
                    }
                }
            }
        }//What Are Important Events For Teacher? Add, Update, Delete, Refresh, Request, Delete Request, Swap, Not Swap, answer, accept, reject, delete
        else if(auth()->user()->tokenCan('server:student'))
        {
            $student=Student::find(auth()->user()->id);
            $student->group=Student::find(auth()->user()->id)->group;   
            $students_=Group::find($student->group->id)->students;         

            foreach ($events as $event)
            {
                $event->sender=json_decode($event->sender,true); 
                $event->info=json_decode($event->info,true); 
                $event->receiver=json_decode($event->receiver,true);
                $event->shown=json_decode($event->shown,true);
                $isNew="No";
                $students=[];

                if( 
                    (
                        $event->event==="Add Program"     ||
                        $event->event==="Update Program"  ||
                        $event->event==="Delete Program"  ||
                        $event->event==="Refresh Program"
                    ) &&
                    $student->group->id===$event->receiver["group"] 
                )
                {
                    foreach($students_ as $student)
                    {
                        if($student->id==auth()->user()->id && array_key_exists($student->id,$event->shown["students_group"]))
                        {
                            if($event->shown["students_group"][auth()->user()->id]==0)
                            {
                                $isNew="Yes";
                            }
                            else
                            {
                                $isNew="No";
                            }

                            $students[$student->id]=1;
                        }
                        else
                        {
                            if(array_key_exists($student->id,$event->shown["students_group"]))
                            {
                                $students[$student->id]=$event->shown["students_group"][$student->id];
                            }
                        }
                    }
    
                    $event->shown=json_encode([
                        "admins"=>$event->shown["admins"],
                        "teacher"=>$event->shown["teacher"],
                        "students_group"=>$students,
                    ]);

                    $event->save();
                    $event->new=$isNew;
                    $event->shown=json_decode($event->shown,true);
                    array_push($response,$event);
                }
                else if(
                    ($event->event==="Swap Programs" || $event->event==="Not Swap Programs") &&
                    $student->group->id===$event->receiver["group_one"])
                {
                    foreach($students_ as $student)
                    {
                        if($student->id==auth()->user()->id && array_key_exists($student->id,$event->shown["students_one_group"]))
                        {
                            if($event->shown["students_one_group"][auth()->user()->id]==0)
                            {
                                $isNew="Yes";
                            }
                            else
                            {
                                $isNew="No";
                            }
                            $students[$student->id]=1;
                        }
                        else
                        {
                            if(array_key_exists($student->id,$event->shown["students_one_group"]))
                            {
                                $students[$student->id]=$event->shown["students_one_group"][$student->id];
                            }
                        }
                    }
    
                    $event->shown=json_encode([
                        "admins"=>$event->shown["admins"],
                        "teacher_one"=>$event->shown["teacher_one"],
                        "teacher_two"=>$event->shown["teacher_two"],
                        "students_one_group"=>$students,
                        "students_two_group"=>$event->shown["students_two_group"],
                    ]);

                    $event->save();
                    $event->new=$isNew;
                    $event->shown=json_decode($event->shown,true);
                    array_push($response,$event);
                }
                else if(
                    ($event->event==="Swap Programs" || $event->event==="Not Swap Programs") &&
                    $student->group->id===$event->receiver["group_two"])
                {
                    foreach($students_ as $student)
                    {
                        if($student->id==auth()->user()->id && array_key_exists($student->id,$event->shown["students_two_group"]))
                        {
                            if($event->shown["students_two_group"][auth()->user()->id]==0)
                            {
                                $isNew="Yes";
                            }
                            else
                            {
                                $isNew="No";
                            }
                            $students[$student->id]=1;
                        }
                        else
                        {
                            if(array_key_exists($student->id,$event->shown["students_two_group"]))
                            {
                                $students[$student->id]=$event->shown["students_two_group"][$student->id];
                            }
                        }
                    }
    
                    $event->shown=json_encode([
                        "admins"=>$event->shown["admins"],
                        "teacher_one"=>$event->shown["teacher_one"],
                        "teacher_two"=>$event->shown["teacher_two"],
                        "students_one_group"=>$event->shown["students_one_group"],
                        "students_two_group"=>$students,
                    ]);

                    $event->save();
                    $event->new=$isNew;
                    $event->shown=json_decode($event->shown,true);
                    array_push($response,$event);
                }
                else if(
                    (
                        $event->event==="Answer Notification" ||
                        $event->event==="Accept Notification" ||
                        $event->event==="Reject Notification" ||
                        $event->event==="Delete Notification"
                    )&& 
                    array_key_exists("student",$event->receiver)
                )
                {
                    if($event->receiver["student"]==auth()->user()->id)
                    {
                        if($event->shown["student"]===0)
                        {
                            $isNew="Yes";
                        }
                        else
                        {
                            $isNew="No";
                        }
    
                        $event->shown=json_encode([
                            "student"=>1,
                        ]);
    
                        $event->save();
                        $event->new=$isNew;
                        $event->shown=json_decode($event->shown,true);
                        array_push($response,$event);
                    }
                }
            }
        }//What Are Important Events For Student? Add, Update, Delete, Refresh, Swap, Not Swap, answer, accept, reject, delete

        return response()->json([
            'status'=>200,
            'events'=>$response
        ]);
    }//Ok

    //02 Count Events
    public function count_events_mine()
    {
        $events=Event::all();
        $count=0;

        if(auth()->user()->tokenCan('server:admin'))
        {
            foreach ($events as $event)
            {
                $event->shown=json_decode($event->shown,true);

                if(!(
                    $event->event==="Update Program"  ||
                    $event->event==="Add Program"     ||           
                    $event->event==="Delete Program"  ||
                    $event->event==="Refresh Program" ||
                    $event->event==="Swap Program"    ||
                    $event->event==="Not Swap Program"
                ))
                {
                    continue;
                }

                if(array_key_exists(auth()->user()->id,$event->shown["admins"]))
                {
                    if($event->shown["admins"][auth()->user()->id]==0)
                    {
                        $count+=1;
                    }
                }
            }
        }
        else if(auth()->user()->tokenCan('server:teacher'))
        {  
            foreach ($events as $event)
            {
                $event->receiver=json_decode($event->receiver,true);

                if(
                    (
                        $event->event==="Update Program"  ||
                        $event->event==="Add Program"     ||           
                        $event->event==="Delete Program"  ||
                        $event->event==="Refresh Program"
                    )&&
                    auth()->user()->id===$event->receiver["teacher"]
                )
                {   
                    $event->shown=json_decode($event->shown,true);

                    if($event->shown["teacher"]==0)
                    {
                        $count+=1;
                    }
                }
                else if(
                    ($event->event==="Swap Programs" || $event->event==="Not Swap Programs") &&
                    auth()->user()->id===$event->receiver["teacher_one"])
                {
                    $event->shown=json_decode($event->shown,true);

                    if($event->shown["teacher_one"]==0)
                    {
                        $count+=1;
                    }
                }
                else if(
                    ($event->event==="Swap Programs" || $event->event==="Not Swap Programs") &&
                    auth()->user()->id===$event->receiver["teacher_two"])
                {
                    $event->shown=json_decode($event->shown,true);

                    if($event->shown["teacher_two"]==0)
                    {
                        $count+=1;
                    }
                }
                else if(
                    ($event->event==="Request Swap" || $event->event==="Delete Request Swap") &&
                    auth()->user()->id===$event->receiver["teacher_two"])
                {
                    $event->shown=json_decode($event->shown,true);

                    if($event->shown["teacher_two"]==0)
                    {
                        $count+=1;
                    }
                }
                else if(
                    (
                        $event->event==="Answer Notification" ||
                        $event->event==="Accept Notification" ||
                        $event->event==="Reject Notification" ||
                        $event->event==="Delete Notification"
                    )&& 
                    array_key_exists("teacher",$event->receiver)
                )
                {
                    if($event->receiver["teacher"]==auth()->user()->id)
                    {
                        $event->shown=json_decode($event->shown,true);

                        if($event->shown["teacher"]==0)
                        {
                            $count+=1;
                        }
                    }
                }
            }
        }
        else if(auth()->user()->tokenCan('server:student'))
        {
            $student=Student::find(auth()->user()->id);
            $student->group=Student::find(auth()->user()->id)->group;

            foreach ($events as $event)
            {
                $event->receiver=json_decode($event->receiver,true);
                if
                (      
                    (
                        $event->event==="Add Program"     ||
                        $event->event==="Update Program"  ||
                        $event->event==="Delete Program"  ||
                        $event->event==="Refresh Program"
                    ) &&
                    $student->group->id===$event->receiver["group"] 
                ) 
                {
                    $event->shown=json_decode($event->shown,true);

                    if(array_key_exists(auth()->user()->id,$event->shown["students_group"]))
                    {
                        if($event->shown["students_group"][auth()->user()->id]==0)
                        {
                            $count+=1;
                        }
                    }
                }
                else if(
                    ($event->event==="Swap Programs" || $event->event==="Not Swap Programs") &&
                    $student->group->id===$event->receiver["group_one"])
                {
                    $event->shown=json_decode($event->shown,true);

                    if(array_key_exists(auth()->user()->id,$event->shown["students_one_group"]))
                    {
                        if($event->shown["students_one_group"][auth()->user()->id]==0)
                        {
                            $count+=1;
                        }
                    }
                    
                }
                else if(
                    ($event->event==="Swap Programs" || $event->event==="Not Swap Programs") &&
                    $student->group->id===$event->receiver["group_two"])
                {
                    $event->shown=json_decode($event->shown,true);

                    if(array_key_exists(auth()->user()->id,$event->shown["students_two_group"]))
                    {
                        if($event->shown["students_two_group"][auth()->user()->id]==0)
                        {
                            $count+=1;
                        }
                    }
                }
                else if(
                    (
                        $event->event==="Answer Notification" ||
                        $event->event==="Accept Notification" ||
                        $event->event==="Reject Notification" ||
                        $event->event==="Delete Notification"
                    )&& 
                    array_key_exists("student",$event->receiver)
                )
                {
                    if($event->receiver["student"]==auth()->user()->id)
                    {
                        $event->shown=json_decode($event->shown,true);

                        if($event->shown["student"]==0)
                        {
                            $count+=1;
                        }
                    }
                }
            }
        }

        return response()->json([
            'status'=>200,
            'count'=>$count
        ]);
    }//Ok

    //03 Clear All events
    public function clear_all_events()
    {
        $events=Event::all();

        if(count($events)>0)
        {
            foreach ($events as $event) {
                $event->delete();
            }
    
            return response()->json([
                'status'=>200,
                'message'=>"Events Cleared Successfuly"
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"Events Not Found To Clear"
            ]);
        }
    }

    //03 Add Event => In Program Controller
    /**
     * Case One By Admin:
     * event: Add, Update Or Delete program
     * sender: {"admin":1}
     * message: One Program Added, Deleted Or Updated Successfully By Admins
     * info:{"program_new":{}} || {"program_old":{}} || {"program_old":{}, "program_new":{}}
     * receiver: {"admins":"all","teacher":1,"group":1}
     * shown:{}
     * 
     * Case Two By Teacher:
     * event: Refresh program (Update Or Edit)
     * sender: {"teacher":1}
     * message: One Program Refreshed Successfully By Teacher
     * info:{"program_old":{}, "program_new":{}}
     * receiver: {"admins":"all","teacher":1,"group":1}
     * shown:{}
     * 
     * Case Three By Two Teachers:
     * event: Swap programs
     * sender: {"teacher_one":1,"teacher_two":2}
     * message: Two Programs Swapped Successfully By Two Teachers
     * info:{"program_one_old":{}, "program_two_old":{}, "program_one_new":{}, "program_two_new":{}}
     * receiver: {"admins":all, "teacher_one":1, "teacher_two":2, "group_one":1 ,"group_two":2}
     * shown:{}
     * 
     * Case Three By Two Teachers:
     * event: Not Swap programs
     * sender: {"teacher_one":1,"teacher_two":2}
     * message: Two Programs Not Swapped Successfully By Two Teachers
     * info:{"program_one_old":{}, "program_two_old":{}, "program_one_new":{}, "program_two_new":{}}
     * receiver: {"admins":all, "teacher_one":1, "teacher_two":2, "group_one":1 ,"group_two":2}
     * shown:{}
     * 
     * Case Four By Two Teachers: (First Teacher Send The Event And Second Teacher Reseive It)
     * event: Request Swap
     * sender: {"teacher":1}
     * message: Two Programs Swapped Successfully By Two Teachers
     * info:{"program_one_old":{}, "program_two_old":{},}
     * receiver:{"teacher":2}
     * shown:{}
     * 
     * Case Five By Two Teachers: (First Teacher Send The Event And Second Teacher Reseive It)
     * event: Delete Request Swap
     * sender: {"teacher":1}
     * message: Two Programs Swapped Successfully By Two Teachers
     * info:{"program_one_old":{}, "program_two_old":{},}
     * receiver:{"teacher":2}
     * shown:{}
     * 
     * Case Six By Admins: (Teachers Send The Notfications And Admins Replies)
     * event: Notification Answer, Accept, Reject, Delete
     * sender: {"admin":1}
     * message: One Notification Answer Added, Accepted, Rejected, Deleted Successfully By Admins  
     * info:{"admin_notification":{}}
     * receiver:{"teacher":1} Or {"student":1}
     * shown:{}
    */
}