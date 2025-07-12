import React, { useEffect, useState } from 'react';

import { Empty, Tabs } from 'antd';
import { URLBaseLocal } from '../../lib/MyURLAPI';
import CreatePreOrder from './CreatePreOrder';
import HomeSupplier from './HomeSupplier';
import { ACCESS_TOKEN_KEY } from '../../utils/constants';

const token = localStorage.getItem(ACCESS_TOKEN_KEY);

const OrderPage = () => {
  const [preorders, setPreorders] = useState([]);

  useEffect(() => {
    fetchPreorders();
  }, []);

  const fetchPreorders = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/preorder');
      const json = await res.json();
      setPreorders(json.data || []);
    } catch (err) {
      console.error('Error fetching preorders:', err);
    }
  };

  const onChange = key => {
    console.log(key);
  };

  const LayoutShowTable = () => {
    const handleCancel = async (id) => {
      const confirmCancel = window.confirm(`Are you sure you want to cancel preorder ID ${id}?`);
      if (!confirmCancel) return;

      try {
        const res = await fetch(`http://localhost:4000/src/preorder/cancel/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
          alert('Preorder canceled successfully.');
          fetchPreorders(); // refresh list
        } else {
          const errorData = await res.json();
          alert('Failed to cancel: ' + errorData.message);
        }
      } catch (err) {
        console.error('Cancel error:', err);
        alert('Something went wrong.');
      }
    };
    return (
      <div>
        <button
          onClick={() => fetchPreorders()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ໂຫລດຂໍ້ມູນໃຫມ່
        </button>
        <table className="min-w-full border rounded shadow mt-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">ວັນທີສັ່ງຊື້</th>
              <th className="border p-2">ສະຖານະ</th>
              <th className="border p-2">ຜູ້ສະໜອງ</th>
              <th className="border p-2">ລາຍລະອຽດ</th>
              <th className="border p-2">ຜູ້ສ້າງ</th>
              <th className="border p-2">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {preorders.map((order) => (
              <tr key={order.preorder_id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{order.preorder_id}</td>
                <td className="border p-2 text-center">{order.preorder_date}</td>
                <td className="border p-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'WAITING' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="border p-2 text-center">{order.sup_id} - {order.company_name ?? 'Unknown'}</td>
                <td className="border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className='border-b'>
                        <th className="text-left border-r">ຢາ</th>
                        <th className="text-right">ຈ/ນ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.details.map((detail) => (
                        <tr key={detail.detail_id}>
                          <td className="border-r">{detail.med_name}</td>
                          <td className="text-right">{detail.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td className="border p-2">{order.created_by ?? '-'}</td>
                <td className="border p-2 text-center">
                  {order.status === 'WAITING' && (
                    <button
                      onClick={() => handleCancel(order.preorder_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const items = [
    {
      key: '1',
      label: 'ລາຍການສັ່ງ',
      children: <LayoutShowTable />,
    },
    {
      key: '2',
      label: 'ສ້າງການສັ່ງຊື້',
      children: <CreatePreOrder tab={2} />,
    },
    {
      key: '3',
      label: 'ລາຍການຜູ້ສະໜອງ',
      children: <HomeSupplier tab={3} />,
    },
  ];



  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4 bg-white">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  )
};

export default OrderPage;
