import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const UpdateYear =(props)=>{

    let id=props.match.params.id;
    const history=useHistory();

    const [yearInput,setYear]=useState({});
    const [errorList,setErrorList]=useState({});
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setYear({...yearInput,[e.target.name]:e.target.value});
    };

    const yearUpdate=(e)=>{
        e.preventDefault();

        const data={
            "name":yearInput.name,
            "order":yearInput.order,
            "description":yearInput.description,
        }

        axios.put(`/api/update_year/${id}`,data).then(res=>{
            if(res.data.status===200)
            {   
                swal("Success",res.data.message,"success");
                history.push('/admin/view_years');
            }
            else  if(res.data.status===404)
            {
                swal("Error",res.data.message,"error");
                history.push('/admin/view_years');
            }
            else
            {
                setErrorList(res.data.validation_errors);
            } 
        });
    };

    useEffect(()=>{
        axios.get(`/api/view_year/${id}`).then(res=>{
            if(res.data.status===200)
            {
                setYear(res.data.year);
                setLoading(false);
            }
            else if(res.data.status===404){
                swal("Error",res.data.message,"error");
                history.push('/admin/view_years');
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
            <div className="container px-4 py-4  text-primary">
                <span className="h1 my-4">Update Year </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    
    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Update Year</h1>
            <i className="fa fa-edit fa-3x d-md-none my-4 text-primary"></i>

            <form onSubmit={yearUpdate} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_years" role="button"><i className="fa fa-chevron-left"></i></Link>

                <div className="border bg-light">
                    <div className="card-body border pt-5">
                       <div className="form-floating mb-3 offset-md-1 col-md-10 text-center">
                            <p className="fs-6">
                                Enter Full Name Of Year With It`s Department If There Is And That For All To Finish.
                                <br/>
                                <strong className="text-primary"> Ex1 : </strong> Fifth Year, Software And Information Systems.
                                <br/>
                                <strong className="text-primary"> Ex2 : </strong> First Year, General.
                            </p>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={yearInput.name} name="name" className="form-control" id="inputName" placeholder="Enter year name" />
                            <label htmlFor="inputName">Year Name</label>
                            <span className="text-danger">{errorList.name}</span>
                        </div>
 
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="number" onChange={handleInput} value={yearInput.order} min={0} name="order" className="form-control" id="inputOrder" placeholder="Enter order show" />
                            <label htmlFor="inputCapacity">Order Show In Downloads</label>
                            <span className="text-danger">{errorList.order}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <textarea onChange={handleInput} value={yearInput.description===null?"No Thing":yearInput.description} name="description" className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: "180px"}}></textarea>
                            <label htmlFor="floatingTextarea2">Description</label>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Update Year</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdateYear;