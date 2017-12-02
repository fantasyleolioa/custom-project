import {BaThemeSpinner} from '../../../../theme/services/baThemeSpinner';
import {NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {CCContext} from '../../../../domain/CCContext';
import {ButtonSetting} from '../../../../domain/ButtonSetting';
import {GlobalState} from '../../../../global.state';
import {ContentTopService} from '../../../../service/contentTopService/ContentTop.service';
import {Router} from "@angular/router";

@Component({
    selector: 'apply-permissions',
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['./apply-permissions.component.scss'],
    styleUrls: ['../../systemManagement.component.scss'],
    templateUrl: './apply-permissions.component.html'
})
export class ApplyPermissionsComponent implements OnInit {

    roles = [];

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

    editRole(role): void {
        // console.log(roleID);
        let _id = role.id;
        let _name = role.name;
        let _hash = role.hash;
        this.router.navigate(
            ['/pages/systemManagement/administratorManagement/administratorPermissions/applyPermissions/view',
                { id: _id, name: _name, hash: _hash }]);
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