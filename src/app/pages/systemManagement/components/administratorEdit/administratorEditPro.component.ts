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

@Component({
    selector: 'AdministratorEditPro',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../systemManagement.component.scss'],
    templateUrl: './administratorEditPro.component.html'
})
export class AdministratorEditPro implements OnInit {

    // 当前角色
    role: RoleInfo;
    roleName: string;
    searchedUsers: UserInfo[] = [];
    selectedUsers: UserInfo[] = [];

    // 过滤条件
    condition: string;
    // 当前页码
    currentPageNo: number;
    // 最大页码
    maxPageNo: number;

    usersInRole = [];
    selectedRole = undefined;
    users = [];
    contentTopButtons: ButtonSetting[] = new Array<ButtonSetting>();
    confirmButtonText: string = '移除';
    confirmButtonStatus: boolean = false;
    editMode: boolean = false;

    private modalRef: NgbModalRef;

    @ViewChild('PreviewModal') PreviewModal;

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

        this.condition = '';
        this.currentPageNo = 1;
        this.maxPageNo = 1;

        // get role from params
        this.role = new RoleInfo(null, null, null, null, null, null);
        route.params.subscribe(params => {
            this.role.id = params['id'] || '';
            this.role.name = params['name'] || '';
            this.role.hash = params['hash'] || '';
            this.roleName = this.role.name;
        });

        this.selectedUsers = JSON.parse(localStorage.getItem('cc.administratorEditPro.component.user.list'));
        // get users
        this.searchUser(1);
        // this.searchRole();
    }

    ngOnInit(): void {

    }

    searchUser(pageNum): void {
        this.currentPageNo = pageNum;
        this.showLoading();
        this.ccContext.PlatformRepository.GetRoleAllUsersWithCondition(this.role.id, this.condition, pageNum)
            .subscribe(
                (result) => {
                    this.maxPageNo = Math.ceil(result.totalCount / 10);
                    this.searchedUsers = _.cloneDeep(result.user);
                    _.forEach(this.searchedUsers, item => {
                        const index = _.findIndex(this.selectedUsers, o => {
                            return item.id === o.id;
                        });
                        item['checked'] = index >= 0;

                    });
                    this.hideLoading();
                }, (error) => {
                    this.showErrorMessage(error);
                });
    }

    preview(): void {
        this.modalRef = this.modalService.open(this.PreviewModal);
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

    save(): void {
        localStorage.setItem('cc.administratorEditPro.component.user.list', JSON.stringify(this.selectedUsers));
        this.back();
    }

    back(): void {
        this.router.navigate(['/pages/systemManagement/administratorManagement/administratorEdit/edit', {
            id: this.role.id,
            name: this.role.name,
            hash: this.role.hash
        }]);
    }

    ngModelChange() {

    }

    // 离开时查询
    onFocusOut(event: FocusEvent) {
        if (1 > this.currentPageNo) {
            this.currentPageNo = 1;
        } else if (this.currentPageNo > this.maxPageNo) {
            this.currentPageNo = this.maxPageNo;
        }
        this.searchUser(this.currentPageNo);
    }

    // 检查是否是数字
    onKeyUp(event: KeyboardEvent) {
        this.currentPageNo = Number(this.currentPageNo);
        if (!this.currentPageNo) {
            this.currentPageNo = 1;
        }
    }

    changePage(pageNum: number): void {
        if (1 <= pageNum && pageNum <= this.maxPageNo) {
            this.currentPageNo = pageNum;
            this.searchUser(this.currentPageNo);
        }
    }

    // 修改所属用户
    clickUser(event, user) {
        user.checked = event.target.checked;
        if (user.checked) {
            // 如果勾选了该用户，且该用户当前不在已勾选清单内
            if (_.findIndex(this.selectedUsers, (item) => {
                return
                }) < 0) {
                this.selectedUsers.push(user);
            }
        } else {
            _.remove(this.selectedUsers, (item) => {
                return item.id === user.id;
            })
        }
    }
}