import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const ViewGroups =()=>{

    let history=useHistory();
    let groupsTable=[];
    let ex = /all|All/;
    
    const[groups,setGroups]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        axios.get(`/api/view_groups`).then(res=>{
            if(res.data.status===200)
            {
                setGroups(res.data.groups);
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
                <span className="h1 my-4">Something went wrong, Change Conditions, Try Again.</span>
            </div>
        )
    }
    else if(loading)
    {
        return (
            <div className="container px-4 py-4 text-primary">
                <span className="h1 my-4">View Groups </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        groupsTable=groups.map((group,idx)=>{
            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{group.name}</td>
                    <td className="py-2 text-center">{group.year.name}</td>
                    <td className="py-2 text-center">{group.capacity}</td>
                    <td className="py-2 text-center">
                        {group.description?group.description:"No Thing"}
                        <br/>
                        {group.programs.length?<Link className="text-primary " to={`/admin/group_programs/${group.id}`} role="button"> Group Programs</Link>:"No Programs Yet"}
                        <br/>
                        {group.students.length && !ex.test(group.name)?<Link className="text-primary " to={`/admin/group_students/${group.id}`} role="button"> Group Students</Link>:!group.students.length && !ex.test(group.name)?"No Students Yet":""}
                    </td>
                    <td className="py-2 text-center">
                        <Link className="btn btn-sm btn-dark m-1" to={`/admin/update_group/${group.id}`} role="button"><i className="fa fa-edit"></i></Link>
                        <span>      </span>
                        <button onClick={(e)=>deleteGroup(e,group.id)} type="button" className="btn btn-sm btn-danger m-1"><i className="fa fa-trash-alt"></i></button>
                    </td>
                </tr>
            )
        })
    }

    const deleteGroup=(e,id)=>{
        e.preventDefault();
        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete(`/api/delete_group/${id}`).then(res=>{
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
            <h1 className="my-4 d-none d-md-block">View Groups</h1>
            <i className="fa fa-users fa-3x d-md-none my-4 text-primary"></i>

            <div className="table-responsive rounded my-5">
                <table className="table table-bordered bg-light">
                    <tbody>
                        <tr className="bg-dark text-light">
                            <th className="text-center" scope="col">Name</th>
                            <th className="text-center" scope="col">Year</th>
                            <th className="text-center" scope="col">Capactiy</th>
                            <th className="text-center" scope="col">Description</th> 
                            <th className="text-center" scope="col"> 
                                <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                    <i className="fa fa-arrows-alt-v"></i><span>  {groups.length}     <Link className="btn btn-sm btn-light" to="/admin/add_group" role="button"><i className="fa fa-plus"></i></Link> </span>
                                </div> 
                            </th>
                        </tr>
                        {groupsTable.reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewGroups;