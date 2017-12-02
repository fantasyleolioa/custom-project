import {BaThemeSpinner} from '../../../../theme/services/baThemeSpinner';
import {NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Component, Injectable, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

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
import {TreeDataTransferService} from "../../../../service/treeService/TreeDataTransfer.service";
import {TreeData} from "../../../../domain/treeData";
import {OrgTagTreeData} from "../../../../domain/OrgInfo";
import {TreeEventService} from "app/service/treeService";

@Component({
    selector: 'organizational-permissions-view',
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['./apply-permissions-view.component.scss'],
    styleUrls: ['../../systemManagement.component.scss'],
    templateUrl: './organizational-permissions-view.component.html'
})
export class OrganizationalPermissionsViewComponent implements OnInit {

    // 当前角色
    role: RoleInfo;

    formStatus: string;

    // 用户清单
    searchedUsers: UserInfo[] = [];
    // 组织权限清单
    roleOrgPolicy: any[] = [];
    // 组织分类（下拉）
    orgCatalogs: any[] = [];
    // 组织分类（选中）
    selectedOrgCatalog: string = '';
    // 组织树（下拉）
    orgAspectList: any[] = [];
    // 组织树（选中）
    selectedOrgAspect: string = '';
    // 组织树状结构
    orgTreeData: any[] = [];

    private modalRef: NgbModalRef;
    @ViewChild('PreviewModal') previewModal: any;
    @ViewChild('OrgPreviewModal') orgPreviewModal: any;

    constructor(private state: GlobalState,
                private contentTopService: ContentTopService,
                private loader: BaThemeSpinner,
                private ccContext: CCContext,
                private modalService: NgbModal,
                private router: Router,
                private authTreeService: AuthTreeService,
                private reflectService: AuthReflectService,
                private treeEvent: TreeEventService,
                private transfer: TreeDataTransferService,
                public route: ActivatedRoute) {

        this.formStatus = 'normal';

        // get role from params
        this.role = new RoleInfo(null, null, null, null, null, null);
        route.params.subscribe(params => {
            this.role.id = params['id'] || '';
            this.role.name = params['name'] || '';
            this.role.hash = params['hash'] || '';
        });
        // get organization
        this.searchOrgPolicy();
        // get belonged users
        this.searchUser();
        // this.searchRole();


        // this.queryOrgCatalog();
    }

    ngOnInit(): void {

    }

    // 查询当前角色有何用户
    searchUser(): void {
        this.showLoading();
        this.ccContext.PlatformRepository.GetRoleAllUsers(this.role.id)
            .subscribe(
                (result) => {
                    this.searchedUsers = _.cloneDeep(result);
                    this.hideLoading();
                }, (error) => {
                    this.showErrorMessage(error);
                });
    }

    // 查询当前角色有何组织
    searchOrgPolicy(): void {
        this.showLoading();
        this.roleOrgPolicy = [];
        this.ccContext.PlatformRepository.GetRoleOrgPolicy(this.role.id)
            .subscribe(
                (result) => {
                    this.roleOrgPolicy = _.cloneDeep(result);
                    this.hideLoading();
                }, (error) => {
                    this.showErrorMessage(error);
                });
    }

    // 查询有哪些组织分类
    queryOrgCatalog(): void {
        this.showLoading();
        this.orgCatalogs = [];
        this.ccContext.PlatformRepository.GetOrgCatalog()
            .subscribe(
                (result) => {
                    this.orgCatalogs = _.cloneDeep(result);
                    if (this.orgCatalogs.length > 0) {
                        this.selectOrgCatalog(this.orgCatalogs[0]['id']);
                    }
                    this.hideLoading();
                }, (error) => {
                    this.showErrorMessage(error);
                });
    }

    // 查询有哪些组织树
    queryOrgTreeByCatalog(): void {
        this.showLoading();
        this.orgAspectList = [];
        this.ccContext.PlatformRepository.GetOrgTreeByCatalog(this.selectedOrgCatalog)
            .subscribe(
                (result) => {
                    this.orgAspectList = _.cloneDeep(result);
                    if (this.orgAspectList.length > 0) {
                        this.selectOrgTree(this.orgAspectList[0]['id']);
                    }
                    this.hideLoading();
                }, (error) => {
                    this.showErrorMessage(error);
                });
    }

    // 查询有哪些组织分类
    queryOrg(): void {
        this.showLoading();
        this.orgTreeData = [];
        this.ccContext.PlatformRepository.GetOrgPolicy({
            roleId: this.role.id,
            aspectId: this.selectedOrgAspect
        }).subscribe(
            (result) => {
                let tempData = result;
                for (let i = 0; i < tempData.length; i++) {
                    tempData[i].parentSid = tempData[i].parentSid + '';
                    tempData[i].sid = tempData[i].sid + '';
                    tempData[i].orgAspectSid = tempData[i].sid;
                    tempData[i].typeUri = tempData[i].uri;

                    const ff = _.findIndex(this.roleOrgPolicy, (item) => {
                        return item.uri == tempData[i].uri;
                    });
                    tempData[i].checked = ff >= 0;
                }
                this.orgTreeData = this.transfer.TransferOrgWithOutAspect(tempData);
                this.hideLoading();
            }, (error) => {
                this.showErrorMessage(error);
            });
    }

    // 选择组织分类
    selectOrgCatalog(orgCatalogId: string): void {
        this.selectedOrgCatalog = orgCatalogId;
        if (this.selectedOrgCatalog) {
            // 联动下一级
            this.queryOrgTreeByCatalog();
        }
    }

    // 选中组织树
    selectOrgTree(orgTreeId: string): void {
        this.selectedOrgAspect = orgTreeId;
        if (this.selectedOrgAspect) {
            // 联动下一级
            this.queryOrg();
        }
    }

    // TreeEvent
    getCheckedItem(treeData: any): any[] {
        const arrCheckedOrg = this.treeEvent.getCheckedItem(treeData, 'multiple');
        const result = [];
        _.forEach(arrCheckedOrg, (item) => {
            result.push({
               hash: item.hash,
               label: item.label,
               name: item.name,
               sid: item.id,
               typeName: item.orgTypeName,
               uri: item.orgUri,
               urn: item.orgUrn
           });
        });
        // this.roleOrgPolicy = temp;
        return result;
    }

    removeOrg(org): void {
        const index = _.findIndex(this.roleOrgPolicy, (item) => {
            return item.uri === org.uri;
        });
        if (index >= 0) {
            this.roleOrgPolicy.splice(index, 1);
        }
    }

    orgTreeGetNotify(event: any): void {
        if (event === 'getResult') {
            // let checkedOrg = this.getCheckedItem(this.orgTreeData);
            console.log('bili bili');
            this.roleOrgPolicy = _.unionBy(this.roleOrgPolicy, this.getCheckedItem(this.orgTreeData), 'uri')
            // this.roleOrgPolicy.push({
            //     hash: '<empty>',
            //     label: '10000',
            //     name: '总部',
            //     sid: '928532522508357600',
            //     typeName: '公司',
            //     uri: 'drn:iam:org:robam:org:10000',
            //     urn: '老板电器:组织树:总部'
            // })
        } else if (event.eventName === 'remove') {
            console.log('pui pui');
            const index = _.findIndex(this.roleOrgPolicy, (item) => {
               return item.uri === event.target.orgUri;
            });
            if (index >= 0) {
                this.roleOrgPolicy.splice(index, 1);
            }
        }
    }

    previewUsers(): void {
        this.modalRef = this.modalService.open(this.previewModal);
    }

    previewOrg(): void {
        // this.getCheckedItem(this.orgTreeData);

        this.modalRef = this.modalService.open(this.orgPreviewModal);
    }

    edit(): void {
        this.formStatus = 'editted';
        this.queryOrgCatalog();
    }

    save(): void {
        const param = {
            roleId: this.role.id,
            orgs: []
        };
        _.forEach(this.roleOrgPolicy, (item: any) => {
            param.orgs.push({
                uri: item.uri
            });
        });
        this.ccContext.PlatformRepository.UpdateRoleOrgPolicy(param)
            .subscribe(
                (result) => {
                    this.searchedUsers = _.cloneDeep(result);
                    this.hideLoading();
                }, (error) => {
                    this.showErrorMessage(error);
                });
    }

    cancel(): void {
        this.update();
        this.searchOrgPolicy();
    }

    update(): void {
        this.formStatus = 'normal';
        this.orgTreeData = [];
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

}
