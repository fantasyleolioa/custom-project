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
import { SelectedUsersService } from '../../../../service/selectedUsers-service';

@Component({
  selector: 'RoleCatalogEdit',
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../style-common.scss','./roleCatalogEdit.scss'],
  templateUrl: './roleCatalogEdit.html'
})
export class RoleCatalogEdit {
  // Properties
  public roleId: string = "";
  public roleName: string = "";
  public roleOrg: string = "";
  public isEnabled: string = 'true';
  public promptText: string = "";
  public roleList: Array<UserInfo> = [];
  public pannelEnvironment: ButtonSetting[] = [];
  private modalRef: NgbModalRef;
  public modalConfirmStatus: boolean = false;
  public hasChildRold: boolean = false;

  public modalConfirmText: string = "确定";
  public role: RoleInfo = new RoleInfo("", "", "", null, "", "");
  public catalog: RoleCatalogInfo = new RoleCatalogInfo();
  @ViewChild('AddRoleModal') public AddRoleModal;

  @ViewChild('msgModal') public msgModal;

  // Constructor
  constructor(private ccContext: CCContext,
    private contentTopService: ContentTopService,
    private router: Router,
    private route: ActivatedRoute,
    private preloader: BaThemeSpinner,
    private selectedUsersService: SelectedUsersService,
    private modalService: NgbModal) {
    // let editedRoleCatalogId = window.sessionStorage.getItem("EditedRoleCatalogId");
    let editedRoleCatalogId: any = null;
    this.route.params.subscribe(params => {
      console.log(params);
      editedRoleCatalogId = params.id;
    })
    if (editedRoleCatalogId) {
      this.ccContext.RoleRepository.GetAllRoleCatalog()
        .subscribe(
        (result) => {
          this.catalog =
            result.find(
              (item) => {
                if (item.id === editedRoleCatalogId) {
                  return item;
                }
              }
            );
        }
        );
      this.ccContext.RoleRepository.GetRoleByCatalogId(editedRoleCatalogId)
        .subscribe(
        (result) => {
          console.log(result);
          this.roleList = result;
        }
        );
    } else {
      this.router.navigate(['/pages/roleManagement/roleEdit']);
    }

    this.contentTopService.clearSubscribe("button.trigger");
    this.EnvironmentStart();
    this.EnvironmentSetting();
  }

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
  public goback() {
    this.router.navigate(['/pages/roleManagement/roleEdit']);
  }
  public disabledRoleCatalogForSure() {
    this.modalRef = this.modalService.open(this.msgModal);
    //this.disabledRoleCatalog();
  }
  public disabledRoleCatalog() {
    this.promptText = ""
    this.preloader.preloaderShow();
    this.ccContext.RoleRepository.DisableRoleCatalog(this.catalog.id, this.catalog.hash)
      .subscribe(
      (result) => {
        console.log(result);
        this.preloader.preloaderHide();
        this.modalRef.close();
        this.router.navigate(['/pages/roleManagement/roleEdit']);
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
  public updatCatalog() {
    this.promptText = ""
    this.preloader.preloaderShow();
    this.ccContext.RoleRepository.UpdateRoleCatalog(this.catalog.id, this.catalog.name, this.catalog.hash)
      .subscribe(
      (result) => {
        console.log(result);
        this.preloader.preloaderHide();
        this.router.navigate(['/pages/roleManagement/roleEdit']);
      },
      (error) => {
        if (error._body != "") {
          this.promptText = JSON.parse(error._body).message;
        }
        else {
          this.promptText = error.statusText;
        }

      }
      )
  }
  public editRole(role: any) {
    //window.sessionStorage.setItem("EditedRoleId", role.id);
    this.selectedUsersService.initUsers();
    this.router.navigate(['/pages/roleManagement/roleIndEdit',{id:role.id}]);
  }
  public openAddRoleModal() {
    this.modalRef = this.modalService.open(this.AddRoleModal);
  };
  public addRole() {
    this.modalConfirmStatus = true;
    this.modalConfirmText = "新增中请稍后";
    this.role.id = this.roleId;
    this.role.name = this.roleName;
    this.role.catalogId = this.catalog.id;
    this.ccContext.RoleRepository.UpdateRole(this.role)
      .subscribe(
      (result) => {
        console.log(result);
        location.reload();
        // this.ResetEnviroment();
        // this.modalConfirmStatus = false;
        // this.modalConfirmText = "确定";
        // this.modalRef.close();
      },
      (error) => {
        this.modalConfirmStatus = false;
        this.modalConfirmText = "确定";
        if (error._body != "") {
          window.alert(JSON.parse(error._body).message);
        }
        else {
          window.alert(error.statusText);
        }
      }
      )
  };
  private ResetEnviroment() {

  };
}

