import React, { useState, useEffect } from 'react';

interface ServiceType {
  id: number;
  name: string;
  price: number;
  defaultInstallments?: number;
}

interface PatientType {
  id: string;
  name: string;
  phone: string;
  address: string;
}

interface PaymentType {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  installments: number;
  installmentAmount: number;
}

const ServicePatientPage: React.FC = () => {
  // สถานะสำหรับข้อมูลคนไข้
  const [patient, setPatient] = useState<PatientType>({
    id: '',
    name: '',
    phone: '',
    address: '',
  });

  // สถานะสำหรับบริการที่เลือก
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  
  // สถานะสำหรับการจ่ายเงิน
  const [payment, setPayment] = useState<PaymentType>({
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    installments: 1,
    installmentAmount: 0,
  });

  // รายการบริการที่มี
  const serviceOptions: ServiceType[] = [
    { id: 1, name: 'ตรวจฟัน', price: 300 },
    { id: 2, name: 'ถอนฟัน', price: 800 },
    { id: 3, name: 'อุดฟัน', price: 1200 },
    { id: 4, name: 'ขูดหินปูน', price: 1500 },
    { id: 5, name: 'รักษารากฟัน', price: 3500 },
  ];

  // รายการจัดฟัน
  const orthoOptions: ServiceType[] = [
    { id: 1, name: 'จัดฟันแบบโลหะ', price: 45000, defaultInstallments: 24 },
    { id: 2, name: 'จัดฟันแบบเซรามิก', price: 55000, defaultInstallments: 24 },
    { id: 3, name: 'จัดฟันแบบใส (Invisalign)', price: 75000, defaultInstallments: 24 },
  ];

  // ฟังก์ชันเมื่อเลือกบริการ
  const handleAddService = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = parseInt(e.target.value);
    if (serviceId) {
      const selectedService = serviceOptions.find(service => service.id === serviceId);
      if (selectedService) {
        setSelectedServices([...selectedServices, selectedService]);
        updatePayment([...selectedServices, selectedService], payment.installments);
      }
    }
  };

  // ฟังก์ชันเมื่อเลือกจัดฟัน
  const handleAddOrtho = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orthoId = parseInt(e.target.value);
    if (orthoId) {
      const selectedOrtho = orthoOptions.find(ortho => ortho.id === orthoId);
      if (selectedOrtho) {
        setSelectedServices([...selectedServices, selectedOrtho]);
        const newInstallments = selectedOrtho.defaultInstallments || 24;
        updatePayment([...selectedServices, selectedOrtho], newInstallments);
        setPayment(prev => ({
          ...prev,
          installments: newInstallments
        }));
      }
    }
  };

  // ฟังก์ชันลบบริการ
  const handleRemoveService = (index: number) => {
    const newServices = [...selectedServices];
    newServices.splice(index, 1);
    setSelectedServices(newServices);
    updatePayment(newServices, payment.installments);
  };

  // ฟังก์ชันอัพเดตการจ่ายเงิน
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

  // ฟังก์ชันเมื่อเปลี่ยนจำนวนงวด
  const handleInstallmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInstallments = parseInt(e.target.value) || 1;
    updatePayment(selectedServices, newInstallments);
    setPayment(prev => ({
      ...prev,
      installments: newInstallments
    }));
  };

  // ฟังก์ชันเมื่อบันทึกข้อมูล
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // สร้างใบเสร็จรับเงิน
    const receipt = {
      patientId: patient.id,
      patientName: patient.name,
      date: new Date().toISOString(),
      services: selectedServices,
      payment: {
        totalAmount: payment.totalAmount,
        paidAmount: payment.paidAmount,
        remainingAmount: payment.remainingAmount,
        installments: payment.installments,
        installmentAmount: payment.installmentAmount,
      }
    };
    
    console.log('บันทึกข้อมูลการรักษา:', receipt);
    alert('บันทึกข้อมูลการรักษาเรียบร้อยแล้ว');
    
    // รีเซ็ตข้อมูล
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
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-6">ระบบบริการคนไข้</h1>
      
      {/* ข้อมูลคนไข้ */}
      <div className="bg-stroke dark:bg-strokedark p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">ข้อมูลคนไข้</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">รหัสคนไข้</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded bg-stroke dark:bg-strokedark" 
              value={patient.id} 
              onChange={(e) => setPatient({...patient, id: e.target.value})}
            />
          </div>
          <div>
            <label className="block mb-1">ชื่อ-นามสกุล</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded bg-stroke dark:bg-strokedark" 
              value={patient.name} 
              onChange={(e) => setPatient({...patient, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block mb-1">เบอร์โทรศัพท์</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded bg-stroke dark:bg-strokedark" 
              value={patient.phone} 
              onChange={(e) => setPatient({...patient, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block mb-1">ที่อยู่</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded bg-stroke dark:bg-strokedark" 
              value={patient.address} 
              onChange={(e) => setPatient({...patient, address: e.target.value})}
            />
          </div>
        </div>
      </div>
      
      {/* เลือกบริการ */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">เลือกบริการ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">บริการทั่วไป</label>
            <select 
              className="w-full border p-2 rounded" 
              onChange={handleAddService}
              defaultValue=""
            >
              <option value="">-- เลือกบริการ --</option>
              {serviceOptions.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.price} บาท
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">บริการจัดฟัน</label>
            <select 
              className="w-full border p-2 rounded" 
              onChange={handleAddOrtho}
              defaultValue=""
            >
              <option value="">-- เลือกประเภทจัดฟัน --</option>
              {orthoOptions.map(ortho => (
                <option key={ortho.id} value={ortho.id}>
                  {ortho.name} - {ortho.price} บาท ({ortho.defaultInstallments} งวด)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* รายการบริการที่เลือก */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">รายการบริการ</h2>
        {selectedServices.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">ลำดับ</th>
                <th className="border p-2 text-left">รายการ</th>
                <th className="border p-2 text-right">ราคา (บาท)</th>
                <th className="border p-2 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {selectedServices.map((service, index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{service.name}</td>
                  <td className="border p-2 text-right">{service.price.toLocaleString()}</td>
                  <td className="border p-2 text-center">
                    <button 
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleRemoveService(index)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td colSpan={2} className="border p-2 text-right">รวมทั้งสิ้น</td>
                <td className="border p-2 text-right">{payment.totalAmount.toLocaleString()}</td>
                <td className="border p-2"></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">ยังไม่มีบริการที่เลือก</p>
        )}
      </div>
      
      {/* การชำระเงิน */}
      {selectedServices.length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">การชำระเงิน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">จำนวนงวด</label>
              <input 
                type="number" 
                min="1" 
                className="w-full border p-2 rounded" 
                value={payment.installments}
                onChange={handleInstallmentChange}
              />
            </div>
            <div>
              <label className="block mb-1">จำนวนเงินต่องวด (บาท)</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-100" 
                value={payment.installmentAmount.toLocaleString()}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-1">ชำระงวดแรก (บาท)</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-100" 
                value={payment.paidAmount.toLocaleString()}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-1">ยอดคงเหลือ (บาท)</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-100" 
                value={payment.remainingAmount.toLocaleString()}
                readOnly
              />
            </div>
          </div>
        </div>
      )}
      
      {/* ปุ่มบันทึก */}
      <div className="flex justify-end">
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded font-bold"
          onClick={handleSubmit}
          disabled={selectedServices.length === 0}
        >
          บันทึกข้อมูล
        </button>
      </div>
      
      {/* ส่วนแสดงใบเสร็จ */}
      {selectedServices.length > 0 && (
        <div className="bg-white p-4 rounded shadow mt-6 print:shadow-none">
          <h2 className="text-xl font-semibold mb-4">ใบเสร็จรับเงิน</h2>
          <div className="border p-4 mb-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">คลินิกทันตกรรม</h3>
              <p>123 ถนนสุขุมวิท กรุงเทพฯ 10110</p>
              <p>โทร 02-123-4567</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p><strong>รหัสคนไข้:</strong> {patient.id}</p>
                <p><strong>ชื่อ-นามสกุล:</strong> {patient.name}</p>
              </div>
              <div className="text-right">
                <p><strong>วันที่:</strong> {new Date().toLocaleDateString('th-TH')}</p>
                <p><strong>เวลา:</strong> {new Date().toLocaleTimeString('th-TH')}</p>
              </div>
            </div>
            
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">ลำดับ</th>
                  <th className="border p-2 text-left">รายการ</th>
                  <th className="border p-2 text-right">ราคา (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {selectedServices.map((service, index) => (
                  <tr key={index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{service.name}</td>
                    <td className="border p-2 text-right">{service.price.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={2} className="border p-2 text-right">รวมทั้งสิ้น</td>
                  <td className="border p-2 text-right">{payment.totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            
            {payment.installments > 1 && (
              <div className="mb-4">
                <h4 className="font-bold mb-2">รายละเอียดการแบ่งชำระ</h4>
                <p><strong>จำนวนงวด:</strong> {payment.installments} งวด</p>
                <p><strong>จำนวนเงินต่องวด:</strong> {payment.installmentAmount.toLocaleString()} บาท</p>
                <p><strong>ชำระงวดแรกแล้ว:</strong> {payment.paidAmount.toLocaleString()} บาท</p>
                <p><strong>ยอดคงเหลือ:</strong> {payment.remainingAmount.toLocaleString()} บาท</p>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <div className="text-center">
                <p>____________________</p>
                <p>ผู้รับเงิน</p>
              </div>
              <div className="text-center">
                <p>____________________</p>
                <p>ผู้จ่ายเงิน</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded font-bold"
              onClick={() => window.print()}
            >
              พิมพ์ใบเสร็จ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePatientPage;