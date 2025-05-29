import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
import useStoreQi from '../../../../store/selectQi';

export default function ListQi({ selectService, tapService }) {
  const [dataQi, setDataQi] = useState([]);
  const { addMedicine, medicine } = useStoreQi();
  const [loading, setLoading] = useState(false);

  const fetchQiList = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/src/manager/medicines/${'M2'}`,
      );
      const data = await res.json();
      setDataQi(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching medicine list:', err);
    } finally {
      setLoading(false);
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
        rowKey="med_id"
        columns={columns}
        loading={loading}
        dataSource={dataQi || []}
        pagination={{ pageSize: 5, size: 'middle' }}
        size="small"
      />
    </div>
  );
}
