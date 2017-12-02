import { Component, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ButtonSetting } from '../../../../domain/ButtonSetting';
import { UserInfo } from '../../../../domain/UserInfo';
import { RoleInfo } from '../../../../domain/RoleInfo';
import { RoleCatalogInfo } from '../../../../domain/RoleCatalogInfo';
import { CCContext } from '../../../../domain/CCContext';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { BasicMetadata } from '../../../../domain/BasicMetadata';
import { TreeData } from '../../../../domain/TreeData';
import { TreeDataTransferService, TreeEventService } from '../../../../service/treeService';
import { BaThemeSpinner } from "../../../../theme/services/baThemeSpinner";

@Component({
  selector: 'RoleEdit',
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../style-common.scss','./roleEdit.scss'],
  templateUrl: './roleEdit.html'
})
export class RoleEdit {
  // Properties
  public roleId: string = "";
  public roleName: string = "";
  public roleOrg: string = "";
  public isEnabled: string = 'true';
  public roleList: Array<UserInfo> = [];
  public pannelEnvironment: ButtonSetting[] = [];
  private modalRef: NgbModalRef;
  public modalConfirmStatus: boolean = false;
  public modalConfirmText: string = "确定";
  public roleCatalogList: Array<any> = [];
  public treeData: TreeData[] = [];
  public editStatus: string = "single";
  public roleCatalogId: string = "";
  public roleCatalogName: string = "";

  @ViewChild('AddRoleCatalogModal') public AddRoleCatalogModal;


  // Constructor
  constructor(private ccContext: CCContext,
    private contentTopService: ContentTopService,
    private router: Router,
    private route: ActivatedRoute,
    private transfer: TreeDataTransferService,
    private treeEvent: TreeEventService,
    private preloader: BaThemeSpinner,
    private modalService: NgbModal) {
   // this.preloader.preloaderShow();
    this.ccContext.RoleRepository.GetAllRole()
      .subscribe(
      (result) => {
        console.log(result);
        this.treeData = this.transfer.TransferRole(result);
        console.log(this.treeData);
        this.ccContext.RoleRepository.GetAllRoleCatalog()
          .subscribe(
          (result: any[]) => {
            console.log(result);
            this.roleCatalogList =
              result.map(
                (item) => {
                  return { "name": item.name, "id": item.id };
                }
              );

            this.roleCatalogList.forEach(
              (item, index) => {

                if (item.id == "administrators") {
                  this.roleCatalogList.splice(index, 1);
                }
              }
            );
            //this.preloader.preloaderHide();
          }
          );
      }
      );
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
      // if (eventName == "addRole") {
      //   this.openAddModal();
      // }
    });
  };
  public openAddModal() {
    this.modalRef = this.modalService.open(this.AddRoleCatalogModal);
  };
  public addRoleCatalog() {
    this.modalConfirmStatus = true;
    this.modalConfirmText = "新增中请稍后";
    this.ccContext.RoleRepository.UpdateRoleCatalog(this.roleCatalogId, this.roleCatalogName, "")
      .subscribe(
      (result) => {
        this.ResetEnviroment();
        this.ccContext.RoleRepository.GetAllRoleCatalog()
          .subscribe(
          (result: any[]) => {
            this.roleCatalogList =
              result.map(
                (item) => {
                  return { "name": item.name, "id": item.id }
                }
              );
          }
          );

        this.modalConfirmStatus = false;
        this.modalConfirmText = "确定";
        this.modalRef.close();
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
    this.ccContext.RoleRepository.GetAllRole()
      .subscribe(
      (result) => {
        this.treeData = this.transfer.TransferRole(result);
        this.roleCatalogId = "";
        this.roleCatalogName = "";
        // this.contentTopService.EnvironmentSetting([]);
        this.contentTopService.EnvironmentSetting(this.pannelEnvironment);
        this.ccContext.RoleRepository.GetAllRoleCatalog()
          .subscribe(
          (result: any[]) => {

            this.roleCatalogList =
              result.map(
                (item) => {

                  return { "name": item.name, "id": item.id };
                }
              );
          }
          );
      }
      );
  };
  private getNotify(event: any) {
    if (event.eventName === 'editRole') {
      //window.sessionStorage.setItem("EditedRoleCatalogId", event.data);
      this.router.navigate(['/pages/roleManagement/roleCatalogEdit', { id: event.data }]);
    }

  };

}
