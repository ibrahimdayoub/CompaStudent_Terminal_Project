import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

export const SearchedTable=(props)=>{

    let table=[];

    let rows=0;

    let ex = new RegExp((props.searchKey).toLowerCase());

    table=props.inSearchPrograms.map((program)=>{
        if(
            ex.test((program.id))||
            ex.test((program.day).toLowerCase())||
            ex.test( (program.time.from).toLowerCase())||
            ex.test((program.time.to).toLowerCase())||
            ex.test((program.subject.name).toLowerCase())||
            ex.test((program.subject.type).toLowerCase())||
            ex.test((program.subject.teacher.first_name).toLowerCase())||
            ex.test((program.subject.teacher.middle_name).toLowerCase())||
            ex.test((program.subject.teacher.last_name).toLowerCase())||
            ex.test((program.group.year.name).toLowerCase())||
            ex.test((program.group.name).toLowerCase())||
            ex.test((program.hall.name).toLowerCase())||
            (program.notice!==null && ex.test((program.notice).toLowerCase()))||
            (program.notice===null && ex.test("no thing"))
        )
        {  
            rows++;
            return(
                <tr key={program.id}>
                    {
                        props.role=="teacher" && props.whatShow==="all"?
                        <td onClick={()=>props.handleCopy(program.id)}  style={{cursor:"pointer"}} className="py-3 text-center">
                            {
                                ex.test((program.id))?
                                <span className="text-primary">
                                    <i title="Copy Id" className="me-2 fa fa-copy text-primary fa-1x"></i>
                                    {program.id}
                                </span>:
                                <>
                                    <i title="Copy Id" className="me-2 fa fa-copy text-primary fa-1x"></i>
                                    {program.id}
                                </>
                            }
                        </td>
                        :null
                    }
                    <td className="py-2 text-center">{ex.test((program.day).toLowerCase())?<span className="text-primary">{program.day}</span>:program.day}</td>
                    <td className="py-2 text-center">{ex.test((program.time.from).toLowerCase())?<span className="text-primary">{program.time.from}</span>:program.time.from}</td>
                    <td className="py-2 text-center">{ex.test((program.time.to).toLowerCase())?<span className="text-primary">{program.time.to}</span>:program.time.to}</td>
                    <td className="py-2 text-center">
                        {
                            ex.test((program.subject.name).toLowerCase()) || ex.test((program.subject.type).toLowerCase()) ?<span className="text-primary">{program.subject.name} | {program.subject.type}</span>:`${program.subject.name} | ${program.subject.type}`
                        }
                    </td>
                    {
                        props.whatShow==="all" || props.role==="teacher"?
                        <>
                        <td className="py-2 text-center">{ex.test((program.group.year.name).toLowerCase())?<span className="text-primary">{program.group.year.name}</span>:program.group.year.name}</td>
                        <td className="py-2 text-center">{ex.test((program.group.name).toLowerCase())?<span className="text-primary">{program.group.name}</span>:program.group.name}</td>
                        </>:null
                    }
                    {
                        !(props.role=="teacher" && props.whatShow=="mine")?
                        <td className="py-2 text-center">
                        {
                            ex.test((program.subject.teacher.first_name).toLowerCase()) || ex.test((program.subject.teacher.middle_name).toLowerCase()) || ex.test((program.subject.teacher.last_name).toLowerCase()) ?
                            <span className="text-primary">{program.subject.teacher.first_name}  {program.subject.teacher.middle_name}  {program.subject.teacher.last_name}</span>:
                            <span> {program.subject.teacher.first_name}  {program.subject.teacher.middle_name}  {program.subject.teacher.last_name}</span>
                        }  
                        </td>:null
                    }
                    <td className="py-2 text-center">{ex.test((program.hall.name).toLowerCase())?<span className="text-primary">{program.hall.name}</span>:program.hall.name}</td>
                    <td className="py-2 text-center">
                        {
                            program.notice!==null && ex.test((program.notice).toLowerCase())? <span className="text-primary" >{program.notice}</span>:
                            (ex.test("no thing") && program.notice===null) ? <span className="text-primary" >No Thing</span>:
                            "No Thing"
                        }
                    </td>
                    {
                        props.whatShow==="mine" && props.role==="teacher"?
                        <td className="py-2 text-center">
                            <Link className="btn btn-sm btn-dark m-1" to={`/teacher/update_program/${program.id}`} title="Refresh " role="button"><i className="fa fa-edit"></i></Link>
                            <button onClick={(e)=>props.deleteProgram(e,program.id)} type="button" className="btn btn-sm btn-danger m-1"><i className="fa fa-trash-alt"></i></button>
                            <Link className="btn btn-sm btn-primary m-1" to={`/teacher/swap_program/${program.id}.${props.idTarget}`} title="Swap" role="button"><i className="fa fa-retweet"></i></Link>
                        </td>:null
                    }
                    {
                        props.role==="admin"?
                        <td className="py-2 text-center">
                            <Link className="btn btn-sm btn-dark m-1" to={`/admin/update_program/${program.id}`} role="button"><i className="fa fa-edit"></i></Link>
                            <span>      </span>
                            <button onClick={(e)=>props.deleteProgram(e,program.id)} type="button" className="btn btn-sm btn-danger m-1"><i className="fa fa-trash-alt"></i></button>
                        </td>:null
                    }
                </tr>
            )
        }
    });

    const noThingToShow =(           
        <div className="d-flex justify-content-center align-items-center my-4 text-center">
            <i className="fa fa-quote-left text-primary"></i>
            <span className="h4 mx-2"> No thing to show </span>
            <i className="fa fa-quote-right text-primary"></i>
        </div>
    )

    return(
        <div className="table-responsive rounded my-5">
            {
                table.length>0?
                <>
                    <table className="table table-bordered bg-light">
                        <tbody>
                            <tr className="bg-dark text-light">
                                {
                                    props.role=="teacher"  && props.whatShow==="all"?
                                    <th className="text-center" scope="col">Id</th>
                                    :null
                                }
                                <th className="text-center" scope="col">Day</th>
                                <th className="text-center" scope="col">From</th>
                                <th className="text-center" scope="col">To</th>
                                <th className="text-center" scope="col">Subject</th>
                                {
                                    props.whatShow==="all" || props.role==="teacher"?
                                    <>
                                    <th className="text-center" scope="col">Year</th>
                                    <th className="text-center" scope="col">Group</th>
                                    </>:null
                                }
                                {
                                   !(props.role=="teacher" && props.whatShow=="mine")?
                                    <th className="text-center" scope="col">Teacher</th>
                                    :null
                                }
                                <th className="text-center" scope="col">Hall</th>
                                {
                                    props.role==="teacher" && props.whatShow==="mine" || props.role==="admin" ?
                                    <th className="text-center" scope="col">Notice</th>:
                                    <th className="text-center" scope="col">Notice
                                        <div className="border border-light p-1 px-2 d-inline-block rounded text-light ms-2">
                                            <i className="fa fa-arrows-alt-v"></i><span> {rows}</span>
                                        </div>
                                    </th>
                                }
                                {
                                    props.role==="teacher" && props.whatShow==="mine"?
                                    <th className="text-center" scope="col"> 
                                        <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                            <i className="fa fa-arrows-alt-v"></i><span>  {rows}     <Link className="btn btn-sm btn-light" to="/teacher/add_program" role="button"><i className="fa fa-plus"></i></Link> </span>
                                        </div> 
                                    </th>:null
                                }
                                {
                                    props.role==="admin"?
                                    <th className="text-center" scope="col"> 
                                        <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                            <i className="fa fa-arrows-alt-v"></i><span>  {rows}     <Link className="btn btn-sm btn-light" to="/admin/add_program" role="button"><i className="fa fa-plus"></i></Link> </span>
                                        </div> 
                                    </th>:null
                                }
                            </tr>
                            {table.reverse()}
                        </tbody>
                    </table>
                </>:
                <>
                    <table className="table table-bordered bg-light">
                        <tbody>
                            <tr className="bg-dark text-light">
                                {
                                    props.role=="teacher"  && props.whatShow==="all"?
                                    <th className="text-center" scope="col">Id</th>
                                    :null
                                }
                                <th className="text-center" scope="col">Day</th>
                                <th className="text-center" scope="col">From</th>
                                <th className="text-center" scope="col">To</th>
                                <th className="text-center" scope="col">Subject</th>
                                {
                                    props.whatShow==="all" || props.role==="teacher"?
                                    <>
                                    <th className="text-center" scope="col">Year</th>
                                    <th className="text-center" scope="col">Group</th>
                                    </>:null
                                }
                                {
                                   !(props.role=="teacher" && props.whatShow=="mine")?
                                    <th className="text-center" scope="col">Teacher</th>
                                    :null
                                }
                                <th className="text-center" scope="col">Hall</th>
                                {
                                    props.role==="teacher" && props.whatShow==="mine" || props.role==="admin" ?
                                    <th className="text-center" scope="col">Notice</th>:
                                    <th className="text-center" scope="col">Notice
                                        <div className="border border-light p-1 px-2 d-inline-block rounded text-light ms-2">
                                            <i className="fa fa-arrows-alt-v"></i><span> {rows}</span>
                                        </div>
                                    </th>
                                }
                                {
                                    props.role==="teacher" && props.whatShow==="mine"?
                                    <th className="text-center" scope="col"> 
                                        <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                            <i className="fa fa-arrows-alt-v"></i><span>  {table.length}     <Link className="btn btn-sm btn-light" to="/teacher/add_program" role="button"><i className="fa fa-plus"></i></Link> </span>
                                        </div> 
                                    </th>:null
                                }
                                {
                                    props.role==="admin"?
                                    <th className="text-center" scope="col"> 
                                        <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                            <i className="fa fa-arrows-alt-v"></i><span>  {table.length}     <Link className="btn btn-sm btn-light" to="/admin/add_program" role="button"><i className="fa fa-plus"></i></Link> </span>
                                        </div> 
                                    </th>:null
                                }
                            </tr> 
                        </tbody> 
                    </table>
                    {noThingToShow}
                </>
            }
        </div>
    )
}//3 Times Used

