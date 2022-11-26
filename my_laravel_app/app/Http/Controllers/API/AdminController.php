<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    //01 View Admins
    public function view_admins()
    {
        $admins=Admin::all();
        $response=[];

        for($i = 0; $i < count($admins); $i++)
        {
            $id=$admins[$i]->id;
            $admin=Admin::find($id);
            $admin->is_me= auth()->user()->email===$admin->email;
            array_push($response, $admin);
        }

        return response()->json([
            'status'=>200,
            'admins'=>$response,
        ]);
    }//Ok

    //02 Add Admin
    public function add_admin(Request $request)
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
            $admin=new Admin;
            $admin->first_name=$request->input('first_name');
            $admin->middle_name=$request->input('middle_name');
            $admin->last_name=$request->input('last_name');
            $admin->email=$request->input('email');
            $admin->password=Hash::make($request->input('password'));
            $admin->save();
            
            /*
                $admin=Admin::create([
                    'first_name'=>$request->first_name,
                    'middle_name'=>$request->middle_name,
                    'last_name'=>$request->last_name,
                    'email'=>$request->email,
                    'password'=>Hash::make($request->password),
                ]);
            */

            return response()->json([
                'status'=>200,
                'message'=>'Admin Added Successfully',
            ]);
        }
    }//Ok
 
    //03 Delete Admin
    public function delete_admin($id)
    {
        $admin=Admin::find($id);
        if($admin)
        {
            $admins=Admin::all();

            if(count($admins)>1)
            {
                if(auth()->user()->id==$id)
                {
                    $tasks=Task::where(["how_send"=>"Admin","sender_id"=>auth()->user()->id])->get();
                    foreach ($tasks as $task) {
                        $task->delete();
                    }

                    auth()->user()->tokens()->delete();
                    $admin->delete();
                    return response()->json([
                        'status'=>202,
                        'message'=>'Your Account Deleted Successfully'
                    ]);
                }
                else{
                    $tasks=Task::where(["how_send"=>"Admin","sender_id"=>auth()->user()->id])->get();
                    foreach ($tasks as $task) {
                        $task->delete();
                    }
                    
                    $admin->delete();
                    return response()->json([
                        'status'=>200,
                        'message'=>'Admin Deleted Successfully',
                    ]);
                }
            }
            else
            {
                return response()->json([
                    'status'=>400,
                    'message'=>'You Are Last Admin In The System, Give Another Admin And Try Latter.',
                ]);
            }
        }
        else
        {
            return response()->json([
                'message'=>'Admin Is Not Found',
            ]);
        }
    }//Ok

    //04 View Admin
    public function view_admin($id)
    {
        $admin=Admin::find($id);
        if($admin)
        {
            return response()->json([
                'status'=>200,
                'admin'=>$admin,
                'message'=>'Admin Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'Admin Is Not Found',
            ]);
        }
    }//Ok

    //05 Update Admin
    public function update_admin(Request $request,$id)
    {
        $validationArray=[
            'first_name'=>['required','string','max:50'],
            'middle_name'=>['required','string','max:50'],
            'last_name'=>['required','string','max:50'],
            'password'=>['required','string','min:8'],
        ];

        $admin_e=Admin::find($id);
        
        if($admin_e && $admin_e->email==$request->input('email'))
        {
            $validationArray['email']=['required','string','max:100','email','unique:students','unique:teachers'];
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
            $admin=Admin::find($id);
            if($admin)
            {
                $admin->first_name=$request->input('first_name');
                $admin->middle_name=$request->input('middle_name');
                $admin->last_name=$request->input('last_name');
                $admin->email=$request->input('email');

                /*
                    we can not show password after hashed it, so we can not show it to user,only we can do validation and here
                    two options, first if the user woulds to save same password and in this case we do no thing, the user just
                    send the word `useOldPassword` and then we know but in second case we well gave the new password and hashing it.
                */

                if($request->input('password')==="useOldPassword")
                {
                    $admin->password=$admin->password;
                }
                else
                {
                    $admin->password=Hash::make($request->input('password'));
                }

                $admin->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Admin Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'Admin Is Not Found',
                ]);
            }
        }
    }//Ok
}