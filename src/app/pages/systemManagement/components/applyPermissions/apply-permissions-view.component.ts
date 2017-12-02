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
import {current} from "codelyzer/util/syntaxKind";
import {AuthReflectService} from "../../../authTree/service/authReflect.service";
import {AuthTreeService} from "../../../authTree/service/authTree.service";
import {ConditionInfo} from "../../../authTree/domain/conditoinInfo";
import {AuthTree} from "../../../authTree/domain/authTree";
import {AppPermission} from "../../../authTree/domain/appPermission";
import {UpdatedSimplePermission} from "../../../authTree/domain/UpdatedSimplePermission";

@Component({
    selector: 'apply-permissions-view',
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['./apply-permissions-view.component.scss'],
    styleUrls: ['../../systemManagement.component.scss'],
    templateUrl: './apply-permissions-view.component.html'
})
export class ApplyPermissionsViewComponent implements OnInit {

    // 当前角色
    role: RoleInfo;

    searchedUsers: UserInfo[] = [];
    private modalRef: NgbModalRef;
    @ViewChild('PreviewModal') PreviewModal: any;
    @ViewChild('treeEditForm') treeEditForm: any;

    // for tree component
    authTreeData: AuthTree[] = [];
    sourcePermission: AppPermission;
    _sourcePermissionActions: Permission[] = [];
    _changedPermissionActions: Permission[] = [];
    isStateView: boolean = false;
    treeStatus: string = 'normal';
    conditionList: ConditionInfo[][] = [];
    selectedAction: AuthTree = new AuthTree('', '');

    constructor(private state: GlobalState,
                private contentTopService: ContentTopService,
                private loader: BaThemeSpinner,
                private ccContext: CCContext,
                private modalService: NgbModal,
                private router: Router,
                private authTreeService: AuthTreeService,
                private reflectService: AuthReflectService,
                public route: ActivatedRoute) {

        // get role from params
        this.role = new RoleInfo(null, null, null, null, null, null);
        route.params.subscribe(params => {
            this.role.id = params['id'] || '';
            this.role.name = params['name'] || '';
            this.role.hash = params['hash'] || '';
        });
        // get app policy
        this.getAppPolicy();
        // get belonged users
        this.searchUser();
        // this.searchRole();
    }

    ngOnInit(): void {
        this.treeEditForm.valueChanges.subscribe((value: any) => {
            if (this.treeEditForm.dirty) {
                console.log('wang wang');
            } else {
                console.log('meow meow');
            }
        })
    }

    getAppPolicy(): void {
        this.showLoading();
        this.ccContext.PlatformRepository.GetRoleAppPolicy(this.role.id)
            .subscribe(
                (result) => {
                    this.sourcePermission = result.permission;
                    this.authTreeData = this.authTreeService.TransferApplication(result.permission);
                    this.setBackup();

                    this.hideLoading();
                }, (error) => {
                    this.showErrorMessage(error);
                });
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
                    this.hideLoading();
                }, (error) => {
                    this.showErrorMessage(error);
                });
    }

    preview(): void {
        this.modalRef = this.modalService.open(this.PreviewModal);
    }

    edit(): void {
        this.treeStatus = 'editted';
    }

    cancel(): void {
        this.treeStatus = 'normal';
        this.getAppPolicy();
    }

    save(): void {
        this.showLoading();

        let result: UpdatedSimplePermission;

        result = new UpdatedSimplePermission(this.role.id, this.sourcePermission);

        this.ccContext.PlatformRepository.UpdateRoleAppPolicy(result)
            .subscribe(
                (result) => {
                    this.treeStatus = 'normal';

                    this.ccContext.PlatformRepository.GetRoleAppPolicy(this.role.id)
                        .subscribe(
                            (result) => {
                                this.sourcePermission = result.permission;
                                this.authTreeData = this.authTreeService.TransferApplication(result.permission);
                                this.setBackup();

                                this.hideLoading();
                            }, (error) => {
                                this.hideLoading();
                                this.showErrorMessage(error);
                            }
                        );
                }, (error) => {
                    if (error._body !== '') {
                        window.alert(JSON.parse(error._body).message);
                    } else {
                        window.alert(error.statusText);
                    }

                    this.hideLoading();
                    this.treeStatus = 'normal';
                }
            );


    }

    showErrorMessage(error: any): void {

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

    hideLoading(): void {
        this.loader.preloaderHide();
    }

    // Event Emitter
    private getNotify(event: any) {
        // debugger;
        this.checkDataChange(event.target);
        // console.log('bili bili ...');
        // 假若要求修改后才能保存，可以，
        // 1. 透过 dirty 检查是否有修改过：但是没法做到检查多次修改后的值是不是初始值
        // 2. 每次变更后检查后检查值和初始值是否一致：为了效率需要，
        //  a. 初始值按 id 排序
        //  b. 不做全部数据检查
        if (event.name === 'settingButton.click') {

            this.selectedAction = JSON.parse(JSON.stringify(event.target));
            this.conditionList = [];
            this.selectedAction.condition.forEach(
                (item) => {

                    if (item.type === 'time') {
                        const date: string = item.value.split(' ')[0];
                        const divide = item.value.split(' ')[1];
                        item.clock = divide.split(':')[0];
                        item.minute = divide.split(':')[1];
                        item.second = divide.split(':')[2];

                        item.date = date;
                    }
                }
            );

            for (let i = 1; i <= Math.ceil(this.selectedAction.condition.length / 3); i++) {

                this.conditionList.push([]);
                for (let j = i * 3 - 2; j <= i * 3; j++) {

                    if (this.selectedAction.condition[j - 1]) {
                        this.conditionList[i - 1].push(this.selectedAction.condition[j - 1]);
                    }
                }
            }

            this.isStateView = true;
            // console.log(this.selectedAction);
        }

        if (event.name === 'effect.changed') {

            this.reflectService.reflectPermission(this.sourcePermission, event.target);
        }
    }

    // 每次查询时保存备份数据，用于修改后的撤销
    setBackup(): void {
        this._sourcePermissionActions = [];
        this._changedPermissionActions = [];
        _.forEach(this.sourcePermission.actions, (item) => {
            this._sourcePermissionActions.push(new Permission(item.id, item.effect));
        });
        this._sourcePermissionActions = _.sortBy(this._sourcePermissionActions, 'id');
    }

    // 撤销时用于还原
    checkDataChange(target: any): void {
        const indexChanged = _.findIndex(this._changedPermissionActions, (item) => {
            return item.id === target.id;
        });
        if (indexChanged < 0) {
            // add this to _changedPermissionActions
            const indexActions = _.findIndex(this._sourcePermissionActions, (item) => {
                return item.id === target.id;
            });
            this._changedPermissionActions.push(
                new Permission(target.id, this._sourcePermissionActions[indexActions].effect));
        } else if (target.effect === this._changedPermissionActions[indexChanged].effect) {
            this._changedPermissionActions.splice(indexChanged, 1);
        }
    }

}

class Permission {
    id: string;
    effect: string = '';

    constructor(_id: string, _effect: string) {
        this.id = _id || '';
        this.effect = _effect || '';
    }
}