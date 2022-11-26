import Home           from '../Layouts/Shared/Home'; 
import Profile        from '../Layouts/Teacher/Profile';
import DownLoad       from '../Layouts/Shared/DownLoad';

import ViewPrograms   from '../Layouts/Teacher/Programs/ViewPrograms';
import AddProgram     from '../Layouts/Teacher/Programs/AddProgram';
import UpdateProgram  from '../Layouts/Teacher/Programs/UpdateProgram';
import SwapProgram    from '../Layouts/Teacher/Programs/SwapProgram';
import ContactRecord  from '../Layouts/Shared/ContactRecord';
import Events         from '../Layouts/Shared/Events';

const Routes=[
    {path:'/teacher', exact:true, name:'teacher'},
    {path:'/teacher/home', exact:true, name:'home', component:Home},
    {path:'/teacher/download/:id', exact:true, name:'download', component:DownLoad},
    {path:'/teacher/profile', exact:true, name:'profile', component:Profile},

    {path:'/teacher/view_programs', exact:true, name:'view_programs', component:ViewPrograms},
    {path:'/teacher/add_program', exact:true, name:'add_program', component:AddProgram},
    {path:'/teacher/update_program/:id', exact:true, name:'update_program', component:UpdateProgram},
    {path:'/teacher/swap_program/:id', exact:true, name:'swap_program', component:SwapProgram},

    {path:'/teacher/contact_record', exact:true, name:'contact_record', component:ContactRecord},

    {path:'/teacher/events', exact:true, name:'events', component:Events},
]

export default Routes;