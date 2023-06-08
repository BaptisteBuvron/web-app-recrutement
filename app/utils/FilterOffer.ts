export class FilterOffer {

    minSalary?: number = 0;
    region?: string;

    constructor(minSalary?: number, region?: string) {
        this.minSalary = minSalary;
        this.region = region;
    }
}