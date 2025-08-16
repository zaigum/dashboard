import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Modal,
  Button,
  Space,
  Tooltip,
  Pagination,
  Dropdown,
  Menu,
  theme,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShareAltOutlined,
  FilePdfOutlined,
  DownOutlined,
  SaveOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Editor } from "@tinymce/tinymce-react";
import blogsData from "../Data/blogs.json";
import PDFDocument from "./PDFDocument";

const { useToken } = theme;

const BlogListPage = ({ updateBlogs }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewedBlog, setViewedBlog] = useState(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [blogToRestore, setBlogToRestore] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [archivedBlogs, setArchivedBlogs] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const { token } = useToken();

  useEffect(() => {
    const storedBlogs = JSON.parse(localStorage.getItem("blogEntries")) || blogsData;
    const storedArchivedBlogs = JSON.parse(localStorage.getItem("archivedBlogs")) || [];
    setBlogs(storedBlogs);
    setArchivedBlogs(storedArchivedBlogs);
  }, []);

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setUpdatedTitle(blog.title);
    setUpdatedContent(blog.content);
    setIsEditModalOpen(true);
  };

  const handleView = (blog) => {
    setViewedBlog(blog);
    setIsViewModalOpen(true);
  };

  const handleDelete = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const updatedBlogs = blogs.filter((b) => b.id !== selectedBlog.id);
    localStorage.setItem("blogEntries", JSON.stringify(updatedBlogs));
    setBlogs(updatedBlogs);
    toast.success("Blog deleted successfully.");
    setIsDeleteModalOpen(false);
  };

  const handleArchive = (blogToArchive) => {
    const newArchivedBlogs = [...archivedBlogs, blogToArchive];
    localStorage.setItem("archivedBlogs", JSON.stringify(newArchivedBlogs));
    setArchivedBlogs(newArchivedBlogs);

    const updatedBlogs = blogs.filter((b) => b.id !== blogToArchive.id);
    localStorage.setItem("blogEntries", JSON.stringify(updatedBlogs));
    setBlogs(updatedBlogs);

    toast.success("Blog archived successfully.");
  };

  const handleRestore = (blog) => {
    setBlogToRestore(blog);
    setIsRestoreModalOpen(true);
  };

  const confirmRestore = () => {
    const newBlogs = [...blogs, blogToRestore];
    localStorage.setItem("blogEntries", JSON.stringify(newBlogs));
    setBlogs(newBlogs);

    const updatedArchivedBlogs = archivedBlogs.filter((b) => b.id !== blogToRestore.id);
    localStorage.setItem("archivedBlogs", JSON.stringify(updatedArchivedBlogs));
    setArchivedBlogs(updatedArchivedBlogs);

    toast.success("Blog restored successfully.");
    setIsRestoreModalOpen(false);
  };

  const handleUpdate = () => {
    if (selectedBlog) {
      const updatedData = {
        ...selectedBlog,
        title: updatedTitle,
        content: updatedContent,
      };

      const updatedBlogs = blogs.map((blog) =>
        blog.id === selectedBlog.id ? updatedData : blog
      );
      localStorage.setItem("blogEntries", JSON.stringify(updatedBlogs));
      setBlogs(updatedBlogs);
      setIsEditModalOpen(false);
      updateBlogs(updatedData);
      toast.success("Blog updated successfully.");
    }
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
            font-family: 'Roxie Rossa', cursive;
            background-color: ${token.colorBgContainer};
          }
          .container {
            background-color: ${token.colorWhite};
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

  const handleShare = (blog) => {
    const blogUrl = `${window.location.origin}/blog/${blog.id}`;

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
      Modal.info({
        title: "Share Blog",
        content: (
          <div>
            <p>
              Your browser does not support the Web Share API. You can copy the
              link below to share:
            </p>
            <Input value={blogUrl} readOnly />
          </div>
        ),
      });
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

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArchivedBlogs = archivedBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (content) => (
        <div
          dangerouslySetInnerHTML={{
            __html: content.split(" ").slice(0, 15).join(" ") + "...",
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, blog) => (
        <Space size="middle">
          <Dropdown
            overlay={
              <Menu>
                {showArchived ? (
                  <Menu.Item
                    key="restore"
                    icon={<RollbackOutlined />}
                    onClick={() => handleRestore(blog)}
                  >
                    Restore
                  </Menu.Item>
                ) : (
                  <>
                    <Menu.Item
                      key="edit"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(blog)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      key="delete"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(blog)}
                    >
                      Delete
                    </Menu.Item>
                    <Menu.Item
                      key="archive"
                      icon={<SaveOutlined />}
                      onClick={() => handleArchive(blog)}
                    >
                      Archive
                    </Menu.Item>
                  </>
                )}
                <Menu.Item
                  key="view"
                  icon={<EyeOutlined />}
                  onClick={() => handleView(blog)}
                >
                  View
                </Menu.Item>
                <Menu.Item
                  key="preview"
                  icon={<EyeOutlined />}
                  onClick={() => handlePreview(blog)}
                >
                    Preview
                </Menu.Item>
                <Menu.Item
                  key="share"
                  icon={<ShareAltOutlined />}
                  onClick={() => handleShare(blog)}
                >
                    Share
                </Menu.Item>
                <Menu.Item
                  key="pdf"
                  icon={<FilePdfOutlined />}
                  onClick={() => handlePDF(blog.id)}
                >
                    PDF
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const dataSource = showArchived ? filteredArchivedBlogs : filteredBlogs;

  return (
    <div
      style={{
        padding: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: 600 }}>
          {showArchived ? "Archived Blogs" : "Blog List"}
        </h2>
        <Space>
          <Input
            placeholder="Search blogs"
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 250 }}
          />
          <Button onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? "Show Main Blogs" : "Show Archived Blogs"}
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: dataSource.length,
          onChange: handlePageChange,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        style={{ flex: 1 }}
      />

      <Modal
        title="Edit Blog"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
        width="80%"
        style={{ top: 20 }}
      >
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="title" style={{ display: "block", fontWeight: 500 }}>
            Title:
          </label>
          <Input
            id="title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content" style={{ display: "block", fontWeight: 500 }}>
            Content:
          </label>
          <Editor
            apiKey="your-api-key"
            value={updatedContent}
            onEditorChange={setUpdatedContent}
            init={{
              height: 320,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table code help wordcount",
                "media emoticons",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
            }}
          />
        </div>
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Yes"
        cancelText="No"
        okType="danger"
      >
        <p>Are you sure you want to delete this blog?</p>
      </Modal>

      <Modal
        title={viewedBlog?.title}
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
        width="80%"
        style={{ top: 20 }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: viewedBlog?.content }}
          style={{ maxHeight: "400px", overflowY: "auto" }}
        />
      </Modal>

      <Modal
        title="Confirm Restoration"
        open={isRestoreModalOpen}
        onOk={confirmRestore}
        onCancel={() => setIsRestoreModalOpen(false)}
        okText="Yes"
        cancelText="No"
        okType="primary"
      >
        <p>Are you sure you want to restore this blog?</p>
      </Modal>
    </div>
  );
};

export default BlogListPage;