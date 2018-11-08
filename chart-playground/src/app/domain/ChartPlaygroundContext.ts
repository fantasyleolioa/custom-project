import { Injectable } from '@angular/core';

import { DataRepository } from "../access/dataRepository";


@Injectable()
export class ChartPlaygroundContext {

    constructor(
        public dataRepository: DataRepository,
    ) { }
}

