import { Table } from 'antd';
import React from 'react';
import { iconTrash } from '@/configs/icon';

export default function SumService({
  selectedServices,
  removeService,
}) {
  
  // ฟังก์ชันสำหรับแสดง ID ตามประเภท
  const getItemId = (record) => {
    if (record.itemType === 'service') return record.ser_id;
    if (record.itemType === 'medicine') return record.med_id;
    if (record.itemType === 'equipment') return record.med_id || record.med_id || record.id;
    if (record.itemType === 'disease') return record.dis_id || record.disease_id;
    return record.id || '-';
  };

  // ฟังก์ชันสำหรับแสดงชื่อตามประเภท
  const getItemName = (record) => {
    if (record.itemType === 'service') return record.ser_name;
    if (record.itemType === 'medicine') return record.med_name;
    if (record.itemType === 'equipment') return record.med_name || record.med_name || record.name;
    if (record.itemType === 'disease') return record.dis_name || record.disease_name;
    return record.name || '-';
  };

  // ฟังก์ชันสำหรับแสดงประเภท
  const getItemType = (itemType) => {
    const typeMap = {
      service: 'ບໍລິການ',
      medicine: 'ຢາ', 
      equipment: 'ອຸປະກອນ',
      disease: 'ພະຍາດ'
    };
    return typeMap[itemType] || itemType;
  };
  const getRowKey = (record) => {
    return `${record.itemType}_${getItemId(record)}`;
  };

  const columns = [
    { 
      title: 'ລະຫັດ', 
      key: 'item_id',
      render: (_, record) => getItemId(record)
    },
    { 
      title: 'ປະເພດ', 
      key: 'item_type',
      render: (_, record) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          record.itemType === 'service' ? 'bg-blue-100 text-blue-800' :
          record.itemType === 'medicine' ? 'bg-green-100 text-green-800' :
          record.itemType === 'equipment' ? 'bg-purple-100 text-purple-800' :
          record.itemType === 'disease' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {getItemType(record.itemType)}
        </span>
      )
    },
    { 
      title: 'ຊື່', 
      key: 'item_name',
      render: (_, record) => getItemName(record)
    },
    {
      title: 'ລາຄາ',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>{price?.toLocaleString() || '-'}</span>,
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
        pagination={{ pageSize: 5, size: 'middle' }}
        rowKey={getRowKey}
      />
      
     
    </div>
  );
}

// import { Table } from 'antd';
// import React from 'react';
// import { iconTrash } from '@/configs/icon';

// export default function SumService({
//   selectedServices,
//   removeService,
// }) {
//   const columns = [
//     { title: 'Services', dataIndex: 'ser_id', key: 'ser_id' },
//     { title: 'Name', dataIndex: 'ser_name', key: 'ser_name' },
 
//     {
//       title: 'Price',
//       dataIndex: 'price',
//       key: 'price',
//       render: (price) => <span>{price?.toLocaleString()}</span>,
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <button
//           onClick={() => removeService(record)}
//           className="text-red-500 hover:text-red-600 p-1 rounded"
//         >
//           {iconTrash}
//         </button>
//       ),
//     },

//   ]
//   const totalPrice =
//     selectedServices?.reduce((sum, service) => sum + (service.price || 0), 0) ||
//     0;

//   return (
//     <div>
//       <Table
//         columns={columns}
//         dataSource={selectedServices}
//         pagination={{ pageSize: 3, size: 'middle' }}
//         rowKey="ser_id"
//       />

    
//     </div>
//   );
// }
