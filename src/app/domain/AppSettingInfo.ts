export class AppsettingInfo{

    public countingId: string;
    public countingName: string;
    public type: string;
    public subCollapsed: boolean = false;
    public checked: boolean = false;
    public affected: CountingAppInfo[];
    public amount: CountingAmountInfo;
    public argument: CountingArgumentInfo;

    constructor(){

        this.countingId = "";
        this.countingName = "";
        this.type = "";
        this.subCollapsed = false;
        this.checked = false;
        this.affected = [];
        this.amount = new CountingAmountInfo();
        this.argument = new CountingArgumentInfo();
    }
}

export  class CountingAppInfo{

     public id: string;
     public name: string;
     public module:CountingModuleInfo[];

     constructor(){
        this.module = [];
        this.id = "";
        this.name = "";
    }
 }

export class CountingModuleInfo{

    public appId:string;
    public id:string;
    public name:string;

    constructor(){
        this.appId = "";
        this.id = "";
        this.name = "";
    }
}

export class CountingAmountInfo{

    public currentCount: number;
    public totalCount: number;

    constructor(){
        this.currentCount = 0;
        this.totalCount = 0;
    }
}

export class CountingArgumentInfo{

    public countbound: string;
    public expiretime: string;

    constructor(){
        this.countbound = "";
        this.expiretime = "";
    }
}