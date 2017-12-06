export class UpdateOrganizationInfo {
    public parentId: string;
    public id: string;
    public name:string;
    public hash: string;

    constructor(_parentId:string, _id: string, _name: string, _hash: string) {
        this.parentId = _parentId;
        this.id = _id;
        this.name = _name;
        this.hash = _hash;
    }
}