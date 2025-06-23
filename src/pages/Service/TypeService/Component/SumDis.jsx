import { Table } from 'antd';
import React from 'react';
import { iconTrash } from '@/configs/icon';
import useStoreDisease from '../../../../store/selectDis';

export default function SumDiseases() {
  const { removeDisease, dis } = useStoreDisease();

  const columns = [
    {
      title: 'ລະຫັດ',
      dataIndex: 'disease_id',
      key: 'disease_id',
    },
    {
      title: 'ພະຍາດ',
      dataIndex: 'disease_name',
      key: 'disease_name',
    },
    {
      title: 'ຈັດການ',
      key: 'action',
      render: (_, record) => (
        <button
          onClick={() => removeDisease(record)}
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
        dataSource={dis}
         locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
        size="small"
      />
    </div>
  );
}
