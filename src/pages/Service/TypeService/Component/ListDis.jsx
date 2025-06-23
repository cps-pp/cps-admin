import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
import useStoreDisease from '../../../../store/selectDis';

export default function ListDis({ selectService, tapService }) {
  const [dataMed, setDataMed] = useState([]);
  const { addDisease, dis } = useStoreDisease();

  const fetchDisList = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/disease');
      const data = await res.json();
      setDataMed(data.data);
    } catch (err) {
      console.error('Error fetching disease list:', err);
    }
  };

  useEffect(() => {
    if (tapService === 4) {
      fetchDisList();
    }
  }, [tapService]);
  const columns = [
    {
      title: 'ລະຫັດພະຍາດ',
      dataIndex: 'disease_id',
      key: 'disease_id',
    },
    {
      title: 'ຊື່ພະຍາດ',
      dataIndex: 'disease_name',
      key: 'disease_name',
    },

    {
      title: 'ຈັດການ',
      key: 'action',
      render: (_, record) => (
        <button
          type="button"
          onClick={() => {
            selectService(record);
            selectionDisease(record);
          }}
          className="bg-secondary2 text-white px-3 py-1 rounded hover:bg-secondary"
        >
          ເພີ່ມ
        </button>
      ),
    },
  ];
  const selectionDisease = async (record) => {
    await addDisease(record);
  };
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataMed}
        pagination={{ pageSize: 3, size: 'middle' }}
        locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
        size="small"
      />
    </div>
  );
}
