import { Table } from 'antd';
import React, { useState, useEffect } from 'react';
import useStoreServices from '../../../../store/selectServices';

export default function ListService({ selectService, tapService }) {
  const [dataService, setDataService] = useState([]);

  const { addService, services: listSelect } = useStoreServices((state) => ({
    addService: state.addService,
    services: state.services,
  }));

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

  const selectionService = async (record) => {
    // await addService(record);
  };

  const columns = [
    { title: 'Services', dataIndex: 'ser_id', key: 'ser_id' },

    { title: 'Name', dataIndex: 'ser_name', key: 'ser_name' },

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
          type="button"
          onClick={() => {
            // console.log('Selecting:', record);
            selectService(record);
            selectionService(record);
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          select
        </button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataService}
      pagination={{ pageSize: 5, size: 'middle' }}
      rowKey="ser_id"
      size="small"
    />
  );
}
