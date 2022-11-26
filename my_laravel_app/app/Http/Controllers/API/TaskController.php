<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    //01 View My Tasks
    public function view_tasks_mine()
    {
        if(auth()->user()->tokenCan('server:admin'))
        {
            $tasks=Task::where(["how_send"=>"Admin","sender_id"=>auth()->user()->id])->get();
            return response()->json([
                'status'=>200,
                'tasks'=>$tasks,
            ]);
        }
        else if(auth()->user()->tokenCan('server:teacher'))
        {  
            $tasks=Task::where(["how_send"=>"Teacher","sender_id"=>auth()->user()->id])->get();
            return response()->json([
                'status'=>200,
                'tasks'=>$tasks,
            ]);
        }
        else if(auth()->user()->tokenCan('server:student'))
        {
            $tasks=Task::where(["how_send"=>"Student","sender_id"=>auth()->user()->id])->get();
            return response()->json([
                'status'=>200,
                'tasks'=>$tasks,
            ]);
        }
        else
        {
            return response()->json([
                'status'=>401,
                'message'=>'Not Allowed To Get Tasks',
            ]);
        }
    }//Ok

    //02 Add Task
    public function add_task(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'text'=>['required','string','max:255','unique:tasks'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $task=new Task;
            $task->text=$request->input('text');
            $task->done="0";

            if(auth()->user()->tokenCan('server:admin'))
            {
                $task->how_send="Admin";
            }
            else if(auth()->user()->tokenCan('server:teacher'))
            {
                $task->how_send="Teacher";
            }
            else if(auth()->user()->tokenCan('server:student'))
            {
                $task->how_send="Student";
            }
            else
            {
                return response()->json([
                    'status'=>401,
                    'message'=>'Not Allowed To Add Task',
                ]);
            }
            
            $task->sender_id=auth()->user()->id;
            $task->save();
            return response()->json([
                'status'=>200,
                'message'=>'Task Added Successfully',
            ]);
        }
    }//Ok

    //03 Delete Task
    public function delete_task($id)
    {
        $task=Task::find($id);

        if($task)
        {
            $how_send="";
            if(auth()->user()->tokenCan('server:admin'))
            {
                $how_send="Admin";
            }
            else if(auth()->user()->tokenCan('server:teacher'))
            {
                $how_send="Teacher";
            }
            else if(auth()->user()->tokenCan('server:student'))
            {
                $how_send="Student";
            }
            else
            {
                return response()->json([
                    'status'=>401,
                    'message'=>'No Permissions To Delete It',
                ]);
            }

            if($task->sender_id==auth()->user()->id && $task->how_send==$how_send)
            {
                $task->delete();
                return response()->json([
                    'status'=>200,
                    'message'=>'Task Deleted Successfully',
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
                'message'=>'No Task Id Found',
            ]);
        }
    }//Ok

    //04 View Task
    public function view_task($id)
    {
        $task=Task::find($id);
        if($task)
        {

            $how_send="";
            if(auth()->user()->tokenCan('server:admin'))
            {
                $how_send="Admin";
            }
            else if(auth()->user()->tokenCan('server:teacher'))
            {
                $how_send="Teacher";
            }
            else if(auth()->user()->tokenCan('server:student'))
            {
                $how_send="Student";
            }
            else
            {
                return response()->json([
                    'status'=>401,
                    'message'=>'No Permissions To Show It',
                ]);
            }

            if($task->sender_id==auth()->user()->id && $task->how_send==$how_send)
            {
                return response()->json([
                    'status'=>200,
                    'task'=>$task,
                    'message'=>'Task Fetched Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>401,
                    'message'=>'No Permissions To Show It',
                ]);
            }
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'Task Is Not Found',
            ]);
        }
    }//Ok

    //05 Update Task
    public function update_task(Request $request,$id)
    {
        $validationArray=[
            'done'=>['required','string','max:10'],
        ];

        $task_e=Task::find($id);
        
        if($task_e && $task_e->text==$request->input('text'))
        {
            $validationArray['text']=['required','string','max:255'];
        }
        else
        {
            $validationArray['text']=['required','string','max:255','unique:tasks'];
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
            $task=Task::find($id);
            if($task)
            {
                $how_send="";
                if(auth()->user()->tokenCan('server:admin'))
                {
                    $how_send="Admin";
                }
                else if(auth()->user()->tokenCan('server:teacher'))
                {
                    $how_send="Teacher";
                }
                else if(auth()->user()->tokenCan('server:student'))
                {
                    $how_send="Student";
                }
                else
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>'No Permissions To Update It',
                    ]);
                }
    
                if($task->sender_id==auth()->user()->id && $task->how_send==$how_send)
                {
                    $task->text=$request->input('text');
                    $task->done=$request->input('done');
                    $task->save();
                    return response()->json([
                        'status'=>200,
                        'message'=>'Task Updated Successfully',
                    ]);
                }
                else
                {
                    return response()->json([
                        'status'=>401,
                        'message'=>'No Permissions To Update It',
                    ]);
                }
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'Task Is Not Found',
                ]);
            }
        }
    }//Ok
}