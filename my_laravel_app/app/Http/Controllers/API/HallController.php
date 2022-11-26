<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Hall;
use App\Models\Program;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HallController extends Controller
{
    //01 View Halls
    public function view_halls()
    {
        $halls=Hall::all();
        $response=[];

        for($i = 0; $i < count($halls); $i++)
        {
            $id=$halls[$i]->id;
            $hall=Hall::find($id);
            $hall->programs=Hall::find($id)->programs;

            for($j = 0; $j < count($hall->programs); $j++)
            {
                $id=$hall->programs[$j]->id;
                $hall->programs[$j]->group=Program::find($id)->group;
                $hall->programs[$j]->group->year=Group::find($hall->programs[$j]->group->id)->year;
                $hall->programs[$j]->group->students=Group::find($hall->programs[$j]->group->id)->students;

                $hall->programs[$j]->subject=Program::find($id)->subject;
                $hall->programs[$j]->subject->teacher=Subject::find($hall->programs[$j]->subject->id)->teacher;
            }
            array_push($response, $hall);
        }

        return response()->json([
            'status'=>200,
            'halls'=>$response,
        ]);
    }//Ok

    //02 Add Hall
    public function add_hall(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'name'=>['required','string','max:50','unique:halls'],
            'floor'=>['required','string','max:50'],
            'build'=>['required','string','max:100'],
            'capacity'=>['required','integer'],
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
            $hall=new Hall;
            $hall->name=$request->input('name');
            $hall->floor=$request->input('floor');
            $hall->build=$request->input('build');
            $hall->capacity=$request->input('capacity');
            $hall->description=$request->input('description');
            $hall->save();
            return response()->json([
                'status'=>200,
                'message'=>'Hall Added Successfully',
            ]);
        }
    }//Ok

    //03 Delete Hall
    public function delete_hall($id)
    {
        $hall=Hall::find($id);
        if($hall)
        {
            /*
                There Is Relation Between Two Models And When I Deleted |Hall|
                I Will Delete All |Programs| That Related With This Hall.. Etc.
            */
            
            $programs=Program::where('hall_id','=',$id)->get();
            $msgProgram="";

           if(count($programs)>0)
            {
                for($i=0; $i < count($programs); $i++)
                {
                    $programs[$i]->delete();
                }
                $msgProgram='Matched Programs Are Deleted Successfully';
            }

            $hall->delete();
            return response()->json([
                'status'=>200,
                'message'=>'Hall Deleted Successfully',
                'more'=>$msgProgram,
            ]);
        }
        else
        {
            return response()->json([
                'message'=>'Hall Is Not Found',
            ]);
        }
    }//Ok

    //04 View Hall
    public function view_hall($id)
    {
        $hall=Hall::find($id);
        if($hall)
        {

            $hall->programs=Hall::find($id)->programs;

            for($j = 0; $j < count($hall->programs); $j++)
            {
                $id=$hall->programs[$j]->id;

                $hall->programs[$j]->time=Program::find($id)->time;

                $hall->programs[$j]->group=Program::find($id)->group;
                $hall->programs[$j]->group->year=Group::find($hall->programs[$j]->group->id)->year;
                $hall->programs[$j]->group->students=Group::find($hall->programs[$j]->group->id)->students;

                $hall->programs[$j]->subject=Program::find($id)->subject;
                $hall->programs[$j]->subject->teacher=Subject::find($hall->programs[$j]->subject->id)->teacher;
            }

            return response()->json([
                'status'=>200,
                'hall'=>$hall,
                'message'=>'Hall Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'Hall Is Not Found',
            ]);
        }
    }//Ok

    //05 Update Hall
    public function update_hall(Request $request,$id)
    {
        $validationArray=[
            'floor'=>['required','string','max:50'],
            'build'=>['required','string','max:100'],
            'capacity'=>['required','integer'],
            'description'=>['max:255'],
        ];

        $hall_e=Hall::find($id);
        
        if($hall_e && $hall_e->name==$request->input('name'))
        {
            $validationArray['name']=['required','string','max:50'];
        }
        else
        {
            $validationArray['name']=['required','string','max:50','unique:halls'];
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
            $hall=Hall::find($id);
            if($hall)
            {
                $hall->name=$request->input('name');
                $hall->floor=$request->input('floor');
                $hall->build=$request->input('build');
                $hall->capacity=$request->input('capacity');
                $hall->description=$request->input('description');
                $hall->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Hall Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'Hall Is Not Found',
                ]);
            }

        }
    }//Ok
}
