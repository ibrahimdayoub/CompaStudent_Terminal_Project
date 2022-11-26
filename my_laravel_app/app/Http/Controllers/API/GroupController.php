<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Program;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    //01 View Groups
    public function view_groups()
    {
        $groups=Group::all();
        $response=[];

        for($i = 0; $i < count($groups); $i++)
        {
            $id=$groups[$i]->id;
            $group=Group::find($id);
            $group->year=Group::find($id)->year;
            $group->students=Group::find($id)->students;
            $group->programs=Group::find($id)->programs;

            for($j = 0; $j < count($group->programs); $j++)
            {
                $id=$group->programs[$j]->id;
                $group->programs[$j]->hall=Program::find($id)->hall;
                $group->programs[$j]->time=Program::find($id)->time;
                $group->programs[$j]->subject=Program::find($id)->subject;
                $group->programs[$j]->subject->teacher=Subject::find($group->programs[$j]->subject->id)->teacher;
            }

            array_push($response, $group);
        }

        return response()->json([
            'status'=>200,
            'groups'=>$response,
        ]);
    }//Ok

    //02 Add Group
    public function add_group(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'name'=>['required','string','max:50'],
            'year_id'=>['required','integer'],
            'capacity'=>['required','integer'],
            'order'=>['required','integer'],
            'description'=>['max:255'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            //Validation To Prevent Add Groups That Repeated After Check Yes, I Will Add Group.
            
            $matchCase_one=[
                'name'=>$request->input('name'),
                'year_id'=>$request->input('year_id'),
            ];

            $matchCase_two=[
                'order'=>$request->input('order'),
                'year_id'=>$request->input('year_id'),
            ];

            $groups1=Group::where($matchCase_one)->get();
            $groups2=Group::where($matchCase_two)->get();

            if(count($groups1)>0)
            {
                return response()->json([
                    'status'=>400,
                    'unique_error'=>"This Group Preexistent, Change Group !",
                ]);
            }

            if(count($groups2)>0)
            {
                return response()->json([
                    'status'=>400,
                    'unique_error'=>"This Order Preexistent, Change Order !",
                ]);
            }

            $group=new Group;
            $group->name=$request->input('name');
            $group->year_id=$request->input('year_id');
            $group->capacity=$request->input('capacity');
            $group->order=$request->input('order');
            $group->description=$request->input('description');
            $group->save();
            return response()->json([
                'status'=>200,
                'message'=>'Group Added Successfully',
            ]);
        }
    }//Ok

    //03 Delete Group
    public function delete_group($id)
    {
        $group=Group::find($id);
        if($group)
        {
            /*
                There Is Relation Between Two Models And When I Deleted |Group|
                I Will Delete All |Programs| That Related With This Group.. Etc.
            */
            
            $programs=Program::where('group_id','=',$id)->get();
            $msgProgram="";

           if(count($programs)>0)
            {
                for($i=0; $i < count($programs); $i++)
                {
                    $programs[$i]->delete();
                }
                $msgProgram='Matched Programs Are Deleted Successfully';
            }

            /*
                There Is Relation Between Two Models And When I Deleted |Group|
                I Will Delete All |Students| That Related With This Group.. Etc.
            */
            
            $students=Student::where('group_id','=',$id)->get();
            $msgStudent="";

           if(count($students)>0)
            {
                for($j=0; $j < count($students); $j++)
                {
                    $students[$j]->delete();
                }
                $msgStudent='Matched Students Are Deleted Successfully';
            }

            $group->delete();
            return response()->json([
                'status'=>200,
                'message'=>'Group Deleted Successfully',
                'more'=>$msgProgram." & ".$msgStudent,
            ]);
        }
        else
        {
            return response()->json([
                'message'=>'Group Is Not Found',
            ]);
        }
    }//Ok

    //04 View Group
    public function view_group($id)
    {
        $group=Group::find($id);
        if($group)
        {
            $group->year=Group::find($id)->year;
            $group->students=Group::find($id)->students;
            $group->programs=Group::find($id)->programs;

            for($j = 0; $j < count($group->programs); $j++)
            {
                $id=$group->programs[$j]->id;
                $group->programs[$j]->hall=Program::find($id)->hall;
                $group->programs[$j]->time=Program::find($id)->time;
                $group->programs[$j]->subject=Program::find($id)->subject;
                $group->programs[$j]->subject->teacher=Subject::find($group->programs[$j]->subject->id)->teacher;
            }

            return response()->json([
                'status'=>200,
                'group'=>$group,
                'message'=>'Group Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'Group Is Not Found',
            ]);
        }
    }//Ok

    //05 Update Group
    public function update_group(Request $request,$id)
    {
        $validator=Validator::make($request->all(),[
            'name'=>['required','string','max:50'],
            'year_id'=>['required','integer'],
            'capacity'=>['required','integer'],
            'order'=>['required','integer'],
            'description'=>['max:255'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $group=Group::find($id);
            if($group)
            {
                //Validation To Prevent Add Groups That Repeated After Check Yes, I Will Add Group.
                $matchCase_one=[
                    'name'=>$request->input('name'),
                    'year_id'=>$request->input('year_id'),
                ];

                $matchCase_two=[
                    'order'=>$request->input('order'),
                    'year_id'=>$request->input('year_id'),
                ];

                $groups1=Group::where($matchCase_one)->get();
                $groups2=Group::where($matchCase_two)->get();

                if(count($groups1)>0)
                { 
                    if(!(count($groups1)==1 && $groups1[0]->id == $group->id))
                    {
                        return response()->json([
                            'status'=>400,
                            'unique_error'=>"This Group Preexistent, Check Your Informations, Change Group !",
                        ]);
                    }
                }

                if(count($groups2)>0)
                { 
                    if(!(count($groups2)==1 && $groups2[0]->id == $group->id))
                    {
                        return response()->json([
                            'status'=>400,
                            'unique_error'=>"This Order Preexistent, Check Your Informations, Change Order !",
                        ]);
                    }
                }

                $group->name=$request->input('name');
                $group->year_id=$request->input('year_id');
                $group->capacity=$request->input('capacity');
                $group->order=$request->input('order');
                $group->description=$request->input('description');
                $group->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Group Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'Group Is Not Found',
                ]);
            }
        }
    }//Ok

    //06 Year Groups
    public function year_groups($iden)
    {
        $groups=Group::where(['year_id'=>$iden])->get();
        $response=[];

        for($i = 0; $i < count($groups); $i++)
        {
            $id=$groups[$i]->id;
            $group=Group::find($id);
            $group->year=Group::find($id)->year;

            array_push($response, $group);
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'groups'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Groups Found To This Year",
            ]); 
        }
    }//Ok
}
