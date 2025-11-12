export class SortParamsModel {
    property: string;
    direction: string;

    constructor(property: string, direction: string) {
        this.property = property;
        this.direction = direction;
    }
}