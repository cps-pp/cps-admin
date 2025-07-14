import React from 'react';
import { List, Pill } from 'lucide-react';

const PopupInspection = ({ isOpen, onClose, inspection, detailedData, prescriptions, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Popup Content */}
        <div className="overflow-y-auto max-h-[80vh] space-y-6">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
            </div>
          ) : (
            <>
              {/* Services */}
              {detailedData?.services?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <List className="w-4 h-4 mr-2" /> ບໍລິການທີ່ໃຊ້
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {detailedData.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              {service.ser_name}  ຈຳນວນ: {service.qty}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {service.total?.toLocaleString()} ກີບ
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Prescriptions */}
              {prescriptions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Pill className="w-4 h-4 mr-2" /> ໃບສັ່ງຢາ ແລະ ອຸປະກອນ
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-4">
                      {prescriptions.map((prescription, index) => (
                        <div key={prescription.pre_id || index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-medium text-gray-900">
                                  {prescription.med_name}
                                </h5>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${prescription.type_name === 'ຢາ' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                  {prescription.type_name}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                <div>
                                  <p className="text-gray-500">ລະຫັດຢາ</p>
                                  <p className="font-medium text-gray-900">{prescription.med_id}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">ຈຳນວນ</p>
                                  <p className="font-medium text-gray-900">{prescription.qty}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">ລາຄາ/ຫົວໜ່ວຍ</p>
                                  <p className="font-medium text-gray-900">{prescription.price?.toLocaleString()} ກີບ</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm text-gray-500">ລາຄາລວມ</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {prescription.total?.toLocaleString()} ກີບ
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-900">ລາຄາລວມທັງໝົດ</span>
                          <span className="text-xl font-bold text-blue-900">
                            {prescriptions.reduce((total, item) => total + (item.total || 0), 0).toLocaleString()} ກີບ
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-blue-700">
                          ລາຍການທັງໝົດ: {prescriptions.length} ລາຍການ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupInspection;