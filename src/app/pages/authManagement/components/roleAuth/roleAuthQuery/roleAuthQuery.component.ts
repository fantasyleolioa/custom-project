import {Component, ViewEncapsulation} from '@angular/core';
import { Router } from "@angular/router";

import { ButtonSetting } from '../../../../../domain/ButtonSetting';
import { RoleInfo } from "../../../../../domain/RoleInfo";
import { CCContext } from '../../../../../domain/CCContext';
import { ContentTopService } from '../../../../../service/contentTopService/ContentTop.service';


@Component({
  selector: 'RoleAuthQuery',
  styleUrls: [('./roleAuthQuery.scss')],
  templateUrl: './roleAuthQuery.html'
})
export class RoleAuthQuery {

  // Properties
  public roleId:string = '';
  public roleName:string = '';

  public nowPage:string = "1";
  public pageCount:number = 1;
  public isPageChanged:boolean = false;
  public lastPage:string = "1";

  public pannelEnvironment: ButtonSetting[] = [];
  public roleList:RoleInfo[] = [];

  public searchButtonText:string = "查询";
  public searchButtonStatus:boolean = false;

 
  // Constructor
  constructor(private ccContext: CCContext,
              private contentTopService: ContentTopService, 
              private router: Router)
  {
    
    this.contentTopService.clearSubscribe("button.trigger");
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

  public searchData() {

    this.searchButtonStatus = true;
    this.searchButtonText = "查询中";

    this.ccContext.RoleRepository.GetAllRoleByPage(1, this.roleId, this.roleName)
        .subscribe(
          (result) => {

            this.pageCount = Math.ceil(result.totalCount / 10);
            if(this.pageCount == 0){this.pageCount = 1};

            this.roleList = result.role;

            this.searchButtonText = "查询";
            this.searchButtonStatus = false;

            this.nowPage = "1";
          }
        );
  };

  public searchDataWithPage(pageNumber:number) {

    this.ccContext.RoleRepository.GetAllRoleByPage(pageNumber, this.roleId, this.roleName)
        .subscribe(
          (result) => {

            this.pageCount = Math.ceil(result.totalCount / 10);
            if(this.pageCount == 0){this.pageCount = 1};

            this.roleList = result.role;

            this.searchButtonText = "查询";
            this.searchButtonStatus = false;
          }
        );
  };

  public roleAuthDataEdit(target:RoleInfo){

    window.sessionStorage.setItem("EdittedRole", JSON.stringify(target));
    this.router.navigate(["/pages/permissionsManagement/roleAuthEdit"]);
  };


  // State Trigger
  private EnvironmentSetting() {
    this.contentTopService.TitleSetting('角色权限');

    this.contentTopService.ChangeStatus('normal');

    this.contentTopService.EnvironmentSetting(this.pannelEnvironment);
    this.contentTopService.SetBackLastCustom(false);
    this.contentTopService.SetBackLastPage(false);
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
