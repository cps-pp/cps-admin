import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import { SupHeaders } from './column/sup';
import CreateSupplier from './create';
import EditSupplier from './edit';

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]); // Data ของ Supplier
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([]); // Data ที่กรองแล้ว
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState(''); // ค่าของการค้นหาที่ผู้ใช้ป้อน
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/manager/supplier`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSuppliers(data.data);
      setFilteredSuppliers(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

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

  const openDeleteModal = (id: string) => () => {
    setSelectedSupplierId(id);
    setShowModal(true);
  };

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

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການຂໍ້ມູນຜູ້ສະໜອງ
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddModal(true)}
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
                        onDelete={openDeleteModal(supplier.sup_id)} 
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
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="rounded-lg w-full max-w-2xl relative px-4 ">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute px-4 top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <CreateSupplier
              setShow={setShowAddModal}
              getList={fetchSuppliers}
            />
          </div>
        </div>
      )}

      {showEditModal && selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="rounded-lg w-full max-w-2xl bg-white relative ">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute  top-4 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <EditSupplier
              id={selectedId}
              onClose={() => setShowEditModal(false)}
              setShow={setShowEditModal}
              getList={fetchSuppliers}
            />
          </div>
        </div>
      )}


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
