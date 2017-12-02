import {Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';

import { UserMetadata, UserMetadataColum } from '../../../../domain/UserMetadata';
import { Tab } from '../../../../domain/Tab';



@Component({
  selector: 'UserMetadataColumn',
  styleUrls: ['./userMetadata.scss'],
  templateUrl: './userMetadata.html'
})
export class UserMetadataComponent {

    @Input() userMetadataInfo:UserMetaDataColumInfo[];
    @Input() tabInfo:Tab;
    
    @Output() userMetadataInfoChange:EventEmitter<string> = new EventEmitter<string>();

    ngAfterViewInit() {
    };

    constructor() { }
}


class UserMetaDataColumInfo{
    
    catalogId: string;
    metadataColumn: Array<Array<UserMetadata>>;

    constructor(_catalogId:string, _metadataColum:Array<Array<UserMetadata>>){

    this.catalogId = _catalogId;
    this.metadataColumn = _metadataColum;
    }
}