import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import {Contact,Delete,Update} from '../Shared/ProfileFunctions'

const Profile=()=>{
    const history=useHistory();
    let selectList=[];
    let ex = /all|All/;
    
    const [studentInput,setStudent]=useState({});
    const [years,setYears]=useState([]);
    const [id,setId]=useState();
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    const [openUpdate,setOpenUpdate]=useState(false);
    const [openDelete,setOpenDelete]=useState(false);
    const [openContact,setOpenContact]=useState(true);

    const [userBorder,setUserBorder]=useState("col-md-3 d-flex justify-content-center align-items-center rounded border border-dark bg-light mt-1 p-1")
   
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
            groups=(<option  className="text-dark" value="">"None"</option>)
        }
        return groups;
    }
    
    const openUpdateFun=()=>{
        setOpenUpdate(true);
        setUserBorder("col-md-3 d-flex justify-content-center align-items-center rounded border border-primary bg-light mt-1 p-1")
        setOpenContact(false);
        setOpenDelete(false);
    }

    const openContactFun=()=>{
        setOpenContact(true);
        setUserBorder("col-md-3 d-flex justify-content-center align-items-center rounded border border-dark bg-light mt-1 p-1")
        setOpenUpdate(false);
        setOpenDelete(false);
    }

    const openDeleteFun=()=>{
        setOpenDelete(true);
        setUserBorder("col-md-3 d-flex justify-content-center align-items-center rounded border border-danger bg-light mt-1 p-1")
        setOpenUpdate(false);
        setOpenContact(false);
    }

    useEffect(()=>{
        let flag=0;
        (async() => {
            const res = await axios.get('/api/authenticated_student');
            await setId(res.data.id);

            await axios.get(`/api/view_student/${res.data.id}`).then(res=>{
                if(res.data.status===200)
                {
                    setStudent(res.data.student);
                    flag++;
                }
            }).then(
                await axios.get(`/api/view_years`).then(res=>{
                    if(res.data.status===200)
                    {
                        setYears(res.data.years);
                        flag++;
                    }
                })
            )

            if(flag==2)
            {
                setLoading(false);
            }
            else
            {
                setError(true);
            }
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
        <div className="container px-4 py-3">
            <div className="my-3">
                <i className="fa fa-user-edit d-md-none fa-2x text-primary"></i> <span className="h1 d-none d-md-inline">Profile </span> 
            </div>

            <div className="row mt-4">
                <div className={userBorder}>
                    <i className="fa fa-user-circle fa-6x text-dark"></i>
                </div>

                <ul className="list-group col-md-9 p-0 p-md-1 my-1 my-md-0">
                    <li className="list-group-item"><span className="fw-bold text-dark">Full Name :</span> {studentInput.first_name} {studentInput.middle_name} {studentInput.last_name}</li>
                    <li className="list-group-item border-top-0"><span className="fw-bold text-dark">Email :</span> {studentInput.email}</li>
                    <li className="list-group-item border-top-0"><span className="fw-bold text-dark">Year :</span> {studentInput.group.year.name}</li>
                    <li className="list-group-item border-top-0" ><span className="fw-bold text-dark">Group :</span> {studentInput.group.name}</li>
                    <li className="list-group-item border-top-0 d-flex justify-content-center flex-wrap d-md-block">
                        <button onClick={openUpdateFun} type="button" className="btn btn-sm btn-outline-primary m-1">Update Account</button>
                        <button onClick={openDeleteFun} type="button" className="btn btn-sm  btn-outline-danger m-1">Delete Account</button>
                        <button onClick={openContactFun} type="button" className="btn btn-sm btn-outline-dark m-1">Contact Admins</button>
                    </li>
                </ul>
            </div>

            <div className="row">
                {
                    openUpdate?
                    <Update id={id} selectList={selectList} data={studentInput} role="Student"/>:
                    openContact?
                    <Contact inURL="student"/>:
                    openDelete?
                    <Delete id={id} role="Student"/>:null
                }
            </div>
        </div>
    )
}

export default Profile;