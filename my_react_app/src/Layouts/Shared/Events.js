import React,{useState,useEffect} from 'react';
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const Events=()=>{

    let history=useHistory();
    let allEvents=[];

    let [events,setEvents]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    let [show,setShow]=useState(0);

    useEffect(()=>{
        axios.get(`/api/view_events_mine`).then(res=>{
            if(res.data.status===200)
            {
                setEvents(res.data.events);
                if(res.data.events.length>0)
                {
                    setShow(res.data.events[res.data.events.length-1].id);
                    setLoading(false);
                }
                else
                {
                    setLoading(false);
                }
            }
            else
            {
                setError(true);
            }
        });
    },[]);

    const clearAll=()=>{
        axios.get(`/api/clear_all_events`).then(res=>{
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

    const showMore=(id)=>{
        if(show==id)
        {
            setShow(0);
        }
        else
        {
            setShow(id);
        }
    }

    const titles=()=>{
        return(
            <>
                <th className="text-center" scope="col">Status</th>
                <th className="text-center" scope="col">Day</th>
                <th className="text-center" scope="col">From</th>
                <th className="text-center" scope="col">To</th>
                <th className="text-center" scope="col">Subject</th>
                <th className="text-center" scope="col">Teacher</th>
                <th className="text-center" scope="col">Year</th>
                <th className="text-center" scope="col">Group</th>
                <th className="text-center" scope="col">Hall</th>
                <th className="text-center" scope="col">Notice</th>
            </>
        )
    }

    const rows=(program)=>{
        return(
            <>
                <td className="py-2 text-center" scope="col">{program.day}</td>
                <td className="py-2 text-center" scope="col">{program.time.from}</td>
                <td className="py-2 text-center" scope="col">{program.time.to}</td>
                <td className="py-2 text-center" scope="col">{program.subject.name} | {program.subject.type}</td>
                <td className="py-2 text-center" scope="col">{program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}</td>
                <td className="py-2 text-center" scope="col">{program.group.year.name}</td>
                <td className="py-2 text-center" scope="col">{program.group.name}</td>
                <td className="py-2 text-center" scope="col">{program.hall.name}</td>
                <td className="py-2 text-center" scope="col">{program.notice?program.notice:"No Thing"}</td>
            </>
        )
    }

    if(error)
    {
        return (
            <div className="container px-1 py-1 text-danger">
                <span className="h5 my-1">Something went wrong! </span>
            </div>
        )
    }
    else if(loading)
    {
        return (
            <div className="container px-4 py-3 text-primary">
                <div className="my-3 d-inline-block me-3">
                    <span className="h1">Events </span> 
                </div>
               
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        allEvents=(
            events.map((event,idx)=>{
                let time=new Date(event.created_at);
                let time1=time.toLocaleDateString();
                let time2=time.toLocaleTimeString();

                return(
                    <li  key={idx} className={event.new=="No"?"list-group-item":"bg-light list-group-item position-relative shadow-lg"}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap ">
                            <span className="text-dark">
                                <span> {event.message} </span>
                                In <span className="text-primary">{time1} </span> 
                                At <span className="text-primary">{time2}</span> 
                            </span> 
                            <div> 
                                {
                                    show==event.id?
                                    <button onClick={()=>showMore(event.id)} className="btn btn-outline-dark btn-sm mt-1">
                                        Collapse
                                    </button>:
                                    <button onClick={()=>showMore(event.id)} className="btn btn-outline-primary btn-sm mt-1">
                                        Expand
                                    </button>
                                }
                            </div>
                        </div>
                        {
                            show==event.id?
                            <>
                                <div>
                                    {
                                        event.event=="Add Program"?
                                        <div>
                                            <div className="table-responsive rounded mt-2 mb-0">
                                                <table className="table table-bordered bg-light">
                                                    <tbody>
                                                        <tr className="bg-dark text-light">
                                                            {titles()}
                                                        </tr>      
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">Added <span style={{fontSize:"10px",color:"#0d6efd"}}> (New)</span></td>
                                                            {rows(event.info.program_new)}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>:
                                        event.event=="Delete Program"?
                                        <div>
                                            <div className="table-responsive rounded mt-2 mb-0">
                                                <table className="table table-bordered bg-light">
                                                    <tbody>
                                                        <tr className="bg-dark text-light">
                                                            {titles()}
                                                        </tr>        
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">Deleted <span style={{fontSize:"10px",color:"#0d6efd"}}>(Old)</span></td>
                                                            {rows(event.info.program_old)}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>:
                                        event.event=="Update Program" || event.event=="Refresh Program" ?
                                        <div>
                                            <div className="table-responsive rounded mt-2 mb-0">
                                                <table className="table table-bordered bg-light">
                                                    <tbody>
                                                        <tr className="bg-dark text-light">
                                                            {titles()}
                                                        </tr>          
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">Updated <span style={{fontSize:"10px",color:"#0d6efd"}}>(Old)</span></td>
                                                            {rows(event.info.program_old)}
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">Updated <span style={{fontSize:"10px",color:"#0d6efd"}}>(New)</span></td>
                                                            {rows(event.info.program_new)}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>:
                                        event.event=="Swap Programs" || event.event=="Not Swap Programs"?
                                        <div>
                                            <div className="table-responsive rounded mt-2 mb-0">
                                                <table className="table table-bordered bg-light">
                                                    <tbody>
                                                        <tr className="bg-dark text-light">
                                                            {titles()}     
                                                        </tr>       
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">Swapped <span style={{fontSize:"10px",color:"#0d6efd"}}>(Old One)</span></td>
                                                            {rows(event.info.program_one_old)}
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">Swapped <span style={{fontSize:"10px",color:"#0d6efd"}}>(Old Two)</span></td>
                                                            {rows(event.info.program_two_old)}
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">Swapped <span style={{fontSize:"10px",color:"#0d6efd"}}>(New One)</span></td>
                                                            {rows(event.info.program_one_new)}
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">Swapped <span style={{fontSize:"10px",color:"#0d6efd"}}>(New Two)</span></td>
                                                            {rows(event.info.program_two_new)}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>:
                                        event.event=="Request Swap"  || event.event=="Delete Request Swap"?
                                        <div>
                                            <div className="table-responsive rounded mt-2 mb-0">
                                                <table className="table table-bordered bg-light">
                                                    <tbody>
                                                        <tr className="bg-dark text-light">
                                                            {titles()}  
                                                        </tr>       
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">Requested Swapp <span style={{fontSize:"10px",color:"#0d6efd"}}>(Old One)</span></td>
                                                            {rows(event.info.program_one_old)}
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">Requested Swapp <span style={{fontSize:"10px",color:"#0d6efd"}}>(Old Two)</span></td>
                                                            {rows(event.info.program_two_old)}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <Link to={`/teacher/swap_program/${event.info.program_two_old.id}.-100`} style={{margin:"1px"}}>Show That Let Me Decide</Link>
                                            </div>
                                        </div>:
                                        event.event=="Answer Notification"  || event.event=="Accept Notification" || event.event=="Reject Notification" || event.event=="Delete Notification"?
                                        <div>
                                            <div className="table-responsive rounded mt-2 mb-0">
                                                <table className="table table-bordered bg-light">
                                                    <tbody>
                                                        <tr className="bg-dark text-light">
                                                            <th className="text-center" scope="col">Title</th>
                                                            <th className="text-center" scope="col">Message</th>
                                                            <th className="text-center" scope="col">Answer</th>
                                                            <th className="text-center" scope="col">Accepted</th>
                                                            <th className="text-center" scope="col">Shown</th>
                                                        </tr>       
                                                        <tr>
                                                            <td className="py-2 text-center" scope="col">
                                                                {
                                                                    event.info.admin_notification.title.length<25?
                                                                    event.info.admin_notification.title:
                                                                    event.info.admin_notification.title.substring(0,25)+"..."
                                                                }
                                                            </td>
                                                            <td className="py-2 text-center" scope="col">
                                                                {
                                                                    event.info.admin_notification.message.length<25?
                                                                    event.info.admin_notification.message:
                                                                    event.info.admin_notification.message.substring(0,25)+"..."
                                                                }
                                                            </td>
                                                            <td className="py-2 text-center" scope="col">
                                                                {
                                                                event.info.admin_notification.admin_answer?
                                                                (
                                                                    event.info.admin_notification.admin_answer.length<25?
                                                                    event.info.admin_notification.admin_answer:
                                                                    event.info.admin_notification.admin_answer.substring(0,25)+"..."
                                                                ):
                                                                "No answer yet"
                                                                }
                                                            </td>
                                                            <td className="py-2 text-center" scope="col">{event.info.admin_notification.accepted==1?"Yes":event.info.admin_notification.accepted==-1?"No":"Unknown"}</td>
                                                            <td className="py-2 text-center" scope="col">{event.info.admin_notification.shown==1?"Yes":"No"}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                {
                                                    event.info.admin_notification.how_send=="Teacher"?
                                                    <Link to={`/teacher/contact_record`} style={{margin:"1px"}}>Show Contact Record</Link>:
                                                    event.info.admin_notification.how_send=="Student"?
                                                    <Link to={`/student/contact_record`} style={{margin:"1px"}}>Show Contact Record</Link>:
                                                    null
                                                }
                                            </div>
                                        </div>:
                                        ""
                                    }
                                </div>
                            </>:""
                        }
                        {
                            event.new=="Yes"?
                            <span className="position-absolute top-50 start-0 translate-middle p-1 bg-primary border border-2 border-light rounded-circle ">
                                <span className="visually-hidden">New alerts</span>
                            </span>:null
                        }
                    </li>
                )
            })
        )
    }
      
    return(
        <div className="container px-4 py-3">

            <div className="my-3 d-flex justify-content-between align-items-center">
                <i className="fa fa-bell d-md-none fa-2x text-primary"></i> <span className="h1 d-none d-md-inline">Events </span> 
                {
                    allEvents.length>0 && localStorage.getItem('auth_role')=="Admin"?
                    <button  onClick={clearAll} className="btn btn-sm btn-danger px-4 m-1">Clear All</button>:
                    localStorage.getItem('auth_role')=="Admin"?
                    <button disabled className="btn btn-sm btn-danger px-4 m-1">Clear All</button>:null
                }
            </div>

            <div>
                {
                    allEvents.length>0?
                    <ul className="list-group rounded position-relative mt-4 border border-2 border-primary border-top-0 border-bottom-0 border-end-0" >
                        {allEvents.reverse()}
                    </ul>:
                    <div className="d-flex justify-content-center align-items-center mt-5">
                        <i className="fa fa-quote-left text-primary"></i>
                        <span className="h4 mx-2"> No thing to show </span>
                        <i className="fa fa-quote-right text-primary"></i>
                    </div>
                }
            </div>
        </div>
    )
}//3 Times Used

export default Events;