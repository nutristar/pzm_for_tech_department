import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_GET = 'http://192.168.0.80:5000/tech_department';
const API_DELETE = 'http://192.168.0.80:5000/delete';



const REFRESH_INTERVAL = 10000;

const TranscriptionsList = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
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
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
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
      <h2>USTERKI TECHNICZNE</h2>

      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Обновление...' : 'REFRESH'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#eee' }}>
            <th></th>
            <th>POKOJ</th>
            <th>PROBLEM</th>
            <th>TIME</th>
          </tr>
        </thead>
        <tbody>
  {[...transcriptions]
    .sort((a, b) => new Date(a.pokoj) - new Date(b.pokoj)) // сортировка по возрастанию
    .map((item) => (
      <tr key={item.id} style={{ borderBottom: '1px solid #ccc' }}>
        <td>
          <input
            type="checkbox"
            checked={selectedIds.has(item.id)}
            onChange={() => handleCheckboxChange(item.id)}
          />
        </td>
        <td style={{ textAlign: 'center' }}>{item.pokoj}</td>
        <td>{item.tech_problem || '-'}</td>
        <td style={{ textAlign: 'center' }}>
          {new Date(item.timestamp).toLocaleString()}
        </td>
      </tr>
    ))}
</tbody>

      </table>

      {transcriptions.length > 0 && (
        <button
          onClick={handleDelete}
          disabled={selectedIds.size === 0}
          style={{ marginTop: '20px' }}
        >
          Fixed / Zrobione
        </button>
      )}
    </div>
  );
};

export default TranscriptionsList;







// const API_GET =    'http://63.178.37.169:5000/tech_department';
// const API_DELETE = 'http://63.178.37.169:5000/delete';