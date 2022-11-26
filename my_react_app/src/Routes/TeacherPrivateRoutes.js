import React,{useState,useEffect} from 'react';
import {Redirect,Route,useHistory,Link} from 'react-router-dom';

import Master from '../Components/Teacher/Navbar';
import axios from 'axios';
import swal from 'sweetalert'

function TeacherPrivateRoutes({...rest}){

    const history=useHistory();

    const [authenticated,setAuthenticated]=useState(false);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        axios.get('/api/authenticated_teacher').then(res=>{
            if(res.status==200)
            {
                setAuthenticated(true);
            }
            setLoading(false);
        });

        return()=>{
            setAuthenticated(false);
        };
    },[]);

    axios.interceptors.response.use(undefined,function axiosRetryInterceptor(error){      
        if(error.response.status===401)
        {
            swal("Error",error.response.data.message,'error');
            history.push('/');
        }
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function(response){
        return response;},
        function(error){
            if(error.response.status===403)
            {
                swal('Error',error.response.data.message,'error');
                history.push('/');
            }
            else if(error.response.status===404)
            {
                swal('Error','Url Or Page Not Found','error');
                history.push('/');
            }
            return Promise.reject(error);
        }
    )

    if(loading)
    {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/teacher">CompaStudent <span className="fs-6 text-primary">Loading</span></Link>
                   
                    <div className="clearfix me-4 py-1">
                        <div className="spinner-border float-end text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

    return(
        <Route {...rest}
            render={ ({props,location})=>
                authenticated?
                (<Master {...props} />):
                (<Redirect to={{pathname: "/login", state: {from: location}}} />)
            }        
        />
    )
}

export default TeacherPrivateRoutes