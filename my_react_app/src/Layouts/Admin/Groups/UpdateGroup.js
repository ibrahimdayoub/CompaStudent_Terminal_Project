import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const UpdateGroup =(props)=>{

    let id=props.match.params.id;
    const history=useHistory();

    const [years,setYears]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [groupInput,setGroup]=useState({});
    const [errorList,setErrorList]=useState({});

    const handleInput=(e)=>{
        e.persist();
        setGroup({...groupInput,[e.target.name]:e.target.value});
    };

    const groupUpdate=(e)=>{
        e.preventDefault();

        const data={
            "name":groupInput.name,
            "order":groupInput.order,
            "year_id":groupInput.year_id,
            "capacity":groupInput.capacity,
            "description":groupInput.description,
        }

        axios.put(`/api/update_group/${id}`,data).then(res=>{
            if(res.data.status===200)
            {   
                swal("Success",res.data.message,"success");
                history.push('/admin/view_groups');
            }
            else  if(res.data.status===404)
            {
                swal("Error",res.data.message,"error");
                history.push('/admin/view_groups');
            }
            else if(res.data.status===400)
            {
                swal("Error",res.data.unique_error,"error");
                setGroup({
                    name:"",
                    order:"",
                    year_id:"",
                    capacity:"",
                    description:"",
                    error_list:[]
                })
            }
            else
            {
                setErrorList(res.data.validation_errors);
            } 
        });
    };

    let selectYear=years.map((year,idx)=>{
        return(
            <option key={idx} value={year.id}>{year.name}</option>
        )
    })

    useEffect(()=>{
        let flag=0;
        (async () => {
            await axios.get(`/api/view_group/${id}`).then(res=>{
                if(res.data.status===200)
                {
                    setGroup(res.data.group);
                    flag++;
                }
                else if(res.data.status===404){ 
                    swal("Error",res.data.message,"error");
                    history.push('/admin/view_groups');
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
        })();

    },[props.match.params.id,history]);

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
                <span className="h1 my-4">Update Group </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Update Group</h1>
            <i className="fa fa-edit fa-3x d-md-none my-4 text-primary"></i>

            <form onSubmit={groupUpdate} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_groups" role="button"><i className="fa fa-chevron-left"></i></Link>
               
                <div className="border bg-light">
                    <div className="card-body border pt-5">   
                        <div className="form-floating mb-3 offset-md-1 col-md-10 text-center">
                            <p className="fs-6">
                                Enter Full Name Of Group And Select The Year That May Contains Many Of Groups.
                                <br/>
                                <strong className="text-primary"> Ex1 : </strong>First Group.
                            </p>
                        </div>
                            
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={groupInput.name} name="name" className="form-control" id="inputName" placeholder="Enter group name" />
                            <label htmlFor="inputName">Group Name</label>
                            <span className="text-danger">{errorList.name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={groupInput.capacity} type="number" min={0} name="capacity" className="form-control" id="inputCapacity" placeholder="Enter group capacity" />
                            <label htmlFor="inputCapacity">Group Capacity</label>
                            <span className="text-danger">{errorList.capacity}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <select onChange={handleInput} value={groupInput.year_id} name="year_id" className="form-select form-select-md py-3" aria-label=".form-select-lg example">
                                <option value="">Select Year</option>
                                {selectYear}
                            </select>
                            <span className="text-danger">{errorList.year_id}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="number" onChange={handleInput} value={groupInput.order} min={0} name="order" className="form-control" id="inputOrder" placeholder="Enter order show" />
                            <label htmlFor="inputCapacity">Order Show In Year For Downloads</label>
                            <span className="text-danger">{errorList.order}</span>
                        </div>


                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <textarea onChange={handleInput}  value={groupInput.description===null?"No Thing":groupInput.description} name="description" className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: "180px"}}></textarea>
                            <label htmlFor="floatingTextarea2">Description</label>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Update Group</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdateGroup;