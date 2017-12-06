export class UpdateUserInOrganizationInfo{

  constructor(public orgId:string, public users:Array<UserRoleInOrgInfo> = new Array<UserRoleInOrgInfo>()){

  }
}

export class UserRoleInOrgInfo{

  /**
   * Creates an instance of UserRoleInOrgInfo.
   * @param {string} userId 用戶編號
   * @param {string} roleId 角色編號
   * @param {string} constraint '[empty]'
   * @param {string} hash 組織hash
   * 
   * @memberOf UserRoleInOrgInfo
   */
  constructor(public userId:string, public roleId:string, public constraint:string, public hash:string){}
}