import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
import useStoreMed from '../../../../store/selectMed';

export default function ListMed({ selectService, dataValue, tapService }) {
  const [dataMed, setDataMed] = useState([]);
  const { addMedicine, medicines } = useStoreMed();
  const [loading, setLoading] = useState(false);


  
  const fetchMedList = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/src/manager/medicines/${'M1'}`,
      );
      // const res = await fetch(`${URLBaseLocal}/src/manager/servicelist`);
      const data = await res.json();
      setDataMed(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching medicine list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tapService === '2') {
      fetchMedList();
    }
  }, []);

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
          <button type="button" onClick={() => selectionMedicine(record)}>
            Select
          </button>
        </Space>
      ),
    },
  ];

  const selectionMedicine = async (record) => {
    await addMedicine(record);
  };

  return (
    <div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={dataMed || []}
        pagination={{ pageSize: 5, size: 'middle' }}
        rowKey="med_id"
        size="small"
      />
    </div>
  );
}
