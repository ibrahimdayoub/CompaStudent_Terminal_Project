import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const ViewSubjects =()=>{

    let subjectsTable=[];
    let history=useHistory();

    const [subjects,setSubjects]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        axios.get(`/api/view_subjects`).then(res=>{
            if(res.data.status===200)
            {
                setSubjects(res.data.subjects);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })
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
                <span className="h1 my-4">View Subjects </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        subjectsTable=subjects.map((subject,idx)=>{
            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{subject.name}</td>
                    <td className="py-2 text-center">{subject.type}</td>
                    <td className="py-2 text-center">{subject.teacher.first_name} {subject.teacher.middle_name} {subject.teacher.last_name}</td>
                    <td className="py-2 text-center">{subject.year.name}</td>
                    <td className="py-2 text-center">
                        {subject.description?subject.description:"No Thing"}
                        <br/>
                        {subject.programs.length?<Link className="text-primary " to={`/admin/subject_programs/${subject.id}`} role="button"> Subject Programs</Link>:"No Programs Yet"}
                    </td>
                    <td className="py-2 text-center">
                        <Link className="btn btn-sm btn-dark m-1" to={`/admin/update_subject/${subject.id}`} role="button"><i className="fa fa-edit"></i></Link>
                        <span>      </span>
                        <button onClick={(e)=>deleteSubject(e,subject.id)} type="button" className="btn btn-sm btn-danger m-1"><i className="fa fa-trash-alt"></i></button>
                    </td>
                </tr>
            )
        })
    }

    const deleteSubject=(e,id)=>{
        e.preventDefault();
        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete(`/api/delete_subject/${id}`).then(res=>{
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
            <h1 className="my-4 d-none d-md-block">View Subjects</h1>
            <i className="my-4 fa fa-book-open fa-3x text-primary d-md-none"></i>

            <div className="table-responsive rounded my-5">
                <table className="table table-bordered bg-light">
                    <tbody>
                        <tr className="bg-dark text-light">
                            <th className="text-center" scope="col">Name</th>
                            <th className="text-center" scope="col">Type</th>
                            <th className="text-center" scope="col">Teacher</th>
                            <th className="text-center" scope="col">Year</th>
                            <th className="text-center" scope="col">Description</th> 
                            <th className="text-center" scope="col"> 
                                <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                    <i className="fa fa-arrows-alt-v"></i><span>  {subjects.length}     <Link className="btn btn-sm btn-light" to="/admin/add_subject" role="button"><i className="fa fa-plus"></i></Link> </span>
                                </div> 
                            </th>
                        </tr>
                        {subjectsTable.reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewSubjects;