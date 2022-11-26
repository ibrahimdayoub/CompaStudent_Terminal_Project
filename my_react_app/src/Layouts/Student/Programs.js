import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import {SearchedTable,FetchHall,FetchSubject,FetchYear,FetchGroup,FetchTeacher,FetchTime,FetchDay} from '../Shared/ProgramsFunctions'

const Programs =()=>{
    let history=useHistory();

    let 
    programsTable=[],myProgramsTable=[],hallsArray=[],subjectsArray=[],yearsArray=[],teachersArray=[],timesArray=[];

    //Groups Mean Groups Of Buttons Not Categories
    let 
    hallsGroup=[],subjectsGroup=[],yearsGroup=[],teachersGroup=[],timesGroup=[];

    const
    [loading,setLoading]=useState(true),
    [error,setError]=useState(false),
    [programs,setPrograms]=useState([]),
    [myPrograms,setMyPrograms]=useState([]),
    [whatShow,setWhatShow]=useState("all"),
    [searchKey,setSearchKey]=useState(""),
    [searchTable,setSearchTable]=useState([]),
    [hallContent,setHallContent]=useState(""),
    [subjectContent,setSubjectContent]=useState(""),
    [yearContent,setYearContent]=useState(""),
    [groupContent,setGroupContent]=useState(""),
    [teacherContent,setTeacherContent]=useState(""),
    [subjectTeacherContent,setSubjectTeacherContent]=useState(""),
    [timeContent,setTimeContent]=useState(""),
    [dayContent,setDayContent]=useState("");

    const 
    handleSearch=(e)=>{
        e.persist();
        setSearchKey(e.target.value);
        let inSearchPrograms=[];
        if(whatShow==="all") {inSearchPrograms=programs}
        else if(whatShow==="mine") {inSearchPrograms=myPrograms}

        setSearchTable(<SearchedTable inSearchPrograms={inSearchPrograms} whatShow={whatShow} searchKey={e.target.value}/>);
    },
    fetchHall=(id)=>{setHallContent(<FetchHall id={id}/>)},
    fetchSubject=(id)=>{setSubjectContent(<FetchSubject id={id}/>)},
    fetchYear=(id)=>{setYearContent(<FetchYear id={id} fetchGroup={fetchGroup}/>)},
    fetchGroup=(id)=>{setGroupContent(<FetchGroup id={id}/>)},
    fetchTeacher=(id)=>{setTeacherContent(<FetchTeacher id={id} fetchSubjectTeacher={fetchSubjectTeacher}/>)},
    fetchSubjectTeacher=(id)=>{setSubjectTeacherContent(<FetchSubject id={id}/>)},
    fetchTime=(id)=>{setTimeContent(<FetchTime id={id} fetchDay={fetchDay}/>)},
    fetchDay=(day,time)=>{setDayContent(<FetchDay day={day} time={time}/>)};

    const filter=(e)=>{
        setSearchKey("");
        if(whatShow!=="load")
        {
            setWhatShow("load");       
            setTimeout(() => {setWhatShow(e.target.name)},500)
        }      
    }

    const noThingToShow =(           
        <div className="d-flex justify-content-center align-items-center my-4 text-center">
            <i className="fa fa-quote-left text-primary"></i>
            <span className="h4 mx-2"> No thing to show </span>
            <i className="fa fa-quote-right text-primary"></i>
        </div>
    )

    useEffect(()=>{
        let flag=0;
        (async() => {
            await axios.get(`/api/view_programs`).then(res=>{
                if(res.data.status===200)
                {
                    setPrograms(res.data.programs);
                    flag++;
                }
            }).then(
                await axios.get(`/api/student_programs_mine`).then(res=>{
                    if(res.data.status===200)
                    {
                        setMyPrograms(res.data.programs); 
                        flag++;
                    }
                    else if(res.data.status===404)
                    {
                        flag++;
                    }
                })
            )
            if(flag===2)
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
                <span className="h1 my-4">Programs </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {   
        programsTable=programs.map((program,idx)=>{
            let pushHall=true,pushYear=true,pushSubject=true,pushTeacher=true,pushTime=true;
            for(let i=0;i<idx;i++)
            {
                if(pushHall!==false && program.hall.name===programs[i].hall.name){pushHall=false}
                if(pushYear!==false && program.group.year.name===programs[i].group.year.name){pushYear=false}
                if(pushSubject!==false && program.subject.name===programs[i].subject.name && program.subject.type===programs[i].subject.type){pushSubject=false}
                if(pushTeacher!==false && program.subject.teacher_id===programs[i].subject.teacher_id){pushTeacher=false}
                if(pushTime!==false && program.time.name===programs[i].time.name){pushTime=false}
            }
            if(pushHall){hallsArray.push({"name":program.hall.name,"id":program.hall.id})}
            if(pushYear){yearsArray.push({"name":program.group.year.name,"id":program.group.year.id})}
            if(pushSubject){subjectsArray.push({"name":program.subject.name,"type":program.subject.type,"id":program.subject.id})}
            if(pushTeacher){teachersArray.push({"name":`${program.subject.teacher.first_name} ${program.subject.teacher.middle_name} ${program.subject.teacher.last_name}`,"id":program.subject.teacher.id})}
            if(pushTime){timesArray.push({"name":`${program.time.name}`,"id":program.time.id})}

            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{program.day}</td>
                    <td className="py-2 text-center">{program.time.from}</td>
                    <td className="py-2 text-center">{program.time.to}</td>
                    <td className="py-2 text-center">{program.subject.name} | {program.subject.type}</td>
                    <td className="py-2 text-center">{program.group.year.name}</td>
                    <td className="py-2 text-center">{program.group.name}</td>
                    <td className="py-2 text-center">{program.subject.teacher.first_name}  {program.subject.teacher.middle_name}  {program.subject.teacher.last_name}</td>
                    <td className="py-2 text-center">{program.hall.name}</td>
                    <td className="py-2 text-center">{program.notice?program.notice:"No Thing"}</td>
                </tr>
            )
        });
        myProgramsTable=myPrograms.map((myProgram,idx)=>{ 
            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{myProgram.day}</td>
                    <td className="py-2 text-center">{myProgram.time.from}</td>
                    <td className="py-2 text-center">{myProgram.time.to}</td>
                    <td className="py-2 text-center">{myProgram.subject.name} | {myProgram.subject.type}</td>
                    <td className="py-2 text-center">{myProgram.subject.teacher.first_name} {myProgram.subject.teacher.middle_name} {myProgram.subject.teacher.last_name}</td>
                    <td className="py-2 text-center">{myProgram.hall.name}</td>
                    <td className="py-2 text-center">{myProgram.notice?myProgram.notice:"No Thing"}</td>
                </tr>
            )
        });
        hallsGroup=hallsArray.map((hall,idx)=>{
            return(
                <button key={idx} onClick={()=>fetchHall(hall.id)} name={`${hall.name.toLowerCase()}`} type="button" className="btn btn-outline-dark">{hall.name}</button>
            )
        });
        yearsGroup=yearsArray.map((year,idx)=>{
            return(
                <button key={idx} onClick={()=>fetchYear(year.id)} name={`${year.name.toLowerCase()}`} type="button" className="btn btn-outline-dark">{year.name}</button>
            )
        });
        subjectsGroup=subjectsArray.map((subject,idx)=>{
            return(
                <button key={idx} onClick={()=>fetchSubject(subject.id)} name={`${subject.name.toLowerCase()}`} type="button" className="btn btn-outline-dark">{subject.name} | {subject.type}</button>
            )
        });
        teachersGroup=teachersArray.map((teacher,idx)=>{
            return(
                <button key={idx} onClick={()=>fetchTeacher(teacher.id)} name={`${teacher.name.toLowerCase()}`} type="button" className="btn btn-outline-dark">{teacher.name}</button>
            )
        });  
        timesGroup=timesArray.map((time,idx)=>{
            return(
                <button key={idx} onClick={()=>fetchTime(time.id)} name={`${time.name.toLowerCase()}`} type="button" className="btn btn-outline-dark">{time.name}</button>
            )
        });  
    }        

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Programs</h1>
            <i className="my-4 fa fa-receipt fa-2x d-md-none text-primary"></i>

            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                    <div className="btn-group bg-light" role="group">
                        <button id="btnGroupDrop1" type="button" className="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Programs
                        </button>
                        <ul className="dropdown-menu p-0 bg-light" aria-labelledby="btnGroupDrop1">
                            <button name="all" onClick={(e)=>filter(e)} type="button" className="border border-none btn btn-outline-dark d-block w-100">All</button>
                            <button name="mine" onClick={(e)=>filter(e)} type="button" className="border border-none btn btn-outline-dark d-block w-100">Mine</button>
                        </ul>
                    </div>
                    <div className="btn-group bg-light" role="group">
                        <button id="btnGroupDrop2" type="button" className="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Filters
                        </button>
                        <ul className="dropdown-menu p-0 bg-light" aria-labelledby="btnGroupDrop2">
                            <button name="subjects" onClick={(e)=>filter(e)} type="button" className="border border-none btn btn-outline-dark d-block w-100 ">Subjects</button>
                            <button name="teachers" onClick={(e)=>filter(e)} type="button" className="border border-none btn btn-outline-dark d-block w-100">Teachers</button>
                            <button name="years" onClick={(e)=>filter(e)} type="button" className="border border-none btn btn-outline-dark d-block w-100">Years</button>
                            <button name="halls" onClick={(e)=>filter(e)} type="button" className="border border-none btn btn-outline-dark d-block w-100">Halls</button>
                            <button name="times" onClick={(e)=>filter(e)} type="button" className="border border-none  btn btn-outline-dark d-block w-100">Times</button>
                        </ul>
                    </div>
                </div>
                {
                    whatShow==="all" || whatShow==="mine"?
                    <div> 
                        <div style={{width:"165px"}} className="form-floating mt-1">
                            <input style={{padding:"6px", height:"34px"}} onKeyUp={handleSearch} className="form-control border border-dark bg-light"  placeholder="Enter search" />
                            <label style={{top:"-8px",color:"#333",color:"#0d6efd"}} htmlFor="inputLastName"><i className="fa fa-search"></i></label>
                        </div>
                    </div>:null
                }
            </div>
            {
                whatShow=="load"?
                <div className="container px-1 py-1 text-primary">
                    <span className="h5 my-1">Loading </span>
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>:null
            }
            {
                whatShow==="all" && searchKey=="" ?
                <div className="table-responsive rounded my-5">
                    {
                        programsTable.length>0?
                        <table className="table table-bordered bg-light">
                            <tbody>
                                <tr className="bg-dark text-light">
                                    <th className="text-center" scope="col">Day</th>
                                    <th className="text-center" scope="col">From</th>
                                    <th className="text-center" scope="col">To</th>
                                    <th className="text-center" scope="col">Subject</th>
                                    <th className="text-center" scope="col">Year</th>
                                    <th className="text-center" scope="col">Group</th>
                                    <th className="text-center" scope="col">Teacher</th>
                                    <th className="text-center" scope="col">Hall</th>
                                    <th className="text-center" scope="col">Notice
                                        <div className="border border-light p-1 px-2 d-inline-block rounded text-light ms-2">
                                            <i className="fa fa-arrows-alt-v"></i><span> {programs.length}</span>
                                        </div>
                                    </th>
                                </tr>
                                {programsTable.reverse()}
                            </tbody>
                        </table>
                       :
                        <>
                        <table className="table table-bordered bg-light">
                            <tbody>
                                <tr className="bg-dark text-light">
                                    <th className="text-center" scope="col">Day</th>
                                    <th className="text-center" scope="col">From</th>
                                    <th className="text-center" scope="col">To</th>
                                    <th className="text-center" scope="col">Subject</th>
                                    <th className="text-center" scope="col">Year</th>
                                    <th className="text-center" scope="col">Group</th>
                                    <th className="text-center" scope="col">Teacher</th>
                                    <th className="text-center" scope="col">Hall</th>
                                    <th className="text-center" scope="col">Notice
                                        <div className="border border-light p-1 px-2 d-inline-block rounded text-light ms-2">
                                            <i className="fa fa-arrows-alt-v"></i><span> {programs.length}</span>
                                        </div>
                                    </th>
                                </tr>  
                            </tbody> 
                        </table>
                        {noThingToShow}
                        </>
                    }  
                </div>:
                whatShow==="mine" && searchKey==""?
                <div className="table-responsive rounded my-5">
                    {
                        myProgramsTable.length>0?
                        <table className="table table-bordered bg-light">
                            <tbody>
                                <tr className="bg-dark text-light">
                                    <th className="text-center" scope="col">Day</th>
                                    <th className="text-center" scope="col">From</th>
                                    <th className="text-center" scope="col">To</th>
                                    <th className="text-center" scope="col">Subject</th>
                                    <th className="text-center" scope="col">Teacher</th>
                                    <th className="text-center" scope="col">Hall</th>
                                    <th className="text-center" scope="col">Notice
                                        <div className="border border-light p-1 px-2 d-inline-block rounded text-light ms-2">
                                            <i className="fa fa-arrows-alt-v"></i><span> {myPrograms.length}</span>
                                        </div>
                                    </th>
                                </tr>
                                {myProgramsTable.reverse()}
                            </tbody>
                        </table>
                        :
                        <>
                        <table className="table table-bordered bg-light">
                            <tbody>
                               <tr className="bg-dark text-light">
                                    <th className="text-center" scope="col">Day</th>
                                    <th className="text-center" scope="col">From</th>
                                    <th className="text-center" scope="col">To</th>
                                    <th className="text-center" scope="col">Subject</th>
                                    <th className="text-center" scope="col">Teacher</th>
                                    <th className="text-center" scope="col">Hall</th>
                                    <th className="text-center" scope="col">Notice
                                        <div className="border border-light p-1 px-2 d-inline-block rounded text-light ms-2">
                                            <i className="fa fa-arrows-alt-v"></i><span> {myPrograms.length}</span>
                                        </div>
                                    </th>
                                </tr>
                            </tbody> 
                        </table>
                        {noThingToShow}
                        </>
                    } 
                </div>:
                whatShow==="all" && searchKey !=="" ?
                searchTable:
                whatShow==="mine" && searchKey !==""?
                searchTable:
                whatShow==="halls"?
                <>
                    {
                        hallsGroup.length>0?
                        <div className="btn-group m-1 bg-light rounded" role="group" aria-label="Basic outlined example">
                            {hallsGroup}
                        </div>:noThingToShow
                    }
                    <div>{hallContent}</div>
                </>:
                whatShow==="years"?
                <>
                    {
                        yearsGroup.length>0?
                        <div className="btn-group  m-1 bg-light rounded" role="group" aria-label="Basic outlined example">
                            {yearsGroup}
                        </div>:noThingToShow
                    }
                    <div>{yearContent}</div>
                    <div>{groupContent}</div>
                </>:
                whatShow==="subjects"?
                <>
                    {
                        subjectsGroup.length>0?
                        <div className="btn-group  m-1 bg-light rounded" role="group" aria-label="Basic outlined example">
                            {subjectsGroup}
                        </div>:noThingToShow
                    }
                    <div>{subjectContent}</div>
                </>:
                whatShow==="teachers"?
                <>
                    {
                        teachersGroup.length>0?
                        <div className="btn-group  m-1 bg-light rounded" role="group" aria-label="Basic outlined example">
                            {teachersGroup}
                        </div>:noThingToShow
                    }
                    <div>{teacherContent}</div>
                    <div>{subjectTeacherContent}</div>
                </>:
                whatShow==="times"?
                <>
                    {
                        timesGroup.length>0?
                        <div className="btn-group  m-1 bg-light rounded" role="group" aria-label="Basic outlined example">
                            {timesGroup}
                        </div>:noThingToShow
                    }
                    <div>{timeContent}</div>
                    <div>{dayContent}</div>
                </>:null
            }
        </div>
    )
}

export default Programs;