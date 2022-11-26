<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Program;
use App\Models\Subject;
use App\Models\Time;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TimeController extends Controller
{
    //01 View Times
    public function view_times()
    {
        $times=Time::all();
        $response=[];

        for($i = 0; $i < count($times); $i++)
        {
            $id=$times[$i]->id;
            $time=Time::find($id);
            $time->programs=Time::find($id)->programs;

            for($j = 0; $j < count($time->programs); $j++)
            {
                $id=$time->programs[$j]->id;

                $time->programs[$j]->hall=Program::find($id)->hall;

                $time->programs[$j]->group=Program::find($id)->group;
                $time->programs[$j]->group->year=Group::find($time->programs[$j]->group->id)->year;
                $time->programs[$j]->group->students=Group::find($time->programs[$j]->group->id)->students;

                $time->programs[$j]->subject=Program::find($id)->subject;
                $time->programs[$j]->subject->teacher=Subject::find($time->programs[$j]->subject->id)->teacher;
            }
            array_push($response, $time);
        }

        return response()->json([
            'status'=>200,
            'times'=>$response,
        ]);
    }//Ok

    //02 Add Time
    public function add_time(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'from'=>['required','string','max:16'],
            'to'=>['required','string','max:16'],
            'order'=>['required','unique:times','integer'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $time=new Time;
            $time->from=$request->input('from');
            $time->to=$request->input('to');
            $time->order=$request->input('order');
            $time->name="From ".$request->input('from')." To ".$request->input('to');

            //Validation To Prevent Add Times That Repeated, After Check Yes I Will Add Time.
            $matchCase_one=[
                'name'=>"From ".$request->input('from')." To ".$request->input('to'),
            ];
    
            $time1=Time::where($matchCase_one)->get();
    
            if(count($time1)>0)
            {
                return response()->json([
                    'status'=>400,
                    'unique_error'=>"This Time Preexistent, Change Time !",
                ]);
            }

            $time->save();
            return response()->json([
                'status'=>200,
                'message'=>'Time Added Successfully',
            ]);
        }
    }//Ok

    //03 Delete Time
    public function delete_time($id)
    {
        $time=Time::find($id);
        if($time)
        {
            /*
                There Is Relation Between Two Models And When I Deleted |Time|
                I Will Delete All |Programs| That Related With This Time.. Etc.
            */
            
            $programs=Program::where('time_id','=',$id)->get();
            $msgProgram="";

           if(count($programs)>0)
            {
                for($i=0; $i < count($programs); $i++)
                {
                    $programs[$i]->delete();
                }
                $msgProgram='Matched Programs Are Deleted Successfully';
            }

            $time->delete();
            return response()->json([
                'status'=>200,
                'message'=>'Time Deleted Successfully',
                'more'=>$msgProgram,
            ]);
        }
        else
        {
            return response()->json([
                'message'=>'Time Is Not Found',
            ]);
        }
    }//Ok

    //04 View Time
    public function view_time($id)
    {
        $time=Time::find($id);
        if($time)
        {
            $time->programs=Time::find($id)->programs;

            for($j = 0; $j < count($time->programs); $j++)
            {
                $id=$time->programs[$j]->id;

                $time->programs[$j]->hall=Program::find($id)->hall;
                
                $time->programs[$j]->group=Program::find($id)->group;
                $time->programs[$j]->group->year=Group::find($time->programs[$j]->group->id)->year;
                $time->programs[$j]->group->students=Group::find($time->programs[$j]->group->id)->students;

                $time->programs[$j]->subject=Program::find($id)->subject;
                $time->programs[$j]->subject->teacher=Subject::find($time->programs[$j]->subject->id)->teacher;
            }

            return response()->json([
                'status'=>200,
                'time'=>$time,
                'message'=>'Time Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'Time Is Not Found',
            ]);
        }
    }//Ok

    //05 Update Time
    public function update_time(Request $request,$id)
    {
        $validationArray=[
            'from'=>['required','string','max:16'],
            'to'=>['required','string','max:16'],
        ];

        $time_e=Time::find($id);
        
        if($time_e && $time_e->order==$request->input('order'))
        {
            $validationArray['order']=['required','integer'];
        }
        else
        {
            $validationArray['order']=['required','unique:times','integer'];
        }

        $validator=Validator::make($request->all(),$validationArray);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $time=Time::find($id);
            if($time)
            {
                $time->from=$request->input('from');
                $time->to=$request->input('to');
                $time->name="From ".$request->input('from')." To ".$request->input('to');
                $time->order=$request->input('order');

                //Validation To Prevent Add Times That Repeated After Check Yes, I Will Add Time.
                $matchCase_one=[
                    'name'=>"From ".$request->input('from')." To ".$request->input('to'),
                ];
        
                $time1=Time::where($matchCase_one)->get();
        
                if(count($time1)>0)
                { 
                    if(!(count($time1)==1 && $time1[0]->id == $time->id))
                    {
                        return response()->json([
                            'status'=>400,
                            'unique_error'=>"This Time Preexistent, Change Time !",
                        ]);
                    }
                }

                $time->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Time Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'Time Is Not Found',
                ]);
            }

        }
    }//Ok
}
