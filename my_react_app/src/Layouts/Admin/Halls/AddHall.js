import React,{useState} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const AddHall =()=>{

    const [hallInput,setHall]=useState({
        name:"",
        floor:"",
        build:"",
        capacity:"",
        description:"",
        error_list:[]
    });

    const handleInput=(e)=>{
        e.persist();
        setHall({...hallInput,[e.target.name]:e.target.value});
    };

    const hallSubmit=(e)=>{
        e.preventDefault();

        const data={
            "name":hallInput.name,
            "floor":hallInput.floor,
            "build":hallInput.build,
            "capacity":hallInput.capacity,
            "description":hallInput.description,
        }

        axios.post('/api/add_hall',data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setHall({
                    name:"",
                    floor:"",
                    build:"",
                    capacity:"",
                    description:"",
                    error_list:[]
                })
            }
            else
            {
                setHall({...hallInput,error_list:res.data.validation_errors});
            }
        });
    };

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Add Hall</h1>
            <i className="my-4 fa fa-plus fa-3x d-md-none text-primary"></i> 

            <form onSubmit={hallSubmit} className="my-5">
                 <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_halls" role="button"><i className="fa fa-chevron-left"></i></Link>
               
                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={hallInput.name} name="name" className="form-control" id="inputName" placeholder="Enter hall name" />
                            <label htmlFor="inputName">Hall Name</label>
                            <span className="text-danger">{hallInput.error_list.name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={hallInput.floor} name="floor" className="form-control" id="inputFloor" placeholder="Enter hall floor" />
                            <label htmlFor="inputFloor">Hall Floor</label>
                            <span className="text-danger">{hallInput.error_list.floor}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={hallInput.build} name="build" className="form-control" id="inputBuild" placeholder="Enter hall build" />
                            <label htmlFor="inputBuild">Hall Build</label>
                            <span className="text-danger">{hallInput.error_list.build}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={hallInput.capacity} type="number" min={0} name="capacity" className="form-control" id="inputCapacity" placeholder="Enter hall capacity" />
                            <label htmlFor="inputCapacity">Hall Capacity</label>
                            <span className="text-danger">{hallInput.error_list.capacity}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <textarea onChange={handleInput} value={hallInput.description} name="description" className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: "180px"}}></textarea>
                            <label htmlFor="floatingTextarea2">Description</label>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Add Hall</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddHall;