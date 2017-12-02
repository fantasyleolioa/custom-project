import { Component, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ButtonSetting } from '../../../../domain/ButtonSetting';
import { UserInfo } from '../../../../domain/UserInfo';
import { RoleInfo } from '../../../../domain/RoleInfo';
import { RoleCatalogInfo } from '../../../../domain/RoleCatalogInfo';
import { CCContext } from '../../../../domain/CCContext';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { BasicMetadata } from '../../../../domain/BasicMetadata';
import { BaThemeSpinner } from "../../../../theme/services/baThemeSpinner";
import * as _ from 'lodash';
import {SelectedUsersService} from '../../../../service/selectedUsers-service';

@Component({
  selector: 'RoleAdvanceEdit',
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../style-common.scss','./roleAdvanceEdit.scss'],
  templateUrl: './roleAdvanceEdit.html'
})
export class RoleAdvanceEdit {
  // Properties
  // public roleId: string = "";
  // public roleName: string = "";
  // public roleOrg: string = "";
  // public isEnabled: string = 'true';
  // public modalConfirmStatus: boolean = false;
  // public hasChildRold: boolean = false;
  // public modalConfirmText: string = "确定";
  // public pannelEnvironment: ButtonSetting[] = [];
  // public searchButtonText: string = "查询";
  // public searchButtonStatus: boolean = false;    
  public promptText: string = "";
  public userList: Array<UserInfo> = [];
  public pannelEnvironment: ButtonSetting[] = [];
  public modalRef: NgbModalRef;
  public role: RoleInfo = new RoleInfo("", "", "", null, "", "");
  public catalog: RoleCatalogInfo = new RoleCatalogInfo();
  public nowPage: string = "1";
  public pageCount: number = 1;
  public isPageChanged: boolean = false;
  public lastPage: string = "1";
  public condition: string = "";
  public selectedUsers: UserInfo[] = [];
  @ViewChild('PreviewModal') public PreviewModal;

  @ViewChild('msgModal') public msgModal;

  // Constructor
  constructor(private ccContext: CCContext,
    private contentTopService: ContentTopService,
    private router: Router,
    private route:ActivatedRoute,
    private preloader: BaThemeSpinner,
    private selectedUsersService: SelectedUsersService,
    private modalService: NgbModal) {
    //let roleIndEditId = window.sessionStorage.getItem("RoleIndEditId");
    let roleIndEditId: any = null;
    this.route.params.subscribe(params => {
      console.log(params);
      roleIndEditId = params.id;
    })    
    if (roleIndEditId) {
      this.ccContext.RoleRepository.GetRoleById(roleIndEditId)
        .subscribe(
        (result) => {
          console.log(result);
          // this.roleId=result.id;
          // this.roleName=result.name;
          this.role = result;
          this.catalog.name = result.catalogName;
          this.catalog.id = result.catalogId;
        }
        );
        this.selectedUsers = _.cloneDeep(this.selectedUsersService.getUsers());
        if(!this.selectedUsers.length){
          this.ccContext.UserRepository.GetUserInRole(roleIndEditId)
            .subscribe(
            (result) => {
              console.log(result);
              this.selectedUsers = _.cloneDeep(result);
              this.searchDataWithPage(1);
            }
            );
        }else{
          this.searchDataWithPage(1);
        }

    } else {
      this.router.navigate(['/pages/roleManagement/roleIndEdit']);
    }

    this.contentTopService.clearSubscribe("button.trigger");
    this.EnvironmentStart();
    this.EnvironmentSetting();
  }
  // Method

  // State Trigger
  private EnvironmentSetting() {
    this.contentTopService.TitleSetting('角色编辑');
    this.contentTopService.ChangeStatus('normal');
    // this.pannelEnvironment.push(new ButtonSetting('addRole', '新增', 'btn-primary-normal', 'addRole', false));
    this.contentTopService.EnvironmentSetting(this.pannelEnvironment);
  };


