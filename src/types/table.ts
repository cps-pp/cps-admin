import { ReactNode } from 'react';

export interface ITableHeader {
  id: string;
  name: string;
  sortable: boolean;
}

export interface ITableSortConfig {
  sortBy: string;
  sortType: 'asc' | 'desc';
}

export interface ITable {
  header: ITableHeader[];
  data: any[];
  body: ReactNode;
  loading: boolean;
  children: ReactNode;
  onSort?: (id: string) => void;
  sortConfig?: ITableSortConfig;
  title?: string;
  headerAction?: ReactNode[];
  filterAction?: ReactNode[];
  className?: string;
}
