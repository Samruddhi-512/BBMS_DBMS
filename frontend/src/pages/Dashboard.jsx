import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();   // ✅ FIX: added navigate

  const [stats, setStats] = useState({ buildings: 0, businesses: 0, employees: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('');
  const [floorStats, setFloorStats] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchFloors();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: buildings } = await api.get('/buildings');
      const { data: businesses } = await api.get('/businesses');
      const { data: employees } = await api.get('/employees');

      setStats({
        buildings: buildings.length,
        businesses: businesses.length,
        employees: employees.length
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFloors = async () => {
    try {
      const { data } = await api.get('/floors');
      setFloors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (q.length > 0) {
      try {
        const { data } = await api.get('/search', { params: { q } });
        setSearchResults(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSearchResults(null);
    }
  };

  const navigateToTab = (tab) => {
    navigate(`/${tab}`);
    setSearchResults(null);
    setSearchQuery('');
  };

  const fetchFloorAnalytics = async (floorId) => {
    setSelectedFloor(floorId);
    if (!floorId) return;

    try {
      const { data } = await api.get(`/floors/${floorId}/summary`);
      setFloorStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      {/* SEARCH BAR */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="🔍 Search buildings, businesses, or employees..." 
          value={searchQuery}
          onChange={handleSearch}
        />

        {searchResults && (
          <div className="glass-card search-results">
            <h3>Search Results</h3>

            {searchResults.buildings?.length > 0 && (
              <div>
                <p><strong>Buildings:</strong></p>
                {searchResults.buildings.map(b => (
                  <div key={b._id} className="search-item clickable" onClick={() => navigateToTab('buildings')}>
                    {b.name} <span style={{fontSize: '0.7em', color: 'var(--text-muted)'}}>- {b.address}</span>
                  </div>
                ))}
              </div>
            )}

            {searchResults.businesses?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Businesses:</strong></p>
                {searchResults.businesses.map(b => (
                  <div key={b._id} className="search-item clickable" onClick={() => navigateToTab('businesses')}>
                    {b.name} <span style={{fontSize: '0.7em', color: 'var(--text-muted)'}}>- Owner: {b.owner?.name || 'N/A'}</span>
                  </div>
                ))}
              </div>
            )}

            {searchResults.employees?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Employees:</strong></p>
                {searchResults.employees.map(e => (
                  <div key={e._id} className="search-item clickable" onClick={() => navigateToTab('employees')}>
                    {e.name} <span style={{fontSize: '0.7em', color: 'var(--text-muted)'}}>({e.role}) - At: {e.business?.name || 'N/A'}</span>
                  </div>
                ))}
              </div>
            )}

            {searchResults.owners?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Owners:</strong></p>
                {searchResults.owners.map(o => (
                  <div key={o._id} className="search-item clickable" onClick={() => navigateToTab('owners')}>
                    {o.name} <span style={{fontSize: '0.7em', color: 'var(--text-muted)'}}>- {o.email}</span>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length > 0 && 
             !searchResults.buildings?.length && 
             !searchResults.businesses?.length && 
             !searchResults.employees?.length && 
             !searchResults.owners?.length && (
              <p className="no-res">No matching records found.</p>
            )}
          </div>
        )}
      </div>

      {/* STATS CARDS (CLICKABLE FIX) */}
      <div className="grid">

        <div 
          className="glass-card stat-card"
          onClick={() => navigate("/buildings")}
        >
          <div className="value">{stats.buildings}</div>
          <div className="label">Total Buildings</div>
        </div>

        <div 
          className="glass-card stat-card"
          onClick={() => navigate("/businesses")}
        >
          <div className="value">{stats.businesses}</div>
          <div className="label">Businesses</div>
        </div>

        <div 
          className="glass-card stat-card"
          onClick={() => navigate("/employees")}
        >
          <div className="value">{stats.employees}</div>
          <div className="label">Employees</div>
        </div>

      </div>

      {/* FLOOR ANALYTICS */}
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2>Floor Analytics (Aggregation Demo)</h2>

        <p style={{ color: 'gray', marginBottom: '1rem' }}>
          MongoDB Aggregation Pipeline Demo
        </p>

        <select 
          value={selectedFloor} 
          onChange={(e) => fetchFloorAnalytics(e.target.value)}
        >
          <option value="">Select a Floor</option>
          {floors.map(f => (
            <option key={f._id} value={f._id}>
              Floor {f.floorNumber} - {f.building?.name}
            </option>
          ))}
        </select>

        {floorStats.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Business</th>
                <th>Owner</th>
                <th>Employees</th>
              </tr>
            </thead>
            <tbody>
              {floorStats.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.roomNumber}</td>
                  <td>{item.businessName}</td>
                  <td>{item.ownerName}</td>
                  <td>{item.employeeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          selectedFloor && <p>No data found.</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;