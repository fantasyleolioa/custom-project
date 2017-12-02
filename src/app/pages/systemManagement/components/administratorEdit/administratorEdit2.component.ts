import {BaThemeSpinner} from '../../../../theme/services/baThemeSpinner';
import {NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {CCContext} from '../../../../domain/CCContext';
import {ButtonSetting} from '../../../../domain/ButtonSetting';
import {GlobalState} from '../../../../global.state';
import {ContentTopService} from '../../../../service/contentTopService/ContentTop.service';
import {ActivatedRoute, Router} from "@angular/router";
import * as _ from 'lodash';
import {UserInfo} from "../../../../domain/UserInfo";
import {RoleInfo} from "../../../../domain/RoleInfo";

@Component({
    selector: 'AdministratorEdit2',
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['./administratorEdit2.component.scss'],
    styleUrls: ['../../systemManagement.component.scss'],
    templateUrl: './administratorEdit2.component.html'
})
export class AdministratorEdit2 implements OnInit {

    // 当前角色
    role: RoleInfo;
    roleName: string;
    searchedUsers: UserInfo[] = [];
    selectedUsers: UserInfo[] = [];


    usersInRole = [];
    selectedRole = undefined;
    users = [];
    contentTopButtons: ButtonSetting[] = new Array<ButtonSetting>();
    confirmButtonText: string = '移除';
    confirmButtonStatus: boolean = false;
    editMode: boolean = false;

    private modalRef: NgbModalRef;

    @ViewChild('disableRoleModal') disableRoleModal;

    // 停用模态框的确定控制
    modalDisableConfirmStatus: boolean = true;
    modalDisableConfirmText: string = '确定';
    // 保存的确定控制
    saveConfirmStatus: boolean = true;
    saveConfirmText: string = '确定';

    constructor(private state: GlobalState,
                private contentTopService: ContentTopService,
                private loader: BaThemeSpinner,
                private ccContext: CCContext,
                private modalService: NgbModal,
                private router: Router,
                public route: ActivatedRoute) {

        // get role from params
        this.role = new RoleInfo(null, null, null, null, null, null);
        route.params.subscribe(params => {
            this.role.id = params['id'] || '';
            this.role.name = params['name'] || '';
            this.role.hash = params['hash'] || '';
            this.roleName = this.role.name;
        });

        // 如果有缓存的用户信息就不要再查询
        let temp = localStorage.getItem('cc.administratorEditPro.component.user.list');
        localStorage.removeItem('cc.administratorEditPro.component.user.list');
        if (temp) {
            this.searchedUsers = JSON.parse(temp);
            this.selectedUsers = _.cloneDeep(this.searchedUsers);
        } else {
            this.searchUser();
        }
        // this.searchRole();
    }

    ngOnInit(): void {

    }

    searchUser(): void {
        this.showLoading();
        // this.ccContext.PlatformRepository.GetPlatformRole(this.role.id)
        //     .subscribe(
        //         (result) => {
        //             this.role = _.cloneDeep(result);
        //             this.roleName = this.role.name;
        //             // if (this.roles.length > 0) {
        //             //     this.selectedRole = this.roles[0];
        //             //     this.loadUsersInRole(this.roles[0].id);
        //             // }
        //         }, (error) => {
        //             this.showErrorMessage(error);
        //         });
        this.ccContext.PlatformRepository.GetRoleAllUsers(this.role.id)
            .subscribe(
                (result) => {
                    this.searchedUsers = _.cloneDeep(result);
                    this.selectedUsers = _.cloneDeep(this.searchedUsers);
                    this.hideLoading();
                }, (error) => {
                    this.showErrorMessage(error);
                });
    }

    disableRole(): void {
        this.modalRef = this.modalService.open(this.disableRoleModal);
    }

    disableRoleModalConfirm(): void {
        this.modalDisableConfirmStatus = false;
        this.modalDisableConfirmText = '停用中请稍后';

        this.ccContext.PlatformRepository.DisableRole(this.role.id, this.role.hash)
            .subscribe(
                (result) => {
                    this.modalDisableConfirmStatus = true;
                    this.modalDisableConfirmText = '确定';
                    this.modalRef.close();
                    setTimeout(() => {
                        this.router.navigate(['/pages/systemManagement/administratorManagement/administratorEdit', {}]);
                    });
                }, (error) => {
                    this.modalDisableConfirmStatus = true;
                    this.modalDisableConfirmText = '确定';
                    this.showErrorMessage(error);

                });
    }

    saveRole(): void {
        this.saveConfirmStatus = false;
        this.saveConfirmText = '存储中请稍后';

        let recoverySaveConfirm = function () {
            this.saveConfirmStatus = false;
            this.saveConfirmText = '存储';
            setTimeout(() => {
                this.searchedUsers = [];
                this.selectedUsers = [];
                this.searchUser();
            });
        };

        this.showLoading();
        this.updateRoleDetail().then((result) => {
            if (result.ok) {
                return this.updateRolesUser();
            } else {
                return new Promise((resolve, reject) => {
                    setTimeout(resolve(result), 0);
                });
            }
        }).then((result) => {
            this.hideLoading();
            if (!result.ok) {
                this.showErrorMessage(result.error);
            }
            recoverySaveConfirm();
        });
    }

    updateRoleDetail(): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                this.ccContext.PlatformRepository.UpdateRole({
                    id: this.role.id,
                    name: this.role.name,
                    hash: this.role.hash
                })
                    .subscribe(
                        (result) => {
                            this.role = _.cloneDeep(result);
                            this.roleName = this.role.name;
                            resolve({ok: true});
                        }, (error) => {
                            resolve({ok: false, error: error});
                        });
            });
    }

    updateRolesUser(): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                this.ccContext.PlatformRepository.UpdateRoleUsers({
                    roleId: this.role.id,
                    userIds: this.getSelectedUserIds()
                })
                    .subscribe(
                        (result) => {
                            resolve({ok: true});
                        }, (error) => {
                            resolve({ok: false, error: error});
                        });
            });
    }

    getSelectedUserIds(): string [] {
        let result = [];
        _.forEach(this.selectedUsers, item => {
            result.push(item.id);
        });
        return result;
    }

    editRolePro(): void {
        localStorage.setItem('cc.administratorEditPro.component.user.list', JSON.stringify(this.selectedUsers));

        let _id = this.role.id;
        let _name = this.role.name;
        let _hash = this.role.hash;
        this.router.navigate(['/pages/systemManagement/administratorManagement/administratorEdit/edit/pro', { id: _id, name: _name, hash: _hash }]);
    }

    private showErrorMessage(error: any): void {

        this.hideLoading();
        let errorMessage: string;
        if (error._body !== '') {
            errorMessage = JSON.parse(error._body).message;
        } else {
            errorMessage = error.statusText;
        }
        window.alert(errorMessage);
    }

    showLoading(): void {
        this.loader.preloaderShow();
    }

    removeUser(user): void {
        _.remove(this.selectedUsers, (item) => {
            return item.id === user.id;
        })
    }

    private hideLoading(): void {
        this.loader.preloaderHide();
    }

}