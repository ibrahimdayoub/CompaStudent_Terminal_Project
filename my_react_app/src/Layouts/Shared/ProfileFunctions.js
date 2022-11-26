import React,{useState,useEffect} from 'react';
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

export const Contact=(props)=>{

    let [contactInput,setContact]=useState({
        title:"",
        message:"",
        error_list:[]
    });

    const handleInputContact=(e)=>{
        e.persist();
        setContact({...contactInput,[e.target.name]:e.target.value});
    };

    const contactAdmins=(e)=>{
        e.preventDefault();
        const data={
            "title":contactInput.title,
            "message":contactInput.message,
        }

        axios.post('/api/add_admin_notification',data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setContact({
                    title:"",
                    message:"",
                    error_list:[]
                })
            }
            else
            {
                setContact({...contactInput,error_list:res.data.validation_errors});
            }
        });
    };

    return (
        <div className="container p-0 offset-md-3 col-md-9">
            <form onSubmit={contactAdmins}>

                <div className="px-2 py-4 border border-dark rounded bg-light">
                    <p className="mb-3">
                        <span className="text-dark fw-bold d-block"><i className="fa fa-bullhorn text-dark me-1"></i> Contact Now : </span> 
                        <br/>
                        <span className="text-dark fw-bold">-</span> Send Your Message To Admins, You Can Send Any Thing And Do Not Forget The Title.
                    </p>
                    <div className="form-floating mb-3">
                        <input onChange={handleInputContact} value={contactInput.title} name="title" className="form-control" id="inputFirstName" placeholder="Enter title" />
                        <label htmlFor="inputFirstName"> Title</label>
                        <span className="text-danger">{contactInput.error_list.title}</span>
                    </div>
                    <div className="form-floating mb-3">
                        <input onChange={handleInputContact} value={contactInput.message} name="message" className="form-control" id="inputMiddleName" placeholder="Enter messsage" />
                        <label htmlFor="inputMiddleName"> Message</label>
                        <span className="text-danger">{contactInput.error_list.message}</span>
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="d-flex justify-content-between flex-wrap flex-sm-nowrap">
                        <button type="submit" className="btn btn-dark py-2 col-12 col-sm-6" style={{margin:"1px"}}>Conact Now</button>
                        <Link className="btn btn-dark py-2 col-12 col-sm-6" to={`/${props.inURL}/contact_record`} style={{margin:"1px"}}>Conact Record</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}//2 Times Used

