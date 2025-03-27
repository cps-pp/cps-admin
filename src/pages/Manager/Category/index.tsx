import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import { CateHeaders } from './column/cate';

const CategoryPage: React.FC = () => {
  const [categories, setCategory] = useState<any[]>([]); // Data ของหมวดหมู่
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]); // Data ที่กรองแล้ว
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // ค่าของการค้นหาที่ผู้ใช้ป้อน
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/manager/category`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data); // Debugging
        setCategory(data.data); // บันทึกข้อมูลหมวดหมู่
        setFilteredCategories(data.data); // เริ่มต้นให้ผลลัพธ์เป็นทั้งหมด
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add a useEffect to apply search filtering whenever searchQuery or categories change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.type_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const openDeleteModal = (id: string) => () => {
    setSelectedCategoryId(id);
    setShowModal(true); 
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return;
  
    try {
      const response = await fetch(
        `http://localhost:4000/manager/category/${selectedCategoryId}`,
        {
          method: 'DELETE',
        },
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Just update the categories state - the useEffect will automatically update filteredCategories
      setCategory((prevCategories) =>
        prevCategories.filter(
          (category) => category.category_id !== selectedCategoryId && 
                       category.medtype_id !== selectedCategoryId
        ),
      );
      
      setShowModal(false);
      setSelectedCategoryId(null); 
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  
  const handleEditCategory = (id: string) => {
    navigate(`/category/edit/${id}`);
  };

  const handleViewCategory = (id: string) => {
    navigate(`/category/detail/${id}`);
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
    <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
      <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">ຈັດການຂໍ້ມູນປະເພດຢາ</h1>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => navigate('/category/create')}
          icon={iconAdd}
          className="bg-primary"
        >
          ເພີ່ມຂໍ້ມູນຢາ
        </Button>
      </div>
    </div>

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

      <div className="text-md text-strokedark dark:text-bodydark3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto border-collapse ">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-left dark:bg-meta-4 bg-blue-100">
                {CateHeaders.map((header, index) => (
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cate, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{cate.medtype_id}</td>

                    <td className="px-4 py-4">{cate.type_name}</td>
                    
                    <td className="px-3 py-4 text-center">
                      <TableAction
                        // onView={() => handleViewCategory(cate.medtype_id)}
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
      </div>

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບປະເພດຢານີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteCategory} 
      />
    </div>
  );
};

export default CategoryPage;