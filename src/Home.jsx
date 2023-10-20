import {useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
  };

  const handleFileUpload = async () => {
    try {
      if (selectedFiles.length === 0 || selectedFiles.length === 1) {
        alert("Please select one or more files to upload.");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
      }
      // Replace 'YOUR_BACKEND_URL' with the actual URL of your backend endpoint for file uploads.
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        setResults(response.data.similarities);
      }
      // Handle the response from the server (e.g., display results, update the UI).
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 w-full flex flex-col py-6 px-4 h-auto justify-center items-center text-white gap-4">
      <h2 className="text-[40px]">Ai Scanner</h2>
      <div className="py-4 flex gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="border-2 border-gray-700 rounded-md p-2"
        />
        <button
          onClick={handleFileUpload}
          className="border-2 border-gray-700 px-2 rounded-md hover:bg-gray-950 transition-all"
        >
          Upload
        </button>
      </div>
      {loading ? (
        <div className="min-h-screen my-6">
          <div className="w-32 h-32 border-4 rounded-full border-t-gray-900 animate-spin"></div>
        </div>
      ) : (
        <>
          {results.length === 0 ? <div>No Similarities, please upload other documents</div> : (
            <div className="bg-gray-800 text-white p-4 rounded-md mb-12">
              {results.map((item, i) => (
                <div key={i}>
                  <div className="flex flex-row text-gray-300 justify-between w-full my-4">
                    <p className="text-xl underline">{item.file1}</p>
                    <p className="text-xl underline">{item.file2}</p>
                  </div>
                    <div>
                    {item.similarParagraphs.map((paragraph, j) => (
                      <p key={j}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FileUpload;
