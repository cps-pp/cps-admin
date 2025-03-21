import { HTMLAttributes, ReactNode } from 'react';

const TableBody: React.FC<
  {
    children: ReactNode;
    className?: string;
    textStyle?: string;
  } & HTMLAttributes<HTMLTableCellElement>
> = ({ children, className, textStyle, ...rest }) => {
  return (
    <td
      className={`border-b border-[#eee] py-5 px-4 dark:border-strokedark ${className}`}
      {...rest}
    >
      <div className={`text-black dark:text-white ${textStyle}`}>
        {children}
      </div>
    </td>
  );
};

export default TableBody;
