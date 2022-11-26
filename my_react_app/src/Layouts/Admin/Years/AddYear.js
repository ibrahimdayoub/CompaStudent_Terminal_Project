import React,{useState} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const AddYear =()=>{

    const [yearInput,setYear]=useState({
        name:"",
        order:"",
        description:"",
        error_list:[]
    });

    const handleInput=(e)=>{
        e.persist();
        setYear({...yearInput,[e.target.name]:e.target.value});
    };

    const yearSubmit=(e)=>{
        e.preventDefault();

        const data={
            "name":yearInput.name,
            "order":yearInput.order,
            "description":yearInput.description,
        }
        axios.post('/api/add_year',data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setYear({
                    name:"",
                    order:"",
                    description:"",
                    error_list:[]
                })
            }
            else
            {
                setYear({...yearInput,error_list:res.data.validation_errors});
            }
        });
    };

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Add Year</h1>
            <i className="fa fa-plus fa-3x d-md-none my-4 text-primary"></i>

            <form onSubmit={yearSubmit} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_years" role="button"><i className="fa fa-chevron-left"></i></Link>
             
                <div className="bg-light border">
                    <div className="tab-pane fade show active card-body border pt-5" id="info" role="tabpanel" aria-labelledby="info-tab">
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
                            <span className="text-danger">{yearInput.error_list.name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="number" onChange={handleInput} value={yearInput.order} min={0} name="order" className="form-control" id="inputOrder" placeholder="Enter order show" />
                            <label htmlFor="inputCapacity">Order Show In Downloads</label>
                            <span className="text-danger">{yearInput.error_list.order}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <textarea onChange={handleInput} value={yearInput.description} name="description" className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: "180px"}}></textarea>
                            <label htmlFor="floatingTextarea2">Description</label>
                            <span className="text-danger">{yearInput.error_list.description}</span>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Add Year</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddYear;











