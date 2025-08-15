import React, { useState, useEffect } from "react";
import {
  Input,
  message,
  Modal,
  Space,
  Typography,
  Layout,
} from "antd";
import {
  RiDeleteBinLine,
  RiSendPlane2Line,
  RiDownload2Line,
  RiEyeLine,
} from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { Editor } from "@tinymce/tinymce-react";
import { PDFViewer } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Blog = ({ updateBlogs }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [imageData, setImageData] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handlePreview = () => {
    if (!title || !content) {
      message.error("Please enter title and content before previewing.");
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const previewHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blog Preview</title>
        <style>
            body { line-height: 1.6; padding: 20px; margin: 0; }
            .container { max-width: 900px; margin: 0 auto; padding: 32px; background-color: #fff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; }
            .title { font-size: 2.25rem; font-weight: bold; margin-bottom: 1rem; }
            .date { font-size: 0.875rem; color: #6b7280; margin-bottom: 2rem; }
            .content { font-size: 1.125rem; color: #374151; line-height: 1.625; margin-bottom: 2rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="title">Preview</h1>
          <p class="date">${currentDate}</p>
          <h2 class="title">${title}</h2>
          <div class="content">${content}</div>
          <div style="border-top: 1px solid #d1d5db; padding-top: 2rem; text-align: center; color: #6b7280;">
            <p style="margin-bottom: 1rem;">Thank you for reading!</p>
            <p>Follow us on social media for more updates.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const previewTab = window.open();
    previewTab.document.write(previewHTML);
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
    message.info("Form cleared.");
  };

  const handleSubmit = () => {
    if (!title || !content) {
      message.error("Please fill in all fields.");
      return;
    }

    const existingEntries = JSON.parse(localStorage.getItem("blogEntries")) || [];
    const blogEntry = { id: Date.now(), title, content };
    const updatedEntries = [...existingEntries, blogEntry];
    localStorage.setItem("blogEntries", JSON.stringify(updatedEntries));

    saveDataToJsonFile(updatedEntries);

    message.success("Blog entry submitted successfully.");
    updateBlogs(blogEntry);
    handleClear();
  };

  const handleImageUpload = (blobInfo, success) => {
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "image/*");
    fileInput.onchange = () => {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("uploadedImage", reader.result);
        const imageData = localStorage.getItem("uploadedImage");
        success(imageData);
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  };

  const handlePDFDownload = () => {
    if (!title || !content) {
      message.error("Please enter a title and content before downloading the PDF.");
      return;
    }
    setShowPDFPreview(true);
  };

  const saveDataToJsonFile = (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blog_data.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <Layout className="site-layout" style={{ padding: "16px" }}>
      <Content>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Title level={4} style={{ margin: 0 }}>New Blog Entry</Title>
          <Space>
            <button
              onClick={handlePDFDownload}
              className="bg-gray-300 hover:bg-gray-400 mr-2 text-gray-800 px-3 py-2 text-xs rounded-full flex items-center sm:text-sm"
            >
              <RiDownload2Line className="mr-2" /> PDF
            </button>
            <button
              onClick={handlePreview}
              className="bg-gray-800 hover:bg-gray-900 mr-2 text-white px-4 py-2 rounded-full text-sm flex items-center"
            >
              <RiEyeLine className="mr-2" /> Preview
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-300 hover:bg-gray-400 mr-2 text-gray-800 px-3 py-2 text-xs rounded-full flex items-center sm:text-sm"
            >
              <RiDeleteBinLine className="mr-2" /> Clear
            </button>
            <button
              onClick={handleSubmit}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full text-sm flex items-center"
            >
              <RiSendPlane2Line className="mr-2" /> Submit
            </button>
          </Space>
        </div>

        <div style={{ padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}>
          <div style={{ marginBottom: "16px" }}>
            <Paragraph type="secondary" style={{ marginBottom: "4px" }}>Title</Paragraph>
            <Input
              placeholder="Enter title"
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          <div>
            <Paragraph type="secondary" style={{ marginBottom: "4px" }}>Content</Paragraph>
            <Editor
              apiKey="your-api-key"
              initialValue={content}
              onEditorChange={handleContentChange}
              init={{
                height: 350,
                menubar: true,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table code help wordcount",
                  "media emoticons powerpaste pdf",
                ],
                toolbar:
                  "file edit view format tools table emoticons | undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image media pdf | help",
                images_upload_handler: handleImageUpload,
              }}
            />
          </div>
        </div>
      </Content>

      <Modal
        title="PDF Preview"
        open={showPDFPreview}
        onCancel={() => setShowPDFPreview(false)}
        footer={null}
        width={700}
        destroyOnClose={true}
      >
        <div style={{ width: "100%", height: "600px" }}>
          <PDFViewer width="100%" height="100%">
            <PDFDocument
              title={title}
              content={content}
              imageData={imageData}
            />
          </PDFViewer>
        </div>
      </Modal>
    </Layout>
  );
};

export default Blog;