import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule',
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'userManagement', pathMatch: 'full' },
      { path: 'console', loadChildren: './console/console.module#ConsoleModule' },
      { path: 'userManagement', loadChildren: './userManagement/userManagement.module#UserManagementModule' },
      { path: 'permissionsManagement', loadChildren: './authManagement/authManagement.module#AuthManagementModule' },
      { path: 'systemManagement', loadChildren: './systemManagement/systemManagement.module#SystemManagementModule' },
      { path: 'roleManagement', loadChildren: './roleManagement/roleManagement.module#RoleManagementModule' },
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
