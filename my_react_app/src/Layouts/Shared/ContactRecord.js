import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const MyContacts=()=>{

    let [loading,setLoading]=useState(true);
    let [contacts,setContacts]=useState([]);
    let history=useHistory();
    let allContacts="";

    useEffect(()=>{

        axios.get(`/api/view_admin_notifications_mine`).then(res=>{
            if(res.data.status===200)
            {
                setContacts(res.data.notifications);
            }
            setLoading(false)
        })
    },[contacts]);

    const deleteNotification=(e,id)=>{
        e.preventDefault();

        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete(`/api/delete_admin_notification/${id}`).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                isClicked.closest("li").remove();
            }
            else{
                swal("Error",res.data.message,"error");
            }
        }); 
    }

    if(loading)
    {
        return (
            <div className="container px-4 py-3 text-primary">
                <div className="my-3 d-inline-block me-3">
                    <span className="h1">Contact Record </span> 
                </div>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        allContacts=(
            contacts.map((contact,idx)=>{
                return( 
                    <li  key={idx} className={contact.shown==="Yes"?" pb-0 list-group-item":"bg-light list-group-item position-relative shadow"}>

                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-1">
                                <div>
                                    <span className="fw-bold">Status : </span>
                                    {
                                        contact.accepted==="Yes"?
                                            <span className=" me-1">Accepted</span>
                                        :
                                        contact.accepted==="No" ?
                                            <span className=" me-1">Rejected</span>
                                        :
                                            <span className=" me-1">Unknown</span> 
                                    }
                                </div>
                                <div  className="d-flex flex-wrap justify-content-between align-items-center">
                                    {
                                            contact.shown==="Yes"?
                                            <i className="text-dark fa fa-eye me-2"></i>:
                                            <i className="text-dark fa fa-eye-slash me-2"></i>
                                    }
                                    <button onClick={(e)=>deleteNotification(e,contact.id)} className="btn p-0" title="Delete"><i className="fa fa-trash-alt text-danger"></i></button>
                                </div>
                            </div>
                       
                        <p className="mb-1"> <span className="fw-bold">Title :</span>  {contact.title} </p>
                        <p className="mb-1"> <span className="fw-bold">Message :</span>  {contact.message} </p>
                        <p className="mb-1"><span className="fw-bold">Admins answer :</span> {!contact.admin_answer?"No answer yet":contact.admin_answer} </p>
                    </li>
                )
            })
        )
    }

    return(
        <div className="container px-4 py-3">
            <div className="my-3 d-flex justify-content-between align-items-center">
                <span className="h1 d-none d-md-inline">Contact Record </span>
                <i className="fa fa-dove d-md-none text-primary fa-3x"></i> 
                
                <button onClick={()=>history.goBack()} className="btn btn-sm btn-primary px-4 m-1"><i className="fa fa-chevron-right"></i></button>
            </div>
            
            {
                allContacts.length>0?
                <ul className="list-group rounded position-relative mt-4 border border-danger border-top-0 border-bottom-0 border-end-0" >
                    {allContacts.reverse()}
                </ul>:
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <i className="fa fa-quote-left text-primary"></i>
                    <span className="h4 mx-2"> No thing to show </span>
                    <i className="fa fa-quote-right text-primary"></i>
                </div>
            }
        </div>
    )
}//2 Times Used

export default MyContacts;