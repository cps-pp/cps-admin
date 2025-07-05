import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import useStoreMed from '../../../store/selectMed';

export default function ListMedUpdate({ selectService, refreshFlag, tapService }) {
  const [dataMed, setDataMed] = useState([]);
  const { addMedicineNews, medicines } = useStoreMed();
  const [loading, setLoading] = useState(false);


  const fetchMedList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/src/manager/medicines/M1`);
      const data = await res.json();
      setDataMed(data.data);
    } catch (err) {
      console.error('Error fetching medicine list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tapService === 2) {
      fetchMedList();
    }
  }, [tapService]);

  const columns = [
    {
      title: 'ລະຫັດຢາ',
      dataIndex: 'med_id',
      key: 'med_id',
    },
    {
      title: 'ຊື່ຢາ',
      dataIndex: 'med_name',
      key: 'med_name',
    },
    {
      title: 'ຈຳນວນ',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'ຫົວໜ່ວຍ',
      dataIndex: 'unit',
      key: 'unit',
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
            addMedicineNews(record);
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
        loading={loading}
        dataSource={dataMed || []}
        pagination={{ pageSize: 5, size: 'middle' }}
        locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
        rowKey="med_id"
        size="small"
      />
    </div>
  );
}