export const FetchHall=(props)=>{

    const [hall,setHall]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/view_hall/${props.id}`).then(res=>{
            if(res.data.status===200)
            {
                setHall(res.data.hall);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })
    },[props.id]);

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
            <div className="container px-1 py-1 text-primary">
                <span className="h5 my-1">Loading </span>
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="card my-2">
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Name : {hall.name}, Floor: {hall.floor}, Build: {hall.build} </li>
                <li className="list-group-item">Capacity : {hall.capacity}</li>
                <li className="list-group-item">
                    Number Of Programs : {hall.programs.length} 
                    <div className="table-responsive rounded my-2">
                        <table className="table table-bordered bg-light">
                            <tbody>
                                <tr className="bg-dark text-light">
                                    <td className="text-center" scope="col">Day</td>
                                    <td className="text-center" scope="col">From</td>
                                    <td className="text-center" scope="col">To</td>
                                    <td className="text-center" scope="col">Subject</td>
                                    <td className="text-center" scope="col">Teacher</td>
                                    <td className="text-center" scope="col">Students</td>
                                    <td className="text-center" scope="col">Notice</td>
                                </tr>     
                                    {
                                        hall.programs.map((program,idx)=>{
                                            return(
                                                <tr key={idx}>
                                                    <td className="py-3 text-center" scope="col">{program.day}</td>
                                                    <td className="py-3 text-center" scope="col">{program.time.from}</td>
                                                    <td className="py-3 text-center" scope="col">{program.time.to}</td>
                                                    <td className="py-3 text-center" scope="col">{program.subject.name} | {program.subject.type}</td>
                                                    <td className="py-3 text-center" scope="col">{program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}</td>
                                                    <td className="py-3 text-center" scope="col">{program.group.name} In {program.group.year.name} That Contain {program.group.students.length} Registerd Students</td>
                                                    <td className="py-3 text-center" scope="col">{program.notice?program.notice:"No Thing"}</td>
                                                </tr>
                                            )
                                        })
                                    }
                            </tbody>
                        </table>
                    </div>
                </li>
            </ul>
        </div>
    )
}//3 Times Used

export const FetchSubject=(props)=>{

    const [subject,setSubject]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/view_subject/${props.id}`).then(res=>{
            if(res.data.status===200)
            {
                setSubject(res.data.subject);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })
    },[props.id]);

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
            <div className="container px-1 py-1 text-primary">
                <span className="h5 my-1">Loading </span>
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="card my-2">
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Teacher : {subject.teacher.first_name} {subject.teacher.middle_name} {subject.teacher.last_name}, Subject : {subject.name}, Type : {subject.type}</li>
                <li className="list-group-item">Year : {subject.year.name}</li>
                <li className="list-group-item">
                    Number Of Programs : {subject.programs.length} 
                    <div className="table-responsive rounded my-2">
                        <table className="table table-bordered bg-light">
                            <tbody>
                                <tr className="bg-dark text-light">
                                    <td className="text-center" scope="col">Day</td>
                                    <td className="text-center" scope="col">From</td>
                                    <td className="text-center" scope="col">To</td>
                                    <td className="text-center" scope="col">Group</td>
                                    <td className="text-center" scope="col">Hall</td>
                                    <td className="text-center" scope="col">Notice</td>
                                </tr>     
                                    {
                                    subject.programs.map((program,idx)=>{
                                            return(
                                                <tr key={idx}>
                                                    <td className="py-3 text-center" scope="col">{program.day}</td>
                                                    <td className="py-3 text-center" scope="col">{program.time.from}</td>
                                                    <td className="py-3 text-center" scope="col">{program.time.to}</td>
                                                    <td className="py-3 text-center" scope="col">{program.group.name}</td>
                                                    <td className="py-3 text-center" scope="col">{program.hall.name}</td>
                                                    <td className="py-3 text-center" scope="col">{program.notice?program.notice:"No Thing"}</td>
                                                </tr>
                                            )
                                        })
                                    }
                            </tbody>
                        </table>
                    </div>
                </li>
            </ul>
        </div>
    )
}//3 Times Used

