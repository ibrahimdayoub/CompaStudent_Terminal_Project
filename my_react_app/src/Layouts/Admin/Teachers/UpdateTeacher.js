import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const UpdateTeacher =(props)=>{

    let id=props.match.params.id;
    const history=useHistory();

    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [teacherInput,setTeacher]=useState({});
    const [errorList,setErrorList]=useState({});
    const [isChecked,setChecked]=useState("1");
    const [check,setCheck]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setTeacher({...teacherInput,[e.target.name]:e.target.value});
    };

    const teacherUpdate=(e)=>{
        e.preventDefault();

        const data={
            "first_name":teacherInput.first_name,
            "middle_name":teacherInput.middle_name,
            "last_name":teacherInput.last_name,
            "email":teacherInput.email,
            "password":teacherInput.password,
        }

        if(isChecked==="0" )
        {
            data.password="useOldPassword";
        }

        axios.put(`/api/update_teacher/${id}`,data).then(res=>{
            if(res.data.status===200)
            {   
                swal("Success",res.data.message,"success");
                history.push('/admin/view_teachers');
            }
            else  if(res.data.status===404)
            {
                swal("Error",res.data.message,"error");
                history.push('/admin/view_teachers');
            }
            else
            {
                setErrorList(res.data.validation_errors);
            } 
        });
    };

    const handleCheck=(e)=>{
        setChecked(e.target.value==="1"?"0":"1");
    }

    const handleCheckPassword=(e)=>{
        e.persist();

        if(e.target.value=="on")
        {
            e.target.value="off"
        }
        else if(e.target.value=="off")
        {
            e.target.value="on"
        }
        setCheck(e.target.value);
    }

    useEffect(()=>{
        axios.get(`/api/view_teacher/${id}`).then(res=>{
            if(res.data.status===200)
            {
                setTeacher(res.data.teacher);
                setLoading(false);
            }
            else if(res.data.status===404){
                swal("Error",res.data.message,"error");
                history.push('/admin/view_teachers');
            }
            else
            {
                setError(true);
            }
        });
    },[props.match.params.id,history]);

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
                <span className="h1 my-4">Update Teacher </span>
                <div className="spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Update Teacher</h1>
            <i className="fa fa-edit fa-3x text-primary my-4 d-md-none"></i>

            <form onSubmit={teacherUpdate} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_teachers" role="button"><i className="fa fa-chevron-left"></i></Link>

                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={teacherInput.first_name} name="first_name" className="form-control" id="inputFirstName" placeholder="Enter teacher first name" />
                            <label htmlFor="inputFirstName"> First Name</label>
                            <span className="text-danger">{errorList.first_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={teacherInput.middle_name} name="middle_name" className="form-control" id="inputMiddleName" placeholder="Enter teacher middle name" />
                            <label htmlFor="inputMiddleName"> Middle Name</label>
                            <span className="text-danger">{errorList.middle_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={teacherInput.last_name} name="last_name" className="form-control" id="inputLastName" placeholder="Enter teacher last name" />
                            <label htmlFor="inputLastName"> Last Name</label>
                            <span className="text-danger">{errorList.last_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="email" onChange={handleInput} value={teacherInput.email} name="email" className="form-control" id="inputEmail" placeholder="Enter teacher email" />
                            <label htmlFor="inputEmail"> Email</label>
                            <span className="text-danger">{errorList.email}</span>
                        </div>


                        <div className="form-check mb-3 offset-md-1 col-md-10">
                            <input onChange={handleCheck} value={isChecked}  className="form-check-input" type="checkbox" id="reset_password" defaultChecked/>
                            <label className="form-check-label" htmlFor="reset_password" className={isChecked==="0"?"text-dark":"text-primary"}>
                                I Would Reset Password For This Teacher
                            </label>
                        </div>

                        {
                            isChecked=="1"?
                            <div className="form-floating mb-3 offset-md-1 col-md-10">
                                <input type={check=="off"?"text":"password"} onChange={handleInput} value={teacherInput.password} name="password" className="form-control" id="inputPassword" placeholder="Enter teacher password" />
                                <label htmlFor="inputPassword"> New Password</label>
                                    <div className="form-check mt-1">
                                        <input className="form-check-input" type="checkbox" defaultChecked={false} id="show-password" name="showPassword" onChange={handleCheckPassword}/>
                                        <label className="form-check-label" htmlFor="show-password">
                                            Show New Password
                                        </label>
                                    </div>
                                <span className="text-danger">{errorList.password}</span>
                            </div>:
                            ""
                        }
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Update Teacher</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdateTeacher;