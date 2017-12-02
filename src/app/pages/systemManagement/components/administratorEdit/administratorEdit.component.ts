import {BaThemeSpinner} from '../../../../theme/services/baThemeSpinner';
import {NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {CCContext} from '../../../../domain/CCContext';
import {ButtonSetting} from '../../../../domain/ButtonSetting';
import {GlobalState} from '../../../../global.state';
import {ContentTopService} from '../../../../service/contentTopService/ContentTop.service';
import {Router} from "@angular/router";

@Component({
    selector: 'AdministratorEdit',
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['./administratorEdit.component.scss'],
    styleUrls: ['../../systemManagement.component.scss'],
    templateUrl: './administratorEdit.component.html'
})
export class AdministratorEdit implements OnInit {

    roles = [];
    usersInRole = [];
    selectedRole = undefined;
    users = [];
    contentTopButtons: ButtonSetting[] = new Array<ButtonSetting>();
    confirmButtonText: string = '移除';
    confirmButtonStatus: boolean = false;
    editMode: boolean = false;

    adminRoleID: string;
    adminRoleName: string;

    private modalRef: NgbModalRef;

    @ViewChild('addRoleModal') AddRoleModal1;

    addRoleConfirmStatus: boolean = false;
    modalConfirmText: string = '确定';
    closeResult: string;

    constructor(private state: GlobalState,
                private contentTopService: ContentTopService,
                private loader: BaThemeSpinner,
                private ccContext: CCContext,
                private modalService: NgbModal,
                private router: Router) {

        this.searchAdminRole();
        this.contentTopService.clearSubscribe('button.trigger');
        this.EnvironmentStart();
        this.EnvironmentSetting();

    }

    ngOnInit(): void {
        this.adminRoleID = '';
        this.adminRoleName = '';
    }

    searchAdminRole(): void {
        this.showLoading();
        this.ccContext.PlatformRepository.GetAllAdminRole()
            .subscribe(
                (result) => {
                    this.roles = result;
                    this.hideLoading();
                    // if (this.roles.length > 0) {
                    //     this.selectedRole = this.roles[0];
                    //     this.loadUsersInRole(this.roles[0].id);
                    // }
                }, (error) => {
                    this.showErrorMessage(error);
                });
    }

    open(content) {
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    addRole(): void {
        this.modalRef = this.modalService.open(this.AddRoleModal1);
    }

    addRoleModalConfirm(): void {

        this.addRoleConfirmStatus = true;
        this.modalConfirmText = '新增中请稍后';

        this.ccContext.PlatformRepository.UpdateRole({
            id: this.adminRoleID,
            name: this.adminRoleName
        })
            .subscribe(
                (result) => {
                    this.roles = result;
                    // if (this.roles.length > 0) {
                    //     this.selectedRole = this.roles[0];
                    //     this.loadUsersInRole(this.roles[0].id);
                    // }
                    this.adminRoleID = '';
                    this.adminRoleName = '';
                    this.modalConfirmText = '确定';
                    this.modalRef.close();
                    setTimeout(() => {
                        this.searchAdminRole();
                    });
                }, (error) => {
                    this.modalConfirmText = '确定';
                    this.showErrorMessage(error);

                });
    }

    editRole(role): void {
        // console.log(roleID);
        let _id = role.id;
        let _name = role.name;
        let _hash = role.hash;
        this.router.navigate(['/pages/systemManagement/administratorManagement/administratorEdit/edit', { id: _id, name: _name, hash: _hash }]);
        // this.router.navigate(['/pages/userManagement/userAdd']);
        // this.router.navigate(['edit', { id: _id, foo: _name }]);
    }

    private showErrorMessage(error: any) {

        this.hideLoading();
        let errorMessage: string;
        if (error._body !== '') {
            errorMessage = JSON.parse(error._body).message;
        } else {
            errorMessage = error.statusText;
        }
        window.alert(errorMessage);
    }

    private showLoading() {
        this.loader.preloaderShow();
    }

    private hideLoading() {
        this.loader.preloaderHide();
    }

    // State Trigger
    private EnvironmentSetting() {
        this.contentTopService.ChangeStatus('normal');

        this.contentTopService.EnvironmentSetting([]);
    };


    // Global Subscribe
    private EnvironmentStart() {
        this.contentTopService.subscribe("button.trigger", (eventName) => {

        });
    };
}