import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { DomainModule } from "../../domain/DomainModule.module";
import { NgbCollapseModule, NgbModalModule, NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './userManagement.routing';
import { UserManagement } from './userManagement.component';
import { UserMappingEdit } from './components/userMappingEdit/userMappingEdit.component';
import { UserMappingQuery } from "./components/userMappingQuery/userMappingQuery.component";
import { UserAdd } from './components/userAdd/userAdd.component';
import { UserEdit } from './components/userEdit/userEdit.component';
import { UserQuery } from './components/userQuery/userQuery.component';
// import { UserLeaves } from './components/userLeaves/userLeaves.component';
import { UserMetadataComponent } from "./components/Child-userMetadata/userMetadata.component";
import { UserInOrgComponent } from "./components/Child-userInOrg/userInOrg.component";
import { UserInOrgTagComponent } from "./components/Child-userInOrgTag/userInOrgTag.component";
import { UserInRoleComponent } from "./components/Child-userInRole/userInRole.component";
import { ResumeDeactivatesEdit } from "./components/resumeDeactivatesEdit/resumeDeactivatesEdit.component";

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
    UserManagement,
    UserMappingEdit,
    UserMappingQuery,
    UserAdd,
    UserEdit,
    UserQuery,
    // UserLeaves,
    UserMetadataComponent,
    UserInOrgComponent,
    UserInOrgTagComponent,
    UserInRoleComponent,
    ResumeDeactivatesEdit
  ],
  providers: [
  ]
})
export class UserManagementModule { }
