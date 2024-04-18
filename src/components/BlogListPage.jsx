import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { Editor } from "@tinymce/tinymce-react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import blogsData from "../Data/blogs.json";
import PDFDocument from "./PDFDocument";

const BlogListPage = ({ updateBlogs }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [sortType, setSortType] = useState("asc");
  const blogsPerPage = 4;
  const pagesVisited = pageNumber * blogsPerPage;
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);

  useEffect(() => {
    const storedBlogs = JSON.parse(localStorage.getItem("blogEntries")) || [];
    setBlogs(storedBlogs);
  }, []);

  useEffect(() => {
    setBlogs(blogsData);
  }, []);

  const handleSort = () => {
    const sortedBlogs = [...blogs].sort((a, b) => {
      if (sortType === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setBlogs(sortedBlogs);
    setSortType(sortType === "asc" ? "desc" : "asc");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (blog) => {
    setIsDeleteModalOpen(true);
    setBlogToDelete(blog);
  };

  const confirmDelete = () => {
    const updatedBlogs = blogs.filter((b) => b.id !== blogToDelete.id);
    localStorage.setItem("blogEntries", JSON.stringify(updatedBlogs));
    setBlogs(updatedBlogs);
    setSelectedRow(null);
    toast.success("Blog deleted successfully.");
    setIsDeleteModalOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handlePreview = (blog) => {
    const previewTab = window.open();
    const previewHTML = getPreviewHTML(blog);
    const blob = new Blob([previewHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    previewTab.location.href = url;
  };

  const getPreviewHTML = (blog) => {
    const { title, content } = blog;
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const queryString = new URLSearchParams({
      title,
      content,
      currentDate,
    });

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blog Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=Roxie+Rossa&display=swap" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body {
            // Additional CSS styles for body if needed
          }
        </style>
      </head>
      <body>
        <div class="container w-9/12 mx-auto px-4 py-8 bg-white bg-opacity-90 rounded-lg">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">Preview</h1>
          <div class="border-t border-gray-300 pt-8 text-gray-600">
            <p class="text-sm text-gray-600 mb-8">${currentDate}</p>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">${title}</h2>
            <div class="text-lg text-gray-700 leading-relaxed mb-8">${content}</div>
            <div class="border-t border-gray-300 pt-8 text-center text-gray-600">
              <p class="mb-4">Thank you for reading!</p>
              <p>Follow us on social media for more updates.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleEdit = (blog) => {
    setSelectedRow(blog);
    setIsModalOpen(true);
    setUpdatedTitle(blog.title);
    setUpdatedContent(blog.content);
  };

  const handleUpdate = () => {
    if (selectedRow) {
      const updatedData = {
        ...selectedRow,
        title: updatedTitle,
        content: updatedContent,
      };

      const updatedBlogs = blogs.map((blog) =>
        blog.id === selectedRow.id ? updatedData : blog
      );
      localStorage.setItem("blogEntries", JSON.stringify(updatedBlogs));
      setBlogs(updatedBlogs);

      setIsModalOpen(false);
      updateBlogs(updatedData);

      toast.success("Blog updated successfully.");
    }
  };

  const onSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setPageNumber(0);
  };

  const filteredBlogs = blogs.filter((blog) => {
    return blog.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pageCount = Math.ceil(filteredBlogs.length / blogsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleShare = (blog) => {
    const baseUrl = window.location.href;
    const queryParams = new URLSearchParams({
      title: blog.title,
      content: blog.content,
    });
    const blogUrl = `${baseUrl}?${queryParams.toString()}`;

    if (navigator.share) {
      navigator
        .share({
          title: blog.title,
          text: blog.content,
          url: blogUrl,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      window.open(blogUrl, "_blank");
    }
  };

  const handlePDF = (blogId) => {
    const blog = blogs.find((blog) => blog.id === blogId);

    if (blog) {
      const pdfBlob = new Blob(
        [<PDFDocument title={blog.title} content={blog.content} />],
        { type: "application/pdf" }
      );
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${blog.title}.pdf`;
      link.click();

      URL.revokeObjectURL(pdfUrl);
    } else {
      console.error("Blog not found!");
    }
  };

  return (
    <div className="w-full h-full p-2 flex flex-col">
      <ToastContainer />
      <div className="flex p-2 items-center justify-between">
        <h2 className="text-2xl   font-semibold">Blog List</h2>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={onSearchInputChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto border rounded-xl  h-3/4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 ">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left  text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={handleSort}
              >
                Title{" "}
                {sortType === "asc" ? <span>&uarr;</span> : <span>&darr;</span>}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Content
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {filteredBlogs
              .slice(pagesVisited, pagesVisited + blogsPerPage)
              .map((blog, index) => (
                // Inside the tbody tag
                <tr key={blog.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 w-60 h-16 ">
                    <div className="text-sm font-medium text-gray-900">
                      {blog.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 w-1/2 ">
                    <div
                      className="text-sm text-gray-700 "
                      dangerouslySetInnerHTML={{
                        __html:
                          blog.content.split(" ").slice(0, 15).join(" ") +
                          "...",
                      }}
                    ></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap justify-center  text-sm flex relative">
                    <button
                      onClick={() =>
                        setDropdownIndex(index === dropdownIndex ? null : index)
                      }
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 text-xs rounded-full flex items-center sm:text-sm mr-2"
                    >
                      <ChevronDownIcon className="h-4 w-4 mr-1" />
                      Actions
                    </button>
                    {dropdownIndex === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white mr-3 border border-gray-200 rounded-lg shadow-md z-10">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center"
                        >
                          <ChevronRightIcon className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center"
                        >
                          <ChevronRightIcon className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                        <button
                          onClick={() => handlePreview(blog)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center"
                        >
                          <ChevronRightIcon className="h-4 w-4 mr-2" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleShare(blog)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center"
                        >
                          <ChevronRightIcon className="h-4 w-4 mr-2" />
                          Share
                        </button>
                        <button
                          onClick={() => handlePDF(blog.id)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center"
                        >
                          <ChevronRightIcon className="h-4 w-4 mr-2" />
                          PDF
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center my-4">
        <ReactPaginate
          previousLabel={
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          }
          nextLabel={
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          }
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
        />
      </div>
      {isModalOpen && (
        <div className="fixed bg-black bg-opacity-50 inset-0 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full md:w-11/12 overflow-hidden">
            <div className="flex justify-between items-center bg-gray-200 px-6 py-3">
              <h2 className="text-xl md:text-2xl font-semibold">Edit Blog</h2>
              <button
                onClick={handleModalClose}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4 md:p-8">
              <div className="mb-4">
                <label htmlFor="title" className="block mb-1 font-medium">
                  Title:
                </label>
                <input
                  id="title"
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block mb-1 font-medium">
                  Content:
                </label>
                <Editor
                  apiKey="your-api-key"
                  initialValue={updatedContent}
                  value={updatedContent}
                  onEditorChange={setUpdatedContent}
                  init={{
                    height: 320,
                    menubar: true,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table code help wordcount",
                      "media emoticons powerpaste pdf",
                    ],
                    toolbar:
                      "file edit view format tools table emoticons | \
      undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | image media pdf | help",
                    images_upload_url: "your-upload-url",
                    images_upload_handler: (
                      blobInfo,
                      success,
                      failure,
                      progress
                    ) => {
                      const fileInput = document.createElement("input");
                      fileInput.setAttribute("type", "file");
                      fileInput.setAttribute("accept", "image/*");
                      fileInput.onchange = () => {
                        const file = fileInput.files[0];
                        const reader = new FileReader();
                        reader.onload = () => {
                          success(reader.result);
                        };
                        reader.readAsDataURL(file);
                      };
                      fileInput.click();
                    },
                  }}
                />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleUpdate}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full text-sm flex items-center"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed bg-black bg-opacity-50 inset-0 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full md:w-1/2 overflow-hidden">
            <div className="p-8">
              <p className="text-lg font-semibold">
                Are you sure you want to delete this blog?
              </p>
              <div className="flex justify-end mt-6">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-400 text-white px-4 py-2 rounded-full text-sm flex items-center"
                >
                  Yes
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full text-sm flex items-center ml-4"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
