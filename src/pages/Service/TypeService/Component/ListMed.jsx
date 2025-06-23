// import React, { useEffect, useState } from 'react';
// import { Space, Table } from 'antd';
// import useStoreMed from '../../../../store/selectMed';

// export default function ListMed({ selectService, dataValue, tapService }) {
//   const [dataMed, setDataMed] = useState([]);
//   const { addMedicine, medicines } = useStoreMed();
//   const [loading, setLoading] = useState(false);

// const [stockToDeduct, setStockToDeduct] = useState([]);
// // stockToDeduct = [{ med_id: "M001", med_qty: 10 }, ...]

//   const fetchMedList = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `http://localhost:4000/src/manager/medicines/${'M1'}`,
//       );
//       // const res = await fetch(`${URLBaseLocal}/src/manager/servicelist`);
//       const data = await res.json();

//       setDataMed(data.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching medicine list:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

// useEffect(() => {
//   console.log('tapService:', tapService);
//   if (tapService === 2) {
//     fetchMedList();
//   }
// }, [tapService]);

//   const columns = [
//     {
//       title: 'ລະຫັດຢາ',
//       dataIndex: 'med_id',
//       key: 'med_id',
//     },
//     {
//       title: 'ຊື່ຢາ',
//       dataIndex: 'med_name',
//       key: 'med_name',
//     },
//     {
//       title: 'ຈຳນວນ',
//       dataIndex: 'qty',
//       key: 'qty',
//     },
//     {
//       title: 'ລາຄາ',
//       dataIndex: 'price',
//       key: 'price',
//       render: (price) => <a>{price?.toLocaleString()}</a>,
//     },
//     {
//       title: 'ຈັດການ',
//       key: 'action',

//       render: (_, record) => (
//       <button
//         type="button"
//         onClick={() => {
//           selectService(record);
//           selectionMedicine(record);
//         }}
//         className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary"
//       >
//         ເພີ່ມ
//       </button>
//     ),
//     },
//   ];

//   const selectionMedicine = async (record) => {
//     await addMedicine(record);
//   };

//   return (
//     <div>
//       <Table
//         columns={columns}
//         loading={loading}
//         dataSource={dataMed || []}
//         pagination={{ pageSize: 5, size: 'middle' }}
//           locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}

//         rowKey="med_id"
//         size="small"
//       />
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import useStoreMed from '../../../../store/selectMed';

export default function ListMed({ selectService, refreshFlag, tapService }) {
  const [dataMed, setDataMed] = useState([]);
  const { addMedicine, medicines } = useStoreMed();
  const [loading, setLoading] = useState(false);

  const [stockToDeduct, setStockToDeduct] = useState([]);

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

  const isAdded = (med_id) => medicines.some((med) => med.med_id === med_id);

const handleAddMedicine = async (record) => {
  if (isAdded(record.med_id)) return;

  const success = await deductOneStock(record);
  if (!success) {
    return;
  }

  addMedicine({ ...record, qty: 1 });
};

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
            selectService(record);
            selectionMedicine(record);
          }}
          
          className="bg-secondary2 text-white px-3 py-1 rounded hover:bg-secondary"
        >
          ເພີ່ມ
        </button>
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
        locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
        rowKey="med_id"
        size="small"
      />
    </div>
  );
}
