import { Routes, RouterModule }  from '@angular/router';

import { ConsoleComponent } from './console.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ConsoleComponent
  }
];

export const routing = RouterModule.forChild(routes);
