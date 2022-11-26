import React,{useState} from 'react';
import {useHistory,Link} from 'react-router-dom';
import Navbar from '../../Components/Wellcome/Navbar'
import axios from 'axios';
import swal from 'sweetalert'

const ForgotPassword=()=>{
    const history=useHistory();

    if(localStorage.getItem('auth_token'))
    {history.goForward()}
    
    const [forgotInput,setForgot]=useState({
        email:"",
        error_list:[]
    });

    const handleInput=(e)=>{
        e.persist();
        setForgot({...forgotInput,[e.target.name]:e.target.value});
    };

    const forgotSubmit=(e)=>{
        e.preventDefault();

        const data={
            "email":forgotInput.email,
        }

        axios.get('/sanctum/csrf-cookie').then(res=>{  
            axios.post('/api/forgot',data).then(res=>{
                if(res.data.status===200)
                {     
                    swal("Success",res.data.message,"success");
                    setForgot({
                        email:"",
                        error_list:[]
                    });
                }
                else if(res.data.status===404 || res.data.status===400)
                {
                    swal("Error",res.data.message,"error");
                    setForgot({
                        email:"",
                        error_list:[]
                    });
                }
                else
                {
                    setForgot({...forgotInput,error_list:res.data.validation_errors});
                }
            });
        });
    };

    return(
        <div>
            <Navbar/>
            <div className="container">
                <div className="shadow-lg rounded-lg mt-5 mx-auto col-md-5 p-3 bg-light">   
                    <h2 style={{letterSpacing:"4px"}} className="text-center font-weight-light mt-3 mb-4">Send Link</h2>
                    <form onSubmit={forgotSubmit}>
                        <div className="form-floating mb-2">
                            <input name="email" value={forgotInput.email} onChange={handleInput} className="form-control" id="inputEmail" type="email" placeholder="Enter your email" />
                            <label htmlFor="inputEmail">Email address</label>
                            <span className="text-danger">{forgotInput.error_list.email}</span>
                        </div>

                        <div className="row mb-2">
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-block py-3">Send Reset Link</button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-start">     
                            <Link className="me-1" to="/login">Login !</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;