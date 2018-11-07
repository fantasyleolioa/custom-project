import { Component } from '@angular/core';

import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';

@Component({
  selector: 'CssPractice',
  styleUrls: ['./cssPractice.scss'],
  templateUrl: './cssPractice.html'
})
export class CssPracticeComponent {

    // Porperty


    // Constructor
    constructor(private contentTopService:ContentTopService) {

        this.contentTopService.TitleSetting("CSS練習");
    }


    // Method
    
}