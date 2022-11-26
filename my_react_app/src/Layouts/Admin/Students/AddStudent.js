import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const AddStudent =()=>{
    let history=useHistory();
    let ex = /all|All/
    let selectList=[];
    const [years,setYears]=useState([]);
    const [studentInput,setStudent]=useState({
        first_name:"",
        middle_name:"",
        last_name:"",
        email:"",
        password:"",
        group_id:"",
        error_list:[]
    });
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [check,setCheck]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setStudent({...studentInput,[e.target.name]:e.target.value});
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

    const studentSubmit=(e)=>{
        e.preventDefault();

        const data={
            "first_name":studentInput.first_name,
            "middle_name":studentInput.middle_name,
            "last_name":studentInput.last_name,
            "email":studentInput.email,
            "password":studentInput.password,
            "group_id":studentInput.group_id,
        }
        
        axios.post('/api/add_student',data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setStudent({ 
                    ...studentInput,   
                    first_name:"",
                    middle_name:"",
                    last_name:"",
                    email:"",
                    password:"",
                    error_list:[]
                })
            }
            else if(res.data.status===400)
            {
                swal("Error",res.data.unique_error,"error");
            }
            else
            {
                setStudent({...studentInput,error_list:res.data.validation_errors});
            }
        });
    };

    const giveMeGroups=(year)=>{
        let groups;
        if(year.groups.length>0)
        {
            groups=year.groups.map((group,idx)=>{
                if(!ex.test(group.name)) //ex = /all|All/
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
            groups=(<option  className="text-dark" value="">None</option>)
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
            <div className="container px-4 py-4 text-primary">
                <span className="h1 my-4">Add Student </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
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
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Add Student</h1>
            <i className="my-4 fa fa-plus fa-3x d-md-none text-primary"></i> 

            <form onSubmit={studentSubmit} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_students" role="button"><i className="fa fa-chevron-left"></i></Link>
                
                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={studentInput.first_name} name="first_name" className="form-control" id="inputFirstName" placeholder="Enter student first name" />
                            <label htmlFor="inputFirstName"> First Name</label>
                            <span className="text-danger">{studentInput.error_list.first_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={studentInput.middle_name} name="middle_name" className="form-control" id="inputMiddleName" placeholder="Enter student middle name" />
                            <label htmlFor="inputMiddleName"> Middle Name</label>
                            <span className="text-danger">{studentInput.error_list.middle_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={studentInput.last_name} name="last_name" className="form-control" id="inputLastName" placeholder="Enter student last name" />
                            <label htmlFor="inputLastName"> Last Name</label>
                            <span className="text-danger">{studentInput.error_list.last_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="email" onChange={handleInput} value={studentInput.email} name="email" className="form-control" id="inputEmail" placeholder="Enter student email" />
                            <label htmlFor="inputEmail"> Email</label>
                            <span className="text-danger">{studentInput.error_list.email}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type={check=="off"?"text":"password"} onChange={handleInput} value={studentInput.password} name="password" className="form-control" id="inputPassword" placeholder="Enter student password" />
                            <label htmlFor="inputPassword"> Password</label>
                            <div className="form-check mt-1">
                                <input className="form-check-input" type="checkbox" defaultChecked={false} id="show-password" name="showPassword" onChange={handleCheck}/>
                                <label className="form-check-label" htmlFor="show-password">
                                    Show Password
                                </label>
                            </div>
                            <span className="text-danger">{studentInput.error_list.password}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <select name="group_id" onChange={handleInput} defaultValue={studentInput.group_id} className="form-select py-3 mt-3" aria-label="Default select example">
                                <option value="" className="d-none">Select Year/Department/Group</option>
                                {selectList}
                            </select>
                            <span className="text-danger">{studentInput.error_list.group_id}</span>
                        </div>

                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Add Student</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddStudent;