export class DashboardData{
    // property
    quality: SingleData[];
    quadrant: QuadrantData[];
    cost: MultiData[];
    conversion: MultiData[];


    // constructor
    constructor() { }
}

export class MultiData{
    // property
    name: string;
    series: SingleData[];


    // constructor
    constructor() { }
}

export class SingleData{
    // property
    name: string;
    value: any;


    // constructor
    constructor() { }
}

export class QuadrantData{
    // property
    name: string;
    series: BubbleData[];


    // constructor
    constructor() { }
}

export class BubbleData{
    // property
    name: string;
    x: any;
    y: any;


    // constructor
    constructor() { }
}