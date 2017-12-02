import { Routes, RouterModule }  from '@angular/router';

import { CustomComponent } from './custom.component';
import { TabComponent } from "./components/TabComponent/tab.component";


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: CustomComponent,
    children:[
      { path:'tab', component:TabComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
