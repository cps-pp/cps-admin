import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import CreateCategory from './create';
import EditCate from './edit';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { Cate } from './column/cate';

const CategoryPage = () => {
  const [categories, setCategory] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [existingIds, setExistingIds] = useState([]);

  // ✅ เก็บ reference ของ handleCloseForm จาก CreateCategory
  const [createFormCloseHandler, setCreateFormCloseHandler] = useState(null);

  // ✅ เพิ่ม state สำหรับการเรียงลำดับ ID (คัดลอกจาก DiseasePage)
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' หรือ 'desc'


  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/src/manager/category`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCategory(data.data);
      setFilteredCategories(data.data);
      // ✅ เก็บรหัสทั้งหมดไว้
      const ids = data.data.map((category) => category.medtype_id);
      setExistingIds(ids);

    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.type_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.medtype_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  // ✅ ฟังก์ชันสำหรับเรียงลำดับ ID (คัดลอกจาก DiseasePage)
  const handleSortById = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    
    const sortedCategories = [...categories].sort((a, b) => {
      const extractNumber = (id) => {
        const match = id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      
      const numA = extractNumber(a.medtype_id);
      const numB = extractNumber(b.medtype_id);
      
      if (newSortOrder === 'asc') {
        return numA - numB; 
      } else {
        return numB - numA; 
      }
    });
    
    setCategory(sortedCategories);
    
    if (searchQuery.trim() !== '') {
      const filtered = sortedCategories.filter(category =>
        category.type_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.medtype_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(sortedCategories);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/category/${selectedCategoryId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('ບໍ່ສາມາດລົບປະເພດຢາໄດ້');

      setCategory((prevCategories) =>
        prevCategories.filter(
          (category) =>
            category.category_id !== selectedCategoryId &&
            category.medtype_id !== selectedCategoryId
        )
      );

      setShowDeleteModal(false);
      setSelectedCategoryId(null);
      dispatch(
        openAlert({
          type: 'success',
          title: 'ລົບຂໍ້ມູນສຳເລັດ',
          message: 'ລົບຂໍ້ມູນປະເພດຢາສຳເລັດແລ້ວ',
        })
      );
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ລົບຂໍ້ມູນບໍ່ສຳເລັດ',
          message: error.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ',
        })
      );
    }
  };

  const openDeleteModal = (id) => () => {
    setSelectedCategoryId(id);
    setShowDeleteModal(true);
  };

  const handleEditCategory = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  // Handle page change in pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Handler สำหรับปุ่ม X ที่จะใช้ฟังก์ชันจาก CreateCategory
  const handleCloseAddModal = () => {
    if (createFormCloseHandler) {
      // เรียกใช้ฟังก์ชันที่ได้รับมาจาก CreateCategory
      createFormCloseHandler();
    } else {
      // fallback ถ้าไม่มี handler
      setShowAddCategoryModal(false);
    }
  };

  const paginatedCate = filteredCategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ຈັດການຂໍ້ມູນປະເພດຢາ
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddCategoryModal(true)}
              icon={iconAdd}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              ເພີ່ມປະເພດ
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="grid w-full gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາຊື່ປະເພດ..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-md">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {Cate.map((header, index) => (
                  <th
                    key={index}
                    className={`px-4 py-3 tracking-wide font-semibold text-form-input ${
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
              {paginatedCate.length > 0 ? (
                paginatedCate.map((cate, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{cate.medtype_id}</td>
                    <td className="px-4 py-4">{cate.type_name}</td>
                    <td className="px-3 py-4 text-center">
                      <TableAction
                        onDelete={openDeleteModal(cate.medtype_id)}
                        onEdit={() => handleEditCategory(cate.medtype_id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded-lg w-full max-w-2xl relative px-4">
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

              <CreateCategory
                setShow={setShowAddCategoryModal}
                getListCategory={fetchCategories}
                existingIds={existingIds}
                onCloseCallback={setCreateFormCloseHandler}
              />
            </div>
          </div>
        )}

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

              <EditCate
                id={selectedId}
                onClose={() => setShowEditModal(false)}
                setShow={setShowEditModal}
                getList={fetchCategories}
              />
            </div>
          </div>
        )}

      </div>

      <TablePaginationDemo
        count={filteredCategories.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      
      <ConfirmModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        message="ທ່ານຕ້ອງການລົບປະເພດຢານີ້ອອกຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteCategory}

      />
    </>



  );
};

export default CategoryPage;

