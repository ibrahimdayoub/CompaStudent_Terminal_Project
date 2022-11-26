import React,{useState} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const AddAdmin =()=>{

    const [adminInput,setAdmin]=useState({
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
        setAdmin({...adminInput,[e.target.name]:e.target.value});
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

    const adminSubmit=(e)=>{
        e.preventDefault();

        const data={
            "first_name":adminInput.first_name,
            "middle_name":adminInput.middle_name,
            "last_name":adminInput.last_name,
            "email":adminInput.email,
            "password":adminInput.password,
        }

        axios.post('/api/add_admin',data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setAdmin({    
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
                setAdmin({...adminInput,error_list:res.data.validation_errors});
            }
        });
    };

    return(
        <div className="container px-4">
            <i className="fa fa-plus fa-3x d-md-none my-4 text-primary"></i>
            <h1 className="my-4 d-none d-md-block">Add Admin</h1>

            <form onSubmit={adminSubmit} className="my-5">

                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_admins" role="button"><i className="fa fa-chevron-left"></i></Link>
              
                <div className="border bg-light">
                    <div className="tab-pane fade show active card-body border pt-5" id="info" role="tabpanel" aria-labelledby="info-tab">
                    
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={adminInput.first_name} name="first_name" className="form-control" id="inputFirstName" placeholder="Enter admin first name" />
                            <label htmlFor="inputFirstName"> First Name</label>
                            <span className="text-danger">{adminInput.error_list.first_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={adminInput.middle_name} name="middle_name" className="form-control" id="inputMiddleName" placeholder="Enter admin middle name" />
                            <label htmlFor="inputMiddleName"> Middle Name</label>
                            <span className="text-danger">{adminInput.error_list.middle_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={adminInput.last_name} name="last_name" className="form-control" id="inputLastName" placeholder="Enter admin last name" />
                            <label htmlFor="inputLastName"> Last Name</label>
                            <span className="text-danger">{adminInput.error_list.last_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="email" onChange={handleInput} value={adminInput.email} name="email" className="form-control" id="inputEmail" placeholder="Enter admin email" />
                            <label htmlFor="inputEmail"> Email</label>
                            <span className="text-danger">{adminInput.error_list.email}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type={check=="off"?"text":"password"} onChange={handleInput} value={adminInput.password} name="password" className="form-control" id="inputPassword" placeholder="Enter admin password" />
                            <label htmlFor="inputPassword"> Password</label>
                            <div className="form-check mt-1">
                                <input className="form-check-input" type="checkbox" defaultChecked={false} id="show-password" name="showPassword" onChange={handleCheck}/>
                                <label className="form-check-label" htmlFor="show-password">
                                    Show Password
                                </label>
                            </div>
                            <span className="text-danger">{adminInput.error_list.password}</span>
                        </div>

                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Add Admin</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddAdmin;