import { Component } from '@angular/core';
import { SwUpdate, SwPush } from "@angular/service-worker";

import { SpinnerService } from "./@theme/services/spinner.service";


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	// property


	// constructor
	constructor(updates: SwUpdate, pusher: SwPush, private spinner: SpinnerService) {
		updates.activated.subscribe(
			(result) => {
				console.log(result.current);
			}
		);

		// pusher.requestSubscription({serverPublicKey: 'BLn-N84A8c7vx58fcXM0g4w8fsSnQg0VplDcnz1IJjnRXsQY6bsYK6l3_TzeO7byG35LxgHEvXi0E3ib9xsMJmY'})
		//     .then(
		// 		(result) => {
		// 			console.log(result);
		// 		},
		// 	);
	}


	// method
	onSelect(event) {
		console.log(event);
	}
}
