import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';

export default function ListMed({ selectService, dataValue, tapService }) {
  const [dataMed, setDataMed] = useState([]);

  const fetchMedList = async () => {
  try {
    const res = await fetch(`http://localhost:4000/src/manager/medicines/${'M1'}`);
    const data = await res.json();
    setDataMed(data.data);
  } catch (err) {
    console.error('Error fetching medicine list:', err);
  }
};


  useEffect(() => {
    if (tapService === 2) {
      fetchMedList();
    }
  }, [tapService]);

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
        <Space size="middle">
          <button type="button" onClick={() => selectService(record)}>Select</button>
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
