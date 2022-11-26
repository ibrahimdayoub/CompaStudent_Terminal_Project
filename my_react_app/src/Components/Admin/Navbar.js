import React,{useState,useEffect} from 'react';
import {Link,useHistory,Switch,Route,Redirect} from 'react-router-dom';
import Routes from '../../Routes/AdminRoutes';
import axios from 'axios';
import swal from 'sweetalert';


const Navbar =()=>{
    const history=useHistory();

    let [countEvents,setCountEvents]=useState(0);
    let [countNotifications,setCountNotifications]=useState(0);

    let getData=()=>{
        axios.get(`/api/count_admin_notifications`).then(res=>{
            if(res.data.status===200)
            {
                setCountNotifications(res.data.count);
            }
        }).then(
            axios.get(`/api/count_events_mine`).then(res=>{
                if(res.data.status===200)
                {
                    setCountEvents(res.data.count);
                }
            })
        )
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
        <div>
            <nav className="border border-primary border-5 border-top-0 border-bottom-0 border-end-0 navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/admin">CompaStudent</Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-md-0">
                            <li className="nav-item me-1" title="Home">
                                <Link className="nav-link" to="/admin/home"> <i className="fa fa-home fa-2x"></i><span className="fs-5 ms-2 d-inline d-lg-none">Home</span></Link>
                            </li>
                            <li className="nav-item me-1 " title="Programs">
                                <Link className="nav-link" to="/admin/view_programs"><i className="fa fa-receipt fa-2x"></i><span className="fs-5 ms-2 d-inline d-lg-none">Programs</span></Link>
                            </li>
                            <li className="nav-item me-1" title="Events" onClick={()=>setCountEvents(0)}>
                                <Link className="nav-link position-relative" to="/admin/events">
                                
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
                            <li className="nav-item me-1" title="Notifications" onClick={()=>setCountNotifications(0)}>
                                <Link className="nav-link position-relative" to="/admin/notification">
                                
                                <i className="fa fa-comment fa-2x"></i>
                                <span className="fs-5 ms-2 d-inline d-lg-none">Notifications</span>
                                
                                {
                                    countNotifications >0?
                                    <span class="position-absolute top-75 start-75 translate-middle badge rounded-pill bg-primary text-light">
                                        {countNotifications}
                                        <span class="visually-hidden">unread messages</span>
                                    </span>
                                    :""  
                                }
                                </Link>
                            </li>
                            <li className="nav-item me-1" title="Profile">
                                <Link className="nav-link" to="/admin/profile"><i className="fa fa-user fa-2x"></i><span className="fs-5 ms-2 d-inline d-lg-none">Profile</span></Link>
                            </li>
                            <li  className="nav-item dropdown me-5" title="Controlling">
                                <button className="btn btn-dark dropdown-toggle text-secondary ps-0 mt-1 mb-2 mt-lg-0 mb-lg-0" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fa fa-cog fa-2x"></i>
                                    <span className="fs-5 ms-2 d-inline d-lg-none">Controlling</span>
                                </button>
                                <ul  className="border border-primary border-3 border-bottom-0 border-start-0 border-end-0 dropdown-menu dropdown-menu-dark my-3" aria-labelledby="dropdownMenuButton2">
                                    <li><Link className="dropdown-item me-4" to="/admin/view_admins"><i className="fa fa-street-view text-primary"></i>  Admins</Link></li>
                                    <li><hr className="dropdown-divider text-primary"/></li>
                                    <li><Link className="dropdown-item me-4" to="/admin/view_years"><i className="fa fa-route text-primary"></i>  Years</Link></li>
                                    <li><Link className="dropdown-item me-4" to="/admin/view_groups"><i className="fa fa-users text-primary"></i>  Groups</Link></li>
                                    <li><Link className="dropdown-item me-4" to="/admin/view_students"><i className="fa fa-graduation-cap text-primary"></i>  Students</Link></li>
                                    <li><hr className="dropdown-divider text-primary"/></li>
                                    <li><Link className="dropdown-item me-4" to="/admin/view_teachers"><i className="fa fa-hat-cowboy text-primary"></i>  Teachers</Link></li>
                                    <li><Link className="dropdown-item me-4" to="/admin/view_subjects"><i className="fa fa-book-open text-primary"></i>  Subjects</Link></li>
                                    <li><hr className="dropdown-divider text-primary"/></li>
                                    <li><Link className="dropdown-item" to="/admin/view_halls"><i className="fa fa-laptop-house text-primary"></i>  Halls</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/view_times"><i className="fa fa-clock text-primary"></i>  Times</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/view_programs"><i className="fa fa-receipt text-primary"></i>  Programs</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item ms-lg-1" title="Logout">
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
                                    exact={route.exact}
                                    name={route.name}
                                    render={(props)=>(
                                        <route.component {...props} />
                                    )}
                                />
                            )
                        )
                    })
                }
                <Redirect to='admin/home' />
                </Switch>
            </main>
        </div>
    )
}

export default Navbar 