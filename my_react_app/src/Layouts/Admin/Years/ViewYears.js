import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const ViewYears =()=>{

    let yearsTable=[];
    let history=useHistory();

    const[years,setYears]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        axios.get(`/api/view_years`).then(res=>{
            if(res.data.status===200)
            {
                setYears(res.data.years);
                setLoading(false);
            }
            else
            {
                setError(true)
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
                <span className="h1 my-4">View Years </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        yearsTable=years.map((year,idx)=>{
            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{year.name}</td>
                    <td className="py-2 text-center">
                        {year.description===null?"No Thing":year.description}
                        <br/>
                        {year.groups.length?<Link className="text-primary " to={`/admin/year_groups/${year.id}`} role="button"> Year Groups</Link>:"No Groups Yet"}
                        <br/>
                        {year.subjects.length?<Link className="text-primary " to={`/admin/year_subjects/${year.id}`} role="button"> Year Subjects</Link>:"No Subjects Yet"}
                    </td>
                    <td className="py-2 text-center">
                        <Link className="btn btn-sm btn-dark m-1" to={`/admin/update_year/${year.id}`} role="button"><i className="fa fa-edit"></i></Link>
                        <span>      </span>
                        <button onClick={(e)=>deleteYear(e,year.id)} type="button" className="btn btn-sm btn-danger m-1"><i className="fa fa-trash-alt"></i></button>
                    </td> 
                </tr>
            )
        })
    }

    const deleteYear=(e,id)=>{
        e.preventDefault();
        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete(`/api/delete_year/${id}`).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                isClicked.closest("tr").remove();
                history.go(0);
            }
            else{
                swal("Error",res.data.message,"error");
                 isClicked.innerText="Delete"
            }
        });    
    }

    return(
        <div className="container px-4">
            <span className="h1 my-4 d-none d-md-block">View Years </span>
            <i className="fa fa-route fa-3x text-primary d-md-none my-4"></i>

            <div className="table-responsive rounded my-5">
                <table className="table table-bordered bg-light">
                    <tbody>
                        <tr className="bg-dark text-light">
                            <th className="text-center" scope="col">Name</th>
                            <th className="text-center" scope="col">Description</th>
                            <th className="text-center" scope="col"> 
                                <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                    <i className="fa fa-arrows-alt-v"></i><span>  {years.length}     <Link className="btn btn-sm btn-light" to="/admin/add_year" role="button"><i className="fa fa-plus"></i></Link> </span>
                                </div> 
                            </th>
                        </tr>
                        {yearsTable.reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewYears;