import React from 'react';
import {Summary,Download,MyTasks,GetStarted} from './HomeFunctions'

const Home =(props)=>{
    return(
        <div className="container">
            <ul className="nav nav-tabs mt-5" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="summary-tab" data-bs-toggle="tab" data-bs-target="#summary" type="button" role="tab" aria-controls="summary" aria-selected="true">Summary</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="tasks-list-tab" data-bs-toggle="tab" data-bs-target="#tasks-list" type="button" role="tab" aria-controls="tasks-list" aria-selected="false">My Tasks</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="download-tab" data-bs-toggle="tab" data-bs-target="#download" type="button" role="tab" aria-controls="download" aria-selected="false">Download</button>
                </li>
                {
                    props.match.path.substring(1,6)=="admin"?
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="getstarted-tab" data-bs-toggle="tab" data-bs-target="#getstarted" type="button" role="tab" aria-controls="getstarted" aria-selected="false">Get Started</button>
                    </li>:null
                }
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="summary" role="tabpanel" aria-labelledby="summary-tab">
                    <Summary />
                </div>
                <div className="tab-pane fade " id="tasks-list" role="tabpanel" aria-labelledby="tasks-list-tab">
                    <MyTasks />
                </div>
                <div className="tab-pane fade" id="download" role="tabpanel" aria-labelledby="download-tab">
                    <Download role={props.match.path.split("/")[1]}/>
                </div>
                {
                    props.match.path.split("/")[1]=="admin"?
                    <div className="tab-pane fade" id="getstarted" role="tabpanel" aria-labelledby="getstarted-tab">
                        <GetStarted />
                    </div>:null
                }
            </div>
        </div>
    )
}//3 Times Used

export default Home;