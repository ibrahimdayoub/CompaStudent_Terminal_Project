import React,{useState} from 'react';
import {useHistory,Link} from 'react-router-dom';
import Navbar from '../../Components/Wellcome/Navbar'
import axios from 'axios';
import swal from 'sweetalert'

const Login=()=>{
    const history=useHistory();

    if(localStorage.getItem('auth_token'))
    {history.goForward();}
    
    const [loginInput,setLogin]=useState({
        email:"",
        password:"",
        error_list:[]
    });
    const [check,setCheck]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setLogin({...loginInput,[e.target.name]:e.target.value});
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

    const loginSubmit=(e)=>{
        e.preventDefault();

        const data={
            "email":loginInput.email,
            "password":loginInput.password,
        }

        axios.get('/sanctum/csrf-cookie').then(res=>{  
            axios.post('/api/login',data).then(res=>{
                if(res.data.status===200)
                {
                    localStorage.setItem('auth_token',res.data.token);
                    localStorage.setItem('auth_name',res.data.name);
                    localStorage.setItem('auth_role',res.data.role);
                    swal("Success",res.data.message,"success");
                    if(res.data.role==="Admin")
                    {
                        history.push('/admin');
                    }
                    else if(res.data.role==="Teacher")
                    {
                        history.push('/teacher');
                    }
                    else if(res.data.role==="Student")
                    {
                        history.push('/student');
                    }
                    else
                    {
                        history.push('/');
                    }
                }
                else if(res.data.status===401)
                {
                    swal("Error",res.data.message,"error")
                }
                else
                {
                    setLogin({...loginInput,error_list:res.data.validation_errors});
                }
            });
        });
    };

    return(
        <div>
            <Navbar/>
            <div className="container">
                <div className="shadow-lg rounded-lg mt-5 mx-auto col-md-5 p-3 bg-light">   
                    <h2 style={{letterSpacing:"4px"}} className="text-center mt-3 mb-4">Login</h2>
                    <form onSubmit={loginSubmit}>
                        <div className="form-floating mb-2">
                            <input name="email" defaultValue={loginInput.email} onChange={handleInput} className="form-control" id="inputEmail" type="email" placeholder="Enter your email" />
                            <label htmlFor="inputEmail">Email address</label>
                            <span className="text-danger">{loginInput.error_list.email}</span>
                        </div>

                        <div className="form-floating mb-4">
                            <input type={check=="off"?"text":"password"} defaultValue={loginInput.password} onChange={handleInput} className="form-control" id="inputPassword"  name="password" placeholder="Enter your password" />
                            <label htmlFor="inputPassword">Password</label>
                            <div className="form-check mt-1">
                                <input className="form-check-input" type="checkbox" defaultChecked={false} id="show-password" name="showPassword" onChange={handleCheck}/>
                                <label className="form-check-label" htmlFor="show-password">
                                    Show Password
                                </label>
                            </div>
                            <span className="text-danger">{loginInput.error_list.password}</span>
                        </div>

                        <div className="row mb-2">
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-block py-3">Login</button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between">     
                            <Link className="me-1" to="/register">Register As Student !</Link>
                            <Link className="ms-1" to="/forgot">Forgot Password ?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;