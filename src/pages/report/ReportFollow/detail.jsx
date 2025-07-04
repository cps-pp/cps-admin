import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';

const DetailFollow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [patientDetail, setPatientDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPatientDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${URLBaseLocal}/src/report/inspection/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error fetching patient detail');
      }

      setPatientDetail(data.detail);
    } catch (error) {
      console.error('Error:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນລາຍລະອຽດໄດ້',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatientDetail();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">ກຳລັງໂຫລດ...</div>
        </div>
      </div>
    );
  }

  if (!patientDetail) {
    return (
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">ບໍ່ພົບຂໍ້ມູນຜູ້ປ່ວຍ</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            ກັບ
          </button>
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark">
            ລາຍລະອຽດການປິນປົວ
          </h1>
        </div>
      </div>

      {/* Patient Detail Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Patient Information Card */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-stroke">
            <h2 className="text-lg font-semibold mb-4 text-strokedark border-b border-stroke pb-2">
              ຂໍ້ມູນຜູ້ປ່ວຍ
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-form-input mb-1">
                    ລະຫັດປິນປົວ
                  </label>
                  <p className="text-strokedark font-medium">{patientDetail.in_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-form-input mb-1">
                    ລະຫັດຄົນເຈັບ
                  </label>
                  <p className="text-strokedark font-medium">{patientDetail.patient_id}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-form-input mb-1">
                  ຊື່ ແລະ ນາມສະກຸນ
                </label>
                <p className="text-strokedark font-medium text-lg">
                  {patientDetail.patient_name} {patientDetail.patient_surname}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-form-input mb-1">
                    ເພດ
                  </label>
                  <p className="text-strokedark">{patientDetail.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-form-input mb-1">
                    ວັນທີປິນປົວ
                  </label>
                  <p className="text-strokedark">{formatDate(patientDetail.date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information Card */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-stroke">
            <h2 className="text-lg font-semibold mb-4 text-strokedark border-b border-stroke pb-2">
              ຂໍ້ມູນການປິນປົວ
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-form-input mb-1">
                  ອາການ
                </label>
                <div className="bg-white dark:bg-boxdark rounded border border-stroke p-3">
                  <p className="text-strokedark">{patientDetail.symptom || 'ບໍ່ມີຂໍ້ມູນ'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-form-input mb-1">
                  ກວດພົບ
                </label>
                <div className="bg-white dark:bg-boxdark rounded border border-stroke p-3">
                  <p className="text-strokedark">{patientDetail.checkup || 'ບໍ່ມີຂໍ້ມູນ'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-form-input mb-1">
                  ພະຍາດປັດຈຸບັນ
                </label>
                <div className="bg-white dark:bg-boxdark rounded border border-stroke p-3">
                  <p className="text-strokedark">{patientDetail.diseases_now || 'ບໍ່ມີຂໍ້ມູນ'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-stroke">
          <h2 className="text-lg font-semibold mb-4 text-strokedark border-b border-stroke pb-2">
            ໝາຍເຫດ
          </h2>
          <div className="bg-white dark:bg-boxdark rounded border border-stroke p-4">
            <p className="text-strokedark whitespace-pre-wrap">
              {patientDetail.note || 'ບໍ່ມີໝາຍເຫດ'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-end">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 border border-stroke rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            ປິດ
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-success text-white rounded hover:bg-opacity-90 transition-colors"
          >
            ພິມ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailFollow;