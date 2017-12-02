import { Routes, RouterModule }  from '@angular/router';

import { RoleManagement } from './roleManagement.component';
import { ResumeDeactivatedRoleQuery } from "./compoment/resumeDeactivatedRoleQuery/resumeDeactivatedRoleQuery.component";
import { RoleEdit } from "./compoment/roleEdit/roleEdit.component";
import { RoleCatalogEdit } from "./compoment/roleCatalogEdit/roleCatalogEdit.component";
import { RoleIndEdit } from "./compoment/roleIndEdit/roleIndEdit.component";
import { RoleAdvanceEdit } from "./compoment/roleAdvanceEdit/roleAdvanceEdit.component";

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: RoleManagement,
    children: [
      { path: 'resumeDeactivatedRoleQuery', component: ResumeDeactivatedRoleQuery },
      { path: 'roleEdit', component: RoleEdit },
      { path: 'roleCatalogEdit', component: RoleCatalogEdit },
      { path: 'roleIndEdit', component: RoleIndEdit },
      { path: 'roleAdvanceEdit', component: RoleAdvanceEdit }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
