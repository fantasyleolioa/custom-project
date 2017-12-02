import { Routes, RouterModule } from '@angular/router';

import { UserManagement } from './userManagement.component';
import { UserMappingEdit } from './components/userMappingEdit/userMappingEdit.component';
import { UserMappingQuery } from "./components/userMappingQuery/userMappingQuery.component";
import { UserAdd } from './components/userAdd/userAdd.component';
import { UserEdit } from './components/userEdit/userEdit.component';
import { UserQuery } from './components/userQuery/userQuery.component';
import { ResumeDeactivatesEdit } from "./components/resumeDeactivatesEdit/resumeDeactivatesEdit.component";
// import { UserLeaves } from './components/userLeaves/userLeaves.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: UserManagement,
    children: [
      { path: 'userMappingEdit', component: UserMappingEdit },
      { path: 'userMappingQuery', component: UserMappingQuery },
      { path: 'userAdd', component: UserAdd },
      { path: 'userEdit', component: UserEdit },
      { path: 'userQuery', component: UserQuery },
      { path: 'resumeDeactivatesEdit', component: ResumeDeactivatesEdit },
      // { path: 'userLeaves', component: UserLeaves }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
