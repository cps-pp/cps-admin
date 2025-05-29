import { Table } from 'antd';
import React from 'react';
import { iconTrash } from '@/configs/icon';

export default function SumMedicin({
  selectedServices,
  removeService,
  tapDetail,
}) {
  const columns = [
    {
      title: 'Med id',
      dataIndex: 'med_id',
      key: 'med_id',
    },
    {
      title: 'Name',
      dataIndex: 'med_name',
      key: 'med_name',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <a>{price?.toLocaleString()}</a>,
    },
    {
      title: 'Action',
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
    <div>
      <Table
        columns={columns}
        dataSource={selectedServices}
        pagination={{ pageSize: 3, size: 'middle' }}
      />

     
    </div>
  );
}
