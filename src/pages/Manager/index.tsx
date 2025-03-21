import api from '@/api/axios';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hook';
import ConfirmModal from '@/components/Modal';
import { useNavigate } from 'react-router-dom';
import { showAlertWithAutoClose } from '@/redux/reducer/alert';
import { IBlogs, TGetListBlogs } from '@/types/blog';
import TablePagination from '@/components/Tables/Pagination';

const BlogPage = () => {
  const [data, setData] = useState<IBlogs[]>([]);
  const [selectedBlog, setSelectedBlogs] = useState<IBlogs | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, _] = useState<number>(9);
  const [totalPages, setTotalPages] = useState<number>(0);

  async function getListBlogs(query?: TGetListBlogs) {
    try {
      const result = await api.get('/blog/getlist', {
        params: {
          limit: query?.limit || 9,
          page: query?.page || 1,
        },
      });
      if (result.data.count) {
        setData(result.data.data);
        setTotalPages(Math.ceil(result.data.count / limit));
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  async function handleDeleteBlog() {
    if (!selectedBlog) return;
    try {
      await api.delete(`/blog/delete/${selectedBlog._id}`);
      setConfirmModal(false);
      getListBlogs(); // Refresh data
      dispatch(
        showAlertWithAutoClose({
          type: 'success',
          title: 'Delete Careers successfully',
          message: '',
        }),
      );
    } catch (error) {
      console.error('Error deleting account:', error);
      dispatch(
        showAlertWithAutoClose({
          type: 'error',
          title: 'Error deleting Careers',
          message: 'Please try again later.',
        }),
      );
    }
  }

  const handleCreateBlogs = () => {
    navigate('/blogs/create');
  };

  // async function handleDeleteCareers() {
  //   if (!selectedCareers) return;
  //   try {
  //     await api.delete(`/career/delete/${selectedCareers._id}`);
  //     setConfirmModal(false);
  //     getListBlogs(); // Refresh data
  //     dispatch(
  //       showAlertWithAutoClose({
  //         type: 'success',
  //         title: 'Delete Careers successfully',
  //         message: '',
  //       }),
  //     );
  //   } catch (error) {
  //     console.error('Error deleting account:', error);
  //     dispatch(
  //       showAlertWithAutoClose({
  //         type: 'error',
  //         title: 'Error deleting Careers',
  //         message: 'Please try again later.',
  //       }),
  //     );
  //   }
  // }

  // useEffect(() => {
  //   fetchData();
  // }, []);
  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
    getListBlogs({ page: pageNumber });
  };

  const handlePrevClick = () => {
    if (page > 1) {
      setPage(page - 1);
      getListBlogs({ page: page - 1 });
    }
  };

  const handleNextClick = () => {
    if (page < totalPages) {
      setPage(page + 1);
      getListBlogs({ page: page + 1 });
    }
  };

  useEffect(() => {
    getListBlogs();
  }, []);

  const handleDetailBlog = (_id: string) => {
    navigate(`/blogs/article/details/${_id}`);
  };
  const handleEditBlog = (id: string) => {
    navigate(`/blogs/article/edit/${id}`);
  };

  return (
    <div className="z-0">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Blogs
        </h2>
      </div>
      <div className="mb-6 flex flex-col gap-3 text-right">
        <div className="flex items-center gap-4">
          <div
            onClick={handleCreateBlogs}
            className="ml-auto cursor-pointer inline-flex items-center justify-center gap-2.5 rounded-md bg-primary active:bg-blue-800 py-3 hover:shadow-lg text-center font-medium text-white hover:bg-opacity-90 lg:px-8 px-10 outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M5.18 15.296c-1.258.738-4.555 2.243-2.547 4.126c.982.92 2.074 1.578 3.448 1.578h7.838c1.374 0 2.467-.658 3.447-1.578c2.009-1.883-1.288-3.389-2.546-4.126a9.61 9.61 0 0 0-9.64 0M14 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0m5.5-3v5M22 6.5h-5"
                  color="currentColor"
                />
              </svg>
            </span>
            Create News Blog
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {data.map((blog) => (
          <div
            key={blog._id}
            className="border border-stroke bg-white p-6 rounded-lg hover:shadow-xl shadow-md transition-shadow duration-300 dark:border-strokedark dark:bg-boxdark"
          >
            {/* <hr className="w-full mb-2 border-slate-600" /> */}

            <div className="mb-3 overflow-hidden h-[185px]">
              {blog.cover_image ? (
                <img
                  src={blog.cover_image}
                  alt="Cover Image"
                  className="w-full h-[180px] object-cover rounded"
                />
              ) : (
                <p className="text-gray-400 text-lg text-center">
                  No cover image available
                </p>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-5 text-ellipsis overflow-hidden h-[78px] line-clamp-3 ">
              {blog.title}
            </h3>
            <p
              className="text-lg text-gray-400 mb-3 text-ellipsis overflow-hidden h-[54px] line-clamp-2"
              dangerouslySetInnerHTML={{ __html: blog.sort_description }}
            ></p>

            <div className="flex justify-between">
              <button
                className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded transition-colors duration-200"
                onClick={() => handleEditBlog(blog._id)}
              >
                Edit
              </button>
              <button
                className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors duration-200"
                onClick={() => handleDetailBlog(blog._id)}
              >
                Detail
              </button>
              {/* <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors duration-200"
          onClick={() => {
            setSelectedBlogs(blog);
            setConfirmModal(true);
          }}
        >
          
          Delete
        </button> */}
            </div>
          </div>
        ))}
      </div>
      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        handlePageClick={handlePageClick}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
      />

      <ConfirmModal
        show={confirmModal}
        setShow={setConfirmModal}
        title="Delete Blog"
        message="Are you sure you want to delete this Blog?"
        handleConfirm={handleDeleteBlog}
      />
    </div>
  );
};
export default BlogPage;
