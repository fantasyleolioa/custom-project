export class RoleInfo {
    public id: string;
    public name: string;
    public constraint: string;
    public level: number;
    public catalogId: string;
    public checked?:boolean;
    public catalogName: string;
    public hash: string;
    public disabledTime?:string;

    constructor(_id: string, _name: string, _constraint: string, _level: number, _catalogId: string, _hash: string ) {
        this.id = _id;
        this.name = _name;
        this.constraint = _constraint;
        this.level = _level;
        this.catalogId = _catalogId;
        this.hash = _hash;
    }
}