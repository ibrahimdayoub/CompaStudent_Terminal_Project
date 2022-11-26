import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const UpdateTime =(props)=>{

    let id=props.match.params.id;
    const history=useHistory();

    const [timeInput,setTime]=useState({});
    const [errorList,setErrorList]=useState({});
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setTime({...timeInput,[e.target.name]:e.target.value});
    };

    const timeUpdate=(e)=>{
        e.preventDefault();

        const data={
            "from":timeInput.from,
            "to":timeInput.to,
            "order":timeInput.order,
        }

        axios.put(`/api/update_time/${id}`,data).then(res=>{
            if(res.data.status===200)
            {   
                swal("Success",res.data.message,"success");
                history.push('/admin/view_times');
            }
            else  if(res.data.status===404)
            {
                swal("Error",res.data.message,"error");
                history.push('/admin/view_times');
            }
            else if(res.data.status===400)
            {
            swal("Error",res.data.unique_error,"error");
                setTime({
                    from:"",
                    to:"",
                    order:0
                })
                setErrorList([]);
            }
            else
            {
                setErrorList(res.data.validation_errors);
            } 
        });
    };

    useEffect(()=>{
        axios.get(`/api/view_time/${id}`).then(res=>{
            if(res.data.status===200)
            {
                setTime(res.data.time);
                setLoading(false);
            }
            else if(res.data.status===404){
                swal("Error",res.data.message,"error");
                history.push('/admin/view_times');
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
                <span className="h1 my-4">Update Time </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Update Time</h1>
            <i className="my-4 fa fa-edit fa-3x d-md-none text-primary"></i> 

            <form onSubmit={timeUpdate} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_times" role="button"><i className="fa fa-chevron-left"></i></Link>

                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="time" onChange={handleInput} value={timeInput.from} name="from" className="form-control" id="inputName" placeholder="Enter time from" />
                            <label htmlFor="inputName">From Time</label>
                            <span className="text-danger">{errorList.from}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input  type="time" onChange={handleInput} value={timeInput.to} name="to" className="form-control" id="inputName" placeholder="Enter time to" />
                            <label htmlFor="inputName">From To</label>
                            <span className="text-danger">{errorList.to}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="number" onChange={handleInput} value={timeInput.order} min={0} name="order" className="form-control" id="inputOrder" placeholder="Enter order show" />
                            <label htmlFor="inputCapacity">Order Show In Downloads</label>
                            <span className="text-danger">{errorList.order}</span>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Update Time</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdateTime;