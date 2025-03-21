import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/api/axios';
import Loader from '@/common/Loader';
import { IBlogs } from '@/types/blog';

const BlogDetailPage = () => {
  const [BlogDetail, setBlogDetail] = useState<IBlogs | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogDetail(id as string);
      //  console.log('Blog Detailllllll:', BlogDetail);
    }
  }, [id]);

  const fetchBlogDetail = async (id: string) => {
    try {
      const response = await api.get(`/blog/${id}`);
      console.log('BlogDetail response:', response.data);

      setBlogDetail(response.data);
    } catch (error) {
      console.error('Error fetching blog details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (id: string) => {
    navigate(`/blogs/article/edit/${id}`);
  };
  if (loading) return <Loader />;
  return (
    <div className="container mx-auto p-4">
      {BlogDetail ? (
        <div className="border border-stroke bg-white p-6 rounded-lg hover:shadow-xl shadow-md transition-shadow duration-300 dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-end gap-2 mb-4 ">
            <button
              onClick={() => handleEditBlog(BlogDetail._id)}
              className="cursor-pointer inline-flex items-center justify-center rounded-md bg-slate-500 hover:bg-slate-600 py-2 px-4 hover:shadow-lg text-center font-medium text-white hover:bg-opacity-90 outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Edit
            </button>
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer inline-flex items-center justify-center rounded-md bg-primary active:bg-blue-800 py-2 px-4 hover:shadow-lg text-center font-medium text-white hover:bg-opacity-90 outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Go Back
            </button>
          </div>
          <div className="flex  items-center">
            <h1 className="text-xl font-bold mb-4 text-primary">
              {BlogDetail.title}
            </h1>
          </div>

          <hr className="my-4 border-gray-300" />
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mt-6">
              En_title:
              <p
                className="text-primary"
                dangerouslySetInnerHTML={{ __html: BlogDetail.en_title }}
              ></p>
            </h2>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Sort_description:
            </h2>
            <p
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: BlogDetail.sort_description }}
            ></p>
          </div>
          <div className="mb-4 ">
            <h2 className="text-xl font-semibold text-gray-700">
              Cover Image:
            </h2>

            <img
              src={BlogDetail.cover_image}
              alt={BlogDetail.title}
              className="w-full h-auto rounded-md shadow-md"
            />
          </div>
          {/* <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Thumbnail:</h2>
            <img
              src={BlogDetail.thumbnail}
            //   alt={BlogDetail.title}
              className="w-full h-auto rounded-md shadow-md"
            />
          </div> */}
          <div className="mb-4 ">
            <h2 className="text-xl font-semibold text-gray-700">Content:</h2>
            <p
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: BlogDetail.content }}
            ></p>
          </div>
          <div className="mb-4 ">
            <h2 className="text-xl font-semibold text-gray-700 ">
              Categories:
            </h2>
            <ul className="text-gray-600 list-none p-0">
              {BlogDetail.categories.map((category: any) => (
                <li key={category._id}>{category.name}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Tags:</h2>
            <ul className="text-gray-600 list-none p-0">
              {BlogDetail.tags.map((tag: any) => (
                <li key={tag._id}>{tag.name}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700">publish:</h2>
            <p className="text-gray-600">
              {BlogDetail.publish ? 'Public' : 'Close'}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading blog details...</p>
      )}
    </div>
  );
};

export default BlogDetailPage;