export const FetchYear=(props)=>{

    const [year,setYear]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/view_year/${props.id}`).then(res=>{
            if(res.data.status===200)
            {
                setYear(res.data.year);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })
    },[props.id]);

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
            <div className="container px-1 py-1 text-primary">
                <span className="h5 my-1">Loading </span>
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="d-flex flex-wrap justify-content-between">
            <div className="btn-group m-1 bg-light rounded" role="group" aria-label="Basic outlined example">
                {
                   year.groups.map((group,idx)=>{
                        if(group.programs.length>0)
                        {
                            return(
                                <button key={idx} onClick={()=>props.fetchGroup(group.id)} name={`${group.name.toLowerCase()} ${group.id}`} type="button" className="btn btn-outline-dark group-one">{group.name}</button>
                            )
                        }
                    })
                }
            </div>
    </div>
    )
}//3 Times Used

export const FetchGroup=(props)=>{

    const [group,setGroup]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/view_group/${props.id}`).then(res=>{
            if(res.data.status===200)
            {
                setGroup(res.data.group);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })
    },[props.id]);

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
            <div className="container px-1 py-1 text-primary">
                <span className="h5 my-1">Loading </span>
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="card my-2">
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Year : {group.year.name}, Group : {group.name}</li>
                <li className="list-group-item">Number Of Students : {group.students.length}</li>
                <li className="list-group-item">
                    Number Of Programs : {group.programs.length} 
                    <div className="table-responsive rounded my-2">
                        <table className="table table-bordered bg-light">
                            <tbody>
                                <tr className="bg-dark text-light">
                                    <td className="text-center" scope="col">Day</td>
                                    <td className="text-center" scope="col">From</td>
                                    <td className="text-center" scope="col">To</td>
                                    <td className="text-center" scope="col">Subject</td>
                                    <td className="text-center" scope="col">Teacher</td>
                                    <td className="text-center" scope="col">Hall</td>
                                    <td className="text-center" scope="col">Notice</td>
                                </tr>     
                                    {
                                        group.programs.map((program,idx)=>{
                                            return(
                                                <tr key={idx}>
                                                    <td className="py-3 text-center" scope="col">{program.day}</td>
                                                    <td className="py-3 text-center" scope="col">{program.time.from}</td>
                                                    <td className="py-3 text-center" scope="col">{program.time.to}</td>
                                                    <td className="py-3 text-center" scope="col">{program.subject.name} | {program.subject.type}</td>
                                                    <td className="py-3 text-center" scope="col">{program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}</td>
                                                    <td className="py-3 text-center" scope="col">{program.hall.name}</td>
                                                    <td className="py-3 text-center" scope="col">{program.notice?program.notice:"No Thing"}</td>
                                                </tr>
                                            )
                                        })
                                    }
                            </tbody>
                        </table>
                    </div>
                </li>
            </ul>
        </div>
    )
}//3 Times Used

