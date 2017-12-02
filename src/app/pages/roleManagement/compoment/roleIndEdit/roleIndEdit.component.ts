import { Component, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ButtonSetting } from '../../../../domain/ButtonSetting';
import { UserInfo } from '../../../../domain/UserInfo';
import { RoleInfo } from '../../../../domain/RoleInfo';
import { RoleCatalogInfo } from '../../../../domain/RoleCatalogInfo';
import { CCContext } from '../../../../domain/CCContext';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { BasicMetadata } from '../../../../domain/BasicMetadata';
import { BaThemeSpinner } from "../../../../theme/services/baThemeSpinner";
import { SelectedUsersService } from '../../../../service/selectedUsers-service';
import * as _ from 'lodash';

@Component({
  selector: 'RoleIndEdit',
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../style-common.scss','./roleIndEdit.scss'],
  templateUrl: './roleIndEdit.html'
})
export class RoleIndEdit {
  // Properties
  // public roleId: string = "";
  // public roleName: string = "";
  // public roleOrg: string = "";
  // public isEnabled: string = 'true';
  public promptText: string = "";
  public userList: Array<UserInfo> = [];
  public pannelEnvironment: ButtonSetting[] = [];
  private modalRef: NgbModalRef;
  // public modalConfirmStatus: boolean = false;
  // public hasChildRold: boolean = false;

  // public modalConfirmText: string = "确定";
  public role: RoleInfo = new RoleInfo("", "", "", null, "", "");
  public catalog: RoleCatalogInfo = new RoleCatalogInfo();
  private editedRoleInfo: { roleId: string, userIds: Array<string>; } = { roleId: '', userIds: [] };
  public selectedUsers: UserInfo[] = [];
  public selectedcCatalog: string = "";
  public addRoleId:string = "";
  public addRoleName:string = "";
  public roleCatalogList: BasicMetadata[] = [];
  @ViewChild('CopyRoleModal') public CopyRoleModal;

  @ViewChild('msgModal') public msgModal;

