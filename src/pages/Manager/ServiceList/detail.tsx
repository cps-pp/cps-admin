import BackButton from '@/components/BackButton';
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const DetailServiceList: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const [list, setList] = useState<any>(location.state?.list || null);
  const [loading, setLoading] = useState<boolean>(!location.state?.list);
  const navigate = useNavigate();

  useEffect(() => {
    if (!list) {
      const fetchListById = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:4000/manager/servicelist/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setList(data.data);
        } catch (error) {
          console.error('Error fetching category details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchListById();
    }
  }, [id, list]);

  if (loading) return <div className="text-center p-4">Loading details...</div>;
  if (!list) return <div className="text-center p-4 text-red-500">ບໍ່ພົບຂໍ້ມູນ</div>;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
    <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
      <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
        ລາຍລະອຽດລາຍການບໍລິການ
      </h1>
      <BackButton className="mb-4" />

    </div>
      <div className="space-y-4 py-8">
        <div className="space-y-2">
          <p><span className="font-medium text-md text-strokedark dark:text-stroke px-4">ຊື່ລາຍການ:</span> <span className="text-strokedark dark:text-stroke">{list.ser_name}</span></p>
          <p><span className="font-medium text-md text-strokedark dark:text-stroke px-4">ລາຄາ:</span> <span className="text-strokedark dark:text-stroke">{list.price}</span></p>

        </div>
      </div>
    </div>
  );
};

export default DetailServiceList;
