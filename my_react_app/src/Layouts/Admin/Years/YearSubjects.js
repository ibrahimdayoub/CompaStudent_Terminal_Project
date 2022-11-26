import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const YearSubjects =(props)=>{

    let id=props.match.params.id;
    let subjectsTable=[];
    const history=useHistory();
    
    const [subjects,setSubjects]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        axios.get(`/api/year_subjects/${id}`).then(res=>{
           if(res.data.status===200)
            {
                setSubjects(res.data.subjects);
                setLoading(false);
            }
            else if(res.data.status===404)
            {
                swal("Error",res.data.message,"error");
                history.push('/admin/view_years');
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
                <span className="h1 my-4">Year Subjects </span>
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
                    <td className="py-2 text-center">{subject.name} {subject.type}</td>
                    <td className="py-2 text-center">{subject.teacher.first_name} {subject.teacher.middle_name} {subject.teacher.last_name}</td>
                    <td className="py-2 text-center">{subject.description?subject.description:"No Thing"}</td>
                </tr>
            )
        })
    }

    return(
            <div className="container px-4">
            <h1 className="my-4"> <span className="d-none d-md-inline">Year Subjects</span> <i className="fa fa-book-open text-primary d-md-none"></i> <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto float-end" to="/admin/view_years" role="button"><i className="fa fa-chevron-right"></i></Link></h1>

            <div className=" mb-3 offset-md-3 col-md-6 text-center">
                <p className="fs-6">
                   There {subjects.length>1?"Are":"Is"}
                   <span className="text-primary"> {subjects.length} </span>
                   Subject{subjects.length>1?"s ":" "} To
                   <span className="text-primary"> {subjects[0].year.name} </span> 
                   <br/>
                   More Options In <Link to="/admin/view_subjects" role="button">All Subjects</Link>
                </p>
            </div>

            <div className="table-responsive rounded my-5">
                <table className="table table-bordered bg-light">
                    <tbody>
                        <tr className="bg-dark text-light">
                            <th className="text-center" scope="col">Name</th>
                            <th className="text-center" scope="col">Teacher</th>
                            <th className="text-center" scope="col">Description</th> 
                        </tr>
                        {subjectsTable.reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default YearSubjects;