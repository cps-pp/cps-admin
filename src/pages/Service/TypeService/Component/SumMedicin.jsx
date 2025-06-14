import { InputNumber, Table } from 'antd';
import { iconTrash } from '@/configs/icon';
import useStoreMed from '../../../../store/selectMed';

export default function SumMedicin() {

  const { removeMedicine, medicines, updateQty } = useStoreMed();

const handleQtyChange = async (med_id, newQty) => {
  const med = medicines.find(m => m.med_id === med_id);
  if (!med) return;

  const delta = newQty - med.qty; // จำนวนเพิ่ม(+)/ลด(-) ที่เปลี่ยน

  if (delta === 0) return; // ถ้าไม่เปลี่ยนจำนวน ไม่ต้องทำอะไร

  try {
    const res = await fetch('http://localhost:4000/src/stock/checkstock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // ส่งข้อมูลจำนวนที่จะตัด/เพิ่มสต็อก (ถ้า delta เป็น + ตัดสต็อก ถ้า - อาจจะเพิ่มสต็อกกลับ)
      body: JSON.stringify({ data: [{ med_id, med_qty: delta }] }),
    });
    const result = await res.json();

    if (res.ok) {
      // ถ้าตัดสต็อกสำเร็จ อัปเดตจำนวนใน store
      updateQty(med_id, newQty);
    } else {
      alert(result.message || 'ไม่สามารถปรับจำนวนยาได้เนื่องจากสต็อกไม่พอ');
    }
  } catch (error) {
    console.error(error);
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
  }
};
  const columns = [
    {
      title: 'ລະຫັດ',
      dataIndex: 'med_id',
      key: 'med_id',
    },
    {
      title: 'ລາຍການຈ່າຍຢາ',
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
      onChange={(value) => handleQtyChange(record.med_id, value)}
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

  // console.log(medicines)

  return (
    <div>
      <Table
        columns={columns}
        dataSource={medicines}
        pagination={{ pageSize: 4, size: 'middle' }}
          locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}

      />
    </div>
  );
}
