import { GetCategoryModel } from "src/app/category/core/models";
import { ProductModel } from "./product.model";

export class GetProductModel extends ProductModel {
    prod_id: number = 0;
    categoria: GetCategoryModel | null = null;
    image_url: string = '';
}