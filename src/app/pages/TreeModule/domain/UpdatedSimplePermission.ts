import { AppPermission } from "./appPermission";

export class UpdatedSimplePermission{
    id:string;
    permission:AppPermission;
    hash:string;
    constructor(_id:string, _permission:AppPermission, _hash?:string){

        this.id = _id;
        this.permission = _permission;
        this.hash = _hash;
    }
}