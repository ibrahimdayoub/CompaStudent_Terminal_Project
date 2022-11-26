<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Program;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    //01 View Subjects
    public function view_subjects()
    {
        $subjects=Subject::all();
        $response=[];

        for($i = 0; $i < count($subjects); $i++)
        {
            $id=$subjects[$i]->id;
            $subject=Subject::find($id);
            $subject->teacher=Subject::find($id)->teacher;
            $subject->year=Subject::find($id)->year;
            $subject->programs=Subject::find($id)->programs;

            for($j = 0; $j < count($subject->programs); $j++)
            {
                $id=$subject->programs[$j]->id;
                $subject->programs[$j]->hall=Program::find($id)->hall;
                $subject->programs[$j]->time=Program::find($id)->time;
                $subject->programs[$j]->group=Program::find($id)->group;
                $subject->programs[$j]->group->students=Group::find($subject->programs[$j]->group->id)->students;
            }
            array_push($response, $subject);
        }

        return response()->json([
            'status'=>200,
            'subjects'=>$response,
        ]);
    }//Ok

    //02 Add Subject
    public function add_subject(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'name'=>['required','string','max:50'],
            'teacher_id'=>['required','integer'],
            'year_id'=>['required','integer'],
            'type'=>['required'],
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
            //Validation To Prevent Add Subjects That Repeated After Check Yes, I Will Add Subject.
            $matchCase_one=[
                'name'=>$request->input('name'),
                'type'=>$request->input('type'),
            ];

            $subjects1=Subject::where($matchCase_one)->get();

            if(count($subjects1)>0)
            {
                return response()->json([
                    'status'=>400,
                    'unique_error'=>"This Subject Preexistent, Check Your Informations, Change Subject !",
                ]);
            }

            $subject=new Subject;
            $subject->name=$request->input('name');
            $subject->teacher_id=$request->input('teacher_id');
            $subject->year_id=$request->input('year_id');
            $subject->type=$request->input('type');
            $subject->description=$request->input('description');
            $subject->save();
            return response()->json([
                'status'=>200,
                'message'=>'Subject Added Successfully',
            ]);
        }
    }//Ok

    //03 Delete Subject
    public function delete_subject($id)
    {
        $subject=Subject::find($id);
        if($subject)
        {
            /*
                There Is Relation Between Two Models And When I Deleted |Subject|
                I Will Delete All |Programs| That Related With This Subject.. Etc.
            */

            $programs=Program::where('subject_id','=',$id)->get();
            $msgProgram="";

           if(count($programs)>0)
            {
                for($i=0; $i < count($programs); $i++)
                {
                    $programs[$i]->delete();
                }
                $msgProgram='Matched Programs Are Deleted Successfully';
            }

            $subject->delete();
            return response()->json([
                'status'=>200,
                'message'=>'Subject Deleted Successfully',
                'more'=>$msgProgram,
            ]);
        }
        else
        {
            return response()->json([
                'message'=>'No Subject Id Found',
            ]);
        }
    }//Ok

    //04 View Subject
    public function view_subject($id)
    {
        $subject=Subject::find($id);
        if($subject)
        {
            $subject->teacher=Subject::find($id)->teacher;
            $subject->year=Subject::find($id)->year;
            $subject->programs=Subject::find($id)->programs;

            for($j = 0; $j < count($subject->programs); $j++)
            {
                $id=$subject->programs[$j]->id;
                $subject->programs[$j]->hall=Program::find($id)->hall;
                $subject->programs[$j]->time=Program::find($id)->time;
                $subject->programs[$j]->group=Program::find($id)->group;
                $subject->programs[$j]->group->students=Group::find($subject->programs[$j]->group->id)->students;
            }
            
            return response()->json([
                'status'=>200,
                'subject'=>$subject,
                'message'=>'Subject Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'Subject Is Not Found',
            ]);
        }
    }//Ok

    //05 Update Subject
    public function update_subject(Request $request,$id)
    {
        $validator=Validator::make($request->all(),[
            'name'=>['required','string','max:50'],
            'teacher_id'=>['required','integer'],
            'year_id'=>['required','integer'],
            'type'=>['required'],
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
            $subject=Subject::find($id);
            if($subject)
            {
                //Validation To Prevent Add Subjects That Repeated After Check Yes, I Will Add Subject.
                
                $matchCase_one=[
                    'name'=>$request->input('name'),
                    'type'=>$request->input('type'),
                ];

                $subjects1=Subject::where($matchCase_one)->get();

                if(count($subjects1)>0)
                {   
                    if(!(count($subjects1)==1 && $subjects1[0]->id == $subject->id))
                    {
                        return response()->json([
                            'status'=>400,
                            'unique_error'=>"This Subject Preexistent, Check Your Informations, Change Subject !",
                        ]);
                    }   
                }

                $subject->name=$request->input('name');
                $subject->teacher_id=$request->input('teacher_id');
                $subject->year_id=$request->input('year_id');
                $subject->type=$request->input('type');
                $subject->description=$request->input('description');
                $subject->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Subject Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'No Subject Id Found',
                ]);
            }
        }
    }//Ok

    //06 Teacher Subjects
    public function teacher_subjects($iden)
    {
        $subjects=Subject::all();
        $response=[];

        for($i = 0; $i < count($subjects); $i++)
        {
            $id=$subjects[$i]->id;
            $subject=Subject::find($id);
            $subject->year=Subject::find($id)->year;
            $subject->teacher=Subject::find($id)->teacher;
            if($subject->teacher->id==$iden)
            {
                array_push($response, $subject);
            }
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'subjects'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Subjects Found For This Teacher",
            ]); 
        }
    }//Ok

    //07 Year Subjects
    public function year_subjects($iden)
    {
        $subjects=Subject::all();
        $response=[];

        for($i = 0; $i < count($subjects); $i++)
        {
            $id=$subjects[$i]->id;
            $subject=Subject::find($id);
            $subject->teacher=Subject::find($id)->teacher;
            $subject->year=Subject::find($id)->year;
            if($subject->year->id==$iden)
            {
                array_push($response, $subject);
            }
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'subjects'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Subjects Found For This Year",
            ]); 
        }
    }//Ok
}
