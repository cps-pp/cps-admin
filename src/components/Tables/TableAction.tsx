import React from 'react';
import {
  iconAddRounded,
  iconEdit,
  iconSearch,
  iconTrash,
  iconView,
} from '@/configs/icon';

interface TableActionProps {
  id?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  onSearch?: () => void;
  onView?: () => void;
}

export const TableAction: React.FC<TableActionProps> = ({
  onEdit,
  onDelete,
  onAdd,
  onSearch,
  onView,
}) => {
  const buttonCount = [onAdd, onSearch, onView, onEdit, onDelete].filter(
    Boolean,
  ).length;
  const gapClass = buttonCount >= 4 ? 'gap-2' : 'gap-4';

  return (
    <div className={`grid w-[60px] grid-cols-3 ${gapClass}`}>
      {onAdd && (
        <button className="w-6 rounded-full" onClick={onAdd}>
          {iconAddRounded}
        </button>
      )}
      {onSearch && <button onClick={onSearch}>{iconSearch}</button>}
      {onView && <button onClick={onView}>{iconView}</button>}
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-purple-600 hover:text-purple-800"
        >
          {iconEdit}
        </button>
      )}

      {onDelete && (
        <button onClick={onDelete} className="text-red-600 hover:text-red-800">
          {iconTrash}
        </button>
      )}
    </div>
  );
};
