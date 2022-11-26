import React,{useState} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const AddTeacher =()=>{
    const [teacherInput,setTeacher]=useState({
        first_name:"",
        middle_name:"",
        last_name:"",
        email:"",
        password:"",
        error_list:[]
    });
    const [check,setCheck]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setTeacher({...teacherInput,[e.target.name]:e.target.value});
    };

    const handleCheck=(e)=>{
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

    const teacherSubmit=(e)=>{
        e.preventDefault();

        const data={
            "first_name":teacherInput.first_name,
            "middle_name":teacherInput.middle_name,
            "last_name":teacherInput.last_name,
            "email":teacherInput.email,
            "password":teacherInput.password,
        }

        axios.post('/api/add_teacher',data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setTeacher({    
                    first_name:"",
                    middle_name:"",
                    last_name:"",
                    email:"",
                    password:"",
                    error_list:[]
                })
            }
            else
            {
                setTeacher({...teacherInput,error_list:res.data.validation_errors});
            }
        });
    };

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Add Teacher</h1>
            <i className="fa fa-plus fa-3x text-primary my-4 d-md-none"></i>

            <form onSubmit={teacherSubmit} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_teachers" role="button"><i className="fa fa-chevron-left"></i></Link>
                
                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={teacherInput.first_name} name="first_name" className="form-control" id="inputFirstName" placeholder="Enter teacher first name" />
                            <label htmlFor="inputFirstName"> First Name</label>
                            <span className="text-danger">{teacherInput.error_list.first_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={teacherInput.middle_name} name="middle_name" className="form-control" id="inputMiddleName" placeholder="Enter teacher middle name" />
                            <label htmlFor="inputMiddleName"> Middle Name</label>
                            <span className="text-danger">{teacherInput.error_list.middle_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={teacherInput.last_name} name="last_name" className="form-control" id="inputLastName" placeholder="Enter teacher last name" />
                            <label htmlFor="inputLastName"> Last Name</label>
                            <span className="text-danger">{teacherInput.error_list.last_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="email" onChange={handleInput} value={teacherInput.email} name="email" className="form-control" id="inputEmail" placeholder="Enter teacher email" />
                            <label htmlFor="inputEmail"> Email</label>
                            <span className="text-danger">{teacherInput.error_list.email}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type={check=="off"?"text":"password"} onChange={handleInput} value={teacherInput.password} name="password" className="form-control" id="inputPassword" placeholder="Enter teacher password" />
                            <label htmlFor="inputPassword"> Password</label>
                            <div className="form-check mt-1">
                                <input className="form-check-input" type="checkbox" defaultChecked={false} id="show-password" name="showPassword" onChange={handleCheck}/>
                                <label className="form-check-label" htmlFor="show-password">
                                    Show Password
                                </label>
                            </div>
                            <span className="text-danger">{teacherInput.error_list.password}</span>
                        </div>

                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Add Teacher</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddTeacher;