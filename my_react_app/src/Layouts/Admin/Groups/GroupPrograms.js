import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const GroupPrograms =(props)=>{

    let id=props.match.params.id;
    let programsTable=[];
    const history=useHistory();

    const [programs,setPrograms]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        axios.get(`/api/group_programs/${id}`).then(res=>{
           if(res.data.status===200)
            {
                setPrograms(res.data.programs);
                setLoading(false);
            }
            else if(res.data.status===404)
            {
                swal("Error",res.data.message,"error");
                history.push('/admin/view_groups');
            }
            else
            {
                setError(true);
            }
        });
    },[]);

    if(error)
    {
        return (
            <div className="container px-4 py-4 text-danger">
                <button onClick={()=>history.goBack()} className="btn btn-sm btn-outline-danger px-4 me-3 mb-3">
                    <i className="fa fa-chevron-left"></i>
                </button>
                <span className="h1 my-4">Something went wrong, Change Conditions, Try Again.</span>
            </div>
        )
    }
    else if(loading)
    {
        return (
            <div className="container px-4 py-4 text-primary">
                <span className="h1 my-4">Group Programs </span>
                <div className="spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        programsTable=programs.map((program,idx)=>{
            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{program.day}</td>
                    <td className="py-2 text-center">{program.time.from}</td>
                    <td className="py-2 text-center">{program.time.to}</td>
                    <td className="py-2 text-center">{program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}</td>
                    <td className="py-2 text-center">{program.group.name}</td>
                    <td className="py-2 text-center">{program.group.year.name}</td>
                    <td className="py-2 text-center">{program.hall.name}</td>
                </tr>
            )
        })
    }



    return(
            <div className="container px-4">
            <h1 className="my-4"> <span className="d-none d-md-inline">Group Programs</span> <i className="fa fa-receipt fa-2x text-primary d-md-none"></i> <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto float-end" to="/admin/view_groups" role="button"><i className="fa fa-chevron-right"></i></Link></h1>


            <div className=" mb-3 offset-md-3 col-md-6 text-center">
                <p className="fs-6">
                   There {programs.length>1?"Are":"Is"}
                   <span className="text-primary"> {programs.length} </span>
                   Program{programs.length>1?"s ":" "} To
                   <span className="text-primary"> {programs[0].group.name}</span> In <span className="text-primary"> {programs[0].group.year.name}</span> 
                   <br/>
                   More Options In <Link to="/admin/view_programs" role="button">All Programs</Link>
                </p>
            </div>

            <div className="table-responsive rounded my-5">
                <table className="table table-bordered bg-light">
                    <tbody>
                        <tr className="bg-dark text-light">
                            <th className="text-center" scope="col">Day</th>
                            <th className="text-center" scope="col">From Time</th>
                            <th className="text-center" scope="col">To Time</th>
                            <th className="text-center" scope="col">Teacher</th>
                            <th className="text-center" scope="col">Group</th>
                            <th className="text-center" scope="col">Year</th>
                            <th className="text-center" scope="col">Hall</th>
                        </tr>
                    
                        {programsTable.reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GroupPrograms;