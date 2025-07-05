import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
import useStoreQi from '../../../store/selectQi';

export default function ListQiUpdate({ selectService, tapService }) {
  const [dataQi, setDataQi] = useState([]);
  const { addEquipmentNews } = useStoreQi();
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
      console.error('Error fetching equipment list:', err);
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
      title: 'ລະຫັດອຸປະກອນ',
      dataIndex: 'med_id',
      key: 'med_id',
    },
    {
      title: 'ຊື່ອຸປະກອນ',
      dataIndex: 'med_name',
      key: 'med_name',
    },
    {
      title: 'ຈຳນວນ',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'ລາຄາ',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <a>{price?.toLocaleString()}</a>,
    },

    {
      title: 'ຈັດການ',
      key: 'action',
      render: (_, record) => (

        <button
          type="button"
          onClick={() => {
            addEquipmentNews(record);
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
        rowKey="med_id"
        columns={columns}
        loading={loading}
        dataSource={dataQi || []}
        pagination={{ pageSize: 5, size: 'middle' }}
        locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
        size="small"
      />
    </div>
  );
}
