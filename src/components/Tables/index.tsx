import { iconDown, iconUp } from '@/configs/icon';
import { ITable } from '@/types/table';

export default function Table(props: ITable) {
  const { header, data, body, loading, children, onSort, sortConfig, headerAction, title, filterAction, className } =
    props;

  return (
    <div
      className={`${className} relative rounded-lg border-stroke bg-white pb-2.5   dark:border-strokedark dark:bg-boxdark xl:pb-1`}
    >
      <div className="flex w-full justify-between px-4 pb-4">
        <div className="flex">
          <h1 className="text-sm font-bold md:text-xl">{title}</h1>
        </div>
        <div className="items-center">
          <div className="flex gap-4">{headerAction}</div>
        </div>
      </div>
      <div className="flex gap-4 px-4">{filterAction}</div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-max table-auto">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-2 text-left dark:bg-meta-4">
              {header.map((item, index) => (
                
                <th
                  key={index}
                  className={`relative min-w-[50px] px-4 py-4 font-normal text-primarySecond dark:font-medium border-b border-stroke dark:text-gray-500 ${item.sortable ? 'cursor-pointer bg-table hover:bg-gray-200 dark:bg-strokedark dark:hover:bg-gray-600' : ''} ${index === 0 ? '' : ''} ${index === header.length - 1 ? '' : ''}`}
                  onClick={() => item.sortable && onSort && onSort(item.id)}
                >
                  <span>{item.name}</span>
                  {item.sortable && sortConfig?.sortBy === item.id && (
                    <span className="absolute z-10">{sortConfig.sortType === 'asc' ? iconUp : iconDown}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={header.length} className="p-0">
                  <div className="relative h-1 w-full bg-gray-200 dark:bg-gray-700">
                    <div className="animate-loading h-full bg-blue-500 dark:bg-blue-600" />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          <tbody>
            {data.length > 0 ? (
              body
            ) : (
              <tr>
                <td colSpan={header.length} className="px-4 py-5 text-center text-black dark:text-white">
                  <div className="flex flex-col items-center justify-center py-10">
                    {/* <h1 className="text-xl font-light">
                      ຕອນນີຍັງບໍ່ພົບລາຍການສິນຄ້າ ກະລຸນາສ້າງສີນຄ້າ, ປະເພດສິນຄ້າ, ຫົວໜ່ວຍ ແລະ ຜູ້ຈັດຫາກ່ອນ{<br />}
                      ເພື່ອຂາຍສິນຄ້າ
                    </h1> */}
                    <p className="pt-4 text-base font-light">ບໍ່ພົບລາຍການສີນຄ້າ</p>
                   
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {children}
    </div>
  );
}
