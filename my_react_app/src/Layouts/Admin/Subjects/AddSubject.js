import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const AddSubject =()=>{
    let history=useHistory();
    let selectYear=[];
    let selectTeacher=[];

    const [teachers,setTeachers]=useState([]);
    const [years,setYears]=useState([]);
    const [subjectInput,setSubject]=useState({
        name:"",
        year_id:"",
        teacher_id:"",
        type:"",
        description:"",
        error_list:[]
    });
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setSubject({...subjectInput,[e.target.name]:e.target.value});
    };

    const subjectSubmit=(e)=>{
        e.preventDefault();

        const data={
            "name":subjectInput.name,
            "year_id":subjectInput.year_id,
            "teacher_id":subjectInput.teacher_id,
            "type":subjectInput.type,
            "description":subjectInput.description,
        }

        axios.post('/api/add_subject',data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setSubject({
                    name:"",
                    year_id:"",
                    teacher_id:"",
                    type:"",
                    description:"",
                    error_list:[]
                })
            }
            else if(res.data.status===400)
            {
                swal("Error",res.data.unique_error,"error");
                setSubject({
                    name:"",
                    year_id:"",
                    teacher_id:"",
                    type:"",
                    description:"",
                    error_list:[]
                }) 
            }
            else
            {
                setSubject({...subjectInput,error_list:res.data.validation_errors});
            }
        });
    };

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
                await axios.get(`/api/view_teachers`).then(res=>{
                    if(res.data.status===200)
                        {
                            setTeachers(res.data.teachers);
                            flag++;
                        }
                })
            );

            if(flag==2)
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
                <span className="h1 my-4">Add Subject </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        selectYear=years.map((year,idx)=>{
            return(
                <option  key={idx} value={year.id}>{year.name}</option>
            )
        })

        selectTeacher=teachers.map((teacher,idx)=>{
            return(
                <option  key={idx} value={teacher.id}>{teacher.first_name} {teacher.middle_name} {teacher.last_name}</option>
            )
        })
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Add Subject</h1>
            <i className="my-4 fa fa-plus fa-3x text-primary d-md-none"></i>

            <form onSubmit={subjectSubmit} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_subjects" role="button"><i className="fa fa-chevron-left"></i></Link>
                
                <div className="border bg-light">
                    <div className="card-body border pt-5" >
                        <div className="form-floating mb-3 offset-md-1 col-md-10 text-center">
                            <p className="fs-6">
                                Enter Full Name Of Subject And Select The Year That May Contains Many Of Subjects
                                <br/>
                                And Select The Teacher Who May Gives Many Of Subjects Too.
                                <br/>
                                <strong className="text-primary"> Ex1 : </strong>First Subject.
                            </p>
                        </div>
                            
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={subjectInput.name} name="name" className="form-control" id="inputName" placeholder="Enter subject name" />
                            <label htmlFor="inputName">Subject Name</label>
                            <span className="text-danger">{subjectInput.error_list.name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <select onChange={handleInput} value={subjectInput.type} name="type" className="form-select form-select-md py-3" aria-label=".form-select-lg example">
                                <option value="">Select Type</option>
                                <option value="Notional">Notional</option>
                                <option value="Practical">Practical</option>
                            </select>
                            <span className="text-danger">{subjectInput.error_list.type}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <select onChange={handleInput} value={subjectInput.year_id} name="year_id" className="form-select form-select-md py-3" aria-label=".form-select-lg example">
                                <option value="">Select Year</option>
                                {selectYear}
                            </select>
                            <span className="text-danger">{subjectInput.error_list.year_id}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <select onChange={handleInput} value={subjectInput.teacher_id} name="teacher_id" className="form-select form-select-md py-3" aria-label=".form-select-lg example">
                                <option value="">Select Teacher</option>
                                {selectTeacher}
                            </select>
                            <span className="text-danger">{subjectInput.error_list.teacher_id}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <textarea onChange={handleInput} value={subjectInput.description} name="description" className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: "100px"}}></textarea>
                            <label htmlFor="floatingTextarea2">Description</label>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Add Subject</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddSubject;