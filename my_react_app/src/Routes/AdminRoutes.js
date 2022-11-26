import Home             from '../Layouts/Shared/Home';
import DownLoad         from '../Layouts/Shared/DownLoad';
import Notification     from '../Layouts/Admin/Notification';
import Events           from '../Layouts/Shared/Events';
import Profile          from '../Layouts/Admin/Profile';

  
import ViewHalls        from '../Layouts/Admin/Halls/ViewHalls';  
import AddHall          from '../Layouts/Admin/Halls/AddHall'; 
import UpdateHall       from '../Layouts/Admin/Halls/UpdateHall';  
import HallPrograms     from '../Layouts/Admin/Halls/HallPrograms'; 

import ViewTimes        from '../Layouts/Admin/Times/ViewTimes';
import AddTime          from '../Layouts/Admin/Times/AddTime'; 
import UpdateTime       from '../Layouts/Admin/Times/UpdateTime';   
import TimePrograms     from '../Layouts/Admin/Times/TimePrograms';

import ViewYears        from '../Layouts/Admin/Years/ViewYears';  
import AddYear          from '../Layouts/Admin/Years/AddYear'; 
import UpdateYear       from '../Layouts/Admin/Years/UpdateYear'; 
import YearGroups       from '../Layouts/Admin/Years/YearGroups';
import YearSubjects     from '../Layouts/Admin/Years/YearSubjects';

import ViewGroups       from '../Layouts/Admin/Groups/ViewGroups';  
import AddGroup         from '../Layouts/Admin/Groups/AddGroup'; 
import UpdateGroup      from '../Layouts/Admin/Groups/UpdateGroup';
import GroupStudents    from '../Layouts/Admin/Groups/GroupStudents'; 
import GroupPrograms    from '../Layouts/Admin/Groups/GroupPrograms'; 

import ViewStudents     from '../Layouts/Admin/Students/ViewStudents'; 
import AddStudent       from '../Layouts/Admin/Students/AddStudent'; 
import UpdateStudent    from '../Layouts/Admin/Students/UpdateStudent'; 

import ViewTeachers     from '../Layouts/Admin/Teachers/ViewTeachers';  
import AddTeacher       from '../Layouts/Admin/Teachers/AddTeacher';  
import UpdateTeacher    from '../Layouts/Admin/Teachers/UpdateTeacher'; 
import TeacherSubjects  from '../Layouts/Admin/Teachers/TeacherSubjects';
import TeacherPrograms  from '../Layouts/Admin/Teachers/TeacherPrograms'; 

import ViewSubjects     from '../Layouts/Admin/Subjects/ViewSubjects';  
import AddSubject       from '../Layouts/Admin/Subjects/AddSubject';  
import UpdateSubject    from '../Layouts/Admin/Subjects/UpdateSubject'; 
import SubjectPrograms  from '../Layouts/Admin/Subjects/SubjectPrograms';  

import ViewAdmins       from '../Layouts/Admin/Admins/ViewAdmins';  
import AddAdmin         from '../Layouts/Admin/Admins/AddAdmin';  
import UpdateAdmin      from '../Layouts/Admin/Admins/UpdateAdmin';  

import ViewPrograms     from '../Layouts/Admin/Programs/ViewPrograms'; 
import AddProgram       from '../Layouts/Admin/Programs/AddProgram'; 
import UpdateProgram    from '../Layouts/Admin/Programs/UpdateProgram'; 

const Routes=[
    { path: '/admin', exact:true, name:'admin'},

    { path: '/admin/home', exact:true, name:'home', component:Home},
    { path: '/admin/download/:id', exact:true, name:'download', component:DownLoad},
    { path: '/admin/notification', exact:true, name:'notification', component:Notification},
    { path: '/admin/events', exact:true, name:'events', component:Events},
    { path: '/admin/profile', exact:true, name:'profile', component:Profile},

    { path: '/admin/view_halls', exact:true, name:'view_halls', component:ViewHalls},
    { path: '/admin/add_hall', exact:true, name:'add_hall', component:AddHall},
    { path: '/admin/update_hall/:id', exact:true, name:'update_hall', component:UpdateHall},
    { path: '/admin/hall_programs/:id', exact:true, name:'hall_programs', component:HallPrograms},

    { path: '/admin/view_times', exact:true, name:'view_times', component:ViewTimes},
    { path: '/admin/add_time', exact:true, name:'add_time', component:AddTime},
    { path: '/admin/update_time/:id', exact:true, name:'update_time', component:UpdateTime},
    { path: '/admin/time_programs/:id', exact:true, name:'time_programs', component:TimePrograms},

    { path: '/admin/view_years', exact:true, name:'view_years', component:ViewYears},
    { path: '/admin/add_year', exact:true, name:'add_year', component:AddYear},
    { path: '/admin/update_year/:id', exact:true, name:'update_year', component:UpdateYear},
    { path: '/admin/year_groups/:id', exact:true, name:'year_groups', component:YearGroups},
    { path: '/admin/year_subjects/:id', exact:true, name:'year_subjects', component:YearSubjects},
   
    { path: '/admin/view_groups', exact:true, name:'view_groups', component:ViewGroups},
    { path: '/admin/add_group', exact:true, name:'add_group', component:AddGroup},
    { path: '/admin/update_group/:id', exact:true, name:'update_group', component:UpdateGroup},
    { path: '/admin/group_students/:id', exact:true, name:'group_students', component:GroupStudents},
    { path: '/admin/group_programs/:id', exact:true, name:'group_programs', component:GroupPrograms},

    { path: '/admin/view_students', exact:true, name:'view_students', component:ViewStudents},
    { path: '/admin/add_student', exact:true, name:'add_student', component:AddStudent},
    { path: '/admin/update_student/:id', exact:true, name:'update_student', component:UpdateStudent},

    { path: '/admin/view_teachers', exact:true, name:'view_teachers', component:ViewTeachers},
    { path: '/admin/add_teacher', exact:true, name:'add_teacher', component:AddTeacher},
    { path: '/admin/update_teacher/:id', exact:true, name:'update_teacher', component:UpdateTeacher},
    { path: '/admin/teacher_subjects/:id', exact:true, name:'teacher_subjects', component:TeacherSubjects},
    { path: '/admin/teacher_programs/:id', exact:true, name:'teacher_programs', component:TeacherPrograms},

    { path: '/admin/view_subjects', exact:true, name:'view_subjects', component:ViewSubjects},
    { path: '/admin/add_subject', exact:true, name:'add_subject', component:AddSubject},
    { path: '/admin/update_subject/:id', exact:true, name:'update_subject', component:UpdateSubject},
    { path: '/admin/subject_programs/:id', exact:true, name:'subject_programs', component:SubjectPrograms},

    { path: '/admin/view_admins', exact:true, name:'view_admins', component:ViewAdmins},
    { path: '/admin/add_admin', exact:true, name:'add_admin', component:AddAdmin},
    { path: '/admin/update_admin/:id', exact:true, name:'update_admin', component:UpdateAdmin},

    { path: '/admin/view_programs', exact:true, name:'view_programs', component:ViewPrograms},
    { path: '/admin/add_program', exact:true, name:'add_program', component:AddProgram},
    { path: '/admin/update_program/:id', exact:true, name:'update_program', component:UpdateProgram},
]

export default Routes;