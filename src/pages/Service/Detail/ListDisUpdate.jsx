import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
import useStoreDisease from '../../../store/selectDis';

export default function ListDisUpdate({ selectService, tapService }) {
<<<<<<< HEAD
  const [dataDis, setDis] = useState([]);
=======
  const [dataDis, setDataDis] = useState([]);
>>>>>>> test-3
  const { addDiseaseUpdate } = useStoreDisease();

  const fetchDisList = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/disease');
      const data = await res.json();
<<<<<<< HEAD
      setDis(data.data);
=======
      setDataDis(data.data);
>>>>>>> test-3
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
            addDiseaseUpdate([record]);
          }}
          className="bg-secondary2 text-white px-3 py-1 rounded hover:bg-secondary"
        >
          ເພີ່ມ
        </button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataDis}
        pagination={{ pageSize: 3, size: 'middle' }}
        locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
        size="small"
      />
    </div>
  );
}
