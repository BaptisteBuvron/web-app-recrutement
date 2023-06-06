export class FilterOffer {

    minSalary?: number;
    region?: string;

    constructor(minSalary?: number, region?: string) {
        this.minSalary = minSalary;
        this.region = region;
    }
}