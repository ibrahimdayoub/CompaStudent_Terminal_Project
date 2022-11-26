import React,{useState,useEffect} from 'react';
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

export const Summary=()=>{
    const 
    [date,setDate]=useState(new Date()),
    [time,setTime]=useState(""),
    [days,setDays]=useState(""),
    [programs,setPrograms]=useState([]),
    [loading,setLoading]=useState(true),
    [error,setError]=useState(false);

    let teachersNow=[],subjectNow=[],groupsNow=[],hallsNow=[],teachers=[],subjects=[],groups=[],halls=[];

    useEffect(()=>{
        setTimeout(()=>{
            setDate(new Date());
        }, 1000);

        let hours=date.getHours() <10? `0${date.getHours()}` :date.getHours();
        let minutes=date.getMinutes() <10 ? `0${date.getMinutes()}` :date.getMinutes();
        let seconds=date.getSeconds() <10 ? `0${date.getSeconds()}` :date.getSeconds();

        setTime(
            `${hours}:${minutes}:${seconds}`
        );

        setDays(
            `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        );
    },[date]);

    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/view_programs`).then(res=>{
            if(res.data.status===200)
            {
                setPrograms(res.data.programs);
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
            <div className="container px-1 py-1 text-danger">
                <span className="h5 my-1">Something went wrong, Can not show summary section! </span>
            </div>
        )
    }
    else if(loading)
    {
        return (
            <div className="container py-3 text-primary">
                <div className="my-3 d-inline-block me-3">
                    <span className="h2">Loading </span> 
                </div>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else{
        programs.map((program,idx)=>{
            if(program.time.from.valueOf()<=time && program.time.to.valueOf()>=time && date.toString().substring(0,3)== program.day.toString().substring(0,3))
            {
                teachersNow.push({
                    name:`${program.subject.teacher.first_name} ${program.subject.teacher.middle_name} ${program.subject.teacher.last_name}`,
                    hall:program.hall.name,
                    subject:`${program.subject.name} / ${program.subject.type}`,
                    from:program.time.from,
                    to:program.time.to
                });

                subjectNow.push({
                    name:`${program.subject.name} / ${program.subject.type}`,
                    hall:program.hall.name,year:program.group.year.name,
                    group:program.group.name,
                    year:program.group.year.name,
                    from:program.time.from,
                    to:program.time.to
                });

                groupsNow.push({
                    name:program.group.name,
                    year:program.group.year.name,
                    hall:program.hall.name,
                    subject:`${program.subject.name} / ${program.subject.type}`,
                    from:program.time.from,
                    to:program.time.to
                });

                hallsNow.push({
                    name:program.hall.name,
                    group:program.group.name,
                    year:program.group.year.name,
                    subject:`${program.subject.name} / ${program.subject.type}`,
                    from:program.time.from,
                    to:program.time.to
                });
            }
        });

        halls=hallsNow.map((hall,idx)=>{
                return(
                <li key={idx} className="list-group-item bg-light">
                    <span className="text-primary fw-bold">{hall.name}</span> from {hall.from} to {hall.to} busy for {hall.group} in {hall.year}
                </li>
           )
       });

        subjects=subjectNow.map((subject,idx)=>{
                return(
                <li key={idx} className="list-group-item bg-light">
                    <span className="text-primary fw-bold">{subject.name}</span> from {subject.from} to {subject.to} gives to {subject.year} in {subject.hall}
                </li>
           )
       });

       teachers=teachersNow.map((teacher,idx)=>{
                return(
                <li key={idx} className="list-group-item bg-light">
                    <span className="text-primary fw-bold">{teacher.name}</span> from {teacher.from} to {teacher.to} gives {teacher.subject} in {teacher.hall}
                </li>
           )
       });

        groups=groupsNow.map((group,idx)=>{
                return(
                <li key={idx} className="list-group-item bg-light">
                    <span className="text-primary fw-bold">{group.name} / {group.year}</span> from {group.from} to {group.to} takes {group.subject} in {group.hall}
                </li>
           )
       });
    }

    return (
        <div className="mt-4">
            <div>
                <div className="d-flex justify-content-center justify-content-md-between align-items-center flex-wrap mb-3">
                    <h5 style={{minWidth:"140px"}} className="order-2 order-md-1 d-flex align-items-center card-title fs-5 px-3 py-3 border text-dark rounded m-1"><i className="fa fa-hourglass-half me-2 text-primary text-start"></i> {time}</h5>
                    <h5 className="order-1 order-md-2 d-flex align-items-center card-title fs-5 px-5 py-3 border text-dark rounded m-1 text-center"><i className="fa fa-quote-left me-2 text-primary"></i> Faculty of Informatics Engineering <i className="fa fa-quote-right ms-2 text-primary"></i></h5>
                    <h5 style={{minWidth:"140px"}} className="order-3 order-md-3 d-flex align-items-center card-title fs-5 px-3 py-3 border text-dark rounded m-1"> {days} <i className="fa fa-calendar-alt ms-2 text-primary text-end"></i></h5>
                </div>

                <div className="d-flex align-content-stretch flex-wrap justify-content-center">
                    <div className="col-12 col-md-6 text-center p-1 border border-light border-5 rounded">
                        <div className="card-body ">
                            <h5 className="card-title mb-3">Halls Now 
                                <div className="ms-1 spinner-grow spinner-grow-sm" style={{width: "0.5rem", height: "0.5rem"}} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </h5>
                            {
                                halls.length>0?
                                <ul className="list-group">
                                    {halls}
                                </ul>:
                                <span className="text-primary border rounded p-2 bg-light d-block">Free Now !</span>
                            }
                        </div>
                    </div>
                    <div className="col-12 col-md-6 text-center p-1 border border-light border-5 rounded">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Teachers Now
                                <div className="ms-1 spinner-grow spinner-grow-sm" style={{width: "0.5rem", height: "0.5rem"}} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </h5>
                            {
                                teachers.length>0?
                                <ul className="list-group">
                                    {teachers}
                                </ul>:
                                <span className="text-primary border rounded p-2 bg-light d-block">Free Now !</span>
                            }
                        </div>
                    </div>
                    <div className="col-12 col-md-6 text-center p-1 border border-light border-5 rounded">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Subjects Now
                                <div className="ms-1 spinner-grow spinner-grow-sm" style={{width: "0.5rem", height: "0.5rem"}} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </h5>
                            {
                                subjects.length>0?
                                <ul className="list-group">
                                    {subjects}
                                </ul>:
                                <span className="text-primary border rounded p-2 bg-light d-block">Free Now !</span>
                            }
                        </div>
                    </div>
                    <div className="col-12 col-md-6 text-center p-1 border border-light border-5 rounded">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Groups Now
                                <div className="ms-1 spinner-grow spinner-grow-sm" style={{width: "0.5rem", height: "0.5rem"}} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </h5>
                            {
                                groups.length>0?
                                <ul className="list-group">
                                    {groups}
                                </ul>:
                                <span className="text-primary border rounded p-2 bg-light d-block">Free Now !</span>
                            }
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    )
}//3 Times Used

export const Download=(props)=>{   
    let history=useHistory(),selectList=[];

    const [years,setYears]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [dowmloadInput,setDownload]=useState({
        group_id:"",
    });
    const [falseSelect,setFalseSelect]=useState("");

    const handleInput=(e)=>{
        e.persist();
        setFalseSelect("")
        setDownload({...dowmloadInput,[e.target.name]:e.target.value});
    };

    const downloadSubmit=(e)=>{
        e.preventDefault();

        if(dowmloadInput.group_id)
        {
            setFalseSelect("");
            history.push(`/${props.role}/download/${dowmloadInput.group_id}`)
        }
        else
        {
            setFalseSelect("Select valid option, Year without groups or group without programs are not valid options.")
        }
    };

    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/view_years`).then(res=>{
            if(res.data.status===200)
            {
                setYears(res.data.years);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })
    },[]);

    const giveMeGroups=(year)=>{
        let groups;
        if(year.groups.length>0)
        {
            groups=year.groups.map((group,idx)=>{

                if(group.programs.length>0)
                {
                    return(
                        <option  key={idx} className=" bg-light m-1 text-dark" value={group.id}>
                            {group.name}
                        </option>
                    )
                }
                else
                {
                    return(
                        <option  key={idx} className=" bg-light m-1 text-dark" value="">
                           {group.name} / Has not programs yet
                        </option>
                    )
                }
            })
        }
        else
        {
            groups=(<option  className="text-dark" value="">Has not groups yet</option>)
        }

        return groups;
    }

    if(error)
    {
        return (
            <div className="container px-1 py-1 text-danger">
                <span className="h5 my-1">Something went wrong, Can not show download section!</span>
            </div>
        )
    }
    else if(loading)
    {
        return (
            <div className="container py-3 text-primary">
                <div className="my-3 d-inline-block me-3">
                    <span className="h2">Loading </span> 
                </div>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else{
        selectList=years.map((year,idx)=>{
            return(
                <optgroup key={idx} className="bg-light p-4 mt-4 text-primary" label={year.name}>
                    {
                        giveMeGroups(year)
                    }
                </optgroup>
            )
        })
    }

    return (
        <div className="mt-4">

            <h5 className="ms-2"> <i className="fa fa-caret-right me-1"></i> Select program and show it, You can download it to your device in latest version.</h5>

            <div className="d-flex justify-content-between align-items-center flex-wrap mt-4">
                <div className="form-floating col-12 col-sm-10 mt-1 p-1">
                    <select  className="form-select py-0" name="group_id" onChange={handleInput} aria-label="Default select example">
                        <option value="">Select Year/Department/Group Program</option>
                        {selectList}
                    </select>
                </div>
                
                <button className="btn btn-sm btn-primary py-3 col-12 col-sm-2 mt-1" onClick={downloadSubmit} >Show That</button>
            </div>

            <p className="ms-2 text-danger fs-6">{falseSelect}</p>

        </div>
    )
}//3 Times Used

export const MyTasks=()=>{
    let content="";
    let countDone=0;

    const [tasks,setTasks]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [flag,setFlag]=useState("a"); //Rerequested When Add, Edit, Delete Task.
    const [editToggler,setEditToggler]=useState(""); //Show And Hide One Field Input When Edit Task.
    
    const [taskInput,setTask]=useState({
        text:"",
        done:"",
        error_list:[]
    }); //When Adding

    const handleInput=(e)=>{
        e.persist();
        setTask({...taskInput,[e.target.name]:e.target.value});
    };

    const taskSubmit=(e)=>{
        e.preventDefault();

        const data={
            "text":taskInput.text,
            "done":"0", //0 Because Adding And Initial Status For Task Is Not Completed
        }

        axios.post('/api/add_task',data).then(res=>{
            if(res.data.status===200)
            {
                if(flag==="a")
                {
                    setFlag("b");
                }
                else
                {
                    setFlag("a");
                }
                swal("Success",res.data.message,"success");
                setTask({
                    text:"",
                    done:"",
                    error_list:[]
                })
            }
            else if(res.data.status===401)
            {
                swal("Error",res.data.message,"error");
            }
            else
            {
                setTask({...taskInput,error_list:res.data.validation_errors});
            }
        }); 
    };
    
    useEffect(()=>{
        setLoading(true);
        setEditToggler("");
        axios.get(`/api/view_tasks_mine`).then(res=>{
            if(res.data.status===200)
            {
                setTasks(res.data.tasks);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })
    },[flag]); //The Flag Changes => Rerequested

    const deleteTask=(e,id)=>{

        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete('/api/delete_task/'+id).then(res=>{
            if(res.data.status===200)
            {
                isClicked.closest("li").remove();
                if(flag==="a")
                {
                    setFlag("b");
                }
                else
                {
                    setFlag("a");
                }
                swal("Success",res.data.message,"success");
            }
            else
            {
                swal("Error",res.data.message,"error");
            }
        });
    }

    const checkTask=(id,text,done)=>{
        const data={
            "text":text,
            "done":done=="0"?"1":"0"
        }

        axios.put('/api/update_task/'+id,data).then(res=>{
            if(res.data.status===200)
            {
                if(flag==="a")
                {
                    setFlag("b");
                }
                else
                {
                    setFlag("a");
                }
                swal("Success",res.data.message,"success");
            }
            else
            {
                swal("Error",res.data.message,"error");
            }
        }); 
    }

    const toglleEdit=(id)=>{
        if(editToggler==id)
        {
            setEditToggler("");
        }
        else
        {
            setEditToggler(id);
        }
    }

    const [taskInputEdit,setTaskEdit]=useState({
        done:"",
        error_list:[]
    });

    const handleInputEdit=(e)=>{
        e.persist();
        setTaskEdit({...taskInputEdit,[e.target.name]:e.target.value});
    };

    const editTask=(id,done)=>{ 
        const data={
            text:taskInputEdit.text,
            done
        }

        axios.put('/api/update_task/'+id,data).then(res=>{
            if(res.data.status===200)
            {
                if(flag==="a")
                {
                    setFlag("b");
                }
                else
                {
                    setFlag("a");
                }
                setEditToggler("");
                swal("Success",res.data.message,"success");
            }
            else if(res.data.status===401 || res.data.status===404)
            {
                swal("Error",res.data.message,"error");
            }
            else
            {
                setTaskEdit({...taskInputEdit,error_list:res.data.validation_errors});
            }
        });
    }

    if(error)
    {
        return (
            <div className="container px-1 py-1 text-danger">
                <span className="h5 my-1">Something went wrong, Can not show tasks!</span>
            </div>
        )
    }
    else if(loading)
    {
        return (
            <div className="container py-3 text-primary">
                <div className="my-3 d-inline-block me-3">
                    <span className="h2">Loading </span> 
                </div>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    { 
        content=(
            tasks.map((task,idx)=>{
                let time=new Date(task.updated_at);
                let time1=time.toLocaleDateString();
                let time2=time.toLocaleTimeString();

                if(task.done=="1")
                {
                    countDone++;
                }

                return(
                    <div key={idx} >
                        <li className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="card-text m-0 ms-1 h5 me-1">
                                    {
                                        task.done=="0"?
                                        <>
                                            <button className="btn btn-sm p-0 pe-1" onClick={()=>checkTask(task.id,task.text,task.done)}>
                                                <i className="fa fa-toggle-off fa-2x text-secondary"></i>
                                            </button>
                                            <span className="fs-6 text-secondary">Last Edit In {time1} At {time2}</span>
                                        </>
                                        :
                                        task.done=="1"?
                                        <>
                                            <button className="btn btn-sm p-0 pe-1" onClick={()=>checkTask(task.id,task.text,task.done)}>
                                                <i className="fa fa-toggle-on fa-2x text-success"></i>
                                            </button>
                                            <span className="fs-6 text-success">Last Edit In {time1} At {time2}</span>
                                        </>:null
                                    }
                                </p>
                                <div style={{minWidth:"60px"}} className="d-flex justify-content-between align-items-center">
                                    <button className="btn btn-sm btn-dark m-1" onClick={()=>{toglleEdit(task.id);setTaskEdit({text:task.text,error_list:[]})}}><i className="fa fa-edit"></i></button>
                                    <button className="btn btn-sm btn-danger m-1" onClick={(e)=>deleteTask(e,task.id)}><i className="fa fa-trash-alt"></i></button>
                                </div>
                            </div>
                            <p className="card-text m-0 ms-1 h5 py-1">
                                {task.text}
                            </p>
                        </li>
                        
                        {
                            editToggler==task.id?
                            <div className="list-group-item p-0">
                                {
                                    taskInputEdit.error_list.text?
                                    <span className="ms-2 text-danger m-0">{taskInputEdit.error_list.text}</span>:""
                                }
                                <div className="d-flex justify-content-between align-items-center flex-wrap p-1 m-0 mb-1">
                                    <div className="form-floating col-12 col-sm-10 mt-1 p-1">
                                        <input onChange={handleInputEdit} defaultValue={task.text} name="text" className="form-control" id="inputText" placeholder="Enter task text" />
                                        <label htmlFor="inputText">Task Text</label>
                                    </div>

                                    <button  className="btn btn-sm btn-primary py-3 col-12 col-sm-2 mt-1" onClick={(e)=>editTask(task.id,task.done)} >Update Task</button>
                                </div>
                            </div>:null
                        }
                    </div>
                )
            })
        )
    }

    return (
        <div className="mt-4">

            <h5 className="ms-2">
                <i className="fa fa-caret-right me-1"></i>
                Add Tasks And Check What You Achive For Time, You Have 
                <span className="border bg-light m-1 px-1 rounded fs-6">{countDone}/{tasks.length}</span>Completed Tasks,
                That Equals To
                <span className="border bg-light m-1 px-1 rounded fs-6">
                {
                    tasks.length>0?
                    (`${countDone*100/tasks.length}`).substring(0,5):"? "
                }%
                </span>.
            </h5>

            <div className="d-flex justify-content-between align-items-center flex-wrap mt-4">

                <div className="form-floating col-12 col-sm-10 mt-1 p-1">
                    <input onChange={handleInput} value={taskInput.text} name="text" className="form-control" id="inputText" placeholder="Enter task text" />
                    <label htmlFor="inputText">Task Text</label>
                </div>
                
                <button type="submit" className="btn btn-sm btn-primary py-3 col-12 col-sm-2 mt-1" onClick={taskSubmit} >Add Task</button>
            </div>
            {
                taskInput.error_list.text?
                <span className="ms-2 text-danger">{taskInput.error_list.text}</span>:""
            }
            <br/>
            {
                content.length>0?
                <ul className="list-group rounded position-relative my-4 shadow" >
                    {content.reverse()}
                </ul>:
                <div className="d-flex justify-content-center align-items-center my-4">
                    <i className="fa fa-quote-left text-primary"></i>
                    <span className="h4 mx-2"> No thing to show </span>
                    <i className="fa fa-quote-right text-primary"></i>
                </div>
            }
        </div>
    )
}//3 Times Used

export const GetStarted=(props)=>{

    const dataGetStatrted=[
        {
            title:"Firstly",
            text:"Add the academic years, bearing in mind that if there are departments in one year, Add them as a separate years.",
            to_url1:"view_years", to_title1:"View years",
            to_url2:"add_year", to_title2:"Add year now !"
        },
        {
            title:"Secondly",
            text:"Add groups each academic year separately, finish all groups in one year and move on to the next year.",
            to_url1:"view_groups", to_title1:"View groups",
            to_url2:"add_group", to_title2:"Add group now !"
        },
        {
            title:"Thirdly",
            text:"Add the teachers in this college.",
            to_url1:"view_teachers", to_title1:"View teachers",
            to_url2:"add_teacher", to_title2:"Add teacher now !"
        },
        {
            title:"Fourthly",
            text:"Add the subjects in this college.",
            to_url1:"view_subjects", to_title1:"View subjects",
            to_url2:"add_subject", to_title2:"Add subject now !"
        },
        {
            title:"Fifth",
            text:" Add the halls in this college.",
            to_url1:"view_halls", to_title1:"View halls",
            to_url2:"add_hall", to_title2:"Add hall now !"
        },
        {
            title:"Sixthly",
            text:" Add the times in this college.",
            to_url1:"view_times", to_title1:"View times",
            to_url2:"add_time", to_title2:"Add time now !"
        },
        {
            title:"Finally",
            text:" Add the programs in this college, we recommend sequencing.",
            to_url1:"view_programs", to_title1:"View programs",
            to_url2:"add_program", to_title2:"Add program now !"
        },
    ]

    return (


        <div className="mt-4">

            <h5 className="ms-2">
                <i className="fa fa-caret-right me-1"></i> Follow This Steps, We Recommend Sequencing For Expected Results.
            </h5>

            <div className="card-body text-center row d-flex justify-content-center align-items-stretch">
                {
                    dataGetStatrted.map((data,idx)=>{
                        return( //className="col-md-5 border p-2 card-body m-1"
                            <div key={idx} className={
                                
                                idx==6?"col-md-5 border p-2 card-body m-0 border border-light border-5 rounded-bottom rounded-bottom-3":
                                idx%2==0 && idx!==6 ?"col-md-5 border p-2 card-body m-0 border border-light border-5 border-bottom-0 border-end-0":
                                "col-md-5 border p-2 card-body m-0 border border-light border-5 border-bottom-0 border-start-0"
                            }>
                                <h5 className="card-title fs-5">{data.title}</h5>
                                <p className="card-text mb-1">{data.text}</p>
                                <div className="btn-group" role="group" aria-label="Basic outlined example ">
                                    <Link to={`/admin/${data.to_url1}`} className="btn btn-outline-primary">{data.to_title1}</Link>
                                    <Link to={`/admin/${data.to_url2}`} className="btn btn-primary">{data.to_title2}</Link>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        
    )
}//1 Times Used
