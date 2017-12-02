import { Routes, RouterModule }  from '@angular/router';

import { AuthManagement } from './authManagement.component';
import { AuthDataQuery } from "./components/authData/authDataQuery/authDataQuery.component";
import { AuthDataEdit } from "./components/authData/authDataEdit/authDataEdit.component";
import { RoleAuthQuery } from "./components/roleAuth/roleAuthQuery/roleAuthQuery.component";
import { RoleAuthEdit } from "./components/roleAuth/roleAuthEdit/roleAuthEdit.component";
import { UserAuthQuery } from "./components/userAuth/userAuthQuery/userAuthQuery.component";
import { UserAuthEdit } from "./components/userAuth/userAuthEdit/userAuthEdit.component";


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: AuthManagement,
    children: [
      { path: 'authDataQuery', component: AuthDataQuery },
      { path: 'authDataEdit', component: AuthDataEdit },
      { path: 'authRoleQuery', component: RoleAuthQuery },
      { path: 'roleAuthEdit', component: RoleAuthEdit },
      { path: 'authUserQuery', component: UserAuthQuery },
      { path: 'userAuthEdit', component :UserAuthEdit }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
