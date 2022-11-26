import {React} from 'react';
import {useHistory,Link} from 'react-router-dom';
import Navbar from '../../Components/Wellcome/Navbar';
import axios from 'axios';
import swal from 'sweetalert';

const Home =()=>{ 
    const history=useHistory();
    let content="";
    let inContentTexts=[ //For Four Carouseles
        "No Confusion After Now",
        "Good Planning And More",
        "Manage Your Precious Time",
        "Take Break And Realx"
    ];

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

    if(localStorage.getItem('auth_role')==="Admin"   ||
       localStorage.getItem('auth_role')==="Teacher" ||
       localStorage.getItem('auth_role')==="Student"
    )
    {history.goBack();}

    if(!localStorage.getItem('auth_token'))
    {
        content=(
            <div className="carousel container mt-5">
                <div id="carouselExampleCaptions" className="carousel slide mb-5" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active d-none d-md-block bg-secondary " aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" className="d-none d-md-block bg-secondary "aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" className="d-none d-md-block bg-secondary " aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" className="d-none d-md-block bg-secondary " aria-label="Slide 4"></button>
                    </div>

                    <div id="carousel-dad" className="carousel-inner">
                        {
                            inContentTexts.map((e,i)=>{
                                let active=false;
                                if(i==0)
                                {
                                    active=true;
                                }
                                
                                return (
                                    <div key={i} className={active?"carousel-item active":"carousel-item"}>
                                        <img src={`${process.env.PUBLIC_URL}/images/wellcome-carousal-${i}.jpg`} className="d-block w-75 mx-auto opacity-75" alt={`carousal-${i}`}/>
                                        <div className="carousel-caption mb-5 text-secondary">
                                            <h5 id={`type-${i}`} className="fs-4 d-none d-md-block p-2 bg-white">{e}</h5>
                                        </div>
                                        <h5 className="fs-5 d-md-none text-center text-secondary">{e}</h5>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon rounded-start bg-secondary py-md-4" aria-hidden="true"></span>
                        <span className="visually-hidden ">Previous</span>
                    </button>

                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                        <span className="carousel-control-next-icon rounded-end bg-secondary py-md-4"  aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        )
    }
    else
    {
        content=(
            <div className="text-center container mt-4">
                <div className="border py-4 my-4 px-2 mx-2 rounded">
                    <h4>{localStorage.getItem('auth_name')}</h4>

                    <p>Hello Again, You Are Registered As {localStorage.getItem('auth_role')}, And We Forward To Awesome Experence, Best Wiches.</p>
                    <p className="m-0">
                    <Link to={`/${localStorage.getItem('auth_role').toLowerCase()}`} className="nav-link btn btn-primary px-2 text-light d-inline-block m-1" data-bs-toggle="tooltip" data-bs-placement="left">
                        <i className="fa fa-sign-in-alt fs-4"></i>
                    </Link>Back To Log In
                    </p>
                    <p className="m-0">
                        <button onClick={logoutSubmit} className="nav-link btn btn-primary px-2 text-light d-inline-block m-1"  data-bs-toggle="tooltip" data-bs-placement="right">
                            <i className="fa fa-sign-out-alt fs-4"></i>
                        </button>Go To Log Out
                    </p>
                </div>
            </div>
        )
    }

    return(
        <div>
            <Navbar/>
            <div className="my-4 py-4 py-md-0" id="master">
                {content}
            </div>
        </div>
    )
}

export default Home