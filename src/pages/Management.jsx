import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Management = () => {
  const [activeTab, setActiveTab] = useState('buildings');
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [dependencies, setDependencies] = useState({});

  useEffect(() => {
    fetchData();
    fetchDependencies();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const { data } = await api.get(`/${activeTab}`);
      setData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDependencies = async () => {
    // Fetch related data for selects based on active tab
    try {
      if (activeTab === 'floors') {
        const res = await api.get('/buildings');
        setDependencies({ buildings: res.data });
      } else if (activeTab === 'rooms') {
        const res = await api.get('/floors');
        setDependencies({ floors: res.data });
      } else if (activeTab === 'businesses') {
        const resR = await api.get('/rooms');
        const resO = await api.get('/owners');
        setDependencies({ rooms: resR.data, owners: resO.data });
      } else if (activeTab === 'employees') {
        const res = await api.get('/businesses');
        setDependencies({ businesses: res.data });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/${activeTab}`, formData);
      setFormData({});
      fetchData();
      alert('Added successfully!');
    } catch (err) {
      alert('Error adding data');
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'buildings':
        return (
          <>
            <input placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input placeholder="Address" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} required />
          </>
        );
      case 'floors':
        return (
          <>
            <input type="number" placeholder="Floor Number" value={formData.floorNumber || ''} onChange={e => setFormData({...formData, floorNumber: e.target.value})} required />
            <select value={formData.buildingId || ''} onChange={e => setFormData({...formData, buildingId: e.target.value})} required>
              <option value="">Select Building</option>
              {dependencies.buildings?.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </>
        );
      case 'rooms':
        return (
          <>
            <input placeholder="Room Number" value={formData.roomNumber || ''} onChange={e => setFormData({...formData, roomNumber: e.target.value})} required />
            <select value={formData.floorId || ''} onChange={e => setFormData({...formData, floorId: e.target.value})} required>
              <option value="">Select Floor</option>
              {dependencies.floors?.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber} - {f.buildingId?.name}</option>)}
            </select>
          </>
        );
      case 'owners':
        return (
          <>
            <input placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input placeholder="Contact" value={formData.contact || ''} onChange={e => setFormData({...formData, contact: e.target.value})} required />
          </>
        );
      case 'businesses':
        return (
          <>
            <input placeholder="Business Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <select value={formData.roomId || ''} onChange={e => setFormData({...formData, roomId: e.target.value})} required>
              <option value="">Select Room</option>
              {dependencies.rooms?.map(r => <option key={r._id} value={r._id}>{r.roomNumber} (Floor {r.floorId?.floorNumber})</option>)}
            </select>
            <select value={formData.ownerId || ''} onChange={e => setFormData({...formData, ownerId: e.target.value})} required>
              <option value="">Select Owner</option>
              {dependencies.owners?.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
            </select>
          </>
        );
      case 'employees':
        return (
          <>
            <input placeholder="Employee Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input placeholder="Role" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} required />
            <select value={formData.businessId || ''} onChange={e => setFormData({...formData, businessId: e.target.value})} required>
              <option value="">Select Business</option>
              {dependencies.businesses?.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="glass-card" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem 2rem' }}>
        {['buildings', 'floors', 'rooms', 'owners', 'businesses', 'employees'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: activeTab === tab ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)',
              textTransform: 'capitalize' 
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid">
        <div className="glass-card">
          <h2 style={{ textTransform: 'capitalize' }}>Add {activeTab.slice(0, -1)}</h2>
          <form onSubmit={handleSubmit}>
            {renderForm()}
            <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Save</button>
          </form>
        </div>

        <div className="glass-card">
          <h2 style={{ textTransform: 'capitalize' }}>{activeTab} List</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name/Number</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item._id}>
                    <td>{item.name || item.roomNumber || `Floor ${item.floorNumber}`}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {item.address || (item.buildingId?.name ? `Building: ${item.buildingId.name}` : '') || (item.contact ? `Contact: ${item.contact}` : '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;
