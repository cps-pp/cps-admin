import { Table } from 'antd';
import { iconTrash } from '@/configs/icon';

export default function SumQil({
  selectedServices,
  removeService,
  tapDetail,
}) {
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
        <button
          onClick={() => removeService(record)}
          className="text-red-500 hover:text-red-600 p-1 rounded"
        >
          {iconTrash}
        </button>
      ),
    },
  ];

  const totalPrice =
    selectedServices?.reduce((sum, service) => sum + (service.price || 0), 0) ||
    0;

  return (
    <div>
      <Table
        columns={columns}
        dataSource={selectedServices}
        pagination={{ pageSize: 3, size: 'middle' }}
      />

      {/* <div className="mt-4 p-3 bg-gray-100 rounded">
        <div className="text-right">
          <strong>Total: {totalPrice.toLocaleString()} Kip</strong>
        </div>
      </div> */}
    </div>
  );
}
