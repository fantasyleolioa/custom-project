export class MenuList{
	// property
	title: string;
	childList: Array<MenuItem>;

	// constructor
	constructor(){ }
}

export class MenuItem{
	// property
	icon: string;
	name: string;
	notification: string;
	url: string;
	isActivated?: boolean;


	// constructor
	constructor(){ }
}
