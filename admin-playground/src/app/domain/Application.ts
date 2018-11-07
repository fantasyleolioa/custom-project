import { BasicMetadata } from './BasicMetadata';
import { Action } from './Action';


export class Application {

    public app:BasicMetadata;
    public modules:BasicMetadata[];
    public actions:Action[];

    constructor() { }
}