import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import { SupHeaders } from './column/sup';

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]); // Data ของ Supplier
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([]); // Data ที่กรองแล้ว
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState(''); // ค่าของการค้นหาที่ผู้ใช้ป้อน
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ดึงข้อมูล Supplier
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/manager/supplier', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSuppliers(data.data); // บันทึกข้อมูล Supplier
        setFilteredSuppliers(data.data); // เริ่มต้นให้ผลลัพธ์เป็นทั้งหมด
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // ฟังก์ชั่นกรอง Supplier ตามคำค้นหา
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter((supplier) =>
        supplier.company_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchQuery, suppliers]);

  // ฟังก์ชั่นเปิด Modal การลบ Supplier
  const openDeleteModal = (id: string) => () => {
    setSelectedSupplierId(id);
    setShowModal(true);
  };

  // ฟังก์ชั่นลบ Supplier
  const handleDeleteSupplier = async () => {
    if (!selectedSupplierId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/manager/supplier/${selectedSupplierId}`,
        { method: 'DELETE' },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter(
          (supplier) => supplier.sup_id !== selectedSupplierId,
        ),
      );
      setShowModal(false);
      setSelectedSupplierId(null);
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleViewSupplier = (id: string) => {
    navigate(`/supplier/detail/${id}`);
  };
  const handleEdit = (id: string) => {
    navigate(`/supplier/edit/${id}`);
  };
  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການຂໍ້ມູນຜູ້ສະໜອງ
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/supplier/create')}
            icon={iconAdd}
            className="bg-primary"
          >
            ເພີ່ມຜູ້ສະໜອງ
          </Button>
        </div>
      </div>

      <div className="grid w-full gap-4 p-4">
        <Search
          type="text"
          name="search"
          placeholder="ຄົ້ນຫາຊື່..."
          className="rounded border border-stroke dark:border-strokedark"
          onChange={(e) => {
            const query = e.target.value;
            setSearchQuery(query);
          }}
        />
      </div>

      <div className="text-md text-strokedark dark:text-bodydark3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto border-collapse">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-left dark:bg-meta-4 bg-blue-100">
                {SupHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 "
                  >
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{supplier.sup_id}</td>
                    <td className="px-4 py-4">{supplier.company_name}</td>
                    <td className="px-4 py-4">{supplier.address}</td>
                    <td className="px-4 py-4">{supplier.phone}</td>
                    <td
                      className={`px-4 py-4 ${supplier.status === 'ປິດ' ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {supplier.status}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <TableAction
                        // onView={() => handleViewSupplier(supplier.sup_id)}
                        onDelete={openDeleteModal(supplier.sup_id)} // Pass supplier id
                        onEdit={() => handleEdit(supplier.sup_id)}

                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບຜູ້ສະໜອງນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteSupplier}
      />
    </div>
  );
};

export default SupplierPage;
