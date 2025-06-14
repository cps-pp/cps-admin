         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-5">
              <h3 className="font-semibold text-form-input mb-4 flex items-center text-lg">
                <User className="mr-2 text-form-strokedark" size={18} />
                ຂໍ້ມູນຄົນເຈັບ
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ລະຫັດຄົນເຈັບ:</span>
                  <span className="font-medium text-form-input">
                    {patientData?.patient_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ເລກທີປິ່ນປົວ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.in_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ຊື່-ນາມສະກູນ:</span>
                  <span className="font-medium text-form-input">
                    {patientData?.patient_name || ''}{' '}
                    {patientData?.patient_surname || ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ເພດ:</span>
                  <span className="font-medium text-form-input">
                    {patientData?.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 ">
              <h3 className="font-semibold text-form-input mb-4 flex items-center text-lg">
                <Hash className="mr-2 text-form-strokedark" size={18} />
                ຂໍ້ມູນການປິ່ນປົວ
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ວັນທີປິ່ນປົວ:</span>
                  <span className="font-medium text-form-input">
                    {formatDate(inspectionData?.date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ອາການເບື່ອງຕົ້ນ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.symptom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ການວິເຄາະ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.diseases_now}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ການກວດ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.checkup}
                  </span>
                </div>
              </div>
            </div>
          </div>
      {services.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-form-input mb-4 text-lg">
                ລາຍການບໍລິການ:
              </h3>
              <div className="overflow-x-auto border border-stroke rounded">
                <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded ">
                  <thead>
                    <tr className="text-left bg-secondary2 text-white ">
                      <th className="border-b border-gray-200 px-4 py-3 text-left  ">
                        ລຳດັບ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left  ">
                        ຊື່ບໍລິການ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center  ">
                        ຈຳນວນ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-right  ">
                        ລາຄາ/ຫົວ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-right  ">
                        ລາຄາລວມ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr
                        key={`service-${index}`}
                        className="border-b border-stroke  hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 text-form-strokedark">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-form-input font-medium">
                          {service.name || service.ser_name || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-center text-form-strokedark">
                          {service.qty}
                        </td>
                        <td className="px-4 py-3 text-right text-form-strokedark">
                          {formatCurrency(service.price)}
                        </td>
                        <td className="px-4 py-3 text-right text-form-input font-semibold">
                          {formatCurrency(service.price * service.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
              {medicines.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-form-input mb-4 text-lg">
                ລາຍການຢາທີ່ໃຊ້:
              </h3>
              <div className="overflow-x-auto border border-stroke rounded">
                <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded">
                  <thead>
                    <tr className="text-left bg-secondary2 text-white">
                      <th className="border-b border-gray-200 px-4 py-3 text-left  ">
                        ລຳດັບ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left  ">
                        ຊື່ຢາ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center  ">
                        ຈຳນວນ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-right  ">
                        ລາຄາ/ຫົວ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-right  ">
                        ລາຄາລວມ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((medicine, index) => (
                      <tr
                        key={`medicine-${index}`}
                        className="border-b border-stroke hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 text-form-strokedark">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-form-input font-medium">
                          {medicine.name || medicine.med_name}
                        </td>
                        <td className="px-4 py-3 text-center text-form-strokedark">
                          {medicine.qty}
                        </td>
                        <td className="px-4 py-3 text-right text-form-strokedark">
                          {formatCurrency(medicine.price)}
                        </td>
                        <td className="px-4 py-3 text-right text-form-input font-semibold">
                          {formatCurrency(medicine.price * medicine.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
