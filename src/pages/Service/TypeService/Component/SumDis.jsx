import { Table } from 'antd';
import React from 'react';
import { iconTrash } from '@/configs/icon';

export default function SumDiseases({
  selectedServices,
  removeServices,
  tapDetail,
}) {
  const columns = [
    {
      title: 'Disease ID',
      dataIndex: 'disease_id',
      key: 'disease_id',
    },
    {
      title: 'Name',
      dataIndex: 'disease_name',
      key: 'disease_name',
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

  const totalPrice =
    selectedServices?.reduce((sum, service) => sum + (service.price || 0), 0) ||
    0;

  return (
    <div>
      <Table
        columns={columns}
        dataSource={selectedServices}
        pagination={{ pageSize: 3, size: 'middle' }}
      />

      {/* <div className="mt-4 p-3 bg-gray-100 rounded">
        <div className="text-right">
          <strong>Total: {totalPrice.toLocaleString()} Kip</strong>
        </div>
      </div> */}
    </div>
  );
}
