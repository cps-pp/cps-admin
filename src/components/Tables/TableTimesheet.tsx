import { ITimesheet } from '../../types/attendance';

const TableTimesheet = ({ data }: { data: Array<ITimesheet> }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Timesheet
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Date</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Start at</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Commit at</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">
              Total commit hours
            </h5>
          </div>
          <div className="p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">
              Total valid hours
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Excess hours</h5>
          </div>
        </div>

        {data.map((item: ITimesheet, key: number) => (
          <div
            className={
              (item.isWeekend ? 'bg-red-900' : '') +
              (item.isHoliday ? 'bg-green-700' : '') +
              ` grid grid-cols-4 sm:grid-cols-6 ${
                key === data.length - 1
                  ? ''
                  : 'border-b border-stroke dark:border-strokedark'
              }`
            }
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white sm:block">
                {item.date} ({item.isHoliday ? 'Holiday' : item.dayName})
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-5 font-bold dark:text-white">
                {item.attendance?.check_in_at}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-6 font-bold dark:text-white">
                {item.attendance?.check_out_at}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-3 font-bold">
                {item.attendance?.total_commit}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3 font-bold">
                {item.attendance?.total_valid}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5 font-bold">
              {item.attendance?.total_excess.includes('-') ? (
                <p className="text-meta-7">{item.attendance?.total_excess}</p>
              ) : (
                <p className="text-meta-5">{item.attendance?.total_excess}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableTimesheet;
