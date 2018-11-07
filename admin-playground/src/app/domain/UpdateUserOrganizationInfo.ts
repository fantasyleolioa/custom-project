export class UpdateUserOrganizationInfo{

  /**
   * 
    * Creates an instance of UpdateUserOrganizationInfo.
    * @param {string} id 
    * @param {Array<UserOrganizationInfo>} [userInOrgs=new Array<UserOrganizationInfo>()] 
    * 
    * @memberof UpdateUserOrganizationInfo   
   */
  constructor(public id: string,
              public userInOrgs: Array<UserOrganizationInfo> = new Array<UserOrganizationInfo>()){

  }
}

export class UserOrganizationInfo{

  /**
   * Creates an instance of UserOrganizationInfo.
   * @param {string} orgId 
   * @param {string} roleId 
   * @param {string} constraint 
   * @param {number} priority 
   * @param {string} hash 
   * 
   * @memberof UserOrganizationInfo
   */
  constructor(public orgId: string, 
              public roleId: string, 
              public constraint: string, 
              public priority:number, 
              public hash:string){}
}