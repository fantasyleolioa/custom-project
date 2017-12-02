import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {DomainModule} from '../../domain/DomainModule.module';
import {NgbCollapseModule, NgbModalModule, NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {routing} from './systemManagement.routing';
import {SystemManagement} from './systemManagement.component';
import {StageSetting} from './components/stageSetting/stageSetting.component';
import {AdministratorEdit} from './components/administratorEdit/administratorEdit.component';
import {AdministratorEdit2} from './components/administratorEdit/administratorEdit2.component';
import {AdministratorEditPro} from './components/administratorEdit/administratorEditPro.component';
import {
    OrganizationalPermissionsComponent
}
    from './components/organizationalPermissions/organizational-permissions.component';
// import {
//     OrganizationalPermissionsEditComponent
// }
//     from './components/organizationalPermissions/organizational-permissions-edit.component';
import {
    OrganizationalPermissionsViewComponent
}
    from './components/organizationalPermissions/organizational-permissions-view.component';
import {ApplyPermissionsComponent} from './components/applyPermissions/apply-permissions.component';
import {ApplyPermissionsViewComponent} from './components/applyPermissions/apply-permissions-view.component';
// import {ApplyPermissionsEditComponent} from './components/applyPermissions/apply-permissions-edit.component';
import {AuthTreeModule} from '../authTree/authTree.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        DomainModule,
        NgbCollapseModule.forRoot(),
        NgbModalModule.forRoot(),
        routing,
        AuthTreeModule,
    ],
    declarations: [
        SystemManagement,
        AdministratorEdit,
        AdministratorEdit2,
        AdministratorEditPro,
        OrganizationalPermissionsComponent,
        OrganizationalPermissionsViewComponent,
        // OrganizationalPermissionsEditComponent,
        ApplyPermissionsComponent,
        ApplyPermissionsViewComponent,
        // ApplyPermissionsEditComponent,
        StageSetting
    ],
    providers: []
})
export class SystemManagementModule {
}
