import React,{useState,useEffect} from 'react';
import {useHistory,Link} from 'react-router-dom';
import Navbar from '../../Components/Wellcome/Navbar';
import axios from 'axios';
import swal from 'sweetalert';

const Register=()=>{

    let selectList=[];
    let history=useHistory();
    let ex = /all|All/;

    if(localStorage.getItem('auth_token'))
    {
       history.goForward();
    }

    const [years,setYears]=useState([]);
    const [registerInput,setRegister]=useState({
        firstName:'',
        middleName:'',
        lastName:'',
        email:'',
        password:'',
        group_id:'',
        error_list:[]
    });
    const [check,setCheck]=useState(false);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setRegister({...registerInput,[e.target.name]:e.target.value})
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

    const registerSubmit=(e)=>{
        e.preventDefault();

        const data={
            "first_name":registerInput.firstName,
            "middle_name":registerInput.middleName,
            "last_name":registerInput.lastName,
            "email":registerInput.email,
            "password":registerInput.password,
            "group_id":registerInput.group_id,
        }
     
        axios.get('/sanctum/csrf-cookie').then(res=>{  
            axios.post('/api/register',data).then(res=>{
                if(res.data.status===201)
                {
                    localStorage.setItem('auth_token',res.data.token);
                    localStorage.setItem('auth_name',res.data.student_name);
                    localStorage.setItem('auth_role',res.data.role);
                    swal("Success",res.data.message,"success");
                    history.push('/student');
                }
                else
                {
                    setRegister({...registerInput,error_list:res.data.validation_errors});
                }
            });
        });
    };

    const giveMeGroups=(year)=>{
        let groups;
        if(year.groups.length>0)
        {
            groups=year.groups.map((group,idx)=>{

                if(!ex.test(group.name))
                {
                    return(
                        <option  key={idx} className=" bg-light m-1 text-dark" value={group.id}>
                            {group.name}
                        </option>
                    )
                }
            })
        }
        else
        {
            groups=(<option  className="text-dark" value="">"None"</option>)
        }

        return groups;
    }

    useEffect(()=>{
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
        });
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
            <nav className="border border-primary border-5 border-top-0 border-bottom-0 border-end-0 navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">CompaStudent <span className="fs-6 text-primary">Loading</span></Link>
                   
                    <div className="clearfix me-4 py-1">
                        <div className="spinner-border float-end text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
    else
    {
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

    return(
        <div>
            <Navbar/>
            <div className="container">
                <div className="shadow-lg rounded-lg mt-5 col-md-5 mx-auto p-3 bg-light">    
                    <h2 style={{letterSpacing:"4px"}} className="text-center font-weight-light mt-3 mb-4">Register</h2>  
                    <form onSubmit={registerSubmit}>
                        <div className="row">
                            <div className="col-lg-4 mb-2">
                                <div className="form-floating">
                                    <input name="firstName" onChange={handleInput} defaultValue={registerInput.firstName} className="form-control" id="inputFirstName" type="text" placeholder="Enter your first name" />
                                    <label htmlFor="inputFirstName" className="d-lg-none">First name</label>
                                    <label htmlFor="inputFirstName" className="d-none d-lg-inline">F-name</label>
                                    <span className="text-danger">{registerInput.error_list.first_name}</span>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-2">
                                <div className="form-floating">
                                    <input name="middleName" onChange={handleInput} defaultValue={registerInput.middleName} className="form-control" id="inputMiddleName" type="text" placeholder="Enter your middle name" />
                                    <label htmlFor="inputFirstName" className="d-lg-none">Middle name</label>
                                    <label htmlFor="inputFirstName" className="d-none d-lg-inline">Mid-name</label>
                                    <span className="text-danger">{registerInput.error_list.middle_name}</span>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-2">
                                <div className="form-floating">
                                    <input name="lastName" onChange={handleInput} defaultValue={registerInput.lastName}  className="form-control" id="inputLastName" type="text" placeholder="Enter your last name" />
                                    <label htmlFor="inputFirstName" className="d-lg-none">Last name</label>
                                    <label htmlFor="inputFirstName" className="d-none d-lg-inline">L-name</label>
                                    <span className="text-danger">{registerInput.error_list.last_name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-floating mb-2">
                            <input name="email" onChange={handleInput} defaultValue={registerInput.email}  className="form-control" id="inputEmail" type="email" placeholder="Enter your email" />
                            <label htmlFor="inputEmail">Email address</label>
                            <span className="text-danger">{registerInput.error_list.email}</span>
                        </div>

                        <div className=" mb-2">
                            <select name="group_id" onChange={handleInput} defaultValue={registerInput.group_id} className="form-select py-3" aria-label="Default select example">
                                <option value="" className="d-none">Select Year/Department/Group</option>
                                {selectList}
                            </select>
                            <span className="text-danger">{registerInput.error_list.group_id}</span>
                        </div>

                        <div className="form-floating mb-4">
                            <input type={check=="off"?"text":"password"} name="password" onChange={handleInput} defaultValue={registerInput.password} className="form-control" id="inputPassword" placeholder="Enter your password" />
                            <label htmlFor="inputPassword">Password</label>
                            <div className="form-check mt-1">
                                <input className="form-check-input" type="checkbox" defaultChecked={false} id="show-password" name="showPassword" onChange={handleCheck}/>
                                <label className="form-check-label" htmlFor="show-password">
                                    Show Password
                                </label>
                            </div>
                            <span className="text-danger">{registerInput.error_list.password}</span>
                        </div>

                        <div className="row mb-2">
                            <div className="d-grid">
                                <button className="btn btn-primary btn-block py-3">Register</button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-start">     
                            <Link className="me-1" to="/login">Have You A Student Account ?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;