export const Delete=(props)=>{
    const confirmFrontEnd="I Want To Delete My Account";
    const history=useHistory();

    const [confirm,setConfirm]=useState("");
    const [errorConfirm,setErrorConfirm]=useState("");

    const accountDelete=()=>{

        if(confirm===confirmFrontEnd)
        { 
            let url="";
            if(props.role=="Student")
            {
                url="/api/delete_student/"+props.id;
            }
            else if(props.role=="Teacher")
            {
                url="/api/delete_teacher/"+props.id;
            }
            else if(props.role=="Admin")
            {
                url="/api/delete_admin/"+props.id;
            }

            axios.delete(`${url}`).then(res=>{
                if(res.data.status===202)
                {     
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_name');
                    localStorage.removeItem('auth_role');

                    history.push('/');
                    swal("Success",res.data.message,"success");
    
                    setTimeout(() => {
                        history.go(0);
                    }, 1500);
                }
                else{
                    swal("Error",res.data.message,"error");
                }
            });
        }
        else
        {
            setErrorConfirm("Please Confirm This");
        }
    }
    
    return(
        <div className="container p-0 offset-md-3 col-md-9">
            <div>
                <div className="px-2 py-4 border border-danger rounded bg-light">
                    <p className="mb-3">
                        <span className="text-danger fw-bold d-block"><i className="fa fa-exclamation-triangle text-danger me-1"></i> Warning : </span> 
                        <br/>
                        <span className="text-danger fw-bold">-</span> If Delete Your Account, You Will Lose Your Role In The System And Your Informations. 
                        <br/>
                        <span className="text-danger fw-bold">-</span> If You Like You Can Logged Out For Some Time, Type This To Confirm <span className="text-danger fw-bold border px-1">{confirmFrontEnd}</span>.
                    </p>

                    <div className="form-floating mb-3">
                        <input onChange={(e)=>{setConfirm(e.target.value); setErrorConfirm("")}} className="form-control"  placeholder="Enter pass confirm" />
                        <label htmlFor="inputLastName"> Confirm</label>
                        <span className="text-danger">{errorConfirm}</span>
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="d-grid">
                        <button onClick={accountDelete} type="button" className="btn btn-danger btn-block py-2 ">Delete Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}//2 Times Used

export const Update=(props)=>{
    const history=useHistory();

    const [dataInput,setData]=useState(props.data);
    const [checkPassword,setCheckPassword]=useState(false);
    const [errorList,setErrorList]=useState({});
    const [isChecked,setChecked]=useState("1");

    const handleInput=(e)=>{
        e.persist();
        setData({...dataInput,[e.target.name]:e.target.value});
    };

    const handleCheckPassword=(e)=>{
        e.persist();
        if(e.target.value=="on"){e.target.value="off";}
        else if(e.target.value=="off"){e.target.value="on";}
        setCheckPassword(e.target.value);
    }

    const handleCheck=(e)=>{
        setChecked(e.target.value==="1"?"0":"1");
    }

    const accountUpdate=(e)=>{
        e.preventDefault();
        let data={};
        let url="";

        if(props.role=="Student")
        {
            data={
                "first_name":dataInput.first_name,
                "middle_name":dataInput.middle_name,
                "last_name":dataInput.last_name,
                "email":dataInput.email,
                "password":dataInput.password,
                "group_id":dataInput.group_id,
            }
            url="/api/update_student/"+props.id;
        }
        else if(props.role=="Teacher")
        {
            data={
                "first_name":dataInput.first_name,
                "middle_name":dataInput.middle_name,
                "last_name":dataInput.last_name,
                "email":dataInput.email,
                "password":dataInput.password,
            }
            url="/api/update_teacher/"+props.id;
        }
        else if(props.role=="Admin")
        {
            data={
                "first_name":dataInput.first_name,
                "middle_name":dataInput.middle_name,
                "last_name":dataInput.last_name,
                "email":dataInput.email,
                "password":dataInput.password,
            }
            url="/api/update_admin/"+props.id;
        }

        if(isChecked==="0" )
        {
            data.password="useOldPassword";
        }

        axios.put(`${url}`,data).then(res=>{
            if(res.data.status===200)
            {   
                swal("Success",res.data.message,"success");
                setTimeout(() => {
                    history.go(0);  
                }, 1500);
            }
            else  if(res.data.status===404)
            {
                swal("Error",res.data.message,"error");
            }
            else
            {
                setErrorList(res.data.validation_errors);
            } 
        });
    };

    return(
        <div className="container p-0 offset-md-3 col-md-9">
            <form onSubmit={accountUpdate}>

                <div className="px-2 py-4 border border-primary rounded bg-light">

                    <div className="form-check mb-3 ">
                        <input onChange={handleCheck} value={isChecked}  className="form-check-input" type="checkbox" id="reset_password" defaultChecked/>
                        <label htmlFor="reset_password" className={isChecked==="0"?"text-dark form-check-label":"text-primary form-check-label"}>
                            I Would Reset My Password <span className="text-secondary" style={{fontSize:"10px"}}> (Password Is Hashed, Can't Show It) </span>
                        </label>
                    </div>

                    {
                        isChecked=="1"?
                        <div className="form-floating mb-3">
                            <input type={checkPassword=="off"?"text":"password"} onChange={handleInput} value={dataInput.password} name="password" className="form-control" id="inputPassword" placeholder="Enter student password" />
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
                    
                    <div className="form-floating my-3">
                        <input onChange={handleInput} value={dataInput.first_name} name="first_name" className="form-control" id="inputFirstName" placeholder="Enter student first name" />
                        <label htmlFor="inputFirstName"> First Name</label>
                        <span className="text-danger">{errorList.first_name}</span>
                    </div>

                    <div className="form-floating mb-3">
                        <input onChange={handleInput} value={dataInput.middle_name} name="middle_name" className="form-control" id="inputMiddleName" placeholder="Enter student middle name" />
                        <label htmlFor="inputMiddleName"> Middle Name</label>
                        <span className="text-danger">{errorList.middle_name}</span>
                    </div>

                    <div className="form-floating mb-3">
                        <input onChange={handleInput} value={dataInput.last_name} name="last_name" className="form-control" id="inputLastName" placeholder="Enter student last name" />
                        <label htmlFor="inputLastName"> Last Name</label>
                        <span className="text-danger">{errorList.last_name}</span>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="email" onChange={handleInput} value={dataInput.email} name="email" className="form-control" id="inputEmail" placeholder="Enter student email" />
                        <label htmlFor="inputEmail"> Email</label>
                        <span className="text-danger">{errorList.email}</span>
                    </div>

                    {
                        props.role=="Student"?
                        <select name="group_id" onChange={handleInput} defaultValue={dataInput.group_id} className="form-select py-3 mt-3" aria-label="Default select example">
                            <option value="" className="d-none">Select Year/Department/Group</option>
                            {props.selectList}
                        </select>:null
                    }

                    <span className="text-danger">{errorList.group_id}</span>
                </div>
                <div className="row mt-2">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-2 ">Update Now</button>
                    </div>
                </div>
            </form>
        </div>
    )
}//3 Times Used