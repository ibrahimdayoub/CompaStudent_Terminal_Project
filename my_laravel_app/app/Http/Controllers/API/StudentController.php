<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Group;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    //01 View Students
    public function view_students()
    {
        $students=Student::all();
        $response=[];
    
        for($i = 0; $i < count($students); $i++)
        {
            $id=$students[$i]->id;
            $student=Student::find($id);
            $student->group=Student::find($id)->group;
            $student->group->year=Group::find($student->group->id)->year;

            array_push($response, $student);
        }

        return response()->json([
            'status'=>200,
            'students'=>$response,
        ]);
    }//Ok

    //02 Add Student
    public function add_student(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'first_name'=>['required','string','max:50'],
            'middle_name'=>['required','string','max:50'],
            'last_name'=>['required','string','max:50'],
            'email'=>['required','string','max:100','email','unique:students','unique:teachers','unique:admins'],
            'password'=>['required','string','min:8'],
            'group_id'=>['required','integer','max:50'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $student=new Student;
            $student->first_name=$request->input('first_name');
            $student->middle_name=$request->input('middle_name');
            $student->last_name=$request->input('last_name');
            $student->email=$request->input('email');
            $student->password=Hash::make($request->input('password'));
            $student->group_id=$request->input('group_id');
            $student->save();
            
            /*
                $student=Student::create([
                    'first_name'=>$request->first_name,
                    'middle_name'=>$request->middle_name,
                    'last_name'=>$request->last_name,
                    'email'=>$request->email,
                    'password'=>Hash::make($request->password),
                    'group_id'=>$request->group_id,
                ]);
            */

            return response()->json([
                'status'=>200,
                'message'=>'Student Added Successfully',
            ]);
        }
    }//Ok

    //03 Delete Student
    public function delete_student($id)
    {
        $student=Student::find($id);
        if($student)
        {
            if(auth()->user()->id==$id && auth()->user()->tokenCan('server:student'))
            {
                $tasks=Task::where(["how_send"=>"Student","sender_id"=>auth()->user()->id])->get();
                foreach ($tasks as $task) {
                    $task->delete();
                }
                auth()->user()->tokens()->delete();
                $student->delete();
                return response()->json([
                    'status'=>202,
                    'message'=>'Your Account Deleted Successfully'
                ]);
            }
            else
            {   
                $tasks=Task::where(["how_send"=>"Student","sender_id"=>auth()->user()->id])->get();
                foreach ($tasks as $task) {
                    $task->delete();
                }
                $student->delete();
                return response()->json([
                    'status'=>200,
                    'message'=>'Student Deleted Successfully',
                ]);
            }
        }
        else
        {
            return response()->json([
                'message'=>'Student Is Not Found',
            ]);
        }
    }//Ok

    //04 View Student
    public function view_student($id)
    {
        $student=Student::find($id);

        if($student)
        {
            $student->group=Student::find($id)->group;
            $student->group->year=Group::find($student->group->id)->year;
            
            return response()->json([
                'status'=>200,
                'student'=>$student,
                'message'=>'Student Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'message'=>'Student Is Not Found',
            ]);
        }
    }//Ok

    //05 Update Student
    public function update_student(Request $request,$id)
    {
        $validationArray=[
            'first_name'=>['required','string','max:50'],
            'middle_name'=>['required','string','max:50'],
            'last_name'=>['required','string','max:50'],
            'password'=>['required','string','min:8'],
            'group_id'=>['required','integer','max:50'],
        ];

        $student_e=Student::find($id);
        
        if($student_e && $student_e->email==$request->input('email'))
        {
            $validationArray['email']=['required','string','max:100','email','unique:teachers','unique:admins'];
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
            $student=Student::find($id);
            if($student)
            {
                $student->first_name=$request->input('first_name');
                $student->middle_name=$request->input('middle_name');
                $student->last_name=$request->input('last_name');
                $student->email=$request->input('email');
                $student->group_id=$request->input('group_id');

                /*
                    we can not show password after hashed it, so we can not show it to user,only we can do validation and here
                    two options, first if the user woulds to save same password and in this case we do no thing, the user just
                    send the word `useOldPassword` and then we know but in second case we well gave the new password and hashing it.
                */

                if($request->input('password')==="useOldPassword")
                {
                    $student->password=$student->password;
                }
                else
                {
                    $student->password=Hash::make($request->input('password'));
                }

                $student->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Student Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'Student Is Not Found',
                ]);
            }
        }
    }//Ok

    //06 Group Students
    public function group_students($iden)
    {
        $students=Student::where(['group_id'=>$iden])->get();
        $response=[];

        for($i = 0; $i < count($students); $i++)
        {
            $id=$students[$i]->id;
            $student=Student::find($id);
            $student->group=Student::find($id)->group;
            $student->group->year=Group::find($student->group->id)->year;

            array_push($response, $student);
        }

        if(count($response)>0)
        {
            return response()->json([
                'status'=>200,
                'students'=>$response,
            ]); 
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>"No Students Found To This Group",
            ]); 
        }
    }//Ok
}