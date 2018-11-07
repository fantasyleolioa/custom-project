import { Routes, RouterModule }  from '@angular/router';

import { CustomComponent } from './custom.component';
import { TabComponent } from "./components/TabComponent/tab.component";
import { TreeComponent } from "./components/TreeComponent/tree.component";
import { StateDemoComponent } from "./components/StateDemo/stateDemo.component";
import { DragAreaComponent } from "./components/DragableArea/dragArea.component";
import { CssPracticeComponent } from "./components/cssPractice/cssPractice.component";


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: CustomComponent,
    children:[
      { path:'tab', component:TabComponent },
      { path:'tree', component:TreeComponent },
      { path:'stateDemo', component:StateDemoComponent },
      { path:'dragableArea', component:DragAreaComponent },
      { path:'cssPractice', component:CssPracticeComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
