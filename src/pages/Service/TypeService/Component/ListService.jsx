import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';

export default function ListService({ selectService, dataValue, tapService }) {
  const [dataService, setDataService] = useState([]);

  const fetchServiceList = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/servicelist');
      const data = await res.json();
      setDataService(data.data);
    } catch (err) {
      console.error('Error fetching service list:', err);
    }
  };

  useEffect(() => {
    if (tapService === 1) {
      fetchServiceList();
    }
  }, [tapService]);

  const columns = [
    {
      title: 'Services',
      dataIndex: 'ser_id',
      key: 'ser_id',
    },
    {
      title: 'Name',
      dataIndex: 'ser_name',
      key: 'ser_name',
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
          <button onClick={() => selectService(record)}>select</button>
        </Space>
      ),
    },
  ];

  return (
    <div>
       <Table 
        columns={columns} 
        dataSource={dataService} 
        pagination={{ pageSize: 5 }} 
        rowKey="ser_id" 
      />
    </div>
  );
}