export const FetchTeacher=(props)=>{

    const [teacher,setTeacher]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/view_teacher/${props.id}`).then(res=>{
            if(res.data.status===200)
            {
                setTeacher(res.data.teacher);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })
    },[props.id]);

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
            <div className="container px-1 py-1 text-primary">
                <span className="h5 my-1">Loading </span>
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="d-flex flex-wrap justify-content-between">
            <div className="btn-group m-1 bg-light rounded" role="group" aria-label="Basic outlined example">
                {
                    teacher.subjects.map((subject,idx)=>{
                        if(subject.programs.length>0)
                        {
                            return(
                                <button key={idx} onClick={()=>props.fetchSubjectTeacher(subject.id)} name={`${subject.name.toLowerCase()} ${subject.id}`} type="button" className="btn btn-outline-dark group-one">{subject.name} | {subject.type}</button>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}//3 Times Used

export const FetchTime=(props)=>{
    let days=[];

    const [time,setTime]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/view_time/${props.id}`).then(res=>{
            if(res.data.status===200)
            {
                setTime(res.data.time);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })
    },[props.id]);

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
            <div className="container px-1 py-1 text-primary">
                <span className="h5 my-1">Loading </span>
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    return(
        <div className="d-flex flex-wrap justify-content-between">
            <div className="btn-group m-1 bg-light rounded" role="group" aria-label="Basic outlined example">
                {
                    time.programs.map((program,idx)=>{

                        if(!days.includes(program.day))
                        {
                            days.push(program.day)
                            return(
                                <button key={idx} onClick={()=>props.fetchDay(program.day,time.name)} name={`${program.day.toLowerCase()}`} type="button" className="btn btn-outline-dark group-one">{program.day}</button>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}//3 Times Used

export const FetchDay=(props)=>{

    const [programs,setPrograms]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    let numberOfPrograms=0;

    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/day_programs/${props.day}`).then(res=>{
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
    },[props.day]);

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
            <div className="container px-1 py-1 text-primary">
                <span className="h5 my-1">Loading </span>
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="card my-2">
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Day : {props.day}, Time : {props.time}</li>
                <li className="list-group-item">
                    {
                    programs.map((program)=>{
                            if(program.time.name===props.time)
                            {
                                numberOfPrograms+=1;
                            }
                    })
                    }
                    Number Of Programs : {numberOfPrograms} 
                    <div className="table-responsive rounded my-2">
                        <table className="table table-bordered bg-light">
                            <tbody id="tableDayPrograms">
                                <tr className="bg-dark text-light">
                                    <td className="text-center" scope="col">Subject</td>
                                    <td className="text-center" scope="col">Teacher</td>
                                    <td className="text-center" scope="col">Group</td>
                                    <td className="text-center" scope="col">Year</td>
                                    <td className="text-center" scope="col">Hall</td>
                                    <td className="text-center" scope="col">Notice</td>
                                </tr>  
                                    {
                                        programs.map((program,idx)=>{
                                            if(program.time.name===props.time)
                                            {
                                                return(
                                                    <tr key={idx}>
                                                        <td className="py-3 text-center" scope="col">{program.subject.name} | {program.subject.type}</td>
                                                        <td className="py-3 text-center" scope="col">{program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}</td>
                                                        <td className="py-3 text-center" scope="col">{program.group.name}</td>
                                                        <td className="py-3 text-center" scope="col">{program.group.year.name}</td>
                                                        <td className="py-3 text-center" scope="col">{program.hall.name}</td>
                                                        <td className="py-3 text-center" scope="col">{program.notice?program.notice:"No Thing"}</td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                            </tbody>
                        </table>
                    </div>
                </li>
            </ul>
        </div>
    )
}//3 Times Used

/*
                <div className="d-flex justify-content-center align-items-center my-4">
                    <i className="fa fa-quote-left text-primary"></i>
                    <span className="h4 mx-2"> No thing to show </span>
                    <i className="fa fa-quote-right text-primary"></i>
                </div>
*/