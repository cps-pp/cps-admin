import React, { useState } from 'react';

interface ServiceType {
  id: number;
  name: string;
  price: number;
  defaultInstallments?: number;
}

const Treatment: React.FC = () => {
  const [patientType, setPatientType] = useState<string>('general');
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [payment, setPayment] = useState({
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    installments: 1,
    installmentAmount: 0,
  });

  const [patientDetails, setPatientDetails] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
  });

  const [currentDateTime] = useState(new Date().toLocaleString()); // แสดงวันที่และเวลา

  // บริการทั่วไป
  const generalServices: ServiceType[] = [
    { id: 1, name: 'ตรวจฟัน', price: 300 },
    { id: 2, name: 'ถอนฟัน', price: 800 },
    { id: 3, name: 'อุดฟัน', price: 1200 },
    { id: 4, name: 'ขูดหินปูน', price: 1500 },
    { id: 5, name: 'รักษารากฟัน', price: 3500 },
  ];

  // บริการจัดฟัน
  const orthoServices: ServiceType[] = [
    { id: 1, name: 'จัดฟันแบบโลหะ', price: 45000, defaultInstallments: 24 },
    { id: 2, name: 'จัดฟันแบบเซรามิก', price: 55000, defaultInstallments: 24 },
    { id: 3, name: 'จัดฟันแบบใส (Invisalign)', price: 75000, defaultInstallments: 24 },
  ];

  // ฟังก์ชั่นสำหรับการเพิ่มบริการที่เลือก
  const handleAddService = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = parseInt(e.target.value);
    let services = patientType === 'general' ? generalServices : orthoServices;
    if (serviceId) {
      const selectedService = services.find(service => service.id === serviceId);
      if (selectedService) {
        setSelectedServices([...selectedServices, selectedService]);
        updatePayment([...selectedServices, selectedService], payment.installments);
      }
    }
  };

  // ฟังก์ชั่นสำหรับการลบบริการที่เลือก
  const handleRemoveService = (index: number) => {
    const newServices = [...selectedServices];
    newServices.splice(index, 1);
    setSelectedServices(newServices);
    updatePayment(newServices, payment.installments);
  };

  // ฟังก์ชั่นอัปเดตการคำนวณเงิน
  const updatePayment = (services: ServiceType[], installments: number) => {
    const totalAmount = services.reduce((sum, service) => sum + service.price, 0);
    const installmentAmount = totalAmount / installments;

    setPayment({
      totalAmount,
      paidAmount: installmentAmount,
      remainingAmount: totalAmount - installmentAmount,
      installments,
      installmentAmount,
    });
  };

  // ฟังก์ชั่นจัดการการเปลี่ยนจำนวนงวด
  const handleInstallmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInstallments = parseInt(e.target.value) || 1;
    updatePayment(selectedServices, newInstallments);
    setPayment(prev => ({
      ...prev,
      installments: newInstallments,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const receipt = {
      patientId: patientDetails.id,
      patientName: patientDetails.name,
      date: currentDateTime,
      services: selectedServices,
      payment: {
        totalAmount: payment.totalAmount,
        paidAmount: payment.paidAmount,
        remainingAmount: payment.remainingAmount,
        installments: payment.installments,
        installmentAmount: payment.installmentAmount,
      },
    };

    console.log('บันทึกข้อมูลการรักษา:', receipt);
    alert('บันทึกข้อมูลการรักษาเรียบร้อยแล้ว');

    setSelectedServices([]);
    setPayment({
      totalAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      installments: 1,
      installmentAmount: 0,
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">ໜ້າບໍລິການ</h1>

      {/* แสดงวันที่และเวลา */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">ວັນທີ່: {currentDateTime}</h2>
      </div>

      {/* เลือกประเภทคนเจ็บ */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">ເລືອກປະເພດຄົນເຈັບ</h2>
        <div className="flex space-x-6">
          <button
            onClick={() => setPatientType('general')}
            className={`w-1/2 py-3 rounded-lg ${patientType === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            ຄົນເຈັບທົ່ວ
          </button>
          <button
            onClick={() => setPatientType('ortho')}
            className={`w-1/2 py-3 rounded-lg ${patientType === 'ortho' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            ດັດແຂ້ວ
          </button>
        </div>
      </div>

      {/* ข้อมูลคนไข้ */}
      {/* <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">ข้อมูลคนไข้</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">รหัสคนไข้</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={patientDetails.id}
              onChange={(e) => setPatientDetails({ ...patientDetails, id: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1">ชื่อ-นามสกุล</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={patientDetails.name}
              onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1">เบอร์โทรศัพท์</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={patientDetails.phone}
              onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1">ที่อยู่</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={patientDetails.address}
              onChange={(e) => setPatientDetails({ ...patientDetails, address: e.target.value })}
            />
          </div>
        </div>
      </div> */}

      {/* เลือกบริการ */}
      {/* <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">เลือกบริการ</h2>
        <select
          className="w-full border p-3 rounded-lg"
          onChange={handleAddService}
          defaultValue=""
        >
          <option value="">-- เลือกบริการ --</option>
          {(patientType === 'general' ? generalServices : orthoServices).map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - {service.price} บาท
            </option>
          ))}
        </select>
      </div> */}

      {/* รายการบริการที่เลือก */}
      {/* <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">รายการบริการที่เลือก</h2>
        {selectedServices.length > 0 ? (
          <table className="w-full table-auto border-collapse text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">ลำดับ</th>
                <th className="border p-3">บริการ</th>
                <th className="border p-3">ราคา</th>
                <th className="border p-3">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {selectedServices.map((service, index) => (
                <tr key={service.id}>
                  <td className="border p-3">{index + 1}</td>
                  <td className="border p-3">{service.name}</td>
                  <td className="border p-3">{service.price} บาท</td>
                  <td className="border p-3">
                    <button
                      className="text-red-500"
                      onClick={() => handleRemoveService(index)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">ยังไม่มีบริการที่เลือก</p>
        )}
      </div> */}

      {/* สรุปการชำระเงิน */}
      {/* <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">สรุปการชำระเงิน</h2>
        <div className="flex justify-between mb-3">
          <span>จำนวนเงินรวม: {payment.totalAmount} บาท</span>
          <span>จำนวนเงินที่ชำระ: {payment.paidAmount} บาท</span>
        </div>
        <div className="flex justify-between mb-3">
          <span>ยอดค้างชำระ: {payment.remainingAmount} บาท</span>
          <span>จำนวนงวด: </span>
          <input
            type="number"
            className="w-20 border p-2 rounded-lg"
            value={payment.installments}
            onChange={handleInstallmentChange}
          />
        </div>
      </div> */}

      {/* <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg"
        >
          บันทึกข้อมูล
        </button>
      </div> */}
    </div>
  );
};

export default Treatment;