  // Global Subscribe
  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {
    });
  };

  private getNotify(event: any) {
    console.log(event);
  };
  public goback(goto: string) {
    // if (goto === 'roleCatalogEdit'){
    //   this.router.navigate(['/pages/roleManagement/roleCatalogEdit',{id:this.catalog.id}]);
    // }
    // // window.sessionStorage.setItem("EditedRoleCatalogId", this.catalog.id);
    // if (goto === 'roleIndEdit') 
    switch (goto){
      case 'roleCatalogEdit':
      this.router.navigate(['/pages/roleManagement/roleCatalogEdit',{id:this.catalog.id}]);
      break;
      case 'roleIndEdit':
      //window.sessionStorage.setItem("EditedRoleId", this.role.id);
      this.router.navigate(['/pages/roleManagement/roleIndEdit',{id:this.role.id}]);
      break;      
      default:
      this.router.navigate(['/pages/roleManagement/' + goto]);
      
    }
  }
  public disabledRoleForSure() {
    this.modalRef = this.modalService.open(this.msgModal);
  }
  public disabledRole() {
    this.promptText = ""
    this.preloader.preloaderShow();
    this.ccContext.RoleRepository.DisableRole(this.role.id, this.role.hash)
      .subscribe(
      (result) => {
        console.log(result);
        this.preloader.preloaderHide();
        this.modalRef.close();
        this.router.navigate(['/pages/roleManagement/roleCatalogEdit']);
      },
      (error) => {
        console.log(error);
        this.preloader.preloaderHide();
        this.modalRef.close();
        if (error._body != "") {
          this.promptText = JSON.parse(error._body).message;
        }
        else {
          this.promptText = error.statusText;
        }

      }
      )
  }
  public updatRole() {
    this.promptText = ""
    this.preloader.preloaderShow();
    this.ccContext.RoleRepository.UpdateRole(this.role)
      .subscribe(
      (result) => {
        console.log(result);
        this.preloader.preloaderHide();
        this.router.navigate(['/pages/roleManagement/roleCatalogEdit']);
      },
      (error) => {
        console.log(error);
        this.preloader.preloaderHide();
        if (error._body != "") {
          this.promptText = JSON.parse(error._body).message;
        }
        else {
          this.promptText = error.statusText;
        }
      }
      )
  }
  public changePage(pageTarget: string, variable: number) {

    if ((Number(pageTarget) + variable) == 0) {
      this.nowPage = "1";
    } else if ((Number(pageTarget) + variable) > this.pageCount) {
      this.nowPage = this.pageCount.toString();
    } else {
      this.nowPage = (Number(pageTarget) + variable).toString();
    };

    this.searchDataWithPage(Number(this.nowPage));
  };
  // public searchData() {

  //       this.searchButtonStatus = true;
  //       this.searchButtonText = "查询中";

  //       this.ccContext.RoleRepository.QueryDisabledRole(1, this.roleId, this.roleName)
  //       .subscribe(
  //         (result) => {
  //           console.log(result);
  //           this.pageCount = Math.ceil(result.totalCount / 10);
  //           if(this.pageCount == 0){this.pageCount = 1};

  //           //this.roleList = result.role;

  //           this.searchButtonText = "查询";
  //           this.searchButtonStatus = false;

  //           this.nowPage = "1";
  //         }
  //       );

  //     }

  public searchDataWithPage(pageNumber: number) {
    this.preloader.preloaderShow();
    this.ccContext.UserRepository.QueryUser(pageNumber, '', this.condition)
      .subscribe(
      (result) => {
        console.log(result);
        this.pageCount = Math.ceil(result.totalCount / 10);
        if (this.pageCount == 0) { this.pageCount = 1 };
        this.userList = _.cloneDeep(result.user);
        _.forEach(this.userList, item => {
          const index = _.findIndex(this.selectedUsers, o => {
            return item.id === o.id;
          });
          item['checked'] = index >= 0;
        });
        console.log(this.userList);
        this.preloader.preloaderHide();
      },
      (error) => {
        console.log(error);
        this.preloader.preloaderHide();
        // if (error._body != "") {
        //   this.promptText = JSON.parse(error._body).message;
        // }
        // else {
        //   this.promptText = error.statusText;
        // }
      }
      );
  }
  public preview(){
    this.modalRef = this.modalService.open(this.PreviewModal);   
  }
  public updateTmpUsers(){
    this.selectedUsersService.setUsers(this.selectedUsers);
    this.goback('roleIndEdit');
    //console.log(this.selectedUsersService.getUsers());
  }
  public clickUser(event, user) {
    user.checked = event.target.checked;
    if (user.checked) {
        // 如果勾选了该用户，且该用户当前不在已勾选清单内
        if (_.findIndex(this.selectedUsers, (item) => {
             return item.id===user.id;
            }) < 0) {
            this.selectedUsers.push(user);
        }
    } else {
        _.remove(this.selectedUsers, (item) => {
            return item.id === user.id;
        })
    }
}
public onKeyUp(event: KeyboardEvent) {

    if (event.key == "Enter") {

      if (Number(this.nowPage) > this.pageCount) {

        this.lastPage = this.pageCount.toString();
        this.nowPage = this.pageCount.toString();
      }
      else if (Number(this.nowPage) <= 0) {

        this.lastPage = "1";
        this.nowPage = "1";
      }
      else {

        this.lastPage = Number(this.nowPage).toString();
      }


      this.searchDataWithPage(Number(this.lastPage));
    };
  };

  public onFocusOut(event: FocusEvent) {

    if (Number(this.lastPage) != Number(this.nowPage)) {

      if (Number(this.nowPage) > this.pageCount) {

        this.lastPage = this.pageCount.toString();
        this.nowPage = this.pageCount.toString();
      }
      else if (Number(this.nowPage) <= 0) {

        this.lastPage = "1";
        this.nowPage = "1";
      }
      else {

        this.lastPage = Number(this.nowPage).toString();
      };

      this.searchDataWithPage(Number(this.lastPage));
    };
  };

}

