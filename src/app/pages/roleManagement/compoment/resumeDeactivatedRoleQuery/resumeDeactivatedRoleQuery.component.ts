import { Component, ViewEncapsulation,ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ButtonSetting } from '../../../../domain/ButtonSetting';
import { UserInfo } from '../../../../domain/UserInfo';
import { RoleInfo } from '../../../../domain/RoleInfo';
import { CCContext } from '../../../../domain/CCContext';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { BasicMetadata } from '../../../../domain/BasicMetadata';

@Component({
  selector: 'ResumeDeactivatedRoleQuery',
  styleUrls: ['../../style-common.scss','./ResumeDeactivatedRoleQuery.scss'],
  templateUrl: './ResumeDeactivatedRoleQuery.html'
})
export class ResumeDeactivatedRoleQuery{

  // Properties
  public roleId:string = "";
  public roleName:string = "";
  public roleOrg:string = "";
  public isEnabled:string = 'true';
  public roleList: Array<UserInfo> = [];

  public nowPage:string = "1";
  public pageCount:number = 1;

  public pannelEnvironment: ButtonSetting[] = [];

  public searchButtonText:string = "查询";
  public searchButtonStatus:boolean = false;
  public isPageChanged:boolean = false;
  public lastPage:string = "1";
  private modalRef:NgbModalRef;
  public modalConfirmStatus: boolean = false;
  public modalConfirmText: string = "确定";
  public selectedcCatalog: string = "";
  public roleCatalogList: BasicMetadata[] = [];
  public resumeRoleId:string = "" ;
  public resumeRoleName:string = "" ;
  @ViewChild('RoleModal') public RoleModal;

  
  // Constructor
  constructor(private ccContext: CCContext,
              private contentTopService: ContentTopService, 
              private router: Router, 
              private modalService:NgbModal)
  {
    this.contentTopService.clearSubscribe("button.trigger");
    this.EnvironmentStart();
    this.EnvironmentSetting();
  }

  // Method
  public changePage(pageTarget:string, variable:number) {

    if ((Number(pageTarget) + variable) == 0){
      this.nowPage = "1";
    } else if((Number(pageTarget) + variable) > this.pageCount){
      this.nowPage = this.pageCount.toString();
    } else{
      this.nowPage = (Number(pageTarget) + variable).toString();
    };

    this.searchDataWithPage(Number(this.nowPage));
  };
  

  public openResumeModal(role){
      console.log(role);
      this.resumeRoleName = role.name;
      this.resumeRoleId = role.id;
      this.selectedcCatalog = role.catalogId;
      this.ccContext.RoleRepository.GetAllRoleCatalog()
      .subscribe(
      (result:BasicMetadata[]) => {
          console.log(result);
          this.roleCatalogList = result;
          //this.selectedcCatalog = this.roleCatalogList[0].id;
        }
       )
      this.modalRef = this.modalService.open(this.RoleModal);
  };
  public resumeDeactiveEdit(){
    this.modalConfirmStatus = true;
    this.modalConfirmText = "恢复中请稍后";
    this.ccContext.RoleRepository.EnableRole(this.resumeRoleId,this.selectedcCatalog)
    .subscribe(
      (result) => {
        this.modalRef.close();
        location.reload();
      },
      (error) => {
        if(error._body != ""){
            window.alert(JSON.parse(error._body).message);
          }
          else{
            window.alert(error.statusText);
          }
          
          this.modalConfirmStatus = false;
          this.modalConfirmText = "确定";
      }
    );
  };
  public catalogSelected(){

  };
  public searchData() {

    this.searchButtonStatus = true;
    this.searchButtonText = "查询中";

    this.ccContext.RoleRepository.QueryDisabledRole(1, this.roleId, this.roleName)
    .subscribe(
      (result) => {
        console.log(result);
        this.pageCount = Math.ceil(result.totalCount / 10);
        if(this.pageCount == 0){this.pageCount = 1};

        this.roleList = result.role;

        this.searchButtonText = "查询";
        this.searchButtonStatus = false;

        this.nowPage = "1";
      }
    );

  }

  public searchDataWithPage(pageNumber:number) {

    this.ccContext.RoleRepository.QueryDisabledRole(pageNumber, this.roleId, this.roleName)
        .subscribe(
          (result) => {
            this.pageCount = Math.ceil(result.totalCount / 10);
            if(this.pageCount == 0){this.pageCount = 1};
            this.roleList = result.role;
          }
        );    
  }

  // State Trigger
  private EnvironmentSetting() {
    this.contentTopService.TitleSetting('恢复停用角色');

    this.contentTopService.ChangeStatus('normal');
    //this.pannelEnvironment.push(new ButtonSetting('addUser', '新增用户', 'btn-primary-normal', 'addUser', false));

    this.contentTopService.EnvironmentSetting(this.pannelEnvironment);
  };

  
  // Global Subscribe
  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {

    });
  };

  // PageNumber Input
  private onKeyUp(event:KeyboardEvent){

    if (event.key == "Enter"){

      if(Number(this.nowPage) > this.pageCount){

        this.lastPage = this.pageCount.toString();
        this.nowPage = this.pageCount.toString();
      }
      else if(Number(this.nowPage) <= 0){

        this.lastPage = "1";
        this.nowPage = "1";
      }
      else{

        this.lastPage = Number(this.nowPage).toString();
      }


      this.searchDataWithPage(Number(this.lastPage));
    };
  };

  private onFocusOut(event:FocusEvent){

    if(Number(this.lastPage) != Number(this.nowPage)){

      if(Number(this.nowPage) > this.pageCount){

        this.lastPage = this.pageCount.toString();
        this.nowPage = this.pageCount.toString();
      }
      else if(Number(this.nowPage) <= 0){

        this.lastPage = "1";
        this.nowPage = "1";
      }
      else{

        this.lastPage = Number(this.nowPage).toString();
      };

      this.searchDataWithPage(Number(this.lastPage));
    };
  };
}
