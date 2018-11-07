export class SysInfo{

    public id:string;
    public idFirst:string;
    public idSecond:string;
    public categoryId:string;
    public name:string;
    public hash:string;
    public checked?:boolean;

    constructor() {}
}

export class UpdateSysInfo{

    public idFirst:string;
    public idSecond:string;
    public categoryId:string;
    public name:string;
    public hash:string;

    constructor(_idF:string, _idS:string, _categoryId:string, _name:string, _hash:string) 
    {
        this.idFirst = _idF;
        this.idSecond = _idS;
        this.categoryId = _categoryId;
        this.name = _name;
        this.hash = _hash;
    }
}

export class SysSetting{

    public key:string;
    public name:string;
    public value:any;
    public type:string;
    public typeParameter?:string[];
    public hash:string;
}

export class UpdateSysSetting{

    public sysId:string;
    public setting:SysSetting[];

    constructor(_id:string, _setting:SysSetting[]){

        this.sysId = _id;
        this.setting = _setting;
    }
}




export class SysCategory{

    public id:string;
    public name:string;

    constructor(){ }
}