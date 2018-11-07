import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './album.routing';

import { AlbumComponent } from "./album.component";
import { AppFoundryComponent } from "./components/AppFoundry/appFoundry.component";
import { CacComponent } from "./components/CAC/cac.component";
import { CCComponent } from "./components/CC/cc.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    AlbumComponent,
    AppFoundryComponent,
    CacComponent,
    CCComponent
  ],
  providers: [
  ]
})
export class AlbumModule {}
