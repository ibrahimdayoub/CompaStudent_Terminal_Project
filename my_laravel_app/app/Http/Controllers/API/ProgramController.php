<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Event;
use App\Models\Group;
use App\Models\Hall;
use App\Models\Program;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Year;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProgramController extends Controller
{
    //Helper1 Function For Repeated Code
    private function helper($id)
    {
        $program=Program::find($id);

        if($program)
        {
            $program->hall=Program::find($id)->hall;
            $program->time=Program::find($id)->time;
            $program->group=Program::find($id)->group;
    
            $program->group->year=Group::find($program->group->id)->year;
            $program->group->year->subjects=Year::find($program->group->year->id)->subjects;
            $program->group->students=Group::find($program->group->id)->students;
    
            $program->subject=Program::find($id)->subject;
            $program->subject->teacher=Subject::find($program->subject->id)->teacher;
    
            return  $program;
        }
        else
        {
            return  false;
        }

    }//Ok

    //01 View Programs
    public function view_programs()
    {
        $programs=Program::all();
        $response=[];

        for($i = 0; $i < count($programs); $i++)
        {
            $program=$this->helper($programs[$i]->id);
            array_push($response, $program);
        }

        return response()->json([
            'status'=>200,
            'programs'=>$response,
        ]);
    }//Ok

    //02 Add Program (By Admin Or Teacher) [validation,400,401,404,200]
    public function add_program(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'day'=>['required','string','max:50'],
            'time_id'=>['required','integer'],
            'hall_id'=>['required','integer'],
            'group_id'=>['required','integer'],
            'subject_id'=>['required','integer'],
            'notice'=>['max:100'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            //Validation To Prevent Add Programs That Repeated Before, Check Yes I Will Add Program.
            $matchCase_zero=[
                'day'=>$request->input('day'),
                'time_id'=>$request->input('time_id'),
                'hall_id'=>$request->input('hall_id'),
                'subject_id'=>$request->input('subject_id')
            ];

            $matchCase_one=[
                'day'=>$request->input('day'),
                'time_id'=>$request->input('time_id'),
                'hall_id'=>$request->input('hall_id')
            ];
    
            $matchCase_two=[
                'day'=>$request->input('day'),
                'time_id'=>$request->input('time_id'),
                'group_id'=>$request->input('group_id'),
            ];
            
            $matchCase_three=[
                'day'=>$request->input('day'),
                'time_id'=>$request->input('time_id'),
                'subject_id'=>$request->input('subject_id')
            ];
    
            $programs0=Program::where($matchCase_zero)->get();
            $programs1=Program::where($matchCase_one)->get();
            $programs2=Program::where($matchCase_two)->get();
            $programs3=Program::where($matchCase_three)->get();
            
            if(count($programs0)>0)
            {
                $flag=0; //Check If Group Already Exist
                foreach ($programs0 as $program) {
                    if($program->group_id==$request->input('group_id'))
                    {
                        $flag=1;
                        break;
                    }
                }

                if($flag==0)
                {
                   //Check If Same Year?
                   $group1_year=Group::find($programs0[0]->group_id)->year->id; //From Any Group I Get Year (All Groups Previously Belongs To One Year)
                   $group2_year=Group::find($request->input('group_id'))->year->id;
       
                   if($group1_year == $group2_year)
                   {
                       //Check If Capacity Avalible
                       //Hall Capacity (Total)
                       $hall_capacity=Hall::find($programs0[0]->hall_id)->capacity;
       
                       //Sum Capacities Of Groups In This Program
                       $sum_capacity=0;
                       foreach ($programs0 as $program) {
                           $sum_capacity+=Group::find($program->group_id)->capacity;
                       }                    
       
                       //Add Capacity Of New Group To $sum_capacity
                       $sum_capacity+=Group::find($request->input('group_id'))->capacity;
       
                       if($sum_capacity>$hall_capacity)
                       {
                           return response()->json([
                               'status'=>400,
                               'unique_error'=>"Not Available, Can't Add MultiProgram In A Cell If Tried, No Additional Capacity In Hall",
                           ]);
                       }
                   }
                   else
                   {
                    return response()->json([
                        'status'=>400,
                        'unique_error'=>"Not Available, Can't Add MultiProgram In A Cell If Tried, Every Group's Year Is Different",
                    ]);
                   }
                }
                else
                {
                    return response()->json([
                        'status'=>400,
                        'unique_error'=>"Not Available, This Program Already Exist With This Group",
                    ]);
                }
            }
            else if(count($programs1)>0)
            {
                return response()->json([
                    'status'=>400,
                    'unique_error'=>"This Program Not Avilable, Change Hall",
                ]);
            }
            else if(count($programs2)>0)
            {
                return response()->json([
                    'status'=>400,
                    'unique_error'=>"This Program Not Avilable, Change Group",
                ]);
            }
            else if(count($programs3)>0)
            {
                return response()->json([
                    'status'=>400,
                    'unique_error'=>"This Program Not Avilable, Change Subject",
                ]);
            }

            $user="";

            if(auth()->user()->tokenCan('server:admin'))
            { 
                $program=new Program;
                $program->day=$request->input('day');
                $program->time_id=$request->input('time_id');
                $program->hall_id=$request->input('hall_id');
                $program->group_id=$request->input('group_id');
                $program->subject_id=$request->input('subject_id');
                $program->notice=$request->input('notice');
                $program->save();
                $user="Admins";
            }
            else if(auth()->user()->tokenCan('server:teacher'))
            {
                //If I'm Teacher And It's My Subject And My Group So Ok, If Not Then Not Ok.
                $subject=Subject::find($request->input('subject_id'));
                if(!$subject)
                {
                    return response()->json([
                        'status'=>404,
                        'message'=>'Subject Is Not Found',
                    ]);
                }

                if($subject->teacher_id!==auth()->user()->id)
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>'This Is Not Your Program To Add, Subject Teacher Id You Want Is '.$subject->teacher_id.' And Your Id Is '.auth()->user()->id,
                    ]);
                }

                $group=Group::find($request->input('group_id'));
                if(!$group)
                {
                    return response()->json([
                        'status'=>404,
                        'message'=>'Group Is Not Found!',
                    ]);
                }

                if($group->year_id!==$subject->year_id)
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>'This Is Not Your Program To Add, Group Year Id You Want Is '.$group->year_id.' And Subject Year Id You Want Is '.$subject->year_id,
                    ]);
                }

                $program=new Program;
                $program->day=$request->input('day');
                $program->time_id=$request->input('time_id');
                $program->hall_id=$request->input('hall_id');
                $program->group_id=$request->input('group_id');
                $program->subject_id=$request->input('subject_id');
                $program->notice=$request->input('notice');
                $program->save();
                $user="Teacher";
            }
            else
            {
                return response()->json([
                    'status'=>401,
                    'message'=>'You Are Not Admin Or Teacher',
                ]);
            }

            //Event Add Program
            $program=$this->helper($program->id);

            $event=new Event;
            $event->event="Add Program";
            if($user=="Admins")
            {
                $event->sender=json_encode([
                    "admin"=>auth()->user()->id
                ]);
            }
            else if($user=="Teacher")
            {
                $event->sender=json_encode([
                    "teacher"=>auth()->user()->id
                ]);
            }
            $event->message="One Program Added Successfully By ".$user;
            $event->info=json_encode([
                "program_new"=>$program,
            ]);
            $event->receiver=json_encode([
                "admins"=>"all",
                "teacher"=>$program->subject->teacher_id,
                "group"=>$program->group_id
            ]);

            $group=Group::find($program->group->id);
            $group->students=Group::find($program->group->id)->students;
            $students=[];
            
            foreach($group->students as $student)
            {
                $students[$student->id]=0;
            }

            $admins_=Admin::all();
            $admins=[];

            foreach($admins_ as $admin)
            {
                $admins[$admin->id]=0;
            }

            $event->shown=json_encode([
                "admins"=>$admins,
                "teacher"=>0,
                "students_group"=>$students,
            ]);

            $event->save();
            
            return response()->json([
                'status'=>200,
                'message'=>'Program Added Successfully',
            ]);
        }
    }//Ok

    //03 Delete Program (By Admin Or Teacher) [401,404,200]
    public function delete_program($id)
    {
        $program=Program::find($id);

        if($program)
        {

            //Event Delete Program
            $program=$this->helper($program->id);

            $event=new Event;
            $event->event="Delete Program";
            $event->sender=json_encode([
                "admin"=>auth()->user()->id
            ]);
            $user="";
            if(auth()->user()->tokenCan('server:admin'))
            {
                $user="Admins";
            }
            else if(auth()->user()->tokenCan('server:teacher'))
            {
                $user="Teacher";
            }

            $event->message="One Program Deleted Successfully By ".$user;
            $event->info=json_encode([
                "program_old"=>$program,
            ]);
            $event->receiver=json_encode([
                "admins"=>"all",
                "teacher"=>$program->subject->teacher->id,
                "group"=>$program->group->id
            ]);

            $group=Group::find($program->group->id);
            $group->students=Group::find($program->group->id)->students;
            $students=[];
            
            foreach($group->students as $student)
            {
                $students[$student->id]=0;
            }

            $admins_=Admin::all();
            $admins=[];

            foreach($admins_ as $admin)
            {
                $admins[$admin->id]=0;
            }

            $event->shown=json_encode([
                "admins"=>$admins,
                "teacher"=>0,
                "students_group"=>$students,
            ]);
            
            if(auth()->user()->tokenCan('server:admin'))
            { 
                //Case One When Swap
                $exp="";
                if($program->swap_notice)
                {
                    if(strpos($program->swap_notice, "|"))
                    {
                        $exp=explode("|",$program->swap_notice)[1];
                    }
                }
                if($exp)
                {
                    $program1=Program::find($exp);
                    $program1->swap_with=null;
                    $program1->swap_notice=null;
                    $program1->save();
                }

                //Case Two When Swap
                if($program->swap_with)
                {
                    $program2=Program::find($program->swap_with);
                    $program2->swap_with=null;
                    $program2->swap_notice=null;
                    $program2->save();
                }

                $program->delete();
                $event->save();
            }
            else if(auth()->user()->tokenCan('server:teacher'))
            {
                //If I'm Teacher And It's My Subject And My Group So Ok, If Not Then Not Ok.
                $subject=Subject::find($program->subject_id);
                if(!$subject)
                {
                    return response()->json([
                        'status'=>404,
                        'message'=>'Subject Is Not Found!',
                    ]);
                }

                if($subject->teacher_id!==auth()->user()->id)
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>'This Is Not Your Program To Delete, Subject Teacher Id Saved Is '.$subject->teacher_id.' And Your Id Is '.auth()->user()->id
                    ]);
                }

                $group=Group::find($program->group_id);
                if(!$group)
                {
                    return response()->json([
                        'status'=>404,
                        'message'=>'Group Is Not Found!',
                    ]);
                }

                if($group->year_id!==$subject->year_id)
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>'This Is Not Your Program To Add, Group Year Id Saved Is '.$group->year_id.' And Subject Year Id Saved Is '.$subject->year_id,
                    ]);
                }

                //Case One When Swap
                $exp="";
                if($program->swap_notice)
                {
                    if(strpos($program->swap_notice, "|"))
                    {
                        $exp=explode("|",$program->swap_notice)[1];
                    }
                }
                if($exp)
                {
                    $program1=Program::find($exp);
                    $program1->swap_with=null;
                    $program1->swap_notice=null;
                    $program1->save();
                }

                //Case Two When Swap
                if($program->swap_with )
                {
                    if($program->swap_with!==-100)
                    {
                        $program2=Program::find($program->swap_with);
                        $program2->swap_with=null;
                        $program2->swap_notice=null;
                        $program2->save();
                    }
                }

                $program->delete();
                $event->save();
            }
            else
            {
                return response()->json([
                    'status'=>401,
                    'message'=>'You Are Not Admin Or Teacher!',
                ]);
            }
            return response()->json([
                'status'=>200,
                'message'=>'Program Deleted Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'Program Is Not Found',
            ]);
        }
    }//Ok

    //04 Update Program (By Admin Or Teacher) [validation,400,401,404,200]
    public function update_program(Request $request,$id)
    {
        $validator=Validator::make($request->all(),[
            'day'=>['required','string','max:50'],
            'time_id'=>['required','integer'],
            'hall_id'=>['required','integer'],
            'group_id'=>['required','integer'],
            'subject_id'=>['required','integer'],
            'notice'=>['max:100']
        ]);
     
        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $program=Program::find($id);

            if($program)
            {
                //Validation To Prevent Update Programs That Repeated After Check Yes, I Will Update Program.
                $matchCase_zero=[
                    'day'=>$request->input('day'),
                    'time_id'=>$request->input('time_id'),
                    'hall_id'=>$request->input('hall_id'),
                    'subject_id'=>$request->input('subject_id')
                ];

                $matchCase_one=[
                    'day'=>$request->input('day'),
                    'time_id'=>$request->input('time_id'),
                    'hall_id'=>$request->input('hall_id')
                ];
        
                $matchCase_two=[
                    'day'=>$request->input('day'),
                    'time_id'=>$request->input('time_id'),
                    'group_id'=>$request->input('group_id'),
                ];

                $matchCase_three=[
                    'day'=>$request->input('day'),
                    'time_id'=>$request->input('time_id'),
                    'subject_id'=>$request->input('subject_id')
                ];
                
                $programs0=Program::where($matchCase_zero)->get();
                $programs1=Program::where($matchCase_one)->get();
                $programs2=Program::where($matchCase_two)->get();
                $programs3=Program::where($matchCase_three)->get();

                if(count($programs0)>0)
                {
                    $flag=0; //Check If Group Already Exist
                    foreach ($programs0 as $program_) {
                        if(
                            $program_->group_id==$request->input('group_id') &&
                            $program_->id != $program->id
                        )
                        {
                            $flag=1;
                            break;
                        }
                    }
    
                    if($flag==0)
                    {
                       //Check If Same Year?
                       $group1_year=Group::find($programs0[0]->group_id)->year->id; //From Any Group I Get Year (All Groups Previously Belongs To One Year)
                       $group2_year=Group::find($request->input('group_id'))->year->id;
           
                       if($group1_year == $group2_year)
                       {
                           //Check If Capacity Avalible?
                           //Hall Capacity (Total)
                           $hall_capacity=Hall::find($programs0[0]->hall_id)->capacity;
           
                           //Sum Capacities Of Groups In This Program!
                           $sum_capacity=0;
                           foreach ($programs0 as $program) {
                               $sum_capacity+=Group::find($program->group_id)->capacity;
                           }
           
                           //Add Capacity Of New Group To $sum_capacity
                           $sum_capacity+=Group::find($request->input('group_id'))->capacity;
           
                           if($sum_capacity>$hall_capacity)
                           {
                               return response()->json([
                                   'status'=>400,
                                   'unique_error'=>"Not Available, Can't Add MultiProgram In A Cell If Tried, No Additional Capacity In Hall",
                               ]);
                           }
                       }
                       else
                       {
                        return response()->json([
                            'status'=>400,
                            'unique_error'=>"Not Available, Can't Add MultiProgram In A Cell If Tried, Every Group's Year Is Different",
                        ]);
                       }
                    }
                    else
                    {
                        return response()->json([
                            'status'=>400,
                            'unique_error'=>"Not Available, This Program Already Exist With This Group",
                        ]);
                    }
                }
                else if(count($programs1)>0)
                {
                    if(!(count($programs1)==1 && $programs1[0]->id == $program->id))
                    {
                        return response()->json([
                            'status'=>400,
                            'unique_error'=>"This Program Not Avilable, Change Hall !",
                        ]);
                    }
                }
                else if(count($programs2)>0)
                {
                    if(!(count($programs2)==1 && $programs2[0]->id == $program->id))
                    {
                        return response()->json([
                            'status'=>400,
                            'unique_error'=>"This Program Not Avilable, Change Group !",
                        ]);
                    }
                }
                else if(count($programs3)>0 )
                {
                    if(!(count($programs3)==1 && $programs3[0]->id == $program->id))
                    {
                        return response()->json([
                            'status'=>400,
                            'unique_error'=>"This Program Not Avilable, Change Subject !",
                        ]);
                    }
                }

                //Before Event Update
                $program1=$this->helper($id); 

                if(auth()->user()->tokenCan('server:admin'))
                {
                    $program->day=$request->input('day');
                    $program->time_id=$request->input('time_id');
                    $program->hall_id=$request->input('hall_id');
                    $program->notice=$request->input('notice');
                    $program->group_id=$request->input('group_id');
                    $program->subject_id=$request->input('subject_id');
                    $program->save();
                }
                else if(auth()->user()->tokenCan('server:teacher'))
                {
                    //If I'm Teacher And It's My Subject And My Group So Ok, If Not Then Not Ok.
                    $subject1=Subject::find($program->subject_id);
                    if(!$subject1)
                    {
                        return response()->json([
                            'status'=>404,
                            'message'=>'Subject Is Not Found!',
                        ]);
                    }

                    if($subject1->teacher_id!==auth()->user()->id)
                    {
                        return response()->json([
                            'status'=>401,
                            'message'=>'This Is Not Your Program To Update, Subject Teacher Id Saved Is '.$subject1->teacher_id.' And Your Id Is '.auth()->user()->id
                        ]);
                    }


                    $group1=Group::find($program->group_id);
                    if(!$group1)
                    {
                        return response()->json([
                            'status'=>404,
                            'message'=>'Group Is Not Found!',
                        ]);
                    }

                    if($group1->year_id!==$subject1->year_id)
                    {
                        return response()->json([
                            'status'=>401,
                            'message'=>'This Is Not Your Program To Update, Group Year Id Saved Is '.$group1->year_id.' And Subject Year Id Saved Is '.$subject1->year_id
                        ]);
                    }


                    $subject2=Subject::find($request->input('subject_id'));
                    if(!$subject2)
                    {
                        return response()->json([
                            'status'=>404,
                            'message'=>'Subject Is Not Found!',
                        ]);
                    }

                    if($subject2->teacher_id!==auth()->user()->id)
                    {
                        return response()->json([
                            'status'=>401,
                            'message'=>'This Is Not Your Program To Update, Subject Teacher Id You Want Is '.$subject2->teacher_id.' And Your Id Is '.auth()->user()->id
                        ]);
                    }


                    $group2=Group::find($request->input('group_id'));
                    if(!$group2)
                    {
                        return response()->json([
                            'status'=>404,
                            'message'=>'Group Is Not Found!',
                        ]);
                    }

                    if($group2->year_id!==$subject2->year_id)
                    {
                        return response()->json([
                            'status'=>401,
                            'message'=>'This Is Not Your Program To Update, Group Year Id You Want Is '.$group2->year_id.' And Subject Year Id You Want Is '.$subject2->year_id
                        ]);
                    }

                    $program->day=$request->input('day');
                    $program->time_id=$request->input('time_id');
                    $program->hall_id=$request->input('hall_id');
                    $program->notice=$request->input('notice');
                    $program->group_id=$request->input('group_id');
                    $program->subject_id=$request->input('subject_id');
                    $program->save();
                }
                else
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>'You Are Not Admin Or Teacher',
                    ]);
                }

                //After Event Update
                $program2=$this->helper($program->id); 

                //How Update?
                $flag=auth()->user()->tokenCan('server:admin')?0:1; // 0=>Admin 1=>Teacher
                
                //Event Update Program Or Refresh Program Down
                $event=new Event;
                $event->event=
                    $flag===0?
                    "Update Program":
                    "Refresh Program";
                $event->sender=
                    $flag===0?
                    json_encode([
                        "admin"=>auth()->user()->id
                    ]):
                    json_encode([
                        "teacher"=>auth()->user()->id
                    ]);
                $event->message=
                    $flag===0?
                    "One Program Updated Successfully By Admins":
                    "One Program Refreshed Successfully By Teacher";
                $event->info=json_encode([
                    "program_old"=>$program1,
                    "program_new"=>$program2,
                ]);
                $event->receiver=json_encode([
                    "admins"=>"all",
                    "teacher"=>$program->subject->teacher->id,
                    "group"=>$program->group->id
                ]);

                $group=Group::find($program->group->id);
                $group->students=Group::find($program->group->id)->students;
                $students=[];
                
                foreach($group->students as $student)
                {
                    $students[$student->id]=0;
                }
    
                $admins_=Admin::all();
                $admins=[];
    
                foreach($admins_ as $admin)
                {
                    $admins[$admin->id]=0;
                }
    
                $event->shown=json_encode([
                    "admins"=>$admins,
                    "teacher"=>0,
                    "students_group"=>$students,
                ]);
    
                $event->save();

                return response()->json([
                    'status'=>200,
                    'message'=>'Program Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'Program Is Not Found',
                ]);
            }
        }
    }//Ok

    //05 View Program
    public function view_program($id)
    {
        $program=$this->helper($id);
        if($program)
        {
            return response()->json([
                'status'=>200,
                'program'=>$program,
                'message'=>'Program Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'Program Is Not Found',
            ]);
        }
    }//Ok

    //06 Hall Programs
    public function hall_programs($iden)
    { 
        $programs=Program::where(['hall_id'=>$iden])->get();
        $response=[];

        for($i = 0; $i < count($programs); $i++)
        {
            $program=$this->helper($programs[$i]->id);
            array_push($response, $program);
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'programs'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Programs Found To This Hall",
            ]); 
        }
    }//Ok

    //07 Time Programs
    public function time_programs($iden)
    {
        $programs=Program::where(['time_id'=>$iden])->get();
        $response=[];

        for($i = 0; $i < count($programs); $i++)
        {  
            $program=$this->helper($programs[$i]->id);
            array_push($response, $program);
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'programs'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Programs Found To This Time",
            ]); 
        }
    }//Ok

    //08 Day Programs
    public function day_programs($iden)
    {
        $programs=Program::where(['day'=>$iden])->get();
        $response=[];

        for($i = 0; $i < count($programs); $i++)
        {   
            $program=$this->helper($programs[$i]->id);
            array_push($response, $program);
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'programs'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Programs Found To This Day",
            ]); 
        } 
    }//Ok

    //09 Group Programs
    public function group_programs($iden)
    {
        $programs=Program::where(['group_id'=>$iden])->get();
        $response=[];

        for($i = 0; $i < count($programs); $i++)
        {   
            $program=$this->helper($programs[$i]->id);
            array_push($response, $program);
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'programs'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Programs Found To This Group",
            ]); 
        }
    }//Ok

    //10 Subject Programs
    public function subject_programs($iden)
    {
        $programs=Program::where(['subject_id'=>$iden])->get();
        $response=[];

        for($i = 0; $i < count($programs); $i++)
        {
            $program=$this->helper($programs[$i]->id);
            array_push($response, $program);
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'programs'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Programs Found To This Subject",
            ]); 
        }
    }//Ok

    //11 Teacher Programs (By Id)
    public function teacher_programs($iden)
    {
        $programs=Program::all();
        $response=[];

        for($i = 0; $i < count($programs); $i++)
        {
            $program=$this->helper($programs[$i]->id);
            if($program->subject->teacher->id==$iden)
            {
                array_push($response, $program);
            }
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'programs'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Programs Found To This Teacher",
            ]); 
        }
    }//Ok

    //12 Teacher Programs (By Auth)
    public function teacher_programs_mine()
    {
        $programs=Program::all();
        $response=[];

        for($i = 0; $i < count($programs); $i++)
        {
            $program=$this->helper($programs[$i]->id);
            if($program->subject->teacher->id==auth()->user()->id)
            {
                array_push($response, $program);
            }
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'programs'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Programs Found To Me",
            ]); 
        }
    }//Ok

    //13 Student Programs (By Auth)
    public function student_programs_mine()
    {
        $programs=Program::all();
        $response=[];

        $student=Student::find(auth()->user()->id);

        if(!$student)
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Student Found",
            ]); 
        }

        $group=Student::find(auth()->user()->id)->group;


        for($i = 0; $i < count($programs); $i++)
        {
            $program=$this->helper($programs[$i]->id);
            if($program->group_id==$group->id)
            {
                array_push($response, $program);
            }
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'programs'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Programs Found To Me",
            ]); 
        }
    }//Ok

    //14 Request Swap Between Two Teachers Times (swap Day, Time and Hall), Side Of The First Teacher
    public function request_swap_programs(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'current_id'=>['required','integer'],
            'target_id'=>['required','integer'],
        ]);
     
        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            if($request->current_id === $request->target_id)
            {
                return response()->json([
                    'status'=>400,
                    'message'=>"Two Programs Are Same, Do You Like Swap With You?",
                ]);
            }

            $program1=Program::find($request->current_id);
            $program2=Program::find($request->target_id);

            if(!($program1 && $program2))
            {
                return response()->json([
                    'status'=>400,
                    'message'=>"One Of Two Programs Is Not Found, Both Are Required",
                ]);
            }
            else
            {
                $subject=Program::find($request->current_id)->subject;

                if($subject->teacher_id!==auth()->user()->id)
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>"Requset Swap Go Wrong, You Do Not Have Access To This Current Program",
                    ]); 
                }

                if($program1->swap_with !==null && $program1->swap_with !==-100 )
                {
                    return response()->json([
                        'status'=>403,
                        'message'=>"Requset Swap Go Wrong, One Of Them Try Swap With You",
                    ]);
                }
                else if($program1->swap_with ==-100)
                {
                    return response()->json([
                        'status'=>403,
                        'message'=>"You Send Request Swap, Try Another Time",
                    ]);
                }

                if($program2->swap_with !==null && $program2->swap_with !==-100 )
                {
                    return response()->json([
                        'status'=>403,
                        'message'=>"Requset Swap Go Wrong, Try Another Time",
                    ]);
                }
                else if($program2->swap_with ==-100)
                {
                    return response()->json([
                        'status'=>403,
                        'message'=>"He Send Request Swap, Try Another Time",
                    ]);
                }

                $program1->swap_with=-100;
                $program1->swap_notice="May Be, I Will Make Swap With |".$request->target_id;
                $program1->save();

                $program2->swap_with=$request->input('current_id');
                $program2->swap_notice="I Want Swap With You, Please";
                $program2->save();

                //Request Swap
                $program_one_old=$this->helper($request->current_id);
                $program_two_old=$this->helper($request->target_id);

                $event=new Event;
                $event->event="Request Swap";
                $event->sender=json_encode([
                    "teacher_one"=>$program_one_old->subject->teacher_id,
                ]);
                $event->message="There Is Swap Request For You Check That Please, Then Accept Or Reject";
                $event->info=json_encode([
                    "program_one_old"=>$program_one_old,
                    "program_two_old"=>$program_two_old
                ]);
                $event->receiver=json_encode([
                    "teacher_two"=>$program_two_old->subject->teacher_id,
                ]);
    
                $event->shown=json_encode([ //1=>Shown
                    "teacher_two"=>0
                ]);
    
                $event->save();

                return response()->json([
                    'status'=>200,
                    'message'=>"Requset Swap Go Successfully, Wait Response",
                ]);
                //Request Swap
            }
        }
    }//Ok

    //15 Delete Request Swap Between Two Teachers Times (swap Day, Time and Hall), Side Of The First Teacher
    public function delete_request_swap_programs(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'current_id'=>['required','integer'],
            'target_id'=>['required','integer'],
        ]);
     
        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            if($request->current_id === $request->target_id)
            {
                return response()->json([
                    'status'=>400,
                    'message'=>"Two Programs Are Same, Do You Like Swap With You?",
                ]);
            }

            if(Program::find($request->current_id)->subject->teacher_id !== auth()->user()->id)
            {
                return response()->json([
                    'status'=>403,
                    'message'=>"You Can Not Delete Because You Are Not First Teacher",
                ]);
            }

            $program1=Program::find($request->current_id);
            $program2=Program::find($request->target_id);

            if(!($program1 && $program2))
            {
                return response()->json([
                    'status'=>400,
                    'message'=>"One Of Two Programs Is Not Found, Both Are Required",
                ]);
            }
            else
            {
                if(!(
                    $program1->swap_with ===-100 &&
                    $program2->swap_with ===$request->current_id
                ))
                {
                    return response()->json([
                        'status'=>403,
                        'message'=>"You Can Not Delete Because No Swap Request Founded",
                    ]);
                }
                else
                {
                    $program1->swap_with =null;
                    $program1->swap_notice="You Back To Swap With |".$request->target_id;
                    $program1->save();
                    $program2->swap_with =null;
                    $program2->swap_notice="One Of Them Delete Request Swap With You";
                    $program2->save();

                    //Delete Request Swap
                    $program_one_old=$this->helper($request->current_id);
                    $program_two_old=$this->helper($request->target_id);

                    $event=new Event;
                    $event->event="Delete Request Swap";
                    $event->sender=json_encode([
                        "teacher_one"=>$program_one_old->subject->teacher_id,
                    ]);
                    $event->message="There Was Swap Request For You, He's Owner Delete It";
                    $event->info=json_encode([
                        "program_one_old"=>$program_one_old,
                        "program_two_old"=>$program_two_old
                    ]);
                    $event->receiver=json_encode([
                        "teacher_two"=>$program_two_old->subject->teacher_id,
                    ]);
        
                    $event->shown=json_encode([ //1=>Shown
                        "teacher_two"=>0
                    ]);
        
                    $event->save();
                    
                    return response()->json([
                        'status'=>200,
                        'message'=>"Delete Requset Swap Go Successfully",
                    ]);
                    //Delete Request Swap
                }
            }
        }
    }//Ok

    //16 Swap Between Two Teachers Times (swap Day, Time and Hall), Side Of The Second Teacher
    public function swap_programs(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'flag'=>['required','string','max:10'],
            'requested_id'=>['required','integer'],
            'reseved_id'=>['required','integer'],
        ]);
     
        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $program1=Program::find($request->requested_id);
            $program2=Program::find($request->reseved_id);

            if(!($program1 && $program2))
            {
                return response()->json([
                    'status'=>400,
                    'message'=>"One Of Two Programs Is Not Found, Both Are Required",
                ]);
            }
            else
            {
                if(!(
                    $program1->swap_with ===-100 &&
                    $program2->swap_with ===$request->requested_id
                ))
                {
                    return response()->json([
                        'status'=>403,
                        'message'=>"You Can Not Swap Because No Swap Request Founded",
                    ]);
                }

                if(auth()->user()->id !== Program::find($request->reseved_id)->subject->teacher_id)
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>"You Can Not Swap Because You Are Not Second Teacher",
                    ]);
                }

                if($request->flag==="True")
                {                     
                    //Swapping Here Day,Time And Hall
                    $program_one_old=$this->helper($request->requested_id);  
                    $program_two_old=$this->helper($request->reseved_id);
                    
                    $day=$program1->day;
                    $program1->day=$program2->day;
                    $program2->day=$day;

                    $time_id=$program1->time_id;
                    $program1->time_id=$program2->time_id;
                    $program2->time_id=$time_id;

                    $hall_id=$program1->hall_id;
                    $program1->hall_id=$program2->hall_id;
                    $program2->hall_id=$hall_id;

                    $program1->swap_with=null;
                    $program2->swap_with=null;

                    $program1->swap_notice="Swap Go Successfully With |".$request->reseved_id;
                    $program2->swap_notice="You Accept Swap Successfully With |".$request->requested_id;
                 
                    $program1->save();
                    $program2->save();

                    //Event Swap Programs
                    $program_one_new=$this->helper($request->requested_id);
                    $program_two_new=$this->helper($request->reseved_id);

                    $event=new Event;
                    $event->event="Swap Programs";
                    $event->sender=json_encode([
                        "teacher_one"=>$program_one_new->subject->teacher->id,
                        "teacher_two"=>$program_two_new->subject->teacher->id
                    ]);
                    $event->message="Two Programs Swaped Successfully By Teachers, Second Teacher Accept Swap";
                    $event->info=json_encode([
                        "program_one_old"=>$program_one_old,
                        "program_two_old"=>$program_two_old,
                        "program_one_new"=>$program_one_new,
                        "program_two_new"=>$program_two_new,
                    ]);
                    $event->receiver=json_encode([
                        "admins"=>"all",
                        "teacher_one"=>$program_one_new->subject->teacher->id,
                        "teacher_two"=>$program_two_new->subject->teacher->id,
                        "group_one"=>$program_one_new->group->id,
                        "group_two"=>$program_two_new->group->id
                    ]);

                    $group_one=Group::find($program_one_new->group->id);
                    $group_two=Group::find($program_two_new->group->id);

                    $group_one->student=Group::find($program_one_new->group->id)->students;
                    $group_two->student=Group::find($program_two_new->group->id)->students;

                    $students_one=[];
                    $students_two=[];
                    
                    foreach($group_one->student as $student)
                    {
                        $students_one[$student->id]=0;
                    }

                    foreach($group_two->student as $student)
                    {
                        $students_two[$student->id]=0;
                    }
        
                    $admins_=Admin::all();
                    $admins=[];
        
                    foreach($admins_ as $admin)
                    {
                        $admins[$admin->id]=0;
                    }
        
                    $event->shown=json_encode([ //1=>Shown
                        "admins"=>$admins,
                        "teacher_one"=>0,
                        "teacher_two"=>0,
                        "students_one_group"=>$students_one,
                        "students_two_group"=>$students_two
                    ]);
        
                    $event->save();
                    
                    return response()->json([
                        'status'=>200,
                        'message'=>"Swap Between Go Successfully",
                    ]);
                    //Event Swap Programs
                }
                else if($request->flag==="False")
                {
                    $program1->swap_with=null;
                    $program2->swap_with=null;

                    $program1->swap_notice="Swap Go Wrong With |".$request->reseved_id;
                    $program2->swap_notice="You Reject Swap Successfully With |".$request->requested_id;

                    $program1->save();
                    $program2->save();

                    //Event Not Swap Programs
                    $program_one_old=$this->helper($request->requested_id);
                    $program_two_old=$this->helper($request->reseved_id);
                    $program_one_new=$this->helper($request->requested_id);
                    $program_two_new=$this->helper($request->reseved_id);

                    $event=new Event;
                    $event->event="Not Swap Programs";
                    $event->sender=json_encode([
                        "teacher_one"=>$program_one_new->subject->teacher->id,
                        "teacher_two"=>$program_two_new->subject->teacher->id
                    ]);
                    $event->message="Two Programs Not Swaped Successfully By Teachers, Second Teacher Reject Swap";
                    $event->info=json_encode([
                        "program_one_old"=>$program_one_old,
                        "program_two_old"=>$program_two_old,
                        "program_one_new"=>$program_one_new,
                        "program_two_new"=>$program_two_new,
                    ]);
                    $event->receiver=json_encode([
                        "admins"=>"all",
                        "teacher_one"=>$program_one_new->subject->teacher->id,
                        "teacher_two"=>$program_two_new->subject->teacher->id,
                        "group_one"=>$program_one_new->group->id,
                        "group_two"=>$program_two_new->group->id
                    ]);

                    $group_one=Group::find($program_one_new->group->id);
                    $group_two=Group::find($program_two_new->group->id);

                    $group_one->student=Group::find($program_one_new->group->id)->students;
                    $group_two->student=Group::find($program_two_new->group->id)->students;

                    $students_one=[];
                    $students_two=[];
                    
                    foreach($group_one->student as $student)
                    {
                        $students_one[$student->id]=0;
                    }

                    foreach($group_two->student as $student)
                    {
                        $students_two[$student->id]=0;
                    }
        
                    $admins_=Admin::all();
                    $admins=[];
        
                    foreach($admins_ as $admin)
                    {
                        $admins[$admin->id]=0;
                    }
        
                    $event->shown=json_encode([ //1=>Shown
                        "admins"=>$admins,
                        "teacher_one"=>0,
                        "teacher_two"=>0,
                        "students_one_group"=>$students_one,
                        "students_two_group"=>$students_two
                    ]);
        
                    $event->save();
                    
                    return response()->json([
                        'status'=>200,
                        'message'=>"Not Swap Between Go Successfully",
                    ]);
                    //Event Not Swap Programs
                }
                else
                {
                    return response()->json([
                        'status'=>400,
                        'message'=>"We Accept Flag Value 'True' Or 'False' Only",
                    ]);
                }
            }
        }
    }//Ok

    //17 Data Status (when We Want Add Or Update Multiprograms)
    public function data_status(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'day'=>['required','string','max:50'],
            'time_id'=>['required','integer'],
            'hall_id'=>['required','integer'],
            'group_id'=>['required','integer'],
            'subject_id'=>['required','integer'],
            'notice'=>['max:100'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $matchCase=[
                'day'=>$request->input('day'),
                'time_id'=>$request->input('time_id'),
                'hall_id'=>$request->input('hall_id'),
                'subject_id'=>$request->input('subject_id')
            ];

            $programs=Program::where($matchCase)->get();
            
            if(count($programs)>0)
            {
                //Check If Same Year?
                $group1_year=Group::find($programs[0]->group_id)->year->name;
                $group2_year=Group::find($request->input('group_id'))->year->name;

                $message="Found Identical Data For (";

                for($i=0;$i<count($programs);$i++)
                {
                    if($i==count($programs)-1)
                    {
                        $message.=Group::find($programs[$i]->group_id)->name.")";
                    }
                    else
                    {
                        $message.=Group::find($programs[$i]->group_id)->name.", ";
                    }
                }
    
                if($group1_year == $group2_year)
                {
                    $message.=" In Year (".$group1_year.")";
                }
                else
                {
                    $message.=" In Year (".$group1_year.") But Your Year Is (".$group2_year.")";
                }

                return response()->json([
                    'status'=>200,
                    'message'=>$message
                ]);
            }
            else
            {
                $message="Not Found Identical Data, Maybe, It's Probable To Being Conflicts";
                return response()->json([
                    'status'=>404,
                    'message'=>$message
                ]);
            }
        }
    }
    /*
        Multiprograms Is More Than One Program In One Table's Cell, For Many Groups
        First Condition: Same Year, Day, Time, Hall And Subject For All Groups
        Second Condition: Sum Of Every Group's Capacity Smaller Than Or Equal A Hall's Capacity  
    */ 
    /*
        To Do:
            - Add 'All Groups' Group, And Handle 'Add_program' And 'update_program' Functions.
            - Swap All Groups (Check:If Cell Has 3 Groups And Another Cell Has 4 Grops That Means Not All Groups)
            - Handle Events.
    */
}