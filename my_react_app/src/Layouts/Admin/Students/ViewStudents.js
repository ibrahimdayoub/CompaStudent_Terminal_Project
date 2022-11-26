import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const ViewStudents =()=>{

    let studentsTable=[];
    let history=useHistory();

    const [students,setStudents]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        axios.get(`/api/view_students`).then(res=>{
            if(res.data.status===200)
            {
                setStudents(res.data.students);
                setLoading(false);
            }
            else
            {
                setError(false);
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
                <span className="h1 my-4">View Students </span>
                <div className="spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        studentsTable=students.map((student,idx)=>{
            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{student.first_name} {student.middle_name} {student.last_name}</td>
                    <td className="py-2 text-center">{student.email}</td>
                    <td className="py-2 text-center">{student.group.name}</td>
                    <td className="py-2 text-center">{student.group.year.name}</td>
                    <td className="py-2 text-center">
                        <Link className="btn btn-sm btn-dark m-1" to={`/admin/update_student/${student.id}`} role="button"><i className="fa fa-edit"></i></Link>
                        <span>      </span>
                        <button onClick={(e)=>deleteStudent(e,student.id)} type="button" className="btn btn-sm btn-danger m-1"><i className="fa fa-trash-alt"></i></button>
                    </td>
                </tr>
            )
        })
    }

    const deleteStudent=(e,id)=>{
        e.preventDefault();
        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete(`/api/delete_student/${id}`).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                isClicked.closest("tr").remove();
                history.go(0);
            }
            else{
                swal("Error",res.data.message,"error");
                history.go(0);
            }
        });    
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">View Students</h1>
            <i className="fa fa-graduation-cap fa-3x text-primary d-md-none my-4"></i>

            <div className="table-responsive rounded my-5">
                <table className="table table-bordered bg-light">
                    <tbody>
                        <tr className="bg-dark text-light">
                            <th className="text-center" scope="col">Name</th>
                            <th className="text-center" scope="col">Email</th> 
                            <th className="text-center" scope="col">Group</th> 
                            <th className="text-center" scope="col">Year</th> 
                            <th className="text-center" scope="col"> 
                                <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                    <i className="fa fa-arrows-alt-v"></i><span>  {students.length}     <Link className="btn btn-sm btn-light" to="/admin/add_student" role="button"><i className="fa fa-plus"></i></Link> </span>
                                </div> 
                            </th>
                        </tr>
                        {studentsTable.reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewStudents;
