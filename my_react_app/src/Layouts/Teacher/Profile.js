import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import {Contact,Update} from '../Shared/ProfileFunctions'

const Profile=()=>{
    const history=useHistory();

    const [teacherInput,setTeacher]=useState({});
    const [years,setYears]=useState([]);
    const [id,setId]=useState();
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    const [openUpdate,setOpenUpdate]=useState(false);
    const [openContact,setOpenContact]=useState(true);

    const [userBorder,setUserBorder]=useState("col-md-3 d-flex justify-content-center align-items-center rounded border border-dark bg-light mt-1 p-1")

    const openUpdateFun=()=>{
        setOpenUpdate(true);
        setUserBorder("col-md-3 d-flex justify-content-center align-items-center rounded border border-primary bg-light mt-1 p-1")
        setOpenContact(false);
    }

    const openContactFun=()=>{
        setOpenContact(true);
        setUserBorder("col-md-3 d-flex justify-content-center align-items-center rounded border border-dark bg-light mt-1 p-1")
        setOpenUpdate(false);
    }

    useEffect(()=>{
        (async() => {
            const res = await axios.get('/api/authenticated_teacher');
            await setId(res.data.id);

            await axios.get(`/api/view_teacher/${res.data.id}`).then(res=>{
                if(res.data.status===200)
                {
                    setTeacher(res.data.teacher);
                    setLoading(false)
                }
                else
                {
                    setError(true);
                }
            })
            
        })()
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
            <div className="container px-4 py-3 text-primary">
                <div className="my-3 d-inline-block me-3">
                    <span className="h1">Profile </span> 
                </div>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return(
        <div className="container px-4 py-3">
            <div className="my-3">
                <i className="fa fa-user-edit d-md-none fa-2x text-primary"></i> <span className="h1 d-none d-md-inline">Profile </span> 
            </div>

            <div className="row mt-4 ">
                <div className={userBorder}>
                    <i className="fa fa-user-circle fa-6x text-dark"></i>
                </div>

                <ul className="list-group col-md-9 p-0 p-md-1 my-1 my-md-0">
                    <li className="list-group-item"><span className="fw-bold text-dark">Full Name :</span> {teacherInput.first_name} {teacherInput.middle_name} {teacherInput.last_name}</li>
                    <li className="list-group-item border-top-0"><span className="fw-bold text-dark">Email :</span> {teacherInput.email}</li>
                    <li className="list-group-item border-top-0 d-flex justify-content-center flex-wrap d-md-block">
                        <button onClick={openUpdateFun} type="button" className="btn btn-sm btn-outline-primary m-1">Update Account</button>
                        <button onClick={openContactFun} type="button" className="btn btn-sm btn-outline-dark m-1">Contact Admins</button>
                    </li>
                </ul>
            </div>

            <div className="row">
                {
                    openUpdate?
                    <Update id={id} data={teacherInput} role="Teacher"/>:
                    openContact?
                    <Contact inURL="teacher" />:null
                }
            </div>
        </div>
    )
}

export default Profile;
