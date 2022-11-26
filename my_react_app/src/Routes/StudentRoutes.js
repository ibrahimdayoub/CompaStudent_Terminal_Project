import Profile       from '../Layouts/Student/Profile';
import Home          from '../Layouts/Shared/Home'; 
import Programs      from '../Layouts/Student/Programs';
import DownLoad      from '../Layouts/Shared/DownLoad';

import ContactRecord from '../Layouts/Shared/ContactRecord';
import Events        from '../Layouts/Shared/Events';

const Routes=[
    {path:'/student', exact:true, name:'student'},
    {path:'/student/home', exact:true, name:'home', component:Home},
    {path:'/student/profile', exact:true, name:'profile', component:Profile},
    {path:'/student/download/:id', exact:true, name:'download', component:DownLoad},
    {path:'/student/programs', exact:true, name:'programs', component:Programs},

    {path:'/student/contact_record', exact:true, name:'contact_record', component:ContactRecord},

    {path:'/student/events', exact:true, name:'events', component:Events},
]

export default Routes;