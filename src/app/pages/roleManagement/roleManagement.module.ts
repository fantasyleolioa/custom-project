import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { DomainModule } from "../../domain/DomainModule.module";
import { NgbCollapseModule, NgbModalModule, NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './roleManagement.routing';
import { RoleManagement } from "./roleManagement.component";
import { ResumeDeactivatedRoleQuery } from "./compoment/resumeDeactivatedRoleQuery/resumeDeactivatedRoleQuery.component";
import { RoleEdit } from "./compoment/roleEdit/roleEdit.component";
import { RoleCatalogEdit } from "./compoment/roleCatalogEdit/roleCatalogEdit.component";
import { RoleIndEdit } from "./compoment/roleIndEdit/roleIndEdit.component";
import { RoleAdvanceEdit } from "./compoment/roleAdvanceEdit/roleAdvanceEdit.component";
import {SelectedUsersService} from '../../../app/service/selectedUsers-service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    DomainModule,
    NgbCollapseModule.forRoot(),
    NgbModalModule.forRoot(),
    routing
  ],
  declarations: [
    RoleManagement,
    ResumeDeactivatedRoleQuery,
    RoleEdit,
    RoleCatalogEdit,
    RoleIndEdit,
    RoleAdvanceEdit
  ],
  providers: [
    SelectedUsersService
  ]
})
export class RoleManagementModule { }
