import { Routes, RouterModule }  from '@angular/router';

import { CustomComponent } from './custom.component';
import { TabComponent } from "./components/TabComponent/tab.component";
import { TreeComponent } from "./components/TreeComponent/tree.component";


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: CustomComponent,
    children:[
      { path:'tab', component:TabComponent },
      { path:'tree', component:TreeComponent },
      // { path:'stateDemo', component:TabComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
