/**
 *@type header column header text
 *@type field Property name from data object
 */

import { SafeHtml } from "@angular/platform-browser";
import { IActions } from "./action-def.interface";
import { PipeTransform } from "@angular/core";
import { ColumnType } from "./column.type";

export interface IColumnDef<T> {
  headerText: string;
  field?: keyof any;
  columnType?: ColumnType;
  actions?: IActions<T>[];
  pipe?: PipeTransform;
  statusClassFn?: (row: T) => string;
  customRenderFn?: (row: T) => string | number | SafeHtml;
  PERMISSION?: string;
}
