import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [modelPreparing, setModelPreparing] = useState(false);
  const [chatbtn, setChat] = useState(false);

  const fetchCurrentModel = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/currentmodel/');
      console.log("RES", res.data.modelname);
      setChat(res.data.modelname === localStorage.getItem('username'));
    } catch (error) {
      console.error('Error fetching current model:', error);
    }
  };

  const fetchFiles = async () => {
    const username = 'sushil';
    try {
      const response = await axios.get('http://127.0.0.1:8000/files/', {
        params: { username }
      });
      setFiles(response.data.files);
      setChat(false); // Hide chat button when files change
      await fetchCurrentModel();  // Call to check current model after fetching files
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('username', 'sushil'); 

    setUploading(true);
    try {
      await axios.post('http://127.0.0.1:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchFiles();  
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handlePrepareModel = async () => {
    setModelPreparing(true);
    const formData = new FormData();
    formData.append('username', 'sushil'); 
    try {
      const response = await axios.post('http://127.0.0.1:8000/start_model/', formData);
      if (response.status === 200) {
        alert('Model prepared successfully');
      }
    } catch (error) {
      console.error('Error preparing model:', error);
    } finally {
      setModelPreparing(false);
      await fetchCurrentModel();  // Check current model after preparing model
    }
  };

  const handleDeleteFile = async (filename) => {
    const username = localStorage.getItem('username');
    try {
        await axios.delete(`http://127.0.0.1:8000/delete/${filename}`, {
            params: { username }
        });
        await fetchFiles();  // Refetch files after deletion
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

  useEffect(() => {
    fetchFiles();
    localStorage.setItem('username', "sushil");
  }, []);

  return (
    <div style={styles.container}>
      <input
        type="file"
        onChange={handleFileUpload}
        style={styles.uploadButton}
        disabled={uploading}
      />
      <div style={styles.fileList}>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <ul>
            {files.map((file, index) => (
              <li key={index} style={styles.fileItem}>
                {file}
                <button
                  onClick={() => handleDeleteFile(file)}
                  style={styles.deleteButton}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {files.length > 0 && (
        <div style={styles.buttonsContainer}>
          <button
            onClick={handlePrepareModel}
            style={styles.prepareButton}
            disabled={modelPreparing}
          >
            {modelPreparing ? 'Preparing model...' : 'Prepare model'}
          </button>
          {chatbtn && (
            <Link to={"/testchat"}>
              <button style={styles.chatButton}>Chat</button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
  },
  uploadButton: {
    marginBottom: '20px',
  },
  fileList: {
    width: '80%',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    textAlign: 'left',
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: 'red',
    fontSize: '20px',
    cursor: 'pointer',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: '20px',
  },
  prepareButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  chatButton: {
    padding: '10px 20px',
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default FileUploader;
