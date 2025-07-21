import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Select, Modal } from 'antd';
import { URLBaseLocal } from '../../lib/MyURLAPI';
import { ACCESS_TOKEN_KEY } from '../../utils/constants';
import { openAlert } from '@/redux/reducer/alert';
import ConfirmModal from '@/components/Modal';

const { Option } = Select;

const token = localStorage.getItem(ACCESS_TOKEN_KEY);

export default function CreatePreOrder({ tab }) {
  const dispatch = useDispatch();

  const [supId, setSupId] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);

  // รายการสินค้าทั้งหมด (ยาและอุปกรณ์รวมกัน)
  const [itemDetails, setItemDetails] = useState([{ med_id: '', qty: 1 }]);

  // สำหรับ ConfirmModal (ใช้เฉพาะการยืนยันการบันทึก)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState(null);

  // สำหรับ validation errors
  const [errors, setErrors] = useState({});

  // สำหรับยาที่ใกล้หมด
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    if (tab === 2) {
      fetchSuppliers();
      fetchEmployees();
      fetchAllItems();
    }
  }, [tab]);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/supplier');
      const json = await res.json();
      setSuppliers(json.data || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນຜູ້ສະໜອງໄດ້',
        }),
      );
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/emp');
      const json = await res.json();
      setEmployees(json.data || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນພນັກງານໄດ້',
        }),
      );
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchAllItems = async () => {
    try {
      const res = await fetch(
        'http://localhost:4000/src/manager/medicinesPAPAG',
      );
      const json = await res.json();
      const items = json.data || [];

      console.log('All items:', items);

      // เก็บรายการทั้งหมดไว้ในตัวแปรเดียว
      setAllItems(items);
      
      // กรองยาที่มีจำนวนคงเหลือ <= 25
      const lowStock = items.filter(item => item.qty <= 25);
      setLowStockItems(lowStock);
    } catch (err) {
      console.error('Error fetching items:', err);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນຢາແລະອຸປະກອນໄດ້',
        }),
      );
    } finally {
      setLoadingItems(false);
    }
  };

  // ฟังก์ชันหาจำนวนคงเหลือของยา
  const getItemStock = (medId) => {
    const item = allItems.find(item => item.med_id === medId);
    return item ? item.qty || 0 : 0;
  };

  // ฟังก์ชันตรวจสอบรายการซ้ำ - ลบช่องที่เลือกซ้ำออก
  const checkDuplicateItem = (itemId, currentIndex) => {
    const existingIndex = itemDetails.findIndex(
      (detail, index) => detail.med_id === itemId && index !== currentIndex,
    );
    if (existingIndex !== -1) {
      const item = allItems.find((item) => item.med_id === itemId);
      const itemName = item ? item.med_name : 'Unknown';

      // แจ้งเตือนแบบธรรมดา
      dispatch(
        openAlert({
          type: 'warning',
          title: 'ແຈ້ງເຕືອນ',
          message: `${itemName} ມີຢູ່ໃນລາຍການແລ້ວ`,
        }),
      );

      // ลบช่องที่เลือกซ้ำออก (currentIndex)
      const updated = itemDetails.filter((_, index) => index !== currentIndex);
      // ถ้าไม่มีช่องเหลือ ให้เหลือช่องว่างอย่างน้อย 1 ช่อง
      if (updated.length === 0) {
        setItemDetails([{ med_id: '', qty: 1 }]);
      } else {
        setItemDetails(updated);
      }

      return true;
    }
    return false;
  };

  // ฟังก์ชันตรวจสอบ validation
  const validateForm = () => {
    const newErrors = {};

    // ตรวจสอบพนักงาน
    if (!empId) {
      newErrors.empId = 'ກະລຸນາເລືອກພະນັກງານ';
    }

    // ตรวจสอบผู้สะหนอง
    if (!supId) {
      newErrors.supId = 'ກະລຸນາເລືອກຜູ້ສະຫນອງ';
    }

    // ตรวจสอบว่ามีการเลือกรายการอย่างน้อย 1 อย่าง
    const hasValidItem = itemDetails.some((detail) => detail.med_id);

    if (!hasValidItem) {
      newErrors.items = 'ກະລຸນາເລືອກຢາ ຫຼື ອຸປະກອນ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleItemDetailChange = (index, field, value) => {
    if (field === 'med_id' && value) {
      if (checkDuplicateItem(value, index)) {
        return; // หยุดการเปลี่ยนแปลงถ้ามีรายการซ้ำ
      }
    }

    const updated = [...itemDetails];
    updated[index][field] = value;
    setItemDetails(updated);

    // ล้าง error เมื่อมีการเลือก
    if (field === 'med_id' && value && errors.items) {
      setErrors((prev) => ({ ...prev, items: undefined }));
    }
  };

  const addItemDetail = () => {
    setItemDetails([...itemDetails, { med_id: '', qty: 1 }]);
  };

  const removeItemDetail = (index) => {
    setItemDetails(itemDetails.filter((_, i) => i !== index));
  };

  const showConfirmation = (message, callback) => {
    setConfirmModalMessage(message);
    setConfirmCallback(() => callback);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmCallback) {
      confirmCallback();
    }
    setShowConfirmModal(false);
    setConfirmCallback(null);
  };

  const handleSupplierChange = (value) => {
    setSupId(value);
    if (value && errors.supId) {
      setErrors((prev) => ({ ...prev, supId: undefined }));
    }
  };

  const handleEmployeeChange = (value) => {
    setEmpId(value);
    if (value && errors.empId) {
      setErrors((prev) => ({ ...prev, empId: undefined }));
    }
  };

  // ฟังก์ชันยกเลิก - รีเซ็ตทุกอย่างกลับเป็นค่าเริ่มต้น
  const handleCancel = () => {
    // ตรวจสอบว่ามีการกรอกข้อมูลหรือไม่
    const hasData =
      supId || empId || itemDetails.some((detail) => detail.med_id);

    if (hasData) {
      // แสดง ConfirmModal ก่อนยกเลิก
      showConfirmation(
        'ທ່ານຕ້ອງການຍົກເລີກນີ້ບໍ່? ຂໍ້ມູນທີ່ປ້ອນຈະສູນເສຍ',
        () => {
          setSupId(null);
          setEmpId(null);
          setItemDetails([{ med_id: '', qty: 1 }]);
          setErrors({});
        },
      );
    } else {
      // ถ้าไม่มีข้อมูลให้ยกเลิกเลย
      setSupId(null);
      setEmpId(null);
      setItemDetails([{ med_id: '', qty: 1 }]);
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบ validation ก่อน
    if (!validateForm()) {
      return;
    }

    // รวมรายการทั้งหมด
    const allDetails = itemDetails
      .filter((d) => d.med_id)
      .map((d) => ({
        med_id: d.med_id,
        qty: parseInt(d.qty),
      }));

    const payload = {
      sup_id: supId,
      emp_id_create: empId,
      status: 'WAITING',
      details: allDetails,
    };

    // บันทึกข้อมูลโดยไม่ต้องยืนยัน
    try {
      const res = await fetch(`${URLBaseLocal}/src/preorder`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // ใช้ openAlert สำหรับความสำเร็จ
        dispatch(
          openAlert({
            type: 'success',
            title: 'ສໍາເລັດ',
            message: 'ສ້າງໃບສັ່ງຊື້ສໍາເລັດແລ້ວ',
          }),
        );

        // รีเซ็ตฟอร์มโดยไม่ต้องยืนยัน
        setSupId(null);
        setEmpId(null);
        setItemDetails([{ med_id: '', qty: 1 }]);
        setErrors({});
      } else {
        const errorData = await res.json();
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: errorData.message || 'ບໍ່ສາມາດສ້າງໃບສັ່ງຊື້ໄດ້',
          }),
        );
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
        }),
      );
    }
  };

  return (
    <div className="">
      {/* <div className="flex justify-between">
        <h2 className="text-xl font-medium mb-4">ສ້າງການສັ່ງຊື້</h2>
      </div> */}

      {/* แสดงยาที่ใกล้หมด */}
      {lowStockItems.length > 0 && (
        <div className="mb-6 p-4 bg-Third3/5 border border-Third3/5 rounded-lg">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">⚠️</span>
            <h3 className="text-lg font-semibold text-yellow-800">
              ຢາ ແລະ ອຸປະກອນ ທີ່ໃກ້ໝົດ 
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((item) => (
              <div 
                key={item.med_id} 
                className="bg-white p-3 rounded border border-stroke"
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-gray-800">
                    {item.med_name} ({item.type_name})
                  </div>
                  <div className="text-sm font-semibold text-red-600 ml-2">
                    ຄົງເຫຼືອ: {item.qty || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">ເລືອກພະນັກງານ</label>
            <Select
              showSearch
              placeholder="Select an employee"
              optionFilterProp="children"
              onChange={handleEmployeeChange}
              value={empId}
              className="w-full"
              size="large"
              loading={loadingEmployees}
              filterOption={(input, option) => {
                if (!option || !option.children) return false;
                const searchText = `${option.children}`.toLowerCase();
                return searchText.includes(input.toLowerCase());
              }}
              style={{ fontFamily: 'inherit' }}
              allowClear
            >
              {employees.map((emp) => (
                <Option key={emp.emp_id} value={emp.emp_id}>
                  {emp.emp_name} {emp.emp_surname}
                </Option>
              ))}
            </Select>
            {errors.empId && (
              <p className="text-red-500 text-sm mt-1">{errors.empId}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">ເລືອກຜູ້ສະໜອງ</label>
            <Select
              showSearch
              placeholder="Select a supplier"
              optionFilterProp="children"
              onChange={handleSupplierChange}
              value={supId}
              className="w-full"
              size="large"
              loading={loadingSuppliers}
              filterOption={(input, option) => {
                if (!option || !option.children) return false;
                const searchText = `${option.children}`.toLowerCase();
                return searchText.includes(input.toLowerCase());
              }}
              style={{ fontFamily: 'inherit' }}
              allowClear
            >
              {suppliers.map((sup) => (
                <Option key={sup.sup_id} value={sup.sup_id}>
                  {sup.company_name}
                </Option>
              ))}
            </Select>
            {errors.supId && (
              <p className="text-red-500 text-sm mt-1">{errors.supId}</p>
            )}
          </div>
        </div>

        <div className="border rounded-md p-4 border-stroke">
          <div className="flex justify-between items-center mb-3">
            <label className="block font-semibold text-gray-700">
              ເລືອກເພີ່ມ ຢາ ຫຼື ອຸປະກອນ
            </label>
            <button
              type="button"
              onClick={addItemDetail}
              className="text-Third4 hover:text-Third3  text-sm font-medium"
            >
              + ເພີ່ມຢາ ຫຼື ອຸປະກອນ
            </button>
          </div>
          {itemDetails.map((detail, index) => (
            <div key={index} className="flex gap-2 items-end mb-2">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600">
                  ຢາ ຫຼື ອຸປະກອນ
                </p>
                <Select
                  showSearch
                  placeholder="Select item"
                  value={detail.med_id || undefined}
                  onChange={(value) =>
                    handleItemDetailChange(index, 'med_id', value)
                  }
                  className="w-full h-8"
                  size="middle"
                  loading={loadingItems}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (!option || !option.children) return false;
                    const searchText = `${option.children}`.toLowerCase();
                    return searchText.includes(input.toLowerCase());
                  }}
                  style={{ fontFamily: 'inherit' }}
                  allowClear
                >
                  {allItems.map((item) => (
                    <Select.Option key={item.med_id} value={item.med_id}>
                      {item.med_name} ({item.type_name})
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* แสดงจำนวนคงเหลือ */}
              <div className="w-32">
                <p className="text-xs font-medium text-gray-600">ຄົງເຫຼືອ</p>
                <div className="border rounded p-2 text-center text-base bg-gray h-8 flex items-center justify-center">
                  {detail.med_id ? getItemStock(detail.med_id) : '-'}
                </div>
              </div>

              <div className="w-28">
                <p className="text-xs font-medium text-gray-600">ຈຳນວນ</p>
                <input
                  type="number"
                  min="1"
                  value={detail.qty}
                  onChange={(e) =>
                    handleItemDetailChange(index, 'qty', e.target.value)
                  }
                  className="w-full border p-2 rounded text-center text-base h-8"
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => removeItemDetail(index)}
                  className="text-red-500 hover:text-red-700 text-sm px-1"
                  disabled={itemDetails.length === 1}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* แสดง error message สำหรับรายการสินค้า */}
        {errors.items && (
          <div className="text-center">
            <p className="text-red-500 text-sm">{errors.items}</p>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            ຍົກເລີກ
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            ບັນທຶກ
          </button>
        </div>
      </form>

      <ConfirmModal
        show={showConfirmModal}
        setShow={setShowConfirmModal}
        message={confirmModalMessage}
        handleConfirm={handleConfirm}
      />
    </div>
  );
}
