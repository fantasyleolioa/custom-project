import { OrgPermission } from './orgPermission';
import { RolePermission } from './rolePermission';
import { UserPermission } from './userPermission';
import { AppPermission } from "./appPermission";


export class AuthSource{

    public user:UserPermission;
    public org:OrgPermission[];
    public role:RolePermission[];
    public result:AppPermission;
    
    constructor() { }
}