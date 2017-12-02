import { Routes, RouterModule }  from '@angular/router';

import { SystemManagement } from './systemManagement.component';
import { AdministratorEdit } from './components/administratorEdit/administratorEdit.component';
import { AdministratorEdit2 } from './components/administratorEdit/administratorEdit2.component';
import { StageSetting } from './components/stageSetting/stageSetting.component';
import { AdministratorEditPro } from './components/administratorEdit/administratorEditPro.component';
import { OrganizationalPermissionsComponent }
    from './components/organizationalPermissions/organizational-permissions.component';
// import { OrganizationalPermissionsEditComponent }
//     from './components/organizationalPermissions/organizational-permissions-edit.component';
import { OrganizationalPermissionsViewComponent }
    from './components/organizationalPermissions/organizational-permissions-view.component';
import {ApplyPermissionsComponent} from './components/applyPermissions/apply-permissions.component';
import {ApplyPermissionsViewComponent} from './components/applyPermissions/apply-permissions-view.component';
// import {ApplyPermissionsEditComponent} from "./components/applyPermissions/apply-permissions-edit.component";

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: SystemManagement,
        children: [
            // 管理员编辑
            { path: 'administratorManagement/administratorEdit', component: AdministratorEdit },
            { path: 'administratorManagement/administratorEdit/edit', component: AdministratorEdit2 },
            { path: 'administratorManagement/administratorEdit/edit/pro', component: AdministratorEditPro },
            // 组织权限编辑
            { path: 'administratorManagement/administratorPermissions/organizationalPermissions',
                component: OrganizationalPermissionsComponent },
            { path: 'administratorManagement/administratorPermissions/organizationalPermissions/view',
                component: OrganizationalPermissionsViewComponent },
            // { path: 'administratorManagement/administratorPermissions/organizationalPermissions/edit',
            //     component: OrganizationalPermissionsEditComponent },
            // 应用权限编辑
            { path: 'administratorManagement/administratorPermissions/applyPermissions',
                component: ApplyPermissionsComponent },
            { path: 'administratorManagement/administratorPermissions/applyPermissions/view',
                component: ApplyPermissionsViewComponent },
            // { path: 'administratorManagement/administratorPermissions/applyPermissions/edit',
            //     component: ApplyPermissionsEditComponent },
            // 阶段编辑
            { path: 'stageSetting', component: StageSetting },
        ],
    },
];

export const routing = RouterModule.forChild(routes);
