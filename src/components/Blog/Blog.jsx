import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  RiDeleteBinLine,
  RiSendPlane2Line,
  RiDownload2Line,
} from "react-icons/ri";
import { RiEyeLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PDFViewer } from "@react-pdf/renderer"; // Import PDFViewer from react-pdf/renderer
import PDFDocument from "./PDFDocument"; // Import your PDFDocument component
import jsPDF from "jspdf";
import { AiOutlineClose } from "react-icons/ai"; // Import the AiOutlineClose icon

const Blog = ({ updateBlogs }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [imageData, setImageData] = useState(""); // Define imageData state

  useEffect(() => {
    countCharactersAndWords();
  }, [content]);

  const countCharactersAndWords = () => {
    const text = content.replace(/(<([^>]+)>)/gi, "");
    const words = text.trim().split(/\s+/);
    setCharCount(text.length);
    setWordCount(words.length);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handlePreview = () => {
    if (!title || !content) {
      toast.error("Please enter title and content before previewing.");
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
        <link href="https://fonts.googleapis.com/css2?family=Roxie+Rossa&display=swap" rel="stylesheet">
        <!-- Include Tailwind CSS CDN -->
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body {
             line-height: 1.6;
            background-image: url('https://unsplash.com/photos/muOHbrFGEQY/download?force=true');
            background-size: cover;
            background-position: center;
            padding: 20px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container w-9/12 mx-auto px-4 py-8 bg-white bg-opacity-90 rounded-lg shadow-md">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">Preview</h1>
          <p class="text-sm text-gray-600 mb-8">${currentDate}</p>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">${title}</h2>
          <div class="text-lg text-gray-700 leading-relaxed mb-8">${content}</div>
          <div class="border-t border-gray-300 pt-8 text-center text-gray-600">
            <p class="mb-4">Thank you for reading!</p>
            <p>Follow us on social media for more updates.</p>
            <!-- Add your social media icons/links here if needed -->
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
    setCharCount(0);
    setWordCount(0);
  };

  const handleSubmit = () => {
    if (!title || !content) {
      toast.error("Please fill in all fields");
      return;
    }

    const existingEntries =
      JSON.parse(localStorage.getItem("blogEntries")) || [];

    const blogEntry = { id: Date.now(), title, content };

    const updatedEntries = [...existingEntries, blogEntry];

    localStorage.setItem("blogEntries", JSON.stringify(updatedEntries));

    saveDataToJsonFile(updatedEntries);

    toast.success("Blog entry submitted successfully");

    updateBlogs(blogEntry);

    setTitle("");
    setContent("");
    setCharCount(0);
    setWordCount(0);
  };

  const handleImageUpload = (blobInfo, success, failure, progress) => {
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
      toast.error("Please enter title and content before downloading PDF.");
      return;
    }

    setShowPDFPreview(true);
  };

  // Function to save data to JSON file
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
    <div className="w-full h-full p-2 flex flex-col">
      <ToastContainer />
      <div>
        <div className="flex justify-between items-center mb-3 mt-2">
          <h5 className="text-2xl font-semibold">New Blog Entry</h5>
          <div className="flex items-center">
            <button
              onClick={handlePDFDownload}
              className="bg-gray-300 hover:bg-gray-400  mr-2 text-gray-800 px-3 py-2 text-xs rounded-full flex items-center sm:text-sm"
            >
              <RiDownload2Line className="mr-2" /> PDF
            </button>
            <button
              onClick={handlePreview}
              className="bg-gray-800 hover:bg-gray-900 mr-2  text-white px-4 py-2 rounded-full text-sm flex items-center"
            >
              <RiEyeLine className="mr-2" /> Preview
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-300 hover:bg-gray-400 mr-2  text-gray-800 px-3 py-2 text-xs rounded-full flex items-center sm:text-sm"
            >
              <RiDeleteBinLine className="mr-2" /> Clear
            </button>
            <button
              onClick={handleSubmit}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full text-sm flex items-center"
            >
              <RiSendPlane2Line className="mr-2" /> Submit
            </button>
          </div>
        </div>
        <div
          className="bg-white rounded-2xl   w-full  p-3"
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
        >
          <div className="mb-4">
            <h6 className="text-sm text-gray-400 italic">Title</h6>
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={handleTitleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div className=" mb-2">
            <div className="flex justify-between items-center mb-1">
              <h6 className="text-sm text-gray-400 italic">Content</h6>
            </div>
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
                  "file edit view format tools table emoticons | \
    undo redo | formatselect | bold italic backcolor | \
    alignleft aligncenter alignright alignjustify | \
    bullist numlist outdent indent | removeformat | image media pdf | help",
                images_upload_url: "your-upload-url",
                images_upload_handler: handleImageUpload,
              }}
            />
          </div>
        </div>
      </div>
      {showPDFPreview && (
        <div className="w-full h-full fixed top-0 left-0 z-50 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="flex justify-between items-center bg-gray-200 p-3">
              <h2 className="text-lg font-semibold">PDF Preview</h2>
              <button
                className="text-gray-800 hover:text-gray-600"
                onClick={() => setShowPDFPreview(false)}
              >
                <AiOutlineClose className="mr-1" />
              </button>
            </div>
            <div style={{ width: "600px", height: "550px" }}>
              <PDFViewer width="100%" height="100%">
                <PDFDocument
                  title={title}
                  content={content}
                  imageData={imageData}
                />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;