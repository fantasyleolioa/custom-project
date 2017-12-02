import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing } from "./authManagement.routing";
import { DomainModule } from "../../domain/DomainModule.module";
import { NgbCollapseModule, NgbModalModule, NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthTreeModule } from "../authTree/authTree.module";

import { AuthManagement } from "./authManagement.component";
import { AuthDataQuery } from './components/authData/authDataQuery/authDataQuery.component';
import { AuthDataEdit } from './components/authData/authDataEdit/authDataEdit.component';
import { RoleAuthQuery } from "./components/roleAuth/roleAuthQuery/roleAuthQuery.component";
import { RoleAuthEdit } from "./components/roleAuth/roleAuthEdit/roleAuthEdit.component";
import { FunctionAuth } from "./components/Child-FunctionAuth/functionAuth.component";
import { DataPolicyComponent } from "./components/Child-DataPolicy/dataPolicy.component";
import { UserAuthQuery } from "./components/userAuth/userAuthQuery/userAuthQuery.component";
import { UserAuthEdit } from "./components/userAuth/userAuthEdit/userAuthEdit.component";

import { ResultAuth } from "./components/authData/authDataEdit/components/resultView/resultAuth/resultAuth.component";
import { OrgAuth } from "./components/authData/authDataEdit/components/orgView/orgAuth/orgAuth.component";
import { RoleAuth } from "./components/authData/authDataEdit/components/roleView/roleAuth/roleAuth.component";
import { UserAuth } from "./components/authData/authDataEdit/components/userView/userAuth/userAuth.component";
import { ResultDatapolicy } from "./components/authData/authDataEdit/components/resultView/resultDatapolicy/resultDatapolicy.component";
import { RoleDatapolicy } from "./components/authData/authDataEdit/components/roleView/roleDatapolicy/roleDatapolicy.component";
import { UserDatapolicy } from "./components/authData/authDataEdit/components/userView/userDatapolicy/userDatapolicy.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    DomainModule,
    NgbCollapseModule.forRoot(),
    NgbModalModule.forRoot(),
    AuthTreeModule,
    routing
  ],
  declarations: [
    AuthManagement,
    AuthDataQuery,
    AuthDataEdit,
    ResultAuth,
    OrgAuth,
    RoleAuth,
    UserAuth,
    ResultDatapolicy,
    RoleDatapolicy,
    UserDatapolicy,
    UserAuthQuery,
    UserAuthEdit,
    RoleAuthEdit,
    RoleAuthQuery,
    FunctionAuth,
    DataPolicyComponent
  ],
  providers: [
  ]
})
export class AuthManagementModule { }
