export class Tab{
    public isFocus: boolean = false;
    public name: string = '';
    public id: string = '';
  
    constructor(_isFocus:boolean, _name: string, _id: string) { 
      this.isFocus = _isFocus;
      this.name = _name;
      this.id = _id;
    }
  }