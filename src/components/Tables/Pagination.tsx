interface ITablePagination {
  totalPages: number;
  currentPage: number;
  handlePageClick: any;
  handlePrevClick: any;
  handleNextClick: any;
}

export default function TablePagination(props: ITablePagination) {
  const {
    totalPages,
    currentPage = 1,
    handlePageClick,
    handlePrevClick,
    handleNextClick,
  } = props;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i}>
          <a
            href="#"
            onClick={() => handlePageClick(i)}
            className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 dark:border-strokedark dark:bg-boxdark 
              ${
                currentPage === i
                  ? 'text-blue-600 dark:border-strokedark dark:bg-blue-600 border border-blue-300 bg-blue-100 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700  dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 bg-white dark:border-strokedark dark:bg-boxdark border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
          >
            {i}
          </a>
        </li>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className="my-4">
      <ul className="flex items-center -space-x-px h-8 text-sm justify-end list-none">
        <li>
          <div
            onClick={handlePrevClick}
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white dark:border-strokedark dark:bg-boxdark border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </div>
        </li>

        {renderPageNumbers()}

        <li>
          <div
            onClick={handleNextClick}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white dark:border-strokedark dark:bg-boxdark border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </div>
        </li>
      </ul>
    </div>
  );
}
