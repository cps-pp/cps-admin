import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';

export default function ListQi({ selectService, tapService }) {
  // console.log(tapService);
  const [dataQi, setDataQi] = useState([]);
  const fetchQiList = async () => {
    try {
      const res = await fetch(`http://localhost:4000/src/manager/medicines/${'M2'}`);
      const data = await res.json();
      setDataQi(data.data);
    } catch (err) {
      console.error('Error fetching medicine list:', err);
    }
  };

  useEffect(() => {
    if (tapService === 3) {
      fetchQiList();
    }
  }, [tapService]);

  const columns = [
    {
      title: 'ID',
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
        
      <Table   rowKey="med_id" columns={columns} dataSource={dataQi} pagination={{ pageSize: 5 }}  />
    </div>
  );
}
