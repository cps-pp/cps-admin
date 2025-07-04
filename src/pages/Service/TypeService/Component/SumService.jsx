import { Table } from 'antd';
import React from 'react';
import { iconTrash } from '@/configs/icon';

export default function SumService({ selectedServices, removeService }) {
  const columns = [
    {
      title: 'ລະຫັດ',
      key: 'ser_id',
      dataIndex: 'ser_id',
    },
    {
      title: 'ລາຍການປິ່ນປົວ',
      key: 'ser_name',
      dataIndex: 'ser_name',
    },
    {
      title: 'ຈໍານວນ',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'ລາຄາ',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>{price?.toLocaleString() || '-'}</span>,
    },
    {
      title: 'ຈັດການ',
      key: 'action',
      render: (_, record) => (
        <button
          onClick={() => removeService(record)}
          className="text-red-500 hover:text-red-600 p-1 rounded"
        >
          {iconTrash}
        </button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={selectedServices}
      pagination={{ pageSize: 4, size: 'middle' }}
      rowKey="ser_id"
      size="small"
      locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
    />
  );
}
