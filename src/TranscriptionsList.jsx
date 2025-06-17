import React, { useEffect, useState } from 'react';
import axios from 'axios';

// const API_GET = 'http://192.168.0.80:5000/recive';
// const API_DELETE = 'http://192.168.0.80:5000/delete';
const API_GET =    'http://63.178.37.169:5000/recive';
const API_DELETE = 'http://63.178.37.169:5000/delete';


const REFRESH_COOLDOWN = 5000;

const TranscriptionsList = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_GET);
      setTranscriptions(response.data);
      setSelectedIds(new Set());
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
      alert('Пожалуйста, подождите перед следующим обновлением');
      return;
    }
    setLastRefreshTime(now);
    fetchData();
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleDelete = async () => {
    const idsToDelete = Array.from(selectedIds);
    try {
      for (const id of idsToDelete) {
        await axios.delete(API_DELETE, {
          headers: { 'Content-Type': 'application/json' },
          data: { id },
        });
      }
      setTranscriptions((prev) =>
        prev.filter((item) => !selectedIds.has(item.id))
      );
      setSelectedIds(new Set());
    } catch (err) {
      alert('Ошибка при удалении');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>LIST USTEREK</h2>
      <button onClick={handleRefresh} disabled={loading}>
        {loading ? 'Обновление...' : 'Refresh/Ponowic'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {transcriptions.map((item, index) => (
          <div key={item.id} style={{ marginBottom: '20px' }}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.has(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
              />
              <span style={{ marginLeft: '10px' }}>
                {/* <strong>Файл:</strong> {item.file_name}<br /> */}
                <strong>POKOJ             :</strong> {item.pokoj}<br />
                <strong>Problema / Usterka:</strong> {item.tresc}<br />
                {/* <strong>Ezyk :</strong> {item.language}<br /> */}
                <strong>Dzien Czas:</strong> {new Date(item.timestamp).toLocaleString()}
              </span>
            </label>
            {index < transcriptions.length - 1 && (
              <hr
                style={{
                  border: 'none',
                  height: '2px',
                  backgroundColor: 'black',
                  margin: '20px 0',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {transcriptions.length > 0 && (
        <button
          onClick={handleDelete}
          disabled={selectedIds.size === 0}
          style={{ marginTop: '20px' }}
        >
          Zrobilem
        </button>
      )}
    </div>
  );
};

export default TranscriptionsList;
