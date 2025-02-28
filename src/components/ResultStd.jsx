import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFilePdf, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { deleteExamResultApi, ExamResultApi } from '../services/allApi';
import './resultstd.css'
import { Button } from 'react-bootstrap';

const ResultStd = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access');
  const [searchQuery, setSearchQuery] = useState("");
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    if (token) {
      fetchResults();
    } else {
      toast.error("Unauthorized: Please log in.");
      setLoading(false);
    }
  }, [token]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await ExamResultApi(token);
      if (response.length > 0) {
        const updatedResults = response.map((result) => ({
          ...result,
          fileUrl: result.file ? `http://localhost:8000${result.file}` : null
        }));
        setResults(updatedResults);
      } else {
        setResults([]);
        toast.warn("No results found.");
      }
    } catch (error) {
      console.error("Error fetching exam results:", error);
      toast.error(error.response?.data?.message || "Error fetching exam results.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await deleteExamResultApi(token, id);
      if (response.status === 204) {
        setResults(results.filter((result) => result.id !== id));
        toast.success('Exam result deleted successfully');
      } else {
        toast.error('Failed to delete exam result');
      }
    } catch (error) {
      console.error("Error deleting exam result:", error);
      toast.error('Error deleting exam result');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter results based on search query
  const filteredResults = results.filter((result) =>
    result.title.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="exam-result-container">
      <h2 className="result-title">Exam Results</h2>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading results...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="no-results">
          <FaExclamationTriangle className="no-results-icon" />
          <p>No results available.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="result-table">
            <thead>
              <tr>
                <th>SI.No</th>
                <th>Title</th>
                <th>File</th>
                {userRole !== 'student' && <th>Action</th>}

              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result, index) => (
                <tr key={result.id}>
                  <td data-label="SI.No">{index + 1}</td>
                  <td data-label="Title">{result.title}</td>
                  <td data-label="File">
                    {result.fileUrl ? (
                      <a
                        className="pdf-link"
                        href={result.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFilePdf className="pdf-icon" />
                        <span>View PDF</span>
                      </a>
                    ) : (
                      <p className="no-pdf">No PDF available</p>
                    )}
                  </td>
                  {userRole !== 'student' && (
                    <td data-label="Action">
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(result.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResultStd;
