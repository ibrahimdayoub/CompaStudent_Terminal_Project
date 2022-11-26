import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const ViewAdmins =()=>{

    let adminsTable=[];
    let history=useHistory();

    const [admins,setAdmins]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        axios.get(`/api/view_admins`).then(res=>{
            if(res.data.status===200)
            {
                setAdmins(res.data.admins);
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
                <span className="h1 my-4">View Admins </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        adminsTable=admins.map((admin,idx)=>{
            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{admin.first_name} {admin.middle_name} {admin.last_name} {admin.is_me?<span className="text-primary fs-6">( This You )</span>:""}</td>
                    <td className="py-2 text-center">{admin.email}</td>
                    <td className="py-2 text-center">
                        {
                            !admin.is_me?
                            <>
                                <Link className="btn btn-sm btn-dark m-1" to={`/admin/update_admin/${admin.id}`} role="button"><i className="fa fa-edit"></i></Link>
                                <span>      </span>
                                <button onClick={(e)=>deleteAdmin(e,admin.id)} type="button" className="btn btn-sm btn-danger m-1"><i className="fa fa-trash-alt"></i></button>
                            </>:
                            <Link className="text-primary fs-6" to={`/admin/profile`} >Your Profile</Link>
                        }
                    </td>
                </tr>
            )
        })
    }

    const deleteAdmin=(e,id)=>{
        e.preventDefault();

        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete(`/api/delete_admin/${id}`).then(res=>{
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
            <i className=" my-4 fa fa-street-view text-primary fa-3x d-md-none"></i>
            <span className="h1 my-4 d-none d-md-block">View Admins </span>

            <div className="table-responsive rounded my-5">
                <table className="table table-bordered bg-light">
                    <tbody>
                        <tr className="bg-dark text-light">
                            <th className="text-center" scope="col">Name</th>
                            <th className="text-center" scope="col">Email</th> 
                            <th className="text-center" scope="col"> 
                                <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                    <i className="fa fa-arrows-alt-v"></i><span>  {admins.length}     <Link className="btn btn-sm btn-light" to="/admin/add_admin" role="button"><i className="fa fa-plus"></i></Link> </span>
                                </div> 
                            </th>
                        </tr>
                    
                        {adminsTable.reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewAdmins;