import React from 'react';
import {BrowserRouter,Redirect,Route,Switch,useHistory} from 'react-router-dom';

import AdminPrivateRoutes   from './Routes/AdminPrivateRoutes';
import TeacherPrivateRoutes from './Routes/TeacherPrivateRoutes';
import StudentPrivateRoutes from './Routes/StudentPrivateRoutes';

import Home             from './Layouts/Wellcome/Home';
import Register         from './Layouts/Wellcome/Register';
import ForgotPassword   from './Layouts/Wellcome/ForgotPassword';
import ResetPassword    from './Layouts/Wellcome/ResetPassword';
import Login            from './Layouts/Wellcome/Login';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import '../node_modules/@fortawesome/fontawesome-free/js/all.min.js';

import axios from 'axios';
axios.defaults.withCredentials=true;
axios.defaults.baseURL="http://localhost:8000/";
axios.defaults.headers.post['Content-Type']='application/json';
axios.defaults.headers.post['Accept']='application/json';
axios.interceptors.request.use(function(config){
  const token=localStorage.getItem('auth_token');
  config.headers.Authorization=token?`Bearer ${token}`:``;
  return config;
})

function App() {
  const history=useHistory();
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact  path="/" component={Home} />

          <Route path="/register">
           {localStorage.getItem("auth_token")? <Redirect to={'/'} /> :<Register/>}
          </Route>

          <Route path="/forgot">
           {localStorage.getItem("auth_token")? <Redirect to={'/'} /> :<ForgotPassword/>}
          </Route>

          {
            //I go with this way not as forgot because i have params here to pass
            !localStorage.getItem("auth_token")?
            <Route path="/reset/:id" component={ResetPassword}/>:
            <Route path="/reset/:id" component={Home}/>
          }
         
          <Route path="/login">
            {localStorage.getItem("auth_token")?  <Redirect to={'/'} /> :<Login/>}
          </Route>

          <AdminPrivateRoutes path="/admin" name="admin" />
          <TeacherPrivateRoutes path="/teacher" name="teacher" />
          <StudentPrivateRoutes path="/student" name="student" />

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;