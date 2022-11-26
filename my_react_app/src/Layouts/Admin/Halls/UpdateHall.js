import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const UpdateHall =(props)=>{

    let id=props.match.params.id;
    const history=useHistory();

    const [hallInput,setHall]=useState({});
    const [errorList,setErrorList]=useState({});
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setHall({...hallInput,[e.target.name]:e.target.value});
    };

    const hallUpdate=(e)=>{
        e.preventDefault();

        const data={
            "name":hallInput.name,
            "floor":hallInput.floor,
            "build":hallInput.build,
            "capacity":hallInput.capacity,
            "description":hallInput.description,
        }

        axios.put(`/api/update_hall/${id}`,data).then(res=>{
            if(res.data.status===200)
            {   
                swal("Success",res.data.message,"success");
                history.push('/admin/view_halls');
            }
            else  if(res.data.status===404)
            {
                swal("Error",res.data.message,"error");
                history.push('/admin/view_halls');
            }
            else
            {
                setErrorList(res.data.validation_errors);
            } 
        });
    };

    useEffect(()=>{
        axios.get(`/api/view_hall/${id}`).then(res=>{
            if(res.data.status===200)
            {
                setHall(res.data.hall);
                setLoading(false);
            }
            else if(res.data.status===404){
                swal("Error",res.data.message,"error");
                history.push('/admin/view_halls');
            }
            else
            {
                setError(true);
            }
        });
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
                <span className="h1 my-4">Update Hall </span>
                <div className="spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Update Hall</h1>
            <i className="my-4 fa fa-edit fa-3x d-md-none text-primary"></i> 

            <form onSubmit={hallUpdate} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_halls" role="button"><i className="fa fa-chevron-left"></i></Link>
                
                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={hallInput.name} name="name" className="form-control" id="inputName" placeholder="Enter hall name" />
                            <label htmlFor="inputName">Hall Name</label>
                            <span className="text-danger">{errorList.name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={hallInput.floor} name="floor" className="form-control" id="inputFloor" placeholder="Enter hall floor" />
                            <label htmlFor="inputFloor">Hall Floor</label>
                            <span className="text-danger">{errorList.floor}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={hallInput.build} name="build" className="form-control" id="inputBuild" placeholder="Enter hall build" />
                            <label htmlFor="inputBuild">Hall Build</label>
                            <span className="text-danger">{errorList.build}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={hallInput.capacity} type="number" min={0} name="capacity" className="form-control" id="inputCapacity" placeholder="Enter hall capacity" />
                            <label htmlFor="inputCapacity">Hall Capacity</label>
                            <span className="text-danger">{errorList.capacity}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <textarea onChange={handleInput} value={hallInput.description===null?"No Thing":hallInput.description} name="description" className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: "180px"}}></textarea>
                            <label htmlFor="floatingTextarea2">Description</label>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Update Hall</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdateHall;