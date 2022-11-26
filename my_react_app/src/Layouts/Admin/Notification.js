import React,{useState,useEffect} from 'react';
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const Notification=()=>{

    let history=useHistory(), allNotifications=[], teachersNotifications=[], studentsNotifications=[];

    const [notifications,setNotifications]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [responseInput,setResponse]=useState({
        admin_answer:"",
        error_list:[]
    });
    const [show,setShow]=useState(0);// Show Input Field

    useEffect(()=>{
        axios.get(`/api/view_admin_notifications`).then(res=>{
            if(res.data.status===200)
            {
                setNotifications(res.data.notifications);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        });
    },[]);

    const clearAll=()=>{
        axios.get(`/api/clear_all_notifications`).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setTimeout(() => {
                    history.go(0);
                }, 1500);
            }
            else if(res.data.status===404){
                swal("Error",res.data.message,"error");
            }
        });
    }

    const deleteNotification=(e,id)=>{
        e.preventDefault();
        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete(`/api/delete_admin_notification/${id}`).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                isClicked.closest("li").remove();
                setTimeout(() => {
                    history.go(0);
                }, 1500);
            }
            else
            {
                swal("Error",res.data.message,"error");
                setTimeout(() => {
                    history.go(0);
                }, 1500);
            }
        }); 
    }

    const acceptNotification=(e,id)=>{
        e.preventDefault();
        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.put(`/api/accept_admin_notification/${id}`).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setTimeout(() => {
                    history.go(0);
                }, 1500);
            }
            else{
                swal("Error",res.data.message,"error");
                setTimeout(() => {
                    history.go(0);
                }, 1500);
            }
        }); 
    }

    const rejectNotification=(e,id)=>{
        e.preventDefault();
        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.put(`/api/reject_admin_notification/${id}`).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setTimeout(() => {
                    history.go(0);
                }, 1500);
            }
            else{
                swal("Error",res.data.message,"error");
                setTimeout(() => {
                    history.go(0);
                }, 1500);
            }
        }); 
    }

    const handleInputResponse=(e)=>{
        e.persist();
        setResponse({...responseInput,[e.target.name]:e.target.value});
    };

    const addResponse=(e,id)=>{
        e.preventDefault();

        let data={
            admin_answer:responseInput.admin_answer //validation_errors
        }

        axios.put(`/api/add_notification_answer/${id}`,data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setTimeout(() => {
                    history.go(0);
                }, 1500);
            }
            if(res.data.status===400 || res.data.status===404)
            {
                swal("Error",res.data.message,"error");
            }
            else{
                setResponse({...responseInput,error_list:res.data.validation_errors});
            }
        });
    }
    
    const showField=(e)=>{
        setResponse({...responseInput,error_list:[]});
        if(show==e.target.id){
            setShow(0);
        }
        else{
            setShow(e.target.id);
        }
    }


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
            <div className="container px-4 py-3 text-primary">
                <div className="my-3 d-inline-block me-3">
                    <span className="h1">Notifications </span> 
                </div>
               
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        allNotifications=(
            notifications.map((notification,idx)=>{

                let li=(
                    <li  key={idx} className={notification.new==="No"?" list-group-item":"bg-light list-group-item position-relative shadow"}>
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="ms-2 fw-bold">
                            <span className="card-text h5"> {notification.title}</span>
                            </div> 
                            <div>
                                <button onClick={(e)=>deleteNotification(e,notification.id)} className="btn p-1" title="Delete"><i className="fa fa-trash-alt text-danger"></i></button>
                                {
                                    notification.accepted==="Yes"?
                                    <>
                                        <button disabled className="btn p-1"><i className="fa fa-handshake text-primary"></i></button>
                                    </>:
                                    notification.accepted==="No" ?
                                    <>
                                        <button disabled className="btn p-1"><i className="fa fa-handshake text-primary"></i></button>
                                    </>:
                                    <>
                                        <button onClick={(e)=>rejectNotification(e,notification.id)} className="btn p-1" title="Reject"><i className="text-dark fa fa-handshake-slash"></i></button>
                                        <button onClick={(e)=>acceptNotification(e,notification.id)} className="btn p-1" title="Accept"><i className="fa fa-handshake text-primary"></i></button>
                                    </>
                                }
                                {
                                    !notification.admin_answer?
                                    <button type="submit" id={notification.id} onClick={(e)=>showField(e)} className="btn btn-primary btn-sm">Add Response</button>:
                                    <button disabled className="btn btn-primary btn-sm">Add Response</button>
                                }
                            </div>
                        </div>
                        <p className="ms-2 my-1"><span className="h6">{notification.sender.first_name} {notification.sender.middle_name} {notification.sender.last_name} sent : </span> {notification.message} </p>
                        {
                          notification.admin_answer?
                          <>
                            <hr className="text-primary m-0"/>
                            <p className="card-text ms-2"><span className="card-text h6">Admins Answer : </span> {notification.admin_answer}</p>
                          </>:""
                        }
                        {
                            show==notification.id?
                            <>
                                <hr className="m-0 text-primary"/>
                                <span className="text-danger">{responseInput.error_list?responseInput.error_list.admin_answer:""}</span>
                                <form onSubmit={(e)=>addResponse(e,notification.id)} className="my-2 d-flex flex-wrap flex-sm-nowrap">
                                    <div className="form-floating col-12 col-sm-10" style={{margin:"1px"}}>
                                        <input style={{height:"27.83px"}} className="form-control" name="admin_answer" id="inputFirstName" placeholder="Enter admin_answer" onChange={handleInputResponse} value={responseInput.admin_answer} />
                                        <label style={{top:"-8px",fontSize:"12px"}} htmlFor="inputFirstName"> Response</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary col-12 col-sm-2 align-center" style={{margin:"1px",height:"30px",lineHeight:"15px"}}>Send</button>
                                </form>
                            </>:""
                        }
                        {
                            notification.new=="Yes"?
                            <span class="position-absolute top-50 start-0 translate-middle p-1 bg-primary border border-2 border-light rounded-circle ">
                                <span class="visually-hidden">New alerts</span>
                            </span>:null
                        }
                        
                    </li>
                )

                if(notification.how_send==="Teacher")
                {
                    teachersNotifications.push(li);
                }
                else if(notification.how_send==="Student")
                {
                    studentsNotifications.push(li);
                }

                return li;
            })
        )
    }

    const noThingToShow=(
        <div className="d-flex justify-content-center align-items-center mt-5">
            <i className="fa fa-quote-left text-primary"></i>
            <span className="h4 mx-2"> No thing to show </span>
            <i className="fa fa-quote-right text-primary"></i>
        </div>
    )
      
    return(
        <div className="container px-4 py-3">

            <div className="my-3 d-flex justify-content-between align-items-center">
                <i className="fa fa-comment d-md-none fa-2x text-primary"></i> <span className="h1 d-none d-md-inline">Notifications </span> 
                {
                    allNotifications.length>0?
                    <button  onClick={clearAll} className="btn btn-sm btn-danger px-4 m-1">Clear All</button>:
                    <button disabled className="btn btn-sm btn-danger px-4 m-1">Clear All</button>
                }
            </div>

            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">All</button>
                    <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Teachers</button>
                    <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Students</button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                {
                    allNotifications.length>0?
                    <ul className="list-group rounded position-relative mt-4 border border-2 border-primary border-top-0 border-bottom-0 border-end-0" >
                        {allNotifications.reverse()}
                    </ul>:
                    noThingToShow
                }
                </div>
                <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                {
                    teachersNotifications.length>0?
                    <ul className="list-group rounded position-relative mt-4" >
                        {teachersNotifications.reverse()}
                    </ul>:
                    noThingToShow
                }
                </div>
                <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                {
                    studentsNotifications.length>0?
                    <ul className="list-group rounded position-relative mt-4" >
                        {studentsNotifications.reverse()}
                    </ul>:
                    noThingToShow
                }
                </div>
            </div>
        </div>
    )
}

export default Notification;