  // Constructor
  constructor(private ccContext: CCContext,
    private contentTopService: ContentTopService,
    private router: Router,
    private route:ActivatedRoute,
    private preloader: BaThemeSpinner,
    private selectedUsersService: SelectedUsersService,
    private modalService: NgbModal) {
    //let editedRoleId = window.sessionStorage.getItem("EditedRoleId");
    let editedRoleId: any = null;
    this.route.params.subscribe(params => {
      console.log(params);
      editedRoleId = params.id;
    })
    this.selectedUsers = selectedUsersService.getUsers();
    console.log(editedRoleId);
    if (editedRoleId) {
      this.ccContext.RoleRepository.GetRoleById(editedRoleId)
        .subscribe(
        (result) => {
          console.log(result);
          // this.role.id=result.id;
          // this.role.name=result.name;
          this.role = result;
          this.catalog.name = result.catalogName;
          this.catalog.id = result.catalogId;
        }
        );
      if (this.selectedUsers.length) {
        this.userList = this.selectedUsers;
      } else {
        this.ccContext.UserRepository.GetUserInRole(editedRoleId)
          .subscribe(
          (result) => {
            console.log(result);
            this.userList = _.cloneDeep(result);;
            this.selectedUsers = this.userList;
          }
          );
      }

    } else {
      this.router.navigate(['/pages/roleManagement/roleEdit']);
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
    if (goto === 'roleCatalogEdit'){
      console.log(this.catalog.id);
      this.router.navigate(['/pages/roleManagement/roleCatalogEdit',{id:this.catalog.id}]);
    }else{
      this.router.navigate(['/pages/roleManagement/' + goto]);
    } 
    // window.sessionStorage.setItem("EditedRoleCatalogId", this.catalog.id);
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
        this.router.navigate(['/pages/roleManagement/roleCatalogEdit',{id:this.catalog.id}]);
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
    let updateRoleFlag = false;
    let updateUserInRoleFlag = false;
    this.promptText = "";
    this.preloader.preloaderShow();
    this.ccContext.RoleRepository.UpdateRole(this.role)
      .subscribe(
      (result) => {
        console.log(result);
        this.preloader.preloaderHide();
        updateRoleFlag = true;
        //this.router.navigate(['/pages/roleManagement/roleCatalogEdit']);
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

    let userIds = [];
    userIds = this.selectedUsers.map(
      (value) => {
        return value.id;
      }
    );
    if (userIds.length) {
      this.editedRoleInfo.roleId = this.role.id;
      this.editedRoleInfo.userIds = userIds;
      this.ccContext.RoleRepository.UpdateUserInRole(this.editedRoleInfo)
        .subscribe(
        (result) => {
          console.log(result);
          this.preloader.preloaderHide();
          updateUserInRoleFlag = true;
          //this.router.navigate(['/pages/roleManagement/roleCatalogEdit']);
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
    } else {
      updateUserInRoleFlag = true;
    }
    let that = this;
    setTimeout(function () {
      waitingPromise();
    }, 100);
    function waitingPromise() {
      setTimeout(function () {
        if (updateUserInRoleFlag && updateRoleFlag) {
          that.router.navigate(['/pages/roleManagement/roleCatalogEdit',{id:that.catalog.id}]);
        } else {
          waitingPromise();
        }
      }, 50);
    }
  }

  public openCopyRoleModal() {
    this.selectedcCatalog = '';
    this.addRoleId='';
    this.addRoleName='';
    this.ccContext.RoleRepository.GetAllRoleCatalog()
      .subscribe(
      (result: BasicMetadata[]) => {
        _.remove(result, (item) => {
          return item.id === 'administrators';
        });
        // _.remove(result, (item) => {
        //   return item.id ===this.catalog.id;
        // });        
        this.roleCatalogList = result;
      }
      )
    this.modalRef = this.modalService.open(this.CopyRoleModal);
  }
  public catalogSelected() {
    console.log(this.selectedcCatalog);
  };
  public copyRole() {
    let addRole:any ={};
    addRole.catalogId=this.selectedcCatalog
    addRole.id=this.addRoleId;
    addRole.name=this.addRoleName;
    this.ccContext.RoleRepository.UpdateRole(addRole)
    .subscribe(
      (result) => {
        console.log(result);
        this.addUserIds();
      },
      (error) => {
        console.log(error);
        // if(error._body != ""){
        //   window.alert(JSON.parse(error._body).message);
        // }
        // else{
        //   window.alert(error.statusText);
        // }
      }
    )
  }
  private addUserIds(){
    let userIds = [];
    userIds = this.selectedUsers.map(
      (value) => {
        return value.id;
      }
    );
    //window.sessionStorage.setItem("EditedRoleCatalogId", this.selectedcCatalog);
    if (userIds.length) {
      this.editedRoleInfo.roleId = this.addRoleId;
      this.editedRoleInfo.userIds = userIds;
      this.preloader.preloaderShow();
      this.ccContext.RoleRepository.UpdateUserInRole(this.editedRoleInfo)
        .subscribe(
        (result) => {
          console.log(result);
          this.preloader.preloaderHide();
          this.modalRef.close();
          this.router.navigate(['/pages/roleManagement/roleCatalogEdit',{id:this.selectedcCatalog}]);
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
    }else{
      this.router.navigate(['/pages/roleManagement/roleCatalogEdit',{id:this.selectedcCatalog}]);
    }    
  }
  public removeSelectedUser(user: UserInfo) {
    _.remove(this.selectedUsers, (item) => {
      return item.id === user.id;
    });
    this.selectedUsersService.setUsers(this.selectedUsers);
  }
  public goToAdvance() {
    //window.sessionStorage.setItem("RoleIndEditId", this.role.id);
    this.router.navigate(['/pages/roleManagement/roleAdvanceEdit',{id:this.role.id}]);
  }
}

