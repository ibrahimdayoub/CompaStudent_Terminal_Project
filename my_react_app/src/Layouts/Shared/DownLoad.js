import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Download=(props)=>{

    const date =new Date();
    let id=props.match.params.id;
    let history=useHistory();

    let [programs,setPrograms]=useState({});
    let [times,setTimes]=useState({});

    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    let content="";
    let contentTable="";

    useEffect(()=>{
        let flag=0;
        (async () => {
            await axios.get(`/api/group_programs/${id}`).then(res=>{
                if(res.data.status===200)
                {
                    setPrograms(res.data.programs);
                    flag++;
                }
                else{
                    swal("Error",res.data.message,"error");
                    history.goBack();
                }
            }).then(
                await axios.get(`/api/view_times`).then(res=>{
                    if(res.data.status===200)
                    {
                        setTimes(res.data.times);
                        flag++;
                    }
                })
            )

            if(flag==2)
            {
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })();
    },[]);

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
            <div className="container px-4 py-3  text-primary">
                <div className="my-3 d-inline-block me-3">
                    <span className="h1">Download </span> 
                </div>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    { 
        let orderedTimes = times.sort(function(item1,item2) {
            return item2.order-item1.order;
        });
        
        contentTable=orderedTimes.map((time,idx1)=>{

            let one=(<td style={{backgroundColor:"#44444412"}}></td>);
            let two=(<td style={{backgroundColor:"#44444412"}}></td>)
            let three=(<td style={{backgroundColor:"#44444412"}}></td>)
            let four=(<td style={{backgroundColor:"#44444412"}}></td>)
            let five=(<td style={{backgroundColor:"#44444412"}}></td>)
            let six=(<td style={{backgroundColor:"#44444412"}}></td>)
            let seven=(<td style={{backgroundColor:"#44444412"}}></td>)

            programs.map((program,idx2)=>{

                if(program.day==="Saturday" && program.time.name===time.name)
                {  
                    seven=(
                    <td className="p-1 m-0 text-center bg-light" title={`Saturday ${time.name}`}>
                        <p key={idx2} className="m-0 p-0">
                            {program.subject.name} {program.subject.type}
                            <br/>
                            {program.hall.name} 
                            <br/>
                            {program.subject.teacher.first_name} {program.subject.teacher.last_name}
                            <br/>
                            {program.notice?<span className="text-primary">{`'${program.notice}'`}</span>:"   "}
                        </p>
                    </td>)
                }
                else if(program.day==="Sunday" && program.time.name===time.name)
                {  
                    one=(
                    <td className="p-0 m-0 text-center bg-light" title={`Sunday ${time.name}`}>
                        <p key={idx2} className="m-0 p-1">
                            {program.subject.name} {program.subject.type}
                            <br/>
                            {program.hall.name} 
                            <br/>
                            {program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}
                            <br/>
                            {program.notice?<span className="text-primary">{`'${program.notice}'`}</span>:"   "}
                        </p>
                    </td>)
                }
                else if(program.day==="Monday" && program.time.name===time.name)
                {  
                    two=(
                    <td className="p-0 m-0 text-center bg-light" title={`Monday ${time.name}`}>
                        <p key={idx2} className="m-0 p-1 pt-2">
                            {program.subject.name} {program.subject.type}
                            <br/>
                            {program.hall.name} 
                            <br/>
                            {program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}
                            <br/>
                            {program.notice?<span className="text-primary">{`'${program.notice}'`}</span>:"   "}
                        </p>
                    </td>)
                }
                else if(program.day==="Tuesday" && program.time.name===time.name)
                {  
                    three=(
                    <td className="p-0 m-0 text-center bg-light" title={`Tuesday ${time.name}`}>
                        <p key={idx2} className="m-0 p-1 pt-2">
                            {program.subject.name} {program.subject.type}
                            <br/>
                            {program.hall.name} 
                            <br/>
                            {program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}
                            <br/>
                            {program.notice?<span className="text-primary">{`'${program.notice}'`}</span>:"   "}
                        </p>
                    </td>)
                }
                else if(program.day==="Wednesday" && program.time.name===time.name)
                {  
                    four=(
                    <td className="p-0 m-0 text-center bg-light" title={`Wednesday ${time.name}`}>
                        <p key={idx2} className="m-0 p-1 pt-2">
                            {program.subject.name} {program.subject.type}
                            <br/>
                            {program.hall.name} 
                            <br/>
                            {program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}
                            <br/>
                            {program.notice?<span className="text-primary">{`'${program.notice}'`}</span>:"   "}
                        </p>
                    </td>)
                }
                else if(program.day==="Thursday" && program.time.name===time.name)
                {  
                    five=(
                    <td className="p-0 m-0 text-center bg-light" title={`Thursday ${time.name}`}>
                        <p key={idx2} className="m-0 p-1 pt-2">
                            {program.subject.name} {program.subject.type}
                            <br/>
                            {program.hall.name} 
                            <br/>
                            {program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}
                            <br/>
                            {program.notice?<span className="text-primary">{`'${program.notice}'`}</span>:"   "}
                        </p>
                    </td>)
                }
                else if(program.day==="Friday" && program.time.name===time.name)
                {  
                    six=(
                    <td className="p-0 m-0 text-center bg-light" title={`Friday ${time.name}`}>
                        <p key={idx2} className="m-0 p-1 pt-2">
                            {program.subject.name} {program.subject.type}
                            <br/>
                            {program.hall.name} 
                            <br/>
                            {program.subject.teacher.first_name} {program.subject.teacher.middle_name} {program.subject.teacher.last_name}
                            <br/>
                            {program.notice?<span className="text-primary">{`'${program.notice}'`}</span>:"   "}
                        </p>
                    </td>)
                }
            })

            return(
                <tr key={idx1}>
                    <td className="text-center fw-bold bg-light">{time.from.toString().substring(0,5)},{time.to.toString().substring(0,5)}</td>
                    {seven}
                    {one}
                    {two}
                    {three}
                    {four}
                    {five}
                    {six}
                </tr>
            )
        })
 
        content=(
            <div className="table-responsive rounded px-4">
                <div className="table-responsive rounded my-3">
                    <table className="table table-bordered" id="my-table">
                            <tbody>
                                <tr className="bg-light">
                                    <th className="text-center py-3 fs-5" colSpan="8"  style={{backgroundColor:"#44444412"}}>
                                        Program Of {programs[0].group.name} In {programs[0].group.year.name}  {date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}
                                    </th>
                                </tr>
                                <tr className="bg-light">
                                    <th className="text-center ">Time / Day</th>
                                    <th className="text-center">Sat</th>
                                    <th className="text-center">Sun</th>
                                    <th className="text-center">Mon</th>
                                    <th className="text-center">Tue</th>
                                    <th className="text-center">Wed</th>
                                    <th className="text-center">Thu</th>
                                    <th className="text-center">Fri</th>
                                </tr>
                                {contentTable.reverse()}
                            </tbody>
                    </table>
                </div>
            </div>
        );
    }

    const download=()=>{
        const doc=new jsPDF();

        let Padding=1;
        let lineColor="#888";
        let lineWidth=0.1;
        let fillColor="#f9f9f9";
        let textColor="#555";

        autoTable(
            doc,
            {   theme:'grid',
                styles:
                {
                    valign:'middle',
                    halign:'center',
                    font:'times',
                    cellPadding:Padding,
                    fillColor:fillColor,
                    textColor:textColor,
                    lineColor:lineColor,
                    lineWidth:lineWidth
                },
                html:'#my-table'
            }
        )

        doc.save(`CompaStudent Program Of ${programs[0].group.name} In ${programs[0].group.year.name}`);

        /* 
            by canvas image but not responsive => import html2canvas from 'html2canvas'
            code:
            html2canvas(document.querySelector("#content")).then(canvas=>{
                const imgData = canvas.toDataURL('img/png');
                const pdf = new jsPDF('landscape','vh','a4','false');
                pdf.addImage(imgData,'PNG',0,0);
                pdf.save(`Program Of ${programs[0].group.name} In ${programs[0].group.year.name} ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} CompaStudent`);
            })
        */
    }

    return(
        <>
        <div className="container px-4 pt-3">
            <div className="my-3 d-flex justify-content-between align-items-center">
                <span className="h1 d-none d-md-inline">Download </span> 
                <i className="fa fa-file-pdf fa-3x d-md-none text-primary"></i> 
                <div>
                    <button onClick={download} className="btn btn-outline-primary me-1"><i className="fa fa-download fs-5 p-0"></i> </button>
                    <button onClick={()=>history.goBack()} className="btn btn-primary"><i className="fa fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
        <div id="content">
                {content}
        </div>
        </>
    )
}//3 Times Used

export default Download; 