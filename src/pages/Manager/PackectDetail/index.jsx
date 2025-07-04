import { useEffect, useState } from 'react';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';

import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { ServiceHeaders } from './column/service.js';

// Import Components
import EditServicerList from './edit.jsx';
import CreateServiceList from './create.jsx';
import ViewService from './view.jsx';
import AddDetailPacket from './create_detail.jsx';
import { Eye, Plus } from 'lucide-react';
import { Empty } from 'antd';

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAdd_detailModal, setShowAdd_detailModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();

  const [existingIds, setExistingIds] = useState([]);
  const [createFormCloseHandler, setCreateFormCloseHandler] = useState(null);

  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' หรือ 'desc'

  const fetchServiceList = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/src/manager/servicelistPACKAGE`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setServices(data.data);
      setFilteredServices(data.data);
      // ✅ เก็บรหัสทั้งหมดไว้
      const ids = data.data.map((service) => service.ser_id);
      setExistingIds(ids);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceList();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.ser_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.ser_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  // ✅ ฟังก์ชันสำหรับเรียงลำดับ ID
  const handleSortById = () => {


    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    const sortedServices = [...services].sort((a, b) => {
      const extractNumber = (id) => {
        const match = id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };

      const numA = extractNumber(a.ser_id);
      const numB = extractNumber(b.ser_id);

      if (newSortOrder === 'asc') {
        return numA - numB;
      } else {
        return numB - numA;
      }
    });

    setServices(sortedServices);

    if (searchQuery.trim() !== '') {
      const filtered = sortedServices.filter(service =>
        service.ser_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(sortedServices);
    }


  };

  // ✅ ฟังก์ชันนี้ถูกต้องแล้ว - ใช้ setSelectedId
  const handleAdd_detail = (id) => {
    setSelectedId(id);
    setShowAdd_detailModal(true);
  };

  // ✅ ฟังก์ชันนี้ถูกต้องแล้ว - ใช้ setSelectedId
  const handleView = (id) => {
    setSelectedId(id);
    setShowViewModal(true);
  };

  const openDeleteModal = (id) => () => {
    setSelectedServiceId(id);
    setShowModal(true);
  };

  const handleDeleteService = async () => {
    if (!selectedServiceId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/servicelist/${selectedServiceId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setServices((prevServices) =>
        prevServices.filter((service) => service.ser_id !== selectedServiceId),
      );

      setShowModal(false);
      setSelectedServiceId(null);
      dispatch(
        openAlert({
          type: 'success',
          title: 'ລົບຂໍ້ມູນສຳເລັດ',
          message: 'ລົບຂໍ້ມູນລາຍການສຳເລັດແລ້ວ',
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

  const handleEdit = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseAddModal = () => {
    if (createFormCloseHandler) {
      createFormCloseHandler();
    } else {
      setShowAddModal(false);
    }
  };

  const paginatedList = filteredServices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />

        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ຈັດການຂໍ້ມູນລາຍການບໍລິການແພັກແກັດ
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddModal(true)}
              icon={iconAdd}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              ເພີ່ມຂໍ້ມູນແພັກແກັດ
            </Button>
          </div>
        </div>

        <div className="grid w-full gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາຊື່ລາຍການ..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
            }}
          />
        </div>

        <div className="overflow-x-auto  shadow-md">
          <table className="w-full min-w-max table-auto  ">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {ServiceHeaders.map((header, index) => (
                  <th
                    key={index}
                    className={`px-4 py-3 tracking-wide font-semibold text-form-input ${header.id === 'id'
                      ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-800 select-none'
                      : ''
                      }`}
                    onClick={header.id === 'id' ? handleSortById : undefined}
                  >
                    <div className="flex items-center gap-2 ">
                      {header.name}
                      {header.id === 'id' && (
                        <span
                          className={`ml-2 inline-block text-xs font-bold transition-colors duration-200 ${sortOrder === 'asc'
                            ? 'text-green-600'
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
              {paginatedList.length > 0 ? (
                paginatedList.map((service, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{service.ser_id}</td>

                    <td className="px-4 py-4">{service.ser_name}</td>

                    <td className="px-4 py-4">
                      {(service.price * 1).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">{service.ispackage}</td>
<td className="px-3 py-4 ">
                    <div className="flex gap-2 ">
                      <button
                        onClick={() => handleAdd_detail(service.ser_id)}
                        className="inline-flex items-center px-3 py-1  text-md font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        ເພີ່ມ
                      </button>


                      <button
                        onClick={() => handleView(service.ser_id)}
                        className="inline-flex items-center px-3 py-1  text-md font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        ເບີ່ງລາຍລະອຽດ
                      </button>
                    </div>
                  </td>

                    {/* <td className="px-3 py-4 text-center">
                      <TableAction
                        onAdd={() => handleAdd_detail(service.ser_id)}
                        onView={() => handleView(service.ser_id)}
                      />
                    </td> */}

                    <td className="px-3 py-4 text-center">
                      <TableAction
                        // onView={() => handleViewService(service.ser_id)}
                        onDelete={openDeleteModal(service.ser_id)}
                        onEdit={() => handleEdit(service.ser_id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                     <div className="text-center ">
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

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded-lg w-full max-w-2xl relative px-4 ">
              {/* ✅ ปุ่ม X ที่ใช้ฟังก์ชันป้องกันจาก CreateCategory */}
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

              <CreateServiceList
                setShow={setShowAddModal}
                getList={fetchServiceList}
                existingIds={existingIds} // ✅ เพิ่มบรรทัดน
                onCloseCallback={setCreateFormCloseHandler} // ✅ ส่ง callback function
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

              <EditServicerList
                id={selectedId}
                onClose={() => setShowEditModal(false)}
                setShow={setShowEditModal}
                getList={fetchServiceList}
              />
            </div>
          </div>
        )}

        {/* Add Detail Modal */}
              {showAdd_detailModal && selectedId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                  <div className="rounded w-full max-w-lg md:max-w-2xl lg:max-w-5xl relative overflow-auto max-h-[90vh]">
                    <button
                      onClick={() => setShowAdd_detailModal(false)}
                      className="absolute top-4 right-2 text-gray-500 hover:text-gray-700 z-10"
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
        
                    <AddDetailPacket
                      id={selectedId}
                      onClose={() => setShowAdd_detailModal(false)}
                      setShow={setShowAdd_detailModal}
                      getList={fetchServiceList}
                    />
                  </div>
                </div>
              )}

        {/* View Modal */}
      {showViewModal && selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="rounded w-full max-w-lg md:max-w-2xl lg:max-w-5xl relative overflow-auto max-h-[90vh]">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-2 text-gray-500 hover:text-gray-700 z-10"
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

            <ViewService
              id={selectedId}
              onClose={() => setShowViewModal(false)}
              setShow={setShowViewModal}
              getList={fetchServiceList}
            />
          </div>
        </div>
      )}
      </div>
      <TablePaginationDemo
        count={paginatedList.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບລາຍການນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteService}
      />
    </>
  );
};

export default ServicePage;
