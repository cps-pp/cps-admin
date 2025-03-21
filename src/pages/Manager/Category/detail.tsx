import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const DetailCategory: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const [category, setCategory] = useState<any>(location.state?.category || null);
  const [loading, setLoading] = useState<boolean>(!location.state?.category);
  const navigate = useNavigate();

  useEffect(() => {
    if (!category) {
      const fetchCategoryById = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:4000/manager/category/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setCategory(data.data);
        } catch (error) {
          console.error('Error fetching category details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCategoryById();
    }
  }, [id, category]);

  if (loading) return <div className="text-center p-4">Loading category details...</div>;
  if (!category) return <div className="text-center p-4 text-red-500">ບໍ່ພົບຂໍ້ມູນ</div>;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-stroke">ລາຍລະອຽດປະເພດການຢາ</h1>
          
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded bg-slate-500 px-4 py-2 text-center font-medium text-white transition-all duration-150 ease-linear hover:bg-opacity-90 hover:shadow-lg focus:outline-none active:bg-slate-600"
          >
            ກັບຄືນ
          </button>
        </div>

      <div className="space-y-4 py-8">
        <div className="space-y-2">
          {/* <p><strong className="text-lg font-medium">ລະຫັດປະເພດ:</strong> <span className="text-gray-700 dark:text-gray-300">{category.medtype_id}</span></p> */}
          <p><span className="font-medium text-md text-strokedark dark:text-stroke px-4">ຊື່ປະເພດ:</span> <span className="text-strokedark dark:text-stroke">{category.type_name}</span></p>
        </div>
      </div>
    </div>
  );
};

export default DetailCategory;
