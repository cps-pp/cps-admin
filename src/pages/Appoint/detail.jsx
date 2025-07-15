import { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Stethoscope,
  Pill,
  FileText,
  Activity,
  ChevronDown,
  ChevronUp,
  Phone,
  FileClock,
  FileMinus,
  RotateCcw,
  Package,
  FilterIcon,
  XCircle,
  ClipboardCheck,
} from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { Empty, Tag } from 'antd';
import { URLBaseLocal } from '../../lib/MyURLAPI';
import moment from 'moment/moment';

const FollowTreatmentPage = ({ onBack }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [inspectionDetails, setInspectionDetails] = useState([]);
  const [filteredInspections, setFilteredInspections] = useState([]);
  const [detailedInspections, setDetailedInspections] = useState({});
  const [prescriptionDetails, setPrescriptionDetails] = useState({});
  const [expandedInspections, setExpandedInspections] = useState({});
  const [loadingInspections, setLoadingInspections] = useState({});

  const [statementPayment, setStatementPayment] = useState([]);

  const [searchDate, setSearchDate] = useState('');
  const [searchInId, setSearchInId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const [patient, setPatient] = useState(location.state?.patient || null);
  const [loading, setLoading] = useState(!location.state?.patient);

  useEffect(() => {
    if (!patient) {
      fetchPatientById();
    } else {
      setPatientDetails(patient);
      fetchInspectionsByPatient(patient.patient_id);
    }
  }, [id, patient]);

  const filterInspections = () => {
    setIsSearching(true);
    let filtered = [...inspectionDetails];

    if (searchDate) {
      filtered = filtered.filter((inspection) => {
        const inspectionDate = new Date(inspection.date)
          .toISOString()
          .split('T')[0];
        const selectedDate = new Date(searchDate).toISOString().split('T')[0];

        // console.log('Comparing:', inspectionDate, 'vs', selectedDate);
        return inspectionDate === selectedDate;
      });
    }

    if (searchInId) {
      filtered = filtered.filter((inspection) =>
        inspection.in_id
          .toString()
          .toLowerCase()
          .includes(searchInId.toLowerCase()),
      );
    }

    setFilteredInspections(filtered);

    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    filterInspections();
  }, [inspectionDetails, searchDate, searchInId]);

  const fetchPatientById = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${URLBaseLocal}/src/report/patient/${id}`);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      setPatient(data.data.patient);
      setPatientDetails(data.data.patient);
      setInspectionDetails(data.data.inspections || []);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInspectionsByPatient = async (patientId) => {
    try {
      const response = await fetch(
        `${URLBaseLocal}/src/report/patient/${patientId}`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setInspectionDetails(data.data.inspections || []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    }
  };

  const fetchInspectionDetails = async (inspectionId) => {
    try {
      setLoadingInspections((prev) => ({ ...prev, [inspectionId]: true }));
      // console.log('Fetching inspection details for ID:', inspectionId);

      const response = await fetch(
        `${URLBaseLocal}/src/report/inspection/${inspectionId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Inspection API response:', data);

      if (data.resultCode === '200') {
        let inspectionData = null;
        if (Array.isArray(data.data) && data.data.length > 0) {
          inspectionData = data.data[0];
        } else if (data.data && typeof data.data === 'object') {
          inspectionData = data.data;
        }

        setDetailedInspections((prev) => ({
          ...prev,
          [inspectionId]: inspectionData,
        }));
        // console.log(inspectionData)
        await fetchPrescriptionDetails(inspectionId);
      } else {
        console.error('API returned error:', data);
      }
    } catch (error) {
      console.error('Error fetching inspection details:', error);
    } finally {
      setLoadingInspections((prev) => ({ ...prev, [inspectionId]: false }));
    }
  };
  const displayedInspections =
    searchDate || searchInId ? filteredInspections : inspectionDetails;

  const fetchPrescriptionDetails = async (inspectionId) => {
    try {
      // console.log('Fetching prescription details for ID:', inspectionId);
      const response = await fetch(
        `${URLBaseLocal}/src/report/prescription?id=${inspectionId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Prescription API response:', data);

      if (data.resultCode === '200') {
        let prescriptionData = [];
        if (data.detail && Array.isArray(data.detail)) {
          prescriptionData = data.detail;
        } else if (data.data && Array.isArray(data.data)) {
          prescriptionData = data.data;
        }

        // console.log('Setting prescription data:', prescriptionData);
        setPrescriptionDetails((prev) => ({
          ...prev,
          [inspectionId]: prescriptionData,
        }));
      } else {
        // console.error('API returned error:', data);
        setPrescriptionDetails((prev) => ({ ...prev, [inspectionId]: [] }));
      }
    } catch (error) {
      // console.error('Error fetching prescription details:', error);
      setPrescriptionDetails((prev) => ({ ...prev, [inspectionId]: [] }));
    }
  };

  const fetchStatements = async (inspectionId) => {
    try {
      // console.log('Fetching prescription details for ID:', inspectionId);
      const response = await fetch(
        `${URLBaseLocal}/src/invoice/inspection-invoice/${inspectionId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.resultCode === '200') {
        setStatementPayment(data.data);
      } else {
        // console.error('API returned error:', data);
        setStatementPayment([]);
      }
    } catch (error) {
      // console.error('Error fetching prescription details:', error);
      setStatementPayment([]);
    }
  };

  const clearSearch = () => {
    setSearchDate('');
    setSearchInId('');
    setFilteredInspections([]);
  };

  const handleReload = async () => {
    setSearchDate('');
    setSearchInId('');

    setFilteredInspections([]);

    if (patient) {
      await fetchInspectionsByPatient(patient.patient_id);
    } else {
      await fetchPatientById();
    }
  };

  const toggleInspectionExpansion = async (inspectionId) => {
    const isExpanded = expandedInspections[inspectionId];

    if (!isExpanded && !detailedInspections[inspectionId]) {
      await fetchInspectionDetails(inspectionId);
    }
    await fetchStatements(inspectionId);

    setExpandedInspections((prev) => ({
      ...prev,
      [inspectionId]: !isExpanded,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return '-';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const latestInspectionId = inspectionDetails
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.in_id;

  const detailedData = latestInspectionId
    ? detailedInspections[latestInspectionId]
    : null;
  // เพิ่ม function เพื่อดึง SPK services จาก inspection ล่าสุด
  const getLatestSPKServices = () => {
    const latestInspectionId = inspectionDetails
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.in_id;

    const latestDetailedData = latestInspectionId
      ? detailedInspections[latestInspectionId]
      : null;

    if (!latestDetailedData?.services) return [];

    // กรองเฉพาะ services ที่มีรหัสขึ้นต้นด้วย "SPK"
    return latestDetailedData.services.filter(
      (service) => service.ser_id && service.ser_id.startsWith('SPK'),
    );
  };

  // เพิ่ม function เพื่อรวมชื่อ services ทั้งหมด
  const getSPKServiceNames = () => {
    const spkServices = getLatestSPKServices();
    if (spkServices.length === 0) return '-';

    return spkServices.map((service) => service.ser_name).join(', ');
  };

  const renderInspectionCard = (inspection) => {
    const isExpanded = expandedInspections[inspection.in_id];
    const isLoading = loadingInspections[inspection.in_id];
    const detailedData = detailedInspections[inspection.in_id];
    const prescriptions = prescriptionDetails[inspection.in_id] || [];

    return (
      <div
        key={inspection.in_id}
        className="bg-white rounded border border-stroke overflow-hidden hover:shadow-sm transition-shadow duration-200"
      >
        <div className="p-4 border-b border-stroke">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-secondary2" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary2 mb-1">
                  ເລກທີປິ່ນປົວ: {inspection.in_id}
                  <Tag
                    className="ml-2 font-normal rounded-full"
                    style={{ fontFamily: 'Noto Sans Lao' }}
                    color={`${inspection?.invoice?.status_paid === 'SUCCESS' ? 'green' : 'blue'}`}
                  >
                    {inspection?.invoice?.status_paid === 'SUCCESS'
                      ? 'ສໍາເລັດ'
                      : 'ບໍ່ສໍາເລັດ'}
                  </Tag>
                </h3>
                <p className="text-sm text-gray-500">
                  ວັນທີ່: {formatDate(inspection.date)}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleInspectionExpansion(inspection.in_id)}
              className="inline-flex items-center px-3 py-1 text-md font-medium rounded border transition-colors text-[#51416B] bg-[#51416B1A] border-[#51416B40] hover:bg-[#51416B33] hover:text-[#3A2F55]"
            >
              <span>{isExpanded ? 'ປິດ' : 'ເບິ່ງລາຍລະອຽດ'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="">
              <h4 className="font-medium text-form-strokedark">
                ອາການເບື້ອງຕົ້ນ: {inspection.symptom || '-'}
              </h4>
            </div>
            <div className="">
              <h4 className="font-medium text-form-strokedark">
                ພະຍາດປັດຈຸບັນ: {inspection.diseases_now || '-'}
              </h4>
            </div>
            <div className="">
              <h4 className="font-medium text-form-strokedark">
                ບົ່ງມະຕີ: {inspection.checkup || '-'}
              </h4>
            </div>
            <div className="">
              <h4 className="font-medium text-form-strokedark">
                ໝາຍເຫດ: {inspection.note || '-'}
              </h4>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {/* Services */}
                {detailedData?.services?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-secondary2 flex items-center">
                      <FileMinus className="w-5 h-5 mr-1 text-secondary2" />
                      ບໍລິການທີ່ໃຊ້
                    </h4>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full border-collapse border border-slate-300">
                        <thead>
                          <tr className="text-left bg-slate-100 border border-stroke">
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200">
                              ບໍລິການ
                            </th>
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200">
                              ຈຳນວນ
                            </th>
                            <th className="px-4 text-right py-3 tracking-wide text-form-input font-semibold border-r border-slate-200">
                              ລາຄາ (ກີບ)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailedData?.services?.map((service, index) => (
                            <tr
                              key={index}
                              className="border-b text-md border-stroke"
                            >
                              <td className="px-4 py-2 border border-stroke">
                                {service.ser_name}
                              </td>
                              <td className="px-4 py-2 border-r border-stroke">
                                {service.qty}
                              </td>
                              <td className="px-4 py-2 border-r border-stroke text-right">
                                {service.total?.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="font-semibold text-secondary2">
                            <td className="px-4 py-2 border border-stroke text-right">
                              ລວມທັງໝົດ
                            </td>
                            <td className="px-4 py-2 border border-stroke">
                              {detailedData?.services?.reduce(
                                (sum, service) => sum + (service.qty || 0),
                                0,
                              )}{' '}
                              ລາຍການ
                            </td>
                            <td className="px-4 py-2 border border-stroke text-right">
                              {detailedData?.services
                                .reduce(
                                  (sum, service) => sum + (service.total || 0),
                                  0,
                                )
                                .toLocaleString()}{' '}
                              ກີບ
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {prescriptions?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-secondary2 flex items-center">
                      <Pill className="w-5 h-5 mr-1 text-secondary2" />
                      ການຈ່າຍຢາ ແລະ ອຸປະກອນ
                    </h4>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full border-collapse border border-slate-300">
                        <thead>
                          <tr className="text-left bg-slate-100 border border-stroke">
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200">
                              ຊື່ຢາ/ອຸປະກອນ
                            </th>
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200">
                              ປະເພດ
                            </th>
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200">
                              ລະຫັດຢາ
                            </th>
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200">
                              ຈຳນວນ
                            </th>
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200 text-right">
                              ລາຄາ
                            </th>
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200 text-right">
                              ລາຄາລວມ (ກີບ)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {prescriptions?.map((prescription, index) => (
                            <tr
                              key={prescription.pre_id || index}
                              className="border-b text-md border-stroke"
                            >
                              <td className="px-4 py-2 border border-stroke">
                                {prescription.med_name}
                              </td>
                              <td className="px-4 py-2 border border-stroke">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    prescription.type_name === 'ຢາ'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-purple-100 text-secondary2'
                                  }`}
                                >
                                  {prescription.type_name}
                                </span>
                              </td>
                              <td className="px-4 py-2 border border-stroke">
                                {prescription.med_id}
                              </td>
                              <td className="px-4 py-2 border border-stroke">
                                {prescription.qty}
                              </td>
                              <td className="px-4 py-2 border border-stroke text-right">
                                {prescription.price?.toLocaleString()}
                              </td>
                              <td className="px-4 py-2 border border-stroke text-gray-900 text-right">
                                {prescription.total?.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="font-semibold text-secondary2">
                            <td
                              className="px-4 py-2 border border-stroke text-right"
                              colSpan={5}
                            >
                              ລາຄາລວມທັງໝົດ
                            </td>
                            <td className="px-4 py-2 border border-stroke text-right">
                              {prescriptions
                                .reduce(
                                  (total, item) => total + (item.total || 0),
                                  0,
                                )
                                .toLocaleString()}{' '}
                              ກີບ
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {statementPayment?.payments?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-Third4 flex items-center">
                      <ClipboardCheck className="w-5 h-5 mr-1 text-Third4" />
                      ປະຫວັດການຈ່າຍ
                    </h4>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full border-collapse border border-slate-300">
                        <thead>
                          <tr className="text-left bg-slate-100 border border-stroke">
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200">
                              ລະຫັດການຈ່າຍ
                            </th>
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200">
                              ເວລາ
                            </th>
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200">
                              ປະເພດ
                            </th>
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200 text-right">
                              ເລດ
                            </th>
                            <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-200 text-right">
                              ຈຳນວນ
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {statementPayment?.payments?.map((payment, index) => (
                            <tr
                              key={payment.pay_id || index}
                              className="border-b text-md border-stroke"
                            >
                              <td className="px-4 py-2 border border-stroke">
                                {payment.pay_id}
                              </td>
                              <td className="px-4 py-2 border border-stroke">
                                {moment(payment?.pay_date).format(
                                  'DD/MM/YYYY HH:mm',
                                )}
                              </td>
                              <td className="px-4 py-2 border border-stroke">
                                {payment.pay_type?.toUpperCase() === 'CASH' && (
                                  <span className="inline-block bg-secondary2/10 text-secondary text-sm  px-3 py-1 rounded-full">
                                    CASH
                                  </span>
                                )}
                                {payment.pay_type?.toUpperCase() === 'TRANSFER' && (
                                  <span className="inline-block bg-blue-100 text-blue-800 text-sm  px-3 py-1 rounded-full">
                                    TRANSFER
                                  </span>
                                )}
                             
                                {!['CASH', 'TRANSFER'].includes(
                                  payment.pay_type?.toUpperCase(),
                                ) && (
                                  <span className="inline-block bg-gray-100 text-gray-700 text-sm  px-3 py-1 rounded-full">
                                    {payment.pay_type}
                                  </span>
                                )}

                              </td>

                              <td className="px-4 py-2 border border-stroke text-gray-900 text-right">
                                {payment?.ex_rate ?? 0}
                              </td>
                              <td className="px-4 py-2 border border-stroke text-right">
                                {Number(
                                  payment?.paid_amount || 0,
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="font-semibold text-secondary2">
                            <td
                              className="px-4 py-2 border border-stroke text-right"
                              colSpan={4}
                            >
                              ຍອດທັງໝົດ (ກີບ)
                            </td>
                            <td className="px-4 py-2 border border-stroke text-right">
                              {statementPayment?.total_paid?.toLocaleString() ??
                                0}
                            </td>
                          </tr>
                          <tr className="font-semibold text-red-500">
                            <td
                              className="px-4 py-2 border border-stroke text-right"
                              colSpan={4}
                            >
                              ຍອດຄ້າງຈ່າຍ (ກີບ)
                            </td>
                            <td className="px-4 py-2 border text-red-500 border-stroke text-right">
                              {(
                                Number(statementPayment?.total) -
                                  Number(statementPayment?.total_paid) || 0
                              ).toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600">ບໍ່ມີຂໍ້ມູນຄົນເຈັບ</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນຄົນເຈັບ...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-red-500">ບໍ່ພົບຂໍ້ມູນຄົນເຈັບ</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="">
        {/* Header Section */}
        <div className="bg-white rounded border border-stroke p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <BackButton />
              <button
                onClick={handleReload}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-md font-medium rounded border border-secondary2/40 bg-secondary2/10 text-secondary2 hover:bg-secondary2/15 disabled:opacity-50 transition-colors"
              >
                <RotateCcw
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                />
                ໂຫຼດໃໝ່
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-md font-semibold rounded border transition-all duration-200 shadow-sm ${
                  showFilters
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                    : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <FilterIcon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showFilters ? 'rotate-90' : ''
                  }`}
                />
                {showFilters ? 'ປິດ' : 'ເປີດການຄົ້ນຫາ'}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                {/* ค้นหาตามวันที่ */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຄົ້ນຫາຕາມວັນທີ່
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary text-black dark:text-white capitalize"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຄົ້ນຫາຕາມລະຫັດໃບບິນ
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="search"
                      placeholder="ຄົ້ນຫາ..."
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary text-black dark:text-white capitalize"
                      value={searchInId}
                      onChange={(e) => setSearchInId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="lg:w-auto">
                  <button
                    onClick={() => {
                      setSearchDate('');
                      setSearchInId('');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-3 mt-2 lg:mt-6 text-md font-semibold rounded border border-rose-500 text-rose-500 bg-white hover:bg-rose-50 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    ລ້າງການຄົ້ນຫາ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] gap-6 ">
          <div className="w-full max-w-sm space-y-4">
            <div className="bg-white rounded  border border-stroke overflow-hidden">
              <div className="bg-white p-6">
                <div className="flex flex-col items-center gap-4 mb-2 ">
                  <div className="w-16 h-16 bg-secondary2 rounded-full flex items-center justify-center shadow">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-form-input">
                      {patient.patient_name} {patient.patient_surname}
                    </h3>
                    <p className="text-md text-slate-500 font-medium">
                      ລະຫັດ: {patient.patient_id}
                    </p>
                  </div>
                </div>

                <div className="">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-md text-form-input">ເພດ</span>
                    <span className="text-md font-medium text-form-input">
                      {patient.gender || '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-md text-form-input">ອາຍຸ</span>
                    <span className="text-md font-medium text-form-input">
                      {calculateAge(patient.dob)} ປີ
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-md text-form-input">ວັນເກີດ</span>
                    <span className="text-md font-medium text-form-input">
                      {formatDate(patient.dob)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4 border-t border-stroke">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary2 mt-1" />
                  <div className="flex-1">
                    <p className="text-md font-medium text-form-input">
                      {patient.village || '-'}
                    </p>
                    <p className="text-sm text-form-input">
                      {patient.district}, {patient.province}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-secondary2" />
                  <span className="text-md text-form-input">
                    {patient.phone1 || '-'}{' '}
                    {patient.phone2 && `/ ${patient.phone2}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary2 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-form-input">ຈຳນວນກວດ</h3>
                    <p className="text-sm text-slate-500">ລວມ</p>
                  </div>

                  <div className="h-10 ml-4 border-l border-slate-400 mx-3" />
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-secondary2">
                    {inspectionDetails.length}{' '}
                    <span className="text-secondary2">ຮອບ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary2 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-form-input">ແພັກແກັດ</h3>
                  </div>

                  <div className="h-10  border-l border-slate-400 mx-7" />
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-secondary2">
                    {getLatestSPKServices().length}{' '}
                    <span className="text-secondary2">ລາຍການ</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    ແພັກແກັກ{getSPKServiceNames()}
                  </div>
                </div>
              </div>
            </div>
            {/*  */}
            <div className="mt-6 bg-white rounded shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-secondary2 rounded-full flex items-center justify-center">
                  <FileClock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-slate-900 mb-1">
                    ກວດຄັ້ງລ່າສຸດ
                  </h3>
                  <p className="text-sm text-slate-500">ການອັບເດດຫຼ້າສຸດ</p>
                </div>
              </div>

              <div className="space-y-3">
                {inspectionDetails
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .slice(0, 3)
                  .map((inspection, index) => (
                    <div
                      key={inspection.in_id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs font-semibold text-secondary2">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-md text-secondary2 font-semibold mb-1">
                          ວັນທີ່ມາກວດ: {formatDate(inspection.date)}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          ໃບບິນປິ່ນປົວ: {inspection.in_id}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Inspection History */}
          <div className="w-full">
            <div className="bg-white rounded shadow-sm border border-stroke">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary2 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        ປະຫວັດການກວດ
                      </h2>
                      <p className="text-sm text-slate-500">
                        ລາຍລະອຽດການກວດແຕ່ລະຄັ້ງ
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {displayedInspections.length > 0 ? (
                  <div className="space-y-4">
                    {displayedInspections.map((inspection) =>
                      renderInspectionCard(inspection),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 flex items-center justify-center mx-auto ">
                      <Empty description={false} />
                    </div>
                    <p className="text-lg">ບໍ່ພົບປະຫວັດການກວດ</p>
                    <p className="text-sm mt-2">ກະລຸນາກວດສອບຂໍ້ມູນ</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FollowTreatmentPage;
