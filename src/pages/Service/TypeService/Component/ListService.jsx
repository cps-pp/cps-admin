import { Table } from 'antd';
import { useState, useEffect } from 'react';
import useStoreServices from '../../../../store/selectServices';
import { URLBaseLocal, URLTest } from '../../../../lib/MyURLAPI';

export default function ListService({ selectService, tapService }) {
  //------Store
  const { addService } = useStoreServices();

  const [dataService, setDataService] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServiceList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${URLTest}/src/manager/servicelist`);
      // const res = await fetch(`${URLBaseLocal}/src/manager/servicelist`);
      const data = await res.json();
      setDataService(data.data);
      setLoading(false);
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
    await addService(record);
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
      title: 'ຈັດການ',
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
          ເພີ່ມ
        </button>
      ),
    },
  ];

  // console.log(services)

  return (
    <div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={dataService || []}
        pagination={{ pageSize: 5, size: 'middle' }}
        rowKey="ser_id"
        size="small"
      />
    </div>
  );
}
