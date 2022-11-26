<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Subject;
use App\Models\Task;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    //01 View Teachers
    public function view_teachers()
    {
        $teachers=Teacher::all();
        $response=[];

        for($i = 0; $i < count($teachers); $i++)
        {
            $id=$teachers[$i]->id;
            $teacher=Teacher::find($id);
            $teacher->subjects=Teacher::find($id)->subjects;
            $teacherPrograms=[];

            for($j = 0; $j < count($teacher->subjects); $j++)
            {
                $id=$teacher->subjects[$j]->id;
                $teacher->subjects[$j]->year=Subject::find($id)->year;

                $teacher->subjects[$j]->programs=Subject::find($id)->programs;
                if(count($teacher->subjects[$j]->programs)>0)
                {
                    for($k = 0; $k < count($teacher->subjects[$j]->programs); $k++)
                    {
                        array_push($teacherPrograms, $teacher->subjects[$j]->programs[$k]);
                    }
                }
            }

            $teacher->programs=$teacherPrograms;
            array_push($response, $teacher);
        }

        return response()->json([
            'status'=>200,
            'teachers'=>$response,
        ]);
    }

    //02 Add Teacher
    public function add_teacher(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'first_name'=>['required','string','max:50'],
            'middle_name'=>['required','string','max:50'],
            'last_name'=>['required','string','max:50'],
            'email'=>['required','string','max:100','email','unique:students','unique:teachers','unique:admins'],
            'password'=>['required','string','min:8'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $teacher=new Teacher;
            $teacher->first_name=$request->input('first_name');
            $teacher->middle_name=$request->input('middle_name');
            $teacher->last_name=$request->input('last_name');
            $teacher->email=$request->input('email');
            $teacher->password=Hash::make($request->input('password'));
            $teacher->save();
            
            /*
                $teacher=Teacher::create([
                    'first_name'=>$request->first_name,
                    'middle_name'=>$request->middle_name,
                    'last_name'=>$request->last_name,
                    'email'=>$request->email,
                    'password'=>Hash::make($request->password),
                ]);
            */

            return response()->json([
                'status'=>200,
                'message'=>'Teacher Added Successfully',
            ]);
        }
    }
 
    //03 Delete Teacher
    public function delete_teacher($id)
    {
        $teacher=Teacher::find($id);
        if($teacher)
        {
            /*
                There Is Relation Between Two Models And When I Deleted |Teacher|
                I Will Delete All |Subjects| That Related With This Teacher.. Etc.
            */

            $msgSubject="";
            $msgProgram="";

            $subjects=Subject::where('teacher_id','=',$id)->get();
            if(count($subjects)>0)
            {
                for($i=0; $i < count($subjects); $i++)
                {
                    
                    /*
                        There Is Relation Between Two Models And When I Deleted |Subject|
                        I Will Delete All |Programs| That Related With This Subject.. Etc.
                    */

                    $programs=Program::where('subject_id','=',$subjects[$i]->id)->get();
                    if(count($programs)>0)
                    {
                        for($j=0; $j < count($programs); $j++)
                        {
                            $programs[$j]->delete();
                        }
                        $msgProgram='Matched Programs Are Deleted Successfully';
                    }

                    $subjects[$i]->delete();
                }

                $msgSubject='Matched Subjects Are Deleted Successfully';
            }
            
            $tasks=Task::where(["how_send"=>"Teacher","sender_id"=>auth()->user()->id])->get();
            foreach ($tasks as $task) {
                $task->delete();
            }

            $teacher->delete();
            return response()->json([
                'status'=>200,
                'message'=>'Teacher Deleted Successfully',
                'more'=>$msgSubject." & ".$msgProgram,
            ]);
        }
        else
        {
            return response()->json([
                'message'=>'Teacher Is Not Found',
            ]);
        }
    }

    //04 View Teacher
    public function view_teacher($id)
    {
        $teacher=Teacher::find($id);

        if($teacher)
        {
            $teacher->subjects=Teacher::find($id)->subjects;

            for($j = 0; $j < count($teacher->subjects); $j++)
            {
                $id=$teacher->subjects[$j]->id;
                $teacher->subjects[$j]->year=Subject::find($id)->year;
                $teacher->subjects[$j]->programs=Subject::find($id)->programs;
            }
            
            return response()->json([
                'status'=>200,
                'teacher'=>$teacher,
                'message'=>'Teacher Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'No Teacher Id Found',
            ]);
        }
    }

    //05 Update Teacher
    public function update_teacher(Request $request,$id)
    {
        $validationArray=[
            'first_name'=>['required','string','max:50'],
            'middle_name'=>['required','string','max:50'],
            'last_name'=>['required','string','max:50'],
            'password'=>['required','string','min:8'],
        ];

        $teacher_e=Teacher::find($id);
        
        if($teacher_e && $teacher_e->email==$request->input('email'))
        {
            $validationArray['email']=['required','string','max:100','email','unique:students','unique:admins'];
        }
        else
        {
            $validationArray['email']=['required','string','max:100','email','unique:students','unique:teachers','unique:admins'];
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
            $teacher=Teacher::find($id);
            if($teacher)
            {
                $teacher->first_name=$request->input('first_name');
                $teacher->middle_name=$request->input('middle_name');
                $teacher->last_name=$request->input('last_name');
                $teacher->email=$request->input('email');

                /*
                    we can not show password after hashed it, so we can not show it to user,only we can do validation, and here
                    two options, first if the user woulds to save same password and in this case we do no thing, the user just
                    send the word `useOldPassword` and then we know but in second case we will gave the new password and hashing it.
                */

                if($request->input('password')==="useOldPassword")
                {
                    $teacher->password=$teacher->password;
                }
                else
                {
                    $teacher->password=Hash::make($request->input('password'));
                }

                $teacher->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Teacher Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'No Teacher Id Found',
                ]);
            }

        }
    }
}