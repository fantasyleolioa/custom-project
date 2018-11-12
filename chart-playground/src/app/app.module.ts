import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DomainModule } from "./domain/domain.module";
import { CoreModule } from './@core/core.module';
import { ToasterModule } from 'angular2-toaster';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ThemeModule } from './@theme/theme.module';
import { environment } from '../environments/environment';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ToasterModule.forRoot(),
    RouterModule.forRoot([], { useHash: true} ),
    AppRoutingModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    DomainModule,
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    NgbModule.forRoot(),
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
