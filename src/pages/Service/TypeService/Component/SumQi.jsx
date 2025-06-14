import { Table ,InputNumber} from 'antd';
import { iconTrash } from '@/configs/icon';
import useStoreQi from '../../../../store/selectQi';

export default function SumQil() {
  const { removeMedicine, equipment, updateQty } = useStoreQi();

  const columns = [
     {
      title: 'ລະຫັດ',
      dataIndex: 'med_id',
      key: 'med_id',
    },
    {
      title: 'ລາຍການຈ່າຍອຸປະກອນ',
      dataIndex: 'med_name',
      key: 'med_name',
    },
    {
      title: 'ຈຳນວນ',
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
      title: 'ລາຄາ',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <a>{price?.toLocaleString()}</a>,
    },
     {
      title: 'ລວມ',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <span>{total?.toLocaleString() ?? 0}</span>,
    },
    {
      title: 'ຈັດການ',
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
        dataSource={equipment}
        size="small"
        pagination={{ pageSize: 4, size: 'middle' }}
          locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}

      />

     
    </div>
  );
}
