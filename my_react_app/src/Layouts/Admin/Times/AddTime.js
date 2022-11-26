import React,{useState} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const AddTime =()=>{

    const [timeInput,setTime]=useState({
        from:"",
        to:"",
        order:0,
        error_list:[]
    });

    const handleInput=(e)=>{
        e.persist();
        setTime({...timeInput,[e.target.name]:e.target.value});
    };

    const timeSubmit=(e)=>{
        e.preventDefault();

        const data={
            "from":timeInput.from,
            "to":timeInput.to,
            "order":timeInput.order,
        }

        axios.post('/api/add_time',data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setTime({
                    from:"",
                    to:"",
                    order:0,
                    error_list:[]
                })
            }
            else if(res.data.status===400)
            {
                swal("Error",res.data.unique_error,"error");
                setTime({
                    from:"",
                    to:"",
                    order:0,
                    error_list:[]
                })
            }
            else
            {
                setTime({...timeInput,error_list:res.data.validation_errors});
            }
        });
    };

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Add Time</h1>
            <i className="my-4 fa fa-plus fa-3x d-md-none text-primary"></i> 

            <form onSubmit={timeSubmit} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_times" role="button"><i className="fa fa-chevron-left"></i></Link>
               
                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="time" onChange={handleInput} value={timeInput.from} name="from" className="form-control" id="inputName" placeholder="Enter time from" />
                            <label htmlFor="inputName">From Time</label>
                            <span className="text-danger">{timeInput.error_list.from}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input  type="time" onChange={handleInput} value={timeInput.to} name="to" className="form-control" id="inputName" placeholder="Enter time to" />
                            <label htmlFor="inputName">From To</label>
                            <span className="text-danger">{timeInput.error_list.to}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="number" onChange={handleInput} value={timeInput.order} min={0} name="order" className="form-control" id="inputOrder" placeholder="Enter order show" />
                            <label htmlFor="inputCapacity">Order Show In Downloads</label>
                            <span className="text-danger">{timeInput.error_list.order}</span>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Add Time</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddTime;