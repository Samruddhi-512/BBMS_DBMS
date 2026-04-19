import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Management = ({ defaultTab = 'buildings' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [dependencies, setDependencies] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    fetchData();
    fetchDependencies();
    cancelEdit(); // Reset form when switching tabs
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

  const handleEdit = (item) => {
    setEditingItem(item);
    // Prep form data - extracts IDs for relational fields
    const prepped = { ...item };
    if (item.building?._id) prepped.building = item.building._id;
    if (item.floor?._id) prepped.floor = item.floor._id;
    if (item.room?._id) prepped.room = item.room._id;
    if (item.owner?._id) prepped.owner = item.owner._id;
    if (item.business?._id) prepped.business = item.business._id;
    setFormData(prepped);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({});
  };

  const handleView = (item) => {
    const details = Object.entries(item)
      .filter(([key]) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key))
      .map(([key, value]) => {
        let displayValue = typeof value === 'object' ? (value?.name || value?.roomNumber || JSON.stringify(value)) : value;
        return `${key.toUpperCase()}: ${displayValue}`;
      })
      .join('\n');
    alert(`Entry Details:\n\n${details}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await api.delete(`/${activeTab}/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/${activeTab}/${editingItem._id}`, formData);
        alert('Updated successfully!');
      } else {
        await api.post(`/${activeTab}`, formData);
        alert('Added successfully!');
      }
      cancelEdit();
      fetchData();
    } catch (err) {
      alert('Error saving data');
    }
  };
  
  // ... (keep renderForm and getDetails logic simple)
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
            <select value={formData.building || ''} onChange={e => setFormData({...formData, building: e.target.value})} required>
              <option value="">Select Building</option>
              {dependencies.buildings?.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </>
        );
      case 'rooms':
        return (
          <>
            <input placeholder="Room Number" value={formData.roomNumber || ''} onChange={e => setFormData({...formData, roomNumber: e.target.value})} required />
            <select value={formData.floor || ''} onChange={e => setFormData({...formData, floor: e.target.value})} required>
              <option value="">Select Floor</option>
              {dependencies.floors?.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber} - {f.building?.name}</option>)}
            </select>
          </>
        );
      case 'owners':
        return (
          <>
            <input placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input placeholder="Phone" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <input placeholder="Email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </>
        );
      case 'businesses':
        return (
          <>
            <input placeholder="Business Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <select value={formData.room || ''} onChange={e => setFormData({...formData, room: e.target.value})} required>
              <option value="">Select Room</option>
              {dependencies.rooms?.map(r => <option key={r._id} value={r._id}>{r.roomNumber} (Floor {r.floor?.floorNumber})</option>)}
            </select>
            <select value={formData.owner || ''} onChange={e => setFormData({...formData, owner: e.target.value})} required>
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
            <input type="number" placeholder="Salary" value={formData.salary || ''} onChange={e => setFormData({...formData, salary: e.target.value})} />
            <select value={formData.business || ''} onChange={e => setFormData({...formData, business: e.target.value})} required>
              <option value="">Select Business</option>
              {dependencies.businesses?.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </>
        );
      default:
        return null;
    }
  };

  const getDetails = (item) => {
    switch (activeTab) {
      case 'buildings': return item.address;
      case 'floors': return item.building?.name ? `Building: ${item.building.name}` : '';
      case 'rooms': return item.floor ? `Floor: ${item.floor.floorNumber}` : '';
      case 'owners': return `${item.email || ''} ${item.phone || ''}`;
      case 'businesses': return `Room: ${item.room?.roomNumber || 'N/A'}`;
      case 'employees': return `Business: ${item.business?.name || 'N/A'}`;
      default: return '';
    }
  };

  return (
    <div>
      <div className="glass-card tabs-container">
        {['buildings', 'floors', 'rooms', 'owners', 'businesses', 'employees'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'active' : ''}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid">
        <div className="glass-card">
          <h2 style={{ textTransform: 'capitalize' }}>
            {editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
          </h2>
          <form onSubmit={handleSubmit}>
            {renderForm()}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="submit" style={{ flex: 1 }}>
                {editingItem ? 'Update' : 'Save'}
              </button>
              {editingItem && (
                <button type="button" className="btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="glass-card">
          <h2 style={{ textTransform: 'capitalize' }}>{activeTab} List</h2>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name/Number</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map(item => (
                    <tr key={item._id}>
                      <td>{item.name || item.roomNumber || `Floor ${item.floorNumber}`}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {getDetails(item)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => handleView(item)} className="btn-small btn-secondary">View</button>
                          <button onClick={() => handleEdit(item)} className="btn-small">Edit</button>
                          <button onClick={() => handleDelete(item._id)} className="btn-small btn-danger">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                      No {activeTab} found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;
