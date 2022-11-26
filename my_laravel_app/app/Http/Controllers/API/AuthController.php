<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Mail\RestMail;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Mail\Message; //With Mail Hog
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    //01 Register (Student)
    public function register(Request $request)
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
            $student=Student::create([
                'first_name'=>$request->first_name,
                'middle_name'=>$request->middle_name,
                'last_name'=>$request->last_name,
                'email'=>$request->email,
                'password'=>Hash::make($request->password),
                'group_id'=>$request->group_id,
            ]);

            $token=$student->createToken($student->email.'Student_Token',['server:student'])->plainTextToken;

            /*
                //Option
                $id_s=$student->id;
                $student->group=Student::find($id_s)->group;

                $id_g=$student->group->id;
                $group=Group::find($id_g); //use App\Models\Group;
                $group->year=Group::find($id_g)->year;

                //You Can Send Message With Response Ok If You Like
                'group_name'=>$student->group->name,
                'year_name'=>$group->year->name,
            */
            
            return response()->json([
                'status'=>201,
                'token'=>$token,
                'name'=>$student->first_name.' '.$student->middle_name.' '.$student->last_name,
                'role'=>'Student',
                'message'=>'Registered Successfully',
            ]);
        }
    }//Ok

    //02 Login (All)
    public function login(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'email'=>['required','string','max:100','email'],
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
            $student=Student::where('email',$request->email)->first();
            $teacher=Teacher::where('email',$request->email)->first();
            $admin=Admin::where('email',$request->email)->first();

            if( (! $student || ! Hash::check($request->password,$student->password))
              &&(! $teacher || ! Hash::check($request->password,$teacher->password))
              &&(! $admin   || ! Hash::check($request->password,$admin->password))
            )
            {
                return response()->json([
                    'status'=>401,
                    'message'=>'Invalid Credentials',
                ]);
            }
            else if($student)
            {
                $token=$student->createToken($student->email.'_Studen_Token',['server:student'])->plainTextToken;

                return response()->json([
                    'status'=>200,
                    'token'=>$token,
                    'name'=>$student->first_name.' '.$student->middle_name.' '.$student->last_name,
                    'role'=>'Student',
                    'message'=>'Logged In Successfully',
                ]);
            }
            else if($teacher)
            {
                $token=$teacher->createToken($teacher->email.'_Teacher_Token',['server:teacher'])->plainTextToken;

                return response()->json([
                    'status'=>200,
                    'token'=>$token,
                    'name'=>$teacher->first_name.' '.$teacher->middle_name.' '.$teacher->last_name,
                    'role'=>'Teacher',
                    'message'=>'Logged In Successfully',
                ]); 
            }
            else if($admin)
            {
                $token=$admin->createToken($admin->email.'_Admin_Token',['server:admin'])->plainTextToken;

                return response()->json([
                    'status'=>200,
                    'token'=>$token,
                    'name'=>$admin->first_name.' '.$admin->middle_name.' '.$admin->last_name,
                    'role'=>'Admin',
                    'message'=>'Logged In Successfully',
                ]); 
            }
        }
    }//Ok

    //03 Forgot Password (All)
    public function forgot (Request $request)
    {
        $validator=Validator::make($request->all(),[
            'email'=>['required','string','max:100','email'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $email =$request->input('email');

            if (
                Admin::where('email', $email)->doesntExist() &&
                Teacher::where('email', $email)->doesntExist() &&
                Student::where('email', $email)->doesntExist()
            )
            {
                return response([
                    'status'=>404,
                    'message' => 'Account Doesn\'t Exists'
                ]);
            }

            $token =Str::random(25);

            try
            {
                DB::table('password_resets')->insert([
                    'email'=>$email,
                    'token'=>$token,
                    'created_at'=>Carbon::now()
                ]);

               
                //Gmail Or Mail Hog,  Only Change .env File
                Mail::send('reset',['token'=>$token],function(Message $message) use ($email){
                    $message->subject('Reset Password');
                    $message->to($email);
                });

                return response([
                    'status'=>200,
                    'message'=>'Check Your Email'
                ]);
            }
            catch (\Exception $e) 
            {
                return response([
                    'status'=>404,
                    'message' => $e->getMessage()
                ]);
            }
        }
    }//Ok

    //04 Reset Password (All)
    public function reset (Request $request)
    {
        $validator=Validator::make($request->all(),[
            'token'=>['required','string'],
            'password'=>['required','string','min:8'],
            'password_confirm'=>['required','string','min:8','same:password']
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $passwordResets =DB::table('password_resets')->where('token',$request->input('token'))->first();

            if(!$passwordResets)
            {
                return response([
                    'status'=>401,
                    'message'=>'Invalid Credentials'
                ]);
            }

            $admin =Admin::where('email',$passwordResets->email)->first();
            $teacher =Teacher::where('email',$passwordResets->email)->first();
            $student =Student::where('email',$passwordResets->email)->first();
        
            //Delete to prevent many resets by same token
            DB::table('password_resets')->where('token',$request->input('token'))->delete();

            if(!$admin && !$teacher && !$student)
            {
                return response([
                    'status'=>404,
                    'message'=>'Account Is Not Found'
                ]);
            }
            else if($student)
            {
                $student->password=Hash::make($request->input('password'));
                $student->save();
            }
            else if($teacher)
            {
                $teacher->password=Hash::make($request->input('password'));
                $teacher->save();
            }
            else if($admin)
            {
                $admin->password=Hash::make($request->input('password'));
                $admin->save();
            }
            
            return response([
                'status'=>200,
                'message'=>'Password Changed Successfully'
            ]);
        }
    }//Ok

    //05 Logout (All)
    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response()->json([
            'status'=>200,
            'message'=>'Logged Out Successfully'
        ]);
    }//Ok
}