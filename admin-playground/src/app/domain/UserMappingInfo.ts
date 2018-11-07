export class UserMappingInfo{

    public sysId:string;
    public sysCategoryId:string;
    public name:string;
    public verifyUserId:string;
    public checked:boolean;

    constructor(_sysId:string, _sysCategoryId:string, _name:string, _verifyUserId:string)
    {
        this.sysId = _sysId;
        this.sysCategoryId = _sysCategoryId;
        this.name = _name;
        this.verifyUserId = _verifyUserId;
    }
}

export class UpdateMappingInfo{

    public userId:string;
    public identityId:string;
    public verifyUserId:string;
    public password:string;

    constructor(_userId:string, _identityId:string, _verifyUserId:string, _password:string)
    {
        this.userId = _userId;
        this.identityId = _identityId;
        this.verifyUserId = _verifyUserId;
        this.password = _password;
    }
}
