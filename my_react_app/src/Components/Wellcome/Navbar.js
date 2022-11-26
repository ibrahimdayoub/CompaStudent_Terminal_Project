import React from 'react'
import {Link,useHistory,NavLink} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

const Navbar =()=>{

    return(
        <nav className="border border-primary border-5 border-top-0 border-bottom-0 border-end-0  navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">CompaStudent</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {
                        !localStorage.getItem("auth_token")?
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link btn btn-outline-primary px-2 mt-1" aria-current="page" to="/login"><i className="fa fa-sign-in-alt fs-4"></i></NavLink>
                            </li>
                        </ul>
                        :null
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar;