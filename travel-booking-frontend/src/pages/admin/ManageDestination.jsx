import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaTimes,
  FaSpinner,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaBuilding,
  FaFilter
} from 'react-icons/fa';

// Resolve Backend Base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_URL || '';
// Ensures no trailing slash for clean path concatenation
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export default function ManageDestination() {
  const { token: contextToken } = useAuth(); // 🔑 Primary source of truth from AuthContext

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // File Upload State
  const [imageFile, setImageFile] = useState(null);

  // Form State (Exact match to model fields)
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    continent: 'Asia',
    description: '',
    isPopular: false,
    isActive: true,
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Retrieve clean JWT Auth Token safely
  const getAuthToken = () => {
    let rawToken = contextToken || localStorage.getItem('travel_token') || localStorage.getItem('token');

    if (!rawToken || rawToken === 'undefined' || rawToken === 'null') {
      const userInfo = localStorage.getItem('travel_user') || localStorage.getItem('userInfo');
      if (userInfo && userInfo !== 'undefined' && userInfo !== 'null') {
        try {
          const parsed = JSON.parse(userInfo);
          rawToken = parsed.token || parsed.data?.token || parsed.user?.token;
        } catch (e) {
          rawToken = '';
        }
      }
    }

    // Strip surrounding quotes or stray JSON stringification marks
    if (typeof rawToken === 'string') {
      return rawToken.replace(/^["']|["']$/g, '').trim();
    }

    return '';
  };

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/destinations`);
      const data = await res.json();
      if (res.ok) {
        setDestinations(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch destinations');
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Could not connect to the server to load destinations.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleOpenEditModal = (dest) => {
    setEditingId(dest._id || dest.id);
    setFormData({
      name: dest.name || '',
      country: dest.country || '',
      continent: dest.continent || 'Asia',
      description: dest.description || '',
      isPopular: Boolean(dest.isPopular),
      isActive: dest.isActive !== undefined ? Boolean(dest.isActive) : true,
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.country.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const token = getAuthToken();
    console.log('Sending Auth Token:', token);

    // Guard: Prevent sending request if token is missing
    if (!token) {
      toast.error('Session expired or missing auth token. Please log in again.');
      return;
    }

    setSubmitting(true);

    const bodyFormData = new FormData();
    bodyFormData.append('name', formData.name);
    bodyFormData.append('country', formData.country);
    bodyFormData.append('continent', formData.continent);
    bodyFormData.append('description', formData.description);
    bodyFormData.append('isPopular', formData.isPopular);
    bodyFormData.append('isActive', formData.isActive);

    if (imageFile) {
      bodyFormData.append('image', imageFile);
    }

    try {
      const url = editingId 
        ? `${API_BASE_URL}/api/destinations/${editingId}` 
        : `${API_BASE_URL}/api/destinations`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: bodyFormData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (editingId) {
          setDestinations((prev) =>
            prev.map((d) => ((d._id || d.id) === editingId ? result.data : d))
          );
          toast.success('Destination updated successfully!');
        } else {
          setDestinations((prev) => [result.data, ...prev]);
          toast.success('Destination created successfully!');
        }
        setIsModalOpen(false);
        resetForm();
      } else {
        toast.error(result.message || 'Error saving destination.');
      }
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Could not connect to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;

    const token = getAuthToken();
    if (!token) {
      toast.error('Session expired or missing auth token. Please log in again.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/destinations/${id}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setDestinations((prev) => prev.filter((item) => (item._id || item.id) !== id));
        toast.success('Destination deleted successfully!');
      } else {
        toast.error(result.message || 'Failed to delete destination.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Could not connect to the server.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setImageFile(null);
    setFormData({
      name: '',
      country: '',
      continent: 'Asia',
      description: '',
      isPopular: false,
      isActive: true,
    });
  };

  const filteredDestinations = destinations.filter((dest) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (dest.name || '').toLowerCase().includes(search) ||
      (dest.country || '').toLowerCase().includes(search);

    const matchesContinent =
      selectedContinent === 'All' || dest.continent === selectedContinent;

    return matchesSearch && matchesContinent;
  });

  return (
    <div className="space-y-6 w-full font-sans text-slate-800">
      {/* ToastContainer renders active toast alerts */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manage Destinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Create, update, and manage global travel destinations for tour packages.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer w-fit shrink-0"
        >
          <FaPlus className="text-[10px]" />
          <span>Add New Destination</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Destinations</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{destinations.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
            <FaGlobe />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Popular Spots</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {destinations.filter((d) => d.isPopular).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <FaStar />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Listings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {destinations.filter((d) => d.isActive !== false).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
            <FaBuilding />
          </div>
        </div>
      </div>

      {/* Search & Continent Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search destination name or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaFilter className="text-slate-400 text-xs shrink-0" />
          <select
            value={selectedContinent}
            onChange={(e) => setSelectedContinent(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="All">All Continents</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Africa">Africa</option>
            <option value="Oceania">Oceania</option>
            <option value="Antarctica">Antarctica</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                <th className="py-3.5 px-6">Destination Name</th>
                <th className="py-3.5 px-6">Country & Continent</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin text-blue-600" />
                      <span>Loading destinations...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDestinations.length > 0 ? (
                filteredDestinations.map((item) => {
                  const destId = item._id || item.id;
                  return (
                    <tr key={destId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.isPopular && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[9px] font-extrabold uppercase">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-slate-400 text-[11px]" />
                          <span>
                            {item.country} <span className="text-slate-400">({item.continent || 'Asia'})</span>
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                        {item.description || 'No description provided.'}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          }`}
                        >
                          {item.isActive !== false ? <FaCheckCircle /> : <FaTimesCircle />}
                          <span>{item.isActive !== false ? 'Active' : 'Inactive'}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Destination"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(destId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Destination"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 text-xs">
                    No destinations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Destination' : 'Create New Destination'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in all destination fields matching your database schema.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Bali"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    placeholder="e.g. Indonesia"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Continent
                </label>
                <select
                  name="continent"
                  value={formData.continent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                >
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                  <option value="Africa">Africa</option>
                  <option value="Oceania">Oceania</option>
                  <option value="Antarctica">Antarctica</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Overview of this travel destination..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Cover Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination Image
                </label>
                <label className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FaImage />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {imageFile ? imageFile.name : 'Select destination photo'}
                    </p>
                    <p className="text-[10px] text-slate-400">JPG, PNG, or WEBP (Defaults to /uploads/packages/default-destination.jpg)</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs">
                    Browse
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                  <span>Popular Destination</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                  <span>Publish Active</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  {submitting && <FaSpinner className="animate-spin text-xs" />}
                  <span>
                    {submitting
                      ? 'Saving Destination...'
                      : editingId
                      ? 'Update Destination'
                      : 'Save Destination'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}