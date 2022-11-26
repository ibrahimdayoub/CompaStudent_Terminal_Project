<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminNotificationController extends Controller
{
    //01 View Admin Notifications => This Function For Admin Only
    public function view_admin_notifications()
    {
        $notifications=AdminNotification::all();
        $response=[];

        for($i = 0; $i < count($notifications); $i++)
        {
            $id=$notifications[$i]->id;
            $notification=AdminNotification::find($id);

            if($notification->shown!=="1")
            {
                $notification->shown="1";
                $notification->save();
                $notification->new="1";
            }
            else
            {
                $notification->new="0";
            }

            $isAccepted="";
            switch($notification->accepted)
            {
                case "1"  : $isAccepted="Yes"; break;
                case "-1" : $isAccepted="No"; break;
                default   : $isAccepted="Unknown";
            }

            $isShown="";
            switch($notification->shown)
            {
                case "1" : $isShown="Yes"; break;
                default  : $isShown="No";
            }

            $isNew="";
            switch($notification->new)
            {
                case "1" : $isNew="Yes"; break;
                default  :  $isNew="No";
            }

            $notification->accepted=$isAccepted;
            $notification->shown=$isShown;
            $notification->new=$isNew;

            $sender=AdminNotification::find($id)->sender;

            if($sender)
            {
                $notification->sender=$sender;
                array_push($response, $notification);
            } 
            else
            {
                $notification->delete();
            }
        }

        return response()->json([
            'status'=>200,
            'notifications'=>$response,
        ]);
    }//Ok
    
    //02 Count Admin Notifications => This Function For Admin Only
    public function count_admin_notifications()
    {
        $notifications=AdminNotification::all();
        $count=0;

        for($i = 0; $i < count($notifications); $i++)
        {
            $id=$notifications[$i]->id;
            $notification=AdminNotification::find($id);

            if($notification->shown==="0")
            {
                $count+=1;
            }
        }

        return response()->json([
            'status'=>200,
            'count'=>$count,
        ]);
        
    }//Ok

    //03 Accept  Admin Notification => This Function For Admin Only
    public function accept_admin_notification($id)
    {
        $notification=AdminNotification::find($id);

        if($notification)
        {
            $notification->accepted="1";
            $notification->save();

            //Accept Notification
            $event=new Event();
            $event->event="Accept Notification";
            $event->sender=json_encode([
                "admin"=>auth()->user()->id,
            ]);
            $event->message="One Admin Notification Accepted Successfully By Admins";
            $event->info=json_encode([
                "admin_notification"=>$notification
            ]);

            $user="";
            if($notification->how_send=="Teacher")
            {
                $user="teacher";
            }
            else if($notification->how_send=="Student")
            {
                $user="student";
            }

            $event->receiver=json_encode([
                $user=>$notification->sender_id,
            ]);

            $event->shown=json_encode([ //1=>Shown
                $user=>0
            ]);

            $event->save();
            //Accept Notification
    
            return response()->json([
                'status'=>200,
                'message'=>"Notification Is Accepted Successfuly",
            ]);
        }

        else
        {
            return response()->json([
                'message'=>'No Notification Id Found',
            ]);
        }
    }//Ok

    //04 Reject Admin Notification => This Function For Admin Only
    public function reject_admin_notification($id)
    {
        $notification=AdminNotification::find($id);

        if($notification)
        {
            $notification->accepted="-1";
            $notification->save();

            //Reject Notification
            $event=new Event();
            $event->event="Reject Notification";
            $event->sender=json_encode([
                "admin"=>auth()->user()->id,
            ]);
            $event->message="One Admin Notification Rejected Successfully By Admins";
            $event->info=json_encode([
                "admin_notification"=>$notification
            ]);

            $user="";
            if($notification->how_send=="Teacher")
            {
                $user="teacher";
            }
            else if($notification->how_send=="Student")
            {
                $user="student";
            }

            $event->receiver=json_encode([
                $user=>$notification->sender_id,
            ]);

            $event->shown=json_encode([ //1=>Shown
                $user=>0
            ]);

            $event->save();
            //Reject Notification
    
            return response()->json([
                'status'=>200,
                'message'=>"Notification Is Rejected Successfuly",
            ]);
        }

        else
        {
            return response()->json([
                'message'=>'No Notification Id Found',
            ]);
        }
    }//Ok

    //05 Delete Admin Notifications => This Function For Admin, Teacher And Student
    public function delete_admin_notification($id)
    {
        $notification=AdminNotification::find($id);

        if($notification)
        {

            if(auth()->user()->tokenCan('server:admin'))
            {
                $notification->delete();

                //Delete Notification
                $event=new Event();
                $event->event="Delete Notification";
                $event->sender=json_encode([
                    "admin"=>auth()->user()->id,
                ]);
                $event->message="One Admin Notification Deleted Successfully By Admins";
                $event->info=json_encode([
                    "admin_notification"=>$notification
                ]);

                $user="";
                if($notification->how_send=="Teacher")
                {
                    $user="teacher";
                }
                else if($notification->how_send=="Student")
                {
                    $user="student";
                }

                $event->receiver=json_encode([
                    $user=>$notification->sender_id,
                ]);

                $event->shown=json_encode([ //1=>Shown
                    $user=>0
                ]);

                $event->save();
                //Delete Notification

                return response()->json([
                    'status'=>200,
                    'message'=>'Admin Notification Deleted Successfully By Admin',
                ]);
            }
            else if(auth()->user()->tokenCan('server:teacher'))
            {
                if($notification->sender_id !== auth()->user()->id || $notification->how_send !== "Teacher")
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>'No Permissions To Delete It',
                    ]);
                }

                $notification->delete();
                return response()->json([
                    'status'=>200,
                    'message'=>'Admin Notification Deleted Successfully By Teacher',
                ]);
                
            }
            else if(auth()->user()->tokenCan('server:student'))
            {
                if($notification->sender_id !== auth()->user()->id || $notification->how_send !== "Student")
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>'No Permissions To Delete It',
                    ]);
                }

                $notification->delete();
                return response()->json([
                    'status'=>200,
                    'message'=>'Admin Notification Deleted Successfully By Student',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>401,
                    'message'=>'No Permissions To Delete It',
                ]);
            }
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'No Admin Notification Id Found',
            ]);
        }
    }//Ok

    //06 View Admin Notifications => This Function For Teacher And Student Only
    public function view_admin_notifications_mine()
    {
        $notifications=AdminNotification::all();
        $response=[];
 
        if(auth()->user()->tokenCan('server:teacher'))
        {
            for($i = 0; $i < count($notifications); $i++)
            {
                if($notifications[$i]->sender_id !== auth()->user()->id || $notifications[$i]->how_send !== "Teacher")
                {
                    continue;
                }

                $id=$notifications[$i]->id;
                $notification=AdminNotification::find($id);

                $isAccepted="";
                switch($notification->accepted)
                {
                    case "1"  : $isAccepted="Yes"; break;
                    case "-1" :  $isAccepted="No"; break;
                    default   :  $isAccepted="Unknown";
                }

                $isShown="";
                switch($notification->shown)
                {
                    case "1" : $isShown="Yes"; break;
                    default  :  $isShown="No";
                }

                $notification->accepted=$isAccepted;
                $notification->shown=$isShown;

                $notification->sender=AdminNotification::find($id)->sender;
                array_push($response, $notification);
            }
        }
        else if(auth()->user()->tokenCan('server:student'))
        {
            for($i = 0; $i < count($notifications); $i++)
            {
                if($notifications[$i]->sender_id !== auth()->user()->id || $notifications[$i]->how_send !== "Student")
                {
                    continue;
                }

                $id=$notifications[$i]->id;
                $notification=AdminNotification::find($id);

                $isAccepted="";
                switch($notification->accepted)
                {
                    case "1"  : $isAccepted="Yes"; break;
                    case "-1" :  $isAccepted="No"; break;
                    default   :  $isAccepted="Unknown";
                }

                $isShown="";
                switch($notification->shown)
                {
                    case "1" : $isShown="Yes"; break;
                    default  :  $isShown="No";
                }

                $notification->accepted=$isAccepted;
                $notification->shown=$isShown;

                $notification->sender=AdminNotification::find($id)->sender;
                array_push($response, $notification);
            }
        }

        return response()->json([
            'status'=>200,
            'notifications'=>$response,
        ]);
    }//Ok
    
    //07 Add Admin Notifications => This Function For Teacher And Student Only
    public function add_admin_notification(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'title'=>['required','string','max:191'],
            'message'=>['required','string','max:191'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $notification=new AdminNotification;
            $notification->title=$request->input('title');
            $notification->message=$request->input('message');
            $notification->sender_id=auth()->user()->id;
            $notification->how_send='';
            if(auth()->user()->tokenCan('server:student'))
            {
                $notification->how_send='Student';
            }
            else if(auth()->user()->tokenCan('server:teacher'))
            {
                $notification->how_send='Teacher';
            }
            $notification->accepted="0"; // -1=> Rejected | 0=> Unknown | 1=> Accepted 
            $notification->shown="0"; // 0=> Not Viewed | 1=> Viewed
            $notification->save();

            return response()->json([
                'status'=>200,
                'message'=>'Admin Notification Added Successfully By '.$notification->how_send,
            ]);
        }
    }//Ok

    //08 Adding Answer To Notifications=> This Function For Admin Only
    public function add_notification_answer(Request $request,$id)
    {
        $validator=Validator::make($request->all(),[
            'admin_answer'=>['required','string','max:191'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $notification=AdminNotification::find($id);
            
            if($notification)
            {
                if($notification->admin_answer===null)
                {
                    $notification->admin_answer=$request->input('admin_answer');
                    $notification->save();

                    //Answer Notification
                    $event=new Event();
                    $event->event="Answer Notification";
                    $event->sender=json_encode([
                        "admin"=>auth()->user()->id,
                    ]);
                    $event->message="One Admin Notification Answered Successfully By Admins";
                    $event->info=json_encode([
                        "admin_notification"=>$notification
                    ]);

                    $user="";
                    if($notification->how_send=="Teacher")
                    {
                        $user="teacher";
                    }
                    else if($notification->how_send=="Student")
                    {
                        $user="student";
                    }

                    $event->receiver=json_encode([
                        $user=>$notification->sender_id,
                    ]);
        
                    $event->shown=json_encode([ //1=>Shown
                        $user=>0
                    ]);
        
                    $event->save();
                    //Answer Notification
            
                    return response()->json([
                        'status'=>200,
                        'message'=>"Notification Answer Is Added Successfuly",
                    ]);
                }
                else
                {
                    return response()->json([
                        'status'=>400,
                        'message'=>"Notification Answer Added Before",
                    ]);
                }
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'No Notification Id Found',
                ]);
            }
        }
    }//Ok

    //09 Clear All Notifications
    public function clear_all_notifications()
    {
        $notifications=AdminNotification::all();

        if(count($notifications)>0)
        {
            foreach ($notifications as $event) {
                $event->delete();
            }
    
            return response()->json([
                'status'=>200,
                'message'=>"Notifications Cleared Successfuly"
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"Notifications Not Found To Clear"
            ]);
        }
    }
}