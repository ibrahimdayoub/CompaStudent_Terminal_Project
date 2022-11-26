import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const ViewHalls =()=>{

    let hallsTable=[];
    let history=useHistory();

    const [halls,setHalls]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        axios.get(`/api/view_halls`).then(res=>{
            if(res.data.status===200)
            {
                setHalls(res.data.halls);
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
                <span className="h1 my-4">View Halls </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        hallsTable=halls.map((hall,idx)=>{
            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{hall.name}</td>
                    <td className="py-2 text-center">{hall.floor}</td>
                    <td className="py-2 text-center">{hall.build}</td>
                    <td className="py-2 text-center">{hall.capacity}</td>
                    <td className="py-2 text-center">
                        {hall.description===null?"No Thing":hall.description}
                        <br/>
                        {hall.programs.length?<Link className="text-primary " to={`/admin/hall_programs/${hall.id}`} role="button"> Hall Programs</Link>:"No Programs Yet"}
                    </td>
                    <td className="py-2 text-center">
                        <Link className="btn btn-sm btn-dark m-1" to={`/admin/update_hall/${hall.id}`} role="button"><i className="fa fa-edit"></i></Link>
                        <span>      </span>
                        <button onClick={(e)=>deleteHall(e,hall.id)} type="button" className="btn btn-sm btn-danger m-1"><i className="fa fa-trash-alt"></i></button>
                    </td>
                </tr>
            )
        })
    }

    const deleteHall=(e,id)=>{
        e.preventDefault();

        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete(`/api/delete_hall/${id}`).then(res=>{
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
            <h1 className="my-4 d-none d-md-block">View Halls</h1>
            <i className="my-4 fa fa-laptop-house fa-3x d-md-none text-primary"></i> 

            <div className="table-responsive rounded my-5">
                <table className="table table-bordered bg-light">
                    <tbody>
                        <tr className="bg-dark text-light">
                            <th className="text-center" scope="col">Name</th>
                            <th className="text-center" scope="col">Floor</th>
                            <th className="text-center" scope="col">Build</th>
                            <th className="text-center" scope="col">Capacity</th>
                            <th className="text-center" scope="col">Description</th> 
                                <th className="text-center" scope="col"> 
                                    <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                        <i className="fa fa-arrows-alt-v"></i><span>  {halls.length}     <Link className="btn btn-sm btn-light" to="/admin/add_hall" role="button"><i className="fa fa-plus"></i></Link> </span>
                                    </div> 
                                </th>
                        </tr>
                        {hallsTable.reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewHalls;