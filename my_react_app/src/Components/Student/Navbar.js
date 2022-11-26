import React,{useState,useEffect} from 'react';
import {Link,useHistory,Switch,Route,Redirect} from 'react-router-dom';
import Routes from '../../Routes/StudentRoutes';
import axios from 'axios';
import swal from 'sweetalert';

const Navbar =()=>{
    const history=useHistory();

    let [countEvents,setCountEvents]=useState(0);

    let getData=()=>{

        axios.get(`/api/count_events_mine`).then(res=>{
            if(res.data.status===200)
            {
                setCountEvents(res.data.count);
            }
        })
    }

    useEffect(()=>{
        getData();
        setInterval(() => {
            getData();
        },20000);
    },[]);

    const logoutSubmit=(e)=>{
        e.preventDefault();

        axios.post('/api/logout').then(res=>{
            if(res.data.status===200)
            {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_name');
                localStorage.removeItem('auth_role');
                history.push('/');
                swal("Success",res.data.message,"success");

                setTimeout(() => {
                    history.go(0);
                }, 1500);
            }
        });
    }

    return(
        <>
        <nav className="border border-primary border-5 border-top-0 border-bottom-0 border-end-0 navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/student">CompaStudent</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-md-0">
                        <li className="nav-item" title="Home">
                            <Link className="nav-link" to="/student/home"><i className="fa fa-home fa-2x"></i><span className="fs-5 ms-2 d-inline d-lg-none">Home</span></Link>
                        </li>
                        <li className="nav-item me-1 " title="Programs">
                            <Link className="nav-link" to="/student/programs"><i className="fa fa-receipt fa-2x"></i><span className="fs-5 ms-2 d-inline d-lg-none">Programs</span></Link>
                        </li>
                        <li className="nav-item me-1" title="Events" onClick={()=>setCountEvents(0)}>
                            <Link className="nav-link position-relative" to="/student/events">
                            
                            <i className="fa fa-bell fa-2x"></i>
                            <span className="fs-5 ms-2 d-inline d-lg-none">Events</span>
                            
                            {
                                countEvents >0?
                                <span class="position-absolute top-75 start-75 translate-middle badge rounded-pill bg-primary text-light">
                                    {countEvents}
                                    <span class="visually-hidden">unread messages</span>
                                </span>
                                :""  
                            }
                            </Link>
                        </li>
                        <li className="nav-item" title="Profile">
                            <Link className="nav-link" to="/student/profile"><i className="fa fa-user fa-2x"></i><span className="fs-5 ms-2 d-inline d-lg-none">Profile</span></Link>
                        </li>            
                        <li className="nav-item ms-lg-4" title="Logout">
                           <button onClick={logoutSubmit} className="nav-link btn btn-outline-primary px-2" >
                                <i className="fa fa-sign-out-alt fs-4"></i>
                                <span className="fs-5 ms-2 d-inline d-lg-none">Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <main>
            <Switch>
            {
                Routes.map((route,idx)=>{
                    return(
                        route.component&& (
                            <Route
                                key={idx}
                                path={route.path}
                                exact={route.true}
                                name={route.name}
                                render={(props)=>(
                                    <route.component {...props} />
                                )}
                            />
                        )
                    )
                })
            }
            <Redirect to='/student/home' />
            </Switch>
        </main>
        </>
    )
}

export default Navbar 