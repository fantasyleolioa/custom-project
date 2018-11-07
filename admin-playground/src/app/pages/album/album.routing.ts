import { Routes, RouterModule }  from '@angular/router';

import { AlbumComponent } from './album.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: AlbumComponent,
    children:[
    //   { path:'tab', component:TabComponent },
      // { path:'tree', component:TabComponent },
      // { path:'stateDemo', component:TabComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
