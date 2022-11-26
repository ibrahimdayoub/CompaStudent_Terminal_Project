import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const AddProgram =()=>{
    let selectHall=[];
    let selectGroup=[];
    let selectTime=[];
    let selectSubject=()=>{};
    let history=useHistory();

    const [years,setYears]=useState([]);
    const [yearSelected,setYearSelected]=useState({});
    const [showGroups,setShowGroups]=useState(false);
    const [halls,setHalls]=useState([]);
    const [times,setTimes]=useState([]);
    const [programInput,setProgram]=useState({
        day:"",
        time_id:"",
        subject_id:"",
        group_id:"",
        hall_id:"",
        notice:"",
        error_list:[]
    });

    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);


    const handleInput=(e)=>{
        e.persist();
        setProgram({...programInput,[e.target.name]:e.target.value});

        if(e.target.name==="group_id")
        { 
            years.map((year)=>{
                year.groups.map((group,idx)=>{
                    if(group.id==e.target.value){           
                        setYearSelected(year);
                        setShowGroups(true);
                    }
                })
            })
        }
    };

    const getDataStatus=()=>{
        const data={
            "day":programInput.day,
            "time_id":programInput.time_id,
            "subject_id":programInput.subject_id,
            "group_id":programInput.group_id,
            "hall_id":programInput.hall_id,
            "notice":programInput.notice,
        }

        axios.post('/api/data_status',data).then(res=>{
            if(res.data.status===200 || res.data.status===404)
            {
                swal("Warning",res.data.message,"warning");
            }
            else
            {
                setProgram({...programInput,error_list:res.data.validation_errors});
            }
        }); 
    }

    const programSubmit=(e)=>{
        e.preventDefault();

        const data={
            "day":programInput.day,
            "time_id":programInput.time_id,
            "subject_id":programInput.subject_id,
            "group_id":programInput.group_id,
            "hall_id":programInput.hall_id,
            "notice":programInput.notice,
        }

        axios.post('/api/add_program',data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                /*setProgram({
                    ...programInput,
                    day:"",
                    time_id:"",
                    hall_id:"",
                    notice:"",
                    error_list:[]
                });*/
            }
            else if(res.data.status===400)
            {
                swal("Error",res.data.unique_error,"error");
                setProgram({
                    ...programInput,
                    day:"",
                    time_id:"",
                    hall_id:"",
                    notice:"",
                    error_list:[]
                });
            }
            else if(res.data.status===401 || res.data.status===401)
            {
                swal("Error",res.data.message,"error");
                history.push('/teacher/view_programs');
            }
            else
            {
                setProgram({...programInput,error_list:res.data.validation_errors});
            }
        });
    };

    const giveMeGroups=(year)=>{
        let groups;
        if(year.groups.length>0)
        {
            groups=year.groups.map((group,idx)=>{
                return(
                    <option  key={idx} className=" bg-light m-1 text-dark" value={group.id}>
                        {group.name}
                    </option>
                )
            })
        }
        else
        {
            groups=(<option  className="text-dark" value="">None</option>)
        }

        return groups;
    }

    const giveMeSubjects=(year)=>{
        let subjects;
        if(year.subjects.length>0)
        {
            subjects=year.subjects.map((subject,idx)=>{
                return(
                    <option  key={idx} className=" bg-light m-1 text-dark" value={subject.id}>
                        {subject.name} | {subject.type}
                    </option>
                )
            })
        }
        else
        {
            subjects=(<option  className="text-dark" value="">None</option>)
        }
        return subjects;
    }

    useEffect(()=>{
        let flag=0;
        (async () => {
            await axios.get(`/api/view_years`).then(res=>{
                    if(res.data.status===200)
                    {
                        setYears(res.data.years);
                        flag++;
                    }
            }).then(
                await axios.get(`/api/view_halls`).then(res=>{
                if(res.data.status===200)
                    {
                        setHalls(res.data.halls);
                        flag++;
                    }
                })).then(
                    await axios.get(`/api/view_times`).then(res=>{
                    if(res.data.status===200)
                        {
                            setTimes(res.data.times);
                            flag++;
                        }
                    }));

            if(flag==3)
            {
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })();
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
                <span className="h1 my-4">Add Program </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        selectHall=halls.map((hall,idx)=>{
            return(
                <option  key={idx} value={hall.id}>{hall.name}</option>
            )
        })

        selectTime=times.map((time,idx)=>{
            return(
                <option  key={idx} value={time.id}>{time.name}</option>
            )
        })

        selectGroup=years.map((year,idx)=>{
            return(
                <optgroup key={idx} className="bg-light p-4 mt-4 text-primary" label={year.name}>
                    {
                        giveMeGroups(year)
                    }
                </optgroup>
            )
        })

        //We Will Select Subject For Selected Year Above Only Not All Subjects For All Years.
        selectSubject=(year)=>{
            return(
                <optgroup className="bg-light p-4 mt-4 text-primary" label={year.name}>
                    {
                        giveMeSubjects(year)
                    }
                </optgroup>
            )
        }   
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Add Program</h1>
            <i className="my-4 fa fa-plus fa-2x d-md-none text-primary"></i>

            <form onSubmit={programSubmit} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/teacher/view_programs" role="button"><i className="fa fa-chevron-left"></i></Link>
               
                <div className="border bg-light">
                    <div className="card-body border pt-5"> 
                        <div className="form-floating mb-3 offset-md-1 col-md-10 text-center">
                            <p className="fs-6">
                                Enter Program By Adding The Time And Select The Subject, Group, Hall.
                                <br/>
                                <strong className="text-primary"> Ex1 : </strong>Sunday From 08:00 To 10:00 We Have Data Base.
                            </p>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <select onChange={handleInput} value={programInput.day} name="day" className="form-select form-select-md py-3" aria-label=".form-select-lg example">
                                <option value="">Select Day</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                            </select>
                            <span className="text-danger">{programInput.error_list.day}</span>
                        </div>
                            
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <select onChange={handleInput} value={programInput.time_id} name="time_id" className="form-select form-select-md py-3" aria-label=".form-select-lg example">
                                <option value="">Select Time</option>
                                {selectTime}
                            </select>
                            <span className="text-danger">{programInput.error_list.time_id}</span>
                        </div>  

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={programInput.notice} name="notice" className="form-control" id="inputName" placeholder="Enter Notice" />
                            <label htmlFor="inputName">Notice</label>
                            <span className="text-danger">{programInput.error_list.notice}</span>
                        </div> 

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <select onChange={handleInput} value={programInput.hall_id} name="hall_id" className="form-select form-select-md py-3" aria-label=".form-select-lg example">
                                <option value="">Select Hall</option>
                                {selectHall}
                            </select>
                            <span className="text-danger">{programInput.error_list.hall_id}</span>
                        </div>
                        
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <select name="group_id" onChange={handleInput} defaultValue={programInput.group_id} className="form-select py-3 mt-3" aria-label="Default select example">
                                <option value="" className="d-none">Select Year/Department/Group</option>
                                {selectGroup}
                            </select>
                            <span className="text-danger">{programInput.error_list.group_id}</span>
                        </div>
                        
                        {
                            !showGroups?
                            <p className="placeholder-glow mb-3">
                                <span className="placeholder bg-dark col-12 offset-md-1 col-md-10 p-4 rounded"></span>
                                <span className="text-danger mb-3 offset-md-1 col-md-10 d-block">{programInput.error_list.subject_id} (Select Group Then Subject)</span>
                            </p>:
                            <div className="form-floating mb-3 offset-md-1 col-md-10">
                                <select name="subject_id" onChange={handleInput} defaultValue={programInput.subject_id} className="form-select py-3 mt-3" aria-label="Default select example">
                                    <option value="" className="d-none">Select Subject</option>
                                        {yearSelected.hasOwnProperty("subjects")?selectSubject(yearSelected):""}
                                </select>
                                <span className="text-danger">{programInput.error_list.subject_id}</span>
                            </div>
                        }    
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="d-flex justify-content-between flex-wrap flex-sm-nowrap">
                        <button onClick={getDataStatus} type="button" className="btn btn-dark py-3 col-12 col-sm-6" style={{margin:"1px"}}>Data Status</button>
                        <button type="submit" className="btn btn-primary py-3 col-12 col-sm-6" style={{margin:"1px"}}>Add Program</button>
                    </div>

                    <p className="ms-1 text-center mt-2">
                        <span className="text-primary fw-bold fs-5 me-1">"</span>
                        Identical data when we found the
                        <span className="text-primary fw-bold mx-1">day</span>with
                        <span className="text-primary fw-bold mx-1">time</span>,
                        <span className="text-primary fw-bold mx-1">hall</span>and 
                        <span className="text-primary fw-bold mx-1">subject</span>
                        that we passed it in database, Useful when we want to add multiprograms in one table's cell, And Show Odds
                        <span className="text-primary fw-bold fs-5 ms-1">"</span>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default AddProgram;