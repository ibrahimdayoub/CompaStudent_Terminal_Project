import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const ViewTimes =()=>{

    let timesTable=[];
    let history=useHistory();

    const [times,setTimes]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        axios.get(`/api/view_times`).then(res=>{
            if(res.data.status===200)
            {
                setTimes(res.data.times);
                setLoading(false);
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
                <span className="h1 my-4">View Times </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        timesTable=times.map((time,idx)=>{
            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{time.from}</td>
                    <td className="py-2 text-center">{time.to}</td>
                    <td className="py-2 text-center">
                        {time.programs.length?<Link className="text-primary " to={`/admin/time_programs/${time.id}`} role="button"> Time Programs</Link>:"No Programs Yet"}
                    </td>
                    <td className="py-2 text-center">
                        <Link className="btn btn-sm btn-dark m-1" to={`/admin/update_time/${time.id}`} role="button"><i className="fa fa-edit"></i></Link>
                        <span>      </span>
                        <button onClick={(e)=>deleteTime(e,time.id)} type="button" className="btn btn-sm btn-danger m-1"><i className="fa fa-trash-alt"></i></button>
                    </td>
                </tr>
            )
        })
    }

    const deleteTime=(e,id)=>{
        e.preventDefault();
        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete(`/api/delete_time/${id}`).then(res=>{
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
            <h1 className="my-4 d-none d-md-block">View Times</h1>
            <i className="my-4 fa fa-clock fa-3x d-md-none text-primary"></i> 

            <div className="table-responsive rounded my-5">
                <table className="table table-bordered bg-light">
                    <tbody>
                        <tr className="bg-dark text-light">
                            <th className="text-center" scope="col">From</th>
                            <th className="text-center" scope="col">To</th>
                            <th className="text-center" scope="col">More</th>
                                <th className="text-center" scope="col"> 
                                    <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                        <i className="fa fa-arrows-alt-v"></i><span>  {times.length}     <Link className="btn btn-sm btn-light" to="/admin/add_time" role="button"><i className="fa fa-plus"></i></Link> </span>
                                    </div> 
                                </th>
                        </tr>
                        {timesTable.reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewTimes;