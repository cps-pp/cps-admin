import {  InputNumber, Table } from 'antd';
import React from 'react';
import { iconTrash } from '@/configs/icon';

export default function SumService({ selectedServices, removeService,updateQty }) {
  const handleQtyChange = (ser_id, newQty) => {
    updateQty(ser_id, newQty);
  };
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
      title: 'ຈຳນວນ',
      dataIndex: 'qty',
      key: 'qty',
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(value) => handleQtyChange(record.ser_id, value)}
        />
      ),
    },

    {
      title: 'ລາຄາ',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <a>{price?.toLocaleString()}</a>,
    },
    {
      title: 'ລວມ',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <span>{total?.toLocaleString() ?? 0}</span>,
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
