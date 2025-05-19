import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';

export default function ListDis({ selectService, tapService }) {
  const [dataMed, setDataMed] = useState([]);

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
      title: 'Services',
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
        <Space size="middle">
          <button onClick={() => selectService(record)}>Select</button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={dataMed} pagination={{ pageSize: 5 }}  />
    </div>
  );
}
