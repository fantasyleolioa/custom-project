import {Component, ViewEncapsulation} from '@angular/core';

import { ContentTopService } from '../../service/contentTopService/ContentTop.service';

@Component({
  selector: 'Custom',
  styleUrls: ['./custom.scss'],
  templateUrl: './custom.html'
})
export class CustomComponent {

  constructor(private contenTopService:ContentTopService) {

    this.contenTopService.EnvironmentSetting([]);
    this.contenTopService.ChangeStatus("normal");
  }
}