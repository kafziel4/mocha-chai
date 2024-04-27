import { Pagination } from './common';

export interface Color {
  id: number;
  name: string;
  year: number;
  color: string;
  pantone_value: string;
}

export interface SingleColor {
  data: Color;
}

export interface ColorList extends Pagination {
  data: Color[];
}
