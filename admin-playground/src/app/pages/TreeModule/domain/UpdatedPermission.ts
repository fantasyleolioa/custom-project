import { AppPermission } from "./appPermission";

export class UpdatedPermission{
    id:string;
    userInOrg:UserInOrgSimple[];
    permission:AppPermission;

    constructor(_id:string, _userInOrg:UserInOrgSimple[], _permission:AppPermission){

        this.id = _id;
        this.userInOrg = _userInOrg;
        this.permission = _permission;
    }
}

export class UserInOrgSimple{

    roleId:string;
    orgId:string;
    constraint:string;
    priority:number;
    hash:string;

    constructor(_roleId:string, _orgId:string, _constraint:string, _priority:number, _hash:string){

        this.roleId = _roleId;
        this.orgId = _orgId;
        this.constraint = _constraint;
        this.priority = _priority;
        this.hash = _hash;
    }
}