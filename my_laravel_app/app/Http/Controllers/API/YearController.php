<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Program;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Year;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class YearController extends Controller
{
    //01 View Years
    public function view_years()
    {
        $years=Year::all();
        $response=[];
    
        for($i = 0; $i < count($years); $i++)
        {
            $id=$years[$i]->id;
            $year=Year::find($id);
            $year->groups=Year::find($id)->groups;
            $year->subjects=Year::find($id)->subjects;

            for($j = 0; $j < count($year->subjects); $j++)
            {
                $id=$year->subjects[$j]->id;
                $year->subjects[$j]->teacher=Subject::find($id)->teacher;
            }
            for($k = 0; $k < count($year->groups); $k++)
            {
                $id=$year->groups[$k]->id;
                $year->groups[$k]->students=Group::find($id)->students;
                $year->groups[$k]->programs=Group::find($id)->programs;
            }
            array_push($response, $year);
        }

        return response()->json([
            'status'=>200,
            'years'=>$response,
        ]);
    }//Ok

    //02 Add Year
    public function add_year(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'name'=>['required','string','max:100','unique:years'],
            'order'=>['required','integer','unique:years'],
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
            $year=new Year;
            $year->name=$request->input('name');
            $year->order=$request->input('order');
            $year->description=$request->input('description');
            $year->save();
            return response()->json([
                'status'=>200,
                'message'=>'Year Added Successfully',
            ]);
        }
    }//Ok

    //03 Delete Year
    public function delete_year($id)
    {
        $year=Year::find($id);
        if($year)
        {
            $msgSubject="";
            $msgGroup="";
            $msgProgram="";
            $msgStudent="";

            /*
                There Is Relation Between Two Models And When I Deleted |Year|
                I Will Delete All |Subjects| That Related With This Year.. Etc.
            */

            $subjects=Subject::where('year_id','=',$id)->get();
            if(count($subjects)>0)
            {
                for($j=0; $j < count($subjects); $j++)
                {
                    $subjects[$j]->delete();
                }
                $msgSubject='Matched Subjects Are Deleted Successfully';
            }

            /*
                There Is Relation Between Two Models And When I Deleted |Year|
                I Will Delete All |Groups| That Related With This Year.. Etc.
            */

            $groups=Group::where('year_id','=',$id)->get();
           if(count($groups)>0)
            {
                for($i=0; $i < count($groups); $i++)
                {

                    /*
                        There Is Relation Between Two Models And When I Deleted |Group|
                        I Will Delete All |Programs| That Related With This Group.. Etc.
                    */

                    $programs=Program::where('group_id','=',$groups[$i]->id)->get();
                    if(count($programs)>0)
                    {
                        for($j=0; $j < count($programs); $j++)
                        {
                            $programs[$j]->delete();
                        }
                        $msgProgram='Matched Programs Are Deleted Successfully';
                    }

                    /*
                        There Is Relation Between Two Models And When I Deleted |Group|
                        I Will Delete All |Students| That Related With This Group.. Etc.
                    */
                    
                    $students=Student::where('group_id','=',$groups[$i]->id)->get();
                    if(count($students)>0)
                    {
                        for($k=0; $k < count($students); $k++)
                        {
                            $students[$k]->delete();
                        }
                        $msgStudent='Matched Students Are Deleted Successfully';
                    }

                    //Then Delete One |Group|
                    $groups[$i]->delete();
                }
                $msgGroup='Matched Groups Are Deleted Successfully';
            }

            $year->delete();
            return response()->json([
                'status'=>200,
                'message'=>'Year Deleted Successfully',
                'more'=>$msgSubject." & ".$msgGroup." & ".$msgProgram." & ".$msgStudent,
            ]);
        }
        else
        {
            return response()->json([
                'message'=>'Year Is Not Found',
            ]);
        }
    }//Ok

    //04 View Year
    public function view_year($id)
    {
        $year=Year::find($id);

        if($year)
        {     
            $year->groups=Year::find($id)->groups;
            $year->subjects=Year::find($id)->subjects;
            
            for($j = 0; $j < count($year->subjects); $j++)
            {
                $id=$year->subjects[$j]->id;
                $year->subjects[$j]->teacher=Subject::find($id)->teacher;
            }

            for($k = 0; $k < count($year->groups); $k++)
            {
                $id=$year->groups[$k]->id;
                $year->groups[$k]->students=Group::find($id)->students;
                $year->groups[$k]->programs=Group::find($id)->programs;
            }

            return response()->json([
                'status'=>200,
                'year'=>$year,
                'message'=>'Year Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'Year Is Not Found',
            ]);
        }
    }//Ok

    //05 Update Year
    public function update_year(Request $request,$id)
    {
        $validationArray=[
            'description'=>['max:255'],
        ];

        $year_e=Year::find($id);
        
        if($year_e && $year_e->name==$request->input('name'))
        {
            $validationArray['name']=['required','string','max:50'];
        }
        else
        {
            $validationArray['name']=['required','string','max:50','unique:years'];
        }

        if($year_e && $year_e->order==$request->input('order'))
        {
            $validationArray['order']=['required','integer'];
        }
        else
        {
            $validationArray['order']=['required','integer','unique:years'];
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
            $hall=Year::find($id);
            if($hall)
            {
                $hall->name=$request->input('name');
                $hall->description=$request->input('description');
                $hall->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Year Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'Year Is Not Found',
                ]);
            }

        }
    }//Ok
}