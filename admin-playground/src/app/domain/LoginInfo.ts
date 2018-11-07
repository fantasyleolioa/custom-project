export class LoginInfo {

    userId:string;
    password?:string;
    passwordHash:string;
    identityType:string;
    queryParameter?:Array<any>;

    constructor(_userId:string, _passwordHash:string, _identityType:string){

        this.userId = _userId;
        this.passwordHash = _passwordHash;
        this.identityType = _identityType;
    }
}   