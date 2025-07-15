import { useEffect, useState } from 'react';
import { message, Empty } from 'antd';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';
import CreateSupplier from './CreateSupplier';
import EditSupplier from './EditSupplier';

// Column headers สำหรับตาราง
const SupHeaders = [
  { id: 'id', name: 'ລະຫັດ' },
  { id: 'company_name', name: 'ຊື່ນາມ ຫລື ອົງການ' },
  { id: 'address', name: 'ທີ່ຢູ່' },
  { id: 'phone', name: 'ເບີໂທ' },
  { id: 'action', name: 'ຈັດການ' }
];

export default function HomeSupplier({ tab }) {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    
    // Modal states - เปลี่ยนชื่อให้เหมือนกับ SupplierPage
    const [showModal, setShowModal] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    
    // เพิ่ม states เหมือนกับ SupplierPage
    const [existingIds, setExistingIds] = useState([]);
    const [createFormCloseHandler, setCreateFormCloseHandler] = useState(null);
    
    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (tab === 3) { 
            fetchSuppliers(); 
        }
    }, [tab]);

    // Search filter effect
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredSuppliers(suppliers);
        } else {
            const filtered = suppliers.filter(
                (supplier) =>
                    supplier.company_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    supplier.sup_id.toLowerCase().includes(searchQuery.toLowerCase()),
            );
            setFilteredSuppliers(filtered);
        }
    }, [searchQuery, suppliers]);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:4000/src/manager/supplier');
            const json = await res.json();
            if (res.ok) {
                setSuppliers(json.data || []);
                setFilteredSuppliers(json.data || []);
                // เก็บ existing IDs เหมือนกับ SupplierPage
                const ids = (json.data || []).map((supplier) => supplier.sup_id);
                setExistingIds(ids);
            } else {
                message.error(json.message || 'Failed to load suppliers');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            message.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    // Sort function
    const handleSortById = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        
        const sortedSuppliers = [...suppliers].sort((a, b) => {
            const extractNumber = (id) => {
                const match = id.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
            };
            
            const numA = extractNumber(a.sup_id);
            const numB = extractNumber(b.sup_id);
            
            if (newSortOrder === 'asc') {
                return numA - numB; 
            } else {
                return numB - numA; 
            }
        });
        
        setSuppliers(sortedSuppliers);
        
        if (searchQuery.trim() !== '') {
            const filtered = sortedSuppliers.filter(supplier =>
                supplier.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                supplier.sup_id.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredSuppliers(filtered);
        } else {
            setFilteredSuppliers(sortedSuppliers);
        }
    };

    // เปลี่ยนให้เหมือนกับ SupplierPage
    const handleAddNew = () => {
        setShowAddModal(true);
    };

    // เปลี่ยนให้เหมือนกับ SupplierPage
    const handleEdit = (id) => {
        setSelectedId(id);
        setShowEditModal(true);
    };

    // เปลี่ยนให้เหมือนกับ SupplierPage
    const openDeleteModal = (id) => () => {
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
            dispatch(
                openAlert({
                    type: 'success',
                    title: 'ລົບຂໍ້ມູນສຳເລັດ',
                    message: 'ລົບຂໍ້ມູນຜູ້ສະໜອງສຳເລັດແລ້ວ',
                }),
            );
        } catch (error) {
            dispatch(
                openAlert({
                    type: 'error',
                    title: 'ລົບຂໍ້ມູນບໍ່ສຳເລັດ',
                    message: 'ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ',
                }),
            );
        }
    };

    // Pagination handlers
    const handlePageChange = (_, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // เพิ่มฟังก์ชันเหมือนกับ SupplierPage
    const handleCloseAddModal = () => {
        if (createFormCloseHandler) {
            createFormCloseHandler();
        } else {
            setShowAddModal(false);
        }
    };

    const paginatedSuppliers = filteredSuppliers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    if (tab !== 3) {
        return null;
    }

    return (
        <>
            <div className="rounded bg-white pt-4 border border-stroke">
                <Alerts />
                <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
                    <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
                        ຈັດການຂໍ້ມູນຜູ້ສະໜອງ
                    </h1>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleAddNew}
                            icon={iconAdd}
                            className="bg-secondary2 hover:bg-secondary3"
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

                <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto border-collapse overflow-hidden">
                        <thead>
                            <tr className="text-left bg-gray border border-stroke">
                                {SupHeaders.map((header, index) => (
                                    <th
                                        key={index}
                                        className={`px-4 py-3 tracking-wide text-form-input font-semibold ${
                                            header.id === 'id'
                                                ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-800 select-none'
                                                : ''
                                        }`}
                                        onClick={header.id === 'id' ? handleSortById : undefined}
                                    >
                                        <div className="flex items-center gap-2">
                                            {header.name}
                                            {header.id === 'id' && (
                                                <span
                                                    className={`ml-1 inline-block text-md font-semibold transition-colors duration-200 ${
                                                        sortOrder === 'asc'
                                                            ? 'text-green-500'
                                                            : 'text-black'
                                                    }`}
                                                >
                                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSuppliers.length > 0 ? (
                                paginatedSuppliers.map((supplier, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-stroke"
                                    >
                                        <td className="px-4 py-4">{supplier.sup_id}</td>
                                        <td className="px-4 py-4">{supplier.company_name}</td>
                                        <td className="px-4 py-4">{supplier.address}</td>
                                        <td className="px-4 py-4">{supplier.phone}</td>
                                        
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
                                        <div className="text-center">
                                            <div className="w-32 h-32 flex items-center justify-center mx-auto">
                                                <Empty description={false} />
                                            </div>
                                            <p className="text-lg">ບໍ່ພົບຂໍ້ມູນ</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal สำหรับเพิ่มข้อมูล - เหมือนกับ SupplierPage */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="rounded-lg w-full max-w-2xl relative px-4">
                            <button
                                onClick={handleCloseAddModal}
                                className="absolute px-4 top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
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
                                existingIds={existingIds}
                                onCloseCallback={setCreateFormCloseHandler}
                            />
                        </div>
                    </div>
                )}

                {/* Modal สำหรับแก้ไขข้อมูล - เหมือนกับ SupplierPage */}
                {showEditModal && selectedId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                        <div className="rounded-lg w-full max-w-2xl bg-white relative">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="absolute top-4 right-2 text-gray-500 hover:text-gray-700"
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
            </div>

            <TablePaginationDemo
                count={filteredSuppliers.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                show={showModal}
                setShow={setShowModal}
                message="ທ່ານຕ້ອງການລົບຜູ້ສະໜອງນີ້ອອກຈາກລະບົບບໍ່？"
                handleConfirm={handleDeleteSupplier}
            />
        </>
    );
}