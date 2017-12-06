import { Routes, RouterModule }  from '@angular/router';

import { CustomComponent } from './custom.component';
import { TabComponent } from "./components/TabComponent/tab.component";
import { TreeComponent } from "./components/TreeComponent/tree.component";
import { StateDemoComponent } from "./components/StateDemo/stateDemo.component";
import { DragAreaComponent } from "./components/DragableArea/dragArea.component";


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: CustomComponent,
    children:[
      { path:'tab', component:TabComponent },
      { path:'tree', component:TreeComponent },
      { path:'stateDemo', component:StateDemoComponent },
      { path:'dragableArea', component:DragAreaComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
