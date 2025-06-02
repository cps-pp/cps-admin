import { Table ,InputNumber} from 'antd';
import { iconTrash } from '@/configs/icon';
import useStoreQi from '../../../../store/selectQi';

export default function SumQil() {
  const { removeMedicine, medicine, updateQty } = useStoreQi();

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
       render: (_, record) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(value) => updateQty(record.med_id, value)}
        />
      ),
    },
    
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <a>{price?.toLocaleString()}</a>,
    },
     {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <span>{total?.toLocaleString() ?? 0}</span>,
    },
    {
      title: 'Action',
      key: 'action',
       render: (_, record) => (
             <button
               onClick={() => removeMedicine(record)}
               className="text-red-500 hover:text-red-600 p-1 rounded"
             >
               {iconTrash}
             </button>
           ),
    },
  ];

  
  return (
    <div>
      <Table
        columns={columns}
        dataSource={medicine}
        pagination={{ pageSize: 3, size: 'middle' }}
      />

     
    </div>
  );
}
