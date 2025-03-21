import React from 'react';
import TablePagination from '@mui/material/TablePagination';

interface TablePaginationDemoProps {
  count: number;
  page: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TablePaginationDemo: React.FC<TablePaginationDemoProps> = ({
  count,
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      sx={{
        '& .MuiTablePagination-displayedRows': {
          textAlign: 'left',
          color: 'var(--primarySecond)',
        },
        '& .MuiTablePagination-actions button': {
          borderRadius: '6px',
        },
        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-actions': {
          color: 'var(--primarySecond)', 
        },
        '& .MuiTablePagination-selectLabel.dark, & .MuiTablePagination-displayedRows.dark, & .MuiTablePagination-actions.dark': {
          color: 'white', 
        },
      }}
      className="text-primarySecond dark:text-white"
    />
  );
};

export default TablePaginationDemo;
