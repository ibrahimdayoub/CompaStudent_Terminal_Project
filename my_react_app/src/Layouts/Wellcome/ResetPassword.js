import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import Navbar from '../../Components/Wellcome/Navbar'
import axios from 'axios';
import swal from 'sweetalert'

const ResetPassword=(props)=>{
    const history=useHistory();

    if(localStorage.getItem('auth_token'))
    {history.goForward();}
    
    const [resetInput,setReset]=useState({
        password:"",
        password_confirm:"",
        error_list:[]
    });
    const [checkOne,setCheckOne]=useState(false);
    const [checkTwo,setCheckTwo]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setReset({...resetInput,[e.target.name]:e.target.value});
    };

    const handleCheckOne=(e)=>{
        e.persist();
        if(e.target.value=="on")
        {
            e.target.value="off"
        }
        else if(e.target.value=="off")
        {
            e.target.value="on"
        }
        setCheckOne(e.target.value);
    }

    const handleCheckTwo=(e)=>{
        e.persist();
        if(e.target.value=="on")
        {
            e.target.value="off"
        }
        else if(e.target.value=="off")
        {
            e.target.value="on"
        }
        setCheckTwo(e.target.value);
    }

    const resetSubmit=(e)=>{
        e.preventDefault();
        const data={
            "password":resetInput.password,
            "password_confirm":resetInput.password_confirm,
            "token":props.match.params.id
        }

        axios.get('/sanctum/csrf-cookie').then(res=>{  
            axios.post('/api/reset',data).then(res=>{
                if(res.data.status===200)
                {     
                    swal("Success",res.data.message,"success");
                    history.push('/login');
                }
                else if(res.data.status===401 || res.data.status===404)
                {
                    swal("Error",res.data.message,"error");
                    setReset({
                        password:"",
                        password_confirm:"",
                        error_list:[]
                    });
                }
                else
                {
                    setReset({...resetInput,error_list:res.data.validation_errors});
                }
            });
        });
    };

    return(
        <div>
            <Navbar/>
            <div className="container">
                <div className="shadow-lg rounded-lg mt-5 mx-auto col-md-5 p-3 bg-light">
                    <h2 style={{letterSpacing:"4px"}} className="text-center font-weight-light mt-3 mb-4">Reset Password</h2>
                    <form onSubmit={resetSubmit}>
                        <div className="form-floating mb-2">
                            <input type={checkOne=="off"?"text":"password"} value={resetInput.password} onChange={handleInput} name="password" className="form-control" id="inputPassword" placeholder="Enter your password" />
                            <label htmlFor="inputPassword">Password</label>
                            <div className="form-check mt-1">
                                <input className="form-check-input" type="checkbox" defaultChecked={false} id="show-password" name="showPassword" onChange={handleCheckOne}/>
                                <label className="form-check-label" htmlFor="show-password">
                                    Show Password
                                </label>
                            </div>
                            <span className="text-danger">{resetInput.error_list.password}</span>
                        </div>

                        <div className="form-floating mb-4">
                            <input type={checkTwo=="off"?"text":"password"} value={resetInput.password_confirm} onChange={handleInput} name="password_confirm" className="form-control" id="inputPasswordConfirm" placeholder="Enter your password confirm" />
                            <label htmlFor="inputPasswordConfirm">Password Confirm</label>
                            <div className="form-check mt-1">
                                <input className="form-check-input" type="checkbox" defaultChecked={false} id="show-password" name="showPassword" onChange={handleCheckTwo}/>
                                <label className="form-check-label" htmlFor="show-password">
                                    Show Password Confirm
                                </label>
                            </div>
                            <span className="text-danger">{resetInput.error_list.password_confirm}</span>
                        </div>

                        <div className="row mb-2">
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-block py-3">Submit</button>
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

export default ResetPassword;