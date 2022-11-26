import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const SwapProgram =(props)=>{
    const idCurrent=props.match.params.id.split(".")[0];
    const idTarget=props.match.params.id.split(".")[1];
    const history=useHistory();

    const [program,setProgram]=useState({});
    const [hisProgram,setHisProgram]=useState({});
    const [targetSwap,setTargetSwap]=useState(idTarget);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [errorRequest,setErrorRequest]=useState("");
    const [whatShow,setWhatShow]=useState("adding");

    const handleInput=(e)=>{
        e.persist();
        setTargetSwap(e.target.value);
    };

    const swapRequest=(e)=>{
        e.preventDefault();
        const data={
            "current_id":parseInt(idCurrent),
            "target_id":parseInt(targetSwap),
        }

        if(parseInt(targetSwap)!==-100 )
        {
            axios.post(`/api/request_swap_programs`,data).then(res=>{
                if(res.data.status===200)
                {   
                    swal("Success",res.data.message,"success");
                    history.push('/teacher/view_programs');
                }
                if(res.data.status===400 || res.data.status===401 || res.data.status===403 )
                {   
                    swal("Error",res.data.message,"error");
                    history.push('/teacher/view_programs');
                }
                else
                {
                    if(res.data.validation_errors)
                    {
                        setErrorRequest(res.data.validation_errors.target_id[0]);
                    }
                } 
            });
        }
        else{
            setErrorRequest("The target id field is required.");
        }
    };

    const answerSwapRequest=(e,flag)=>{
        e.preventDefault();

        let data={
            flag:flag,
            requested_id:program.swap_with,
            reseved_id:program.id
        }

        axios.post(`/api/swap_programs`,data).then(res=>{
            if(res.data.status===200)
            {   
                swal("Success",res.data.message,"success");
                history.push('/teacher/view_programs');
            }
            if(res.data.status===400 || res.data.status===401 || res.data.status===403 )
            {   
                swal("Error",res.data.message,"error");
                history.push('/teacher/view_programs');
            }
            else
            {
                if(res.data.validation_errors)
                {
                    swal("Error",res.data.validation_errors.target_id[0],"error");
                    history.push('/teacher/view_programs');
                }
            } 
        });
    }

    const deleteSwapRequest=(e)=>{
        e.preventDefault();

        let data={
            target_id:parseInt(program.swap_notice.split("|")[1]),
            current_id:program.id
        }

        axios.post(`/api/delete_request_swap_programs`,data).then(res=>{
            if(res.data.status===200)
            {   
                swal("Success",res.data.message,"success");
                history.push('/teacher/view_programs');
            }
            if(res.data.status===400 || res.data.status===403 )
            {   
                swal("Error",res.data.message,"error");
                history.push('/teacher/view_programs');
            }
            else
            {
                if(res.data.validation_errors)
                {
                    swal("Error",res.data.validation_errors.target_id[0],"error");
                    history.push('/teacher/view_programs');
                }
            } 
        });
    }

    useEffect(()=>{
        (async () => {          
            let flag=0;
            let idn=0;
            let idn2=0
            let heIsCommed=false;
        
            await axios.get(`/api/view_program/${idCurrent}`).then(res=>{
                if(res.data.status===200)
                {
                    setProgram(res.data.program);
                    idn=res.data.program.swap_with;
                    if(res.data.program.swap_notice!==null)
                    {
                        idn2=parseInt(res.data.program.swap_notice.split("|")[1])
                    }
                    flag++;
                }
                else if(res.data.status===404){
                    swal("Error",res.data.message,"error");
                    history.push('/teacher/view_programs');
                }
            });
            
            if(idn && idn!==-100 && !idn2)
            {
                await axios.get(`/api/view_program/${idn}`).then(res=>{
                    if(res.data.status===200)
                    {
                        setHisProgram(res.data.program);
                        heIsCommed=true;
                        flag++;
                    }
                    else if(res.data.status===404){
                        swal("Error",res.data.message,"error");
                        history.push('/teacher/view_programs');
                    }
                });
            }
            else if(idn2)
            {
                await axios.get(`/api/view_program/${idn2}`).then(res=>{
                    if(res.data.status===200)
                    {
                        setHisProgram(res.data.program);
                        heIsCommed=true;
                        flag++;
                    }
                    else if(res.data.status===404){
                        swal("Error",res.data.message,"error");
                        history.push('/teacher/programs');
                    }
                });
            }

            if((flag==2 && heIsCommed)||(flag==1 && !heIsCommed))
            {
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })();
    },[idCurrent,history]);

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
                <span className="h1 my-4">Swap Program </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Swap Program</h1>
            <i className="my-4 fa fa-retweet fa-2x d-md-none text-primary"></i>

            {
                whatShow==="adding"?
                <form onSubmit={swapRequest} className="my-5">
                    <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/teacher/view_programs" role="button"><i className="fa fa-chevron-left"></i></Link>
                    {
                        program.swap_with!==-100 && program.swap_with!==null?
                        <button type="button"  onClick={()=>setWhatShow("receiving")} className="btn btn-primary btn-sm">Show Swap Request</button>:
                        program.swap_with==-100?
                        <button type="button"  onClick={()=>setWhatShow("deleting")} className="btn btn-primary btn-sm">Delete Swap Request</button>:
                        <span style={{fontSize:".875rem",padding:".48rem .5rem",height:"27px",position:"relative",top:"1px"}} className="ms-1 rounded bg-primary text-light fw-normal">No Swap Request</span>
                    }

                    <div className="border bg-light">
                        <div className="tab-pane fade show active card-body border pt-5" id="info" role="tabpanel" aria-labelledby="info-tab">
                            <div className="form-floating mb-2 offset-md-1 col-md-10 text-center">
                                <p className="fs-6">
                                    Enter Id Of Program That You Want Add Request To Swap With It, Enter Valid Id.
                                </p>
                            </div>

                            <div className="form-floating mb-2 offset-md-1 col-md-10">
                                <input onChange={handleInput}  value={targetSwap} className="form-control" id="inputName" placeholder="Target Program" />
                                <label htmlFor="inputName">Id For Target Program</label>
                                <span className="text-danger">{errorRequest}</span>
                            </div> 
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary btn-block py-2 offset-md-1 col-md-10">Swap Program</button>
                        </div>
                    </div>
                </form>:
                whatShow==="receiving"?
                <form className="my-5">
                    <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/teacher/view_programs" role="button"><i className="fa fa-chevron-left"></i></Link>
                    
                    {
                        true?
                        <button type="button"  onClick={()=>setWhatShow("adding")} className="btn btn-primary btn-sm">Add Swap Request</button>:
                        program.swap_with==-100?
                        <button type="button"  onClick={()=>setWhatShow("deleting")} className="btn btn-primary btn-sm">Delete Swap Request</button>:
                        <span style={{fontSize:".875rem",padding:".48rem .5rem",height:"27px",position:"relative",top:"1px"}} className="ms-1 rounded bg-primary text-light fw-normal">No Swap Request</span>
                    }
                    <div className="border bg-light">
                        <div className="card-body border pt-5" id="info" role="tabpanel" aria-labelledby="info-tab">  
                            <div className="form-floating mb-2 offset-md-1 col-md-10 text-center">
                                <p className="fs-6">
                                    See Programs First, Then Accept Or Reject The Swap Request.
                                </p>
                            </div>

                            <div className="table-responsive rounded my-2">
                                <table className="table table-bordered bg-light">
                                    <tbody>
                                        <tr className="bg-dark text-light">
                                            <th className="text-center" scope="col">Owner</th>
                                            <th className="text-center" scope="col">Day</th>
                                            <th className="text-center" scope="col">From</th>
                                            <th className="text-center" scope="col">To</th>
                                            <th className="text-center" scope="col">Subject</th>
                                            <th className="text-center" scope="col">Teacher</th>
                                            <th className="text-center" scope="col">Year</th>
                                            <th className="text-center" scope="col">Group</th>
                                            <th className="text-center" scope="col">Hall</th>
                                            <th className="text-center" scope="col">Notice</th>
                                        </tr>      
                                        <tr>
                                            <td className="py-3 text-center text-primary fw-bold" scope="col">He</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.day}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.time.from}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.time.to}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.subject.name} | {hisProgram.subject.type}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.subject.teacher.first_name} {hisProgram.subject.teacher.middle_name} {hisProgram.subject.teacher.last_name}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.group.year.name}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.group.name}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.hall.name}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.notice?hisProgram.notice:"No Thing"}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-center text-primary fw-bold" scope="col">You</td>
                                            <td className="py-3 text-center" scope="col">{program.day}</td>
                                            <td className="py-3 text-center" scope="col">{program.time.from}</td>
                                            <td className="py-3 text-center" scope="col">{program.time.to}</td>
                                            <td className="py-3 text-center" scope="col">{program.subject.name} | {program.subject.type}</td>
                                            <td className="py-3 text-center" scope="col">{program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}</td>
                                            <td className="py-3 text-center" scope="col">{program.group.year.name}</td>
                                            <td className="py-3 text-center" scope="col">{program.group.name}</td>
                                            <td className="py-3 text-center" scope="col">{program.hall.name}</td>
                                            <td className="py-3 text-center" scope="col">{program.notice?program.notice:"No Thing"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>   
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="d-flex justify-content-between flex-wrap flex-sm-nowrap">
                            <button onClick={(e)=>answerSwapRequest(e,"True")} type="submit" className="btn btn-primary py-2 col-12 col-sm-6" style={{margin:"1px"}}>Accept Swap Request</button>
                            <button onClick={(e)=>answerSwapRequest(e,"False")} type="submit" className="btn btn-danger py-2 col-12 col-sm-6" style={{margin:"1px"}}>Reject Swap Request</button>
                        </div>
                    </div>
                </form>:
                whatShow==="deleting"?
                <form onSubmit={deleteSwapRequest} className="my-5">
                    <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/teacher/view_programs" role="button"><i className="fa fa-chevron-left"></i></Link>
                    {
                        true?
                        <button type="button"  onClick={()=>setWhatShow("adding")} className="btn btn-primary btn-sm">Add Swap Request</button>:
                        program.swap_with!==-100 && program.swap_with!==null?
                        <button type="button"  onClick={()=>setWhatShow("receiving")} className="btn btn-primary btn-sm">Show Swap Request</button>:
                        <span style={{fontSize:".875rem",padding:".48rem .5rem",height:"27px",position:"relative",top:"1px"}} className="ms-1 rounded bg-primary text-light fw-normal">No Swap Request</span>
                    }
                    
                    <div className="border bg-light">
                        <div className="card-body border pt-5" id="info" role="tabpanel" aria-labelledby="info-tab">
                            <div className="form-floating mb-2 offset-md-1 col-md-10 text-center">
                                <p className="fs-6">
                                    You Want To Delete Swap Request Now?
                                </p>
                            </div>

                            <div className="table-responsive rounded my-2">
                                <table className="table table-bordered bg-light">
                                    <tbody>
                                        <tr className="bg-dark text-light">
                                            <th className="text-center" scope="col">Owner</th>
                                            <th className="text-center" scope="col">Day</th>
                                            <th className="text-center" scope="col">From</th>
                                            <th className="text-center" scope="col">To</th>
                                            <th className="text-center" scope="col">Subject</th>
                                            <th className="text-center" scope="col">Teacher</th>
                                            <th className="text-center" scope="col">Year</th>
                                            <th className="text-center" scope="col">Group</th>
                                            <th className="text-center" scope="col">Hall</th>
                                            <th className="text-center" scope="col">Notice</th>
                                        </tr>      
                                        <tr>
                                            <td className="py-3 text-center text-primary fw-bold" scope="col">He</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.day}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.time.from}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.time.to}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.subject.name} | {hisProgram.subject.type}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.subject.teacher.first_name} {hisProgram.subject.teacher.middle_name} {hisProgram.subject.teacher.last_name}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.group.year.name}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.group.name}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.hall.name}</td>
                                            <td className="py-3 text-center" scope="col">{hisProgram.notice?hisProgram.notice:"No Thing"}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-center text-primary fw-bold" scope="col">You</td>
                                            <td className="py-3 text-center" scope="col">{program.day}</td>
                                            <td className="py-3 text-center" scope="col">{program.time.from}</td>
                                            <td className="py-3 text-center" scope="col">{program.time.to}</td>
                                            <td className="py-3 text-center" scope="col">{program.subject.name} | {program.subject.type}</td>
                                            <td className="py-3 text-center" scope="col">{program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}</td>
                                            <td className="py-3 text-center" scope="col">{program.group.year.name}</td>
                                            <td className="py-3 text-center" scope="col">{program.group.name}</td>
                                            <td className="py-3 text-center" scope="col">{program.hall.name}</td>
                                            <td className="py-3 text-center" scope="col">{program.notice?program.notice:"No Thing"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>   
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="d-grid">
                            <button type="submit" className="btn btn-danger btn-block py-2 offset-md-1 col-md-10">Delete Swap Request</button>
                        </div>
                    </div>
                </form>:null
            }
        </div>
    )
}

export default SwapProgram;