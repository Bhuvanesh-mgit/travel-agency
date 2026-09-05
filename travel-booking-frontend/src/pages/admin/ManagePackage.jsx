import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaBoxOpen, 
  FaDollarSign, 
  FaMapMarkerAlt, 
  FaTimes,
  FaSpinner,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaImages,
  FaImage
} from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://travel-agency-kmy6.onrender.com';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export default function ManagePackage() {
  const { token: contextToken } = useAuth();

  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState('All');

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // File Upload States
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    locationName: '',
    description: '',
    price: '',
    salePrice: 0,
    kidPrice: '', // 🔑 Added kidPrice state
    days: 2,
    nights: 1,
    category: 'Family',
    inclusions: 'Hotel 4-Star, Meals, Sightseeing',
    exclusions: 'Personal Expenses, Visa Fees',
    availableSeats: 20,
    maxCapacity: 30,
    isFeatured: false,
    isActive: true,
  });

  // 🔑 Pax 1 to Pax 10 Pricing State (Array of { pax: number, price: number })
  const [paxPricing, setPaxPricing] = useState(
    Array.from({ length: 10 }, (_, i) => ({ pax: i + 1, price: '' }))
  );

  // Tour Schedule State
  const [itinerary, setItinerary] = useState([
    { 
      day: 1, 
      title: 'Arrival & Welcome Dinner', 
      description: 'Arrival at airport, transfer to hotel, check-in and evening welcome dinner.', 
      activities: 'Airport Transfer, Hotel Check-in, Welcome Dinner' 
    },
    { 
      day: 2, 
      title: 'City Sightseeing Tour', 
      description: 'Full day guided tour visiting major landmarks and local markets.', 
      activities: 'Guided Bus Tour, Museum Entry, Local Lunch' 
    }
  ]);

  useEffect(() => {
    fetchPackages();
    fetchDestinations();
  }, []);

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

    if (typeof rawToken === 'string') {
      return rawToken.replace(/^["']|["']$/g, '').trim();
    }
    return '';
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/packages`);
      const data = await res.json();
      if (res.ok) setPackages(data.data || []);
      else toast.error(data.message || 'Failed to fetch packages.');
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/destinations`);
      const data = await res.json();
      if (res.ok) {
        const list = data.data || [];
        setDestinations(list);
        if (list.length > 0 && !formData.destination) {
          setFormData((prev) => ({ ...prev, destination: list[0]._id || list[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 🔑 Handle individual pax tier price change
  const handlePaxPriceChange = (paxNum, value) => {
    setPaxPricing((prev) =>
      prev.map((item) => (item.pax === paxNum ? { ...item, price: value } : item))
    );
  };

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleGalleryChange = (e) => {
    if (e.target.files) {
      const selectedArr = Array.from(e.target.files);
      const totalCount = galleryFiles.length + selectedArr.length + existingGallery.length;

      if (totalCount > 5) {
        toast.error('You can upload a maximum of 5 extra gallery images.');
        return;
      }

      setGalleryFiles((prev) => [...prev, ...selectedArr]);
    }
  };

  const handleRemoveNewGalleryImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingGalleryImage = (index) => {
    setExistingGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDay = () => {
    const nextDay = itinerary.length + 1;
    const updated = [...itinerary, { day: nextDay, title: '', description: '', activities: '' }];
    setItinerary(updated);
    setFormData((prev) => ({ ...prev, days: updated.length, nights: Math.max(0, updated.length - 1) }));
  };

  const handleRemoveDay = (index) => {
    if (itinerary.length <= 1) {
      toast.error('Package must contain at least 1 day in schedule.');
      return;
    }
    const filtered = itinerary.filter((_, i) => i !== index);
    const updated = filtered.map((item, idx) => ({ ...item, day: idx + 1 }));
    setItinerary(updated);
    setFormData((prev) => ({ ...prev, days: updated.length, nights: Math.max(0, updated.length - 1) }));
  };

  const handleItineraryChange = (index, field, value) => {
    const updated = [...itinerary];
    updated[index][field] = value;
    setItinerary(updated);
  };

  const handleOpenEditModal = (pkg) => {
    setEditingId(pkg._id || pkg.id);
    const destId = pkg.destination?._id || pkg.destination || destinations[0]?._id || '';

    setFormData({
      title: pkg.title || '',
      destination: destId,
      locationName: pkg.locationName || '',
      description: pkg.description || '',
      price: pkg.price || '',
      salePrice: pkg.salePrice || 0,
      kidPrice: pkg.kidPrice || '', // 🔑 Load existing kidPrice
      days: pkg.duration?.days || 1,
      nights: pkg.duration?.nights || 0,
      category: pkg.category || 'Family',
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : '',
      exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join(', ') : '',
      availableSeats: pkg.availableSeats || 20,
      maxCapacity: pkg.maxCapacity || 30,
      isFeatured: Boolean(pkg.isFeatured),
      isActive: pkg.isActive !== undefined ? Boolean(pkg.isActive) : true,
    });

    // 🔑 Load existing pax pricing or initialize blank 1-10
    if (pkg.paxPricing && pkg.paxPricing.length > 0) {
      const loadedPricing = Array.from({ length: 10 }, (_, i) => {
        const found = pkg.paxPricing.find((p) => p.pax === i + 1);
        return { pax: i + 1, price: found ? found.price : '' };
      });
      setPaxPricing(loadedPricing);
    } else {
      setPaxPricing(Array.from({ length: 10 }, (_, i) => ({ pax: i + 1, price: '' })));
    }

    setExistingGallery(pkg.gallery || []);
    setCoverFile(null);
    setGalleryFiles([]);

    if (pkg.itinerary && pkg.itinerary.length > 0) {
      setItinerary(
        pkg.itinerary.map((item, idx) => ({
          day: item.day || idx + 1,
          title: item.title || '',
          description: item.description || '',
          activities: Array.isArray(item.activities) ? item.activities.join(', ') : (item.activities || '')
        }))
      );
    }
    setIsModalOpen(true);
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.destination || !formData.locationName || !formData.price) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.error('Session expired or missing auth token. Please log in again.');
      return;
    }

    setSubmitting(true);

    const bodyFormData = new FormData();
    bodyFormData.append('title', formData.title);
    bodyFormData.append('destination', formData.destination);
    bodyFormData.append('locationName', formData.locationName);
    bodyFormData.append('description', formData.description);
    bodyFormData.append('price', formData.price);
    bodyFormData.append('salePrice', formData.salePrice || 0);
    bodyFormData.append('kidPrice', formData.kidPrice !== '' ? formData.kidPrice : 0); // 🔑 Append kidPrice
    bodyFormData.append('category', formData.category);
    bodyFormData.append('availableSeats', formData.availableSeats);
    bodyFormData.append('maxCapacity', formData.maxCapacity);
    bodyFormData.append('isFeatured', formData.isFeatured);
    bodyFormData.append('isActive', formData.isActive);

    bodyFormData.append('duration', JSON.stringify({ days: Number(formData.days), nights: Number(formData.nights) }));
    bodyFormData.append('inclusions', JSON.stringify(formData.inclusions.split(',').map((s) => s.trim()).filter(Boolean)));
    bodyFormData.append('exclusions', JSON.stringify(formData.exclusions.split(',').map((s) => s.trim()).filter(Boolean)));

    // 🔑 Format and attach Pax Pricing (only keeping rows with valid prices entered)
    const formattedPaxPricing = paxPricing
      .filter((p) => p.price !== '' && !isNaN(p.price))
      .map((p) => ({ pax: Number(p.pax), price: Number(p.price) }));
    bodyFormData.append('paxPricing', JSON.stringify(formattedPaxPricing));

    const formattedItinerary = itinerary.map((item) => ({
      day: Number(item.day),
      title: item.title,
      description: item.description,
      activities: item.activities ? item.activities.split(',').map((a) => a.trim()).filter(Boolean) : []
    }));
    bodyFormData.append('itinerary', JSON.stringify(formattedItinerary));

    if (coverFile) {
      bodyFormData.append('image', coverFile);
    }

    galleryFiles.forEach((file) => {
      bodyFormData.append('gallery', file);
    });

    try {
      const url = editingId ? `${API_BASE_URL}/api/packages/${editingId}` : `${API_BASE_URL}/api/packages`;
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
          setPackages((prev) => prev.map((p) => ((p._id || p.id) === editingId ? result.data : p)));
          toast.success('Package updated successfully!');
        } else {
          setPackages((prev) => [result.data, ...prev]);
          toast.success('Package created successfully!');
        }
        setIsModalOpen(false);
        resetForm();
      } else {
        toast.error(result.message || 'Error saving package.');
      }
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Could not save package to server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    const token = getAuthToken();
    if (!token) {
      toast.error('Session expired or missing auth token. Please log in again.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/packages/${id}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setPackages((prev) => prev.filter((item) => (item._id || item.id) !== id));
        toast.success('Package deleted successfully!');
      } else {
        toast.error(result.message || 'Failed to delete package.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Could not connect to server.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setCoverFile(null);
    setGalleryFiles([]);
    setExistingGallery([]);
    setFormData({
      title: '',
      destination: destinations[0]?._id || '',
      locationName: '',
      description: '',
      price: '',
      salePrice: 0,
      kidPrice: '',
      days: 2,
      nights: 1,
      category: 'Family',
      inclusions: 'Hotel 4-Star, Meals, Sightseeing',
      exclusions: 'Personal Expenses, Visa Fees',
      availableSeats: 20,
      maxCapacity: 30,
      isFeatured: false,
      isActive: true,
    });
    setPaxPricing(Array.from({ length: 10 }, (_, i) => ({ pax: i + 1, price: '' })));
    setItinerary([
      { day: 1, title: 'Arrival & Welcome Dinner', description: 'Arrival at airport, transfer to hotel.', activities: 'Airport Transfer, Dinner' },
      { day: 2, title: 'City Sightseeing Tour', description: 'Full day guided sightseeing tour.', activities: 'City Tour, Museum' }
    ]);
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.locationName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;
    
    const pkgDestId = pkg.destination?._id || pkg.destination;
    const matchesDestination = selectedDestinationFilter === 'All' || pkgDestId === selectedDestinationFilter;

    return matchesSearch && matchesCategory && matchesDestination;
  });

  return (
    <div className="space-y-6 w-full font-sans text-slate-800">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manage Tour Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Create, edit, and allocate tour itineraries under global destinations.
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
          <span>Add New Package</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Packages</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{packages.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
            <FaBoxOpen />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Featured Listings</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {packages.filter((p) => p.isFeatured).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <FaStar />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Base Price</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ${Math.round(packages.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / (packages.length || 1))}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
            <FaDollarSign />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search package title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          {/* Destination Allocation Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <FaFilter className="text-slate-400 text-xs shrink-0" />
            <select
              value={selectedDestinationFilter}
              onChange={(e) => setSelectedDestinationFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="All">All Destinations</option>
              {destinations.map((d) => (
                <option key={d._id || d.id} value={d._id || d.id}>
                  {d.name || d.title}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-40 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="All">All Categories</option>
            <option value="Honeymoon">Honeymoon</option>
            <option value="Adventure">Adventure</option>
            <option value="Family">Family</option>
            <option value="Luxury">Luxury</option>
            <option value="Budget">Budget</option>
            <option value="Group">Group</option>
            <option value="Solo">Solo</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                <th className="py-3.5 px-6">Title & Category</th>
                <th className="py-3.5 px-6">Allocated Destination</th>
                <th className="py-3.5 px-6">Duration</th>
                <th className="py-3.5 px-6">Gallery Images</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin text-blue-600" />
                      <span>Loading tour packages...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPackages.length > 0 ? (
                filteredPackages.map((item) => {
                  const pkgId = item._id || item.id;
                  const allocatedDestName = item.destination?.name || item.destination?.title || 'Unassigned';

                  return (
                    <tr key={pkgId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {item.title}
                            {item.isFeatured && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[9px] font-extrabold uppercase">
                                Featured
                              </span>
                            )}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium">{item.category}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-blue-500 text-[11px]" />
                          <span className="font-bold text-slate-800">{allocatedDestName}</span>
                          <span className="text-[10px] text-slate-400">({item.locationName})</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {item.duration?.days || 0}D / {item.duration?.nights || 0}N
                      </td>

                      <td className="py-4 px-6 text-slate-600 font-semibold">
                        <div className="flex items-center gap-1">
                          <FaImages className="text-slate-400 text-[11px]" />
                          <span>1 Cover + {item.gallery?.length || 0} Extra</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-bold text-slate-900">
                        ${item.price}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          }`}
                        >
                          {item.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                          <span>{item.isActive ? 'Active' : 'Inactive'}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Package"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(pkgId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Package"
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
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-xs">
                    No tour packages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Tour Package' : 'Create New Tour Package'}
                </h3>
                <p className="text-xs text-slate-500">Allocate this package under a destination with itineraries & photos.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-6">
              
              {/* SECTION 1: BASIC DETAILS */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">1. Basic Details</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Package Title *</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Exotic Bali Tropical Getaway"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / Region (locationName) *</label>
                    <input
                      type="text"
                      name="locationName"
                      placeholder="e.g. Ubud, Bali"
                      value={formData.locationName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Allocated Destination *</label>
                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      required
                    >
                      <option value="">-- Choose Destination --</option>
                      {destinations.map((d) => (
                        <option key={d._id || d.id} value={d._id || d.id}>
                          {d.name || d.title} ({d.country || 'Global'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    >
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Family">Family</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Budget">Budget</option>
                      <option value="Group">Group</option>
                      <option value="Solo">Solo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
                  <textarea
                    name="description"
                    rows="2"
                    placeholder="Brief highlights of this holiday offer..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* SECTION 2: MEDIA */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">2. Package Media & Photos</h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Default Cover Photo</label>
                  <label className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <FaImage />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {coverFile ? coverFile.name : 'Select main thumbnail image'}
                      </p>
                      <p className="text-[10px] text-slate-400">JPG, PNG, or WEBP up to 5MB</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs">
                      Browse
                    </span>
                    <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Extra Gallery Photos (Max 5)</label>
                    <span className="text-[10px] font-bold text-slate-400">
                      {existingGallery.length + galleryFiles.length} / 5 Selected
                    </span>
                  </div>

                  <label className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer transition-all">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <FaImages />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">Add multiple gallery photos</p>
                      <p className="text-[10px] text-slate-400">Select up to 5 photos</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs">
                      Upload Multiple
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryChange}
                      className="hidden"
                      disabled={existingGallery.length + galleryFiles.length >= 5}
                    />
                  </label>

                  {(galleryFiles.length > 0 || existingGallery.length > 0) && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {existingGallery.map((imgUrl, index) => (
                        <div key={`existing-${index}`} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                          <img src={imgUrl} alt="gallery" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingGalleryImage(index)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white text-[9px] opacity-90 hover:opacity-100"
                            title="Remove Photo"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}

                      {galleryFiles.map((file, index) => (
                        <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden border border-blue-200 aspect-square">
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewGalleryImage(index)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white text-[9px] opacity-90 hover:opacity-100"
                            title="Remove Photo"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: PRICING & DURATION */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">3. Pricing & Duration</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Base Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="899"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sale Price ($)</label>
                    <input
                      type="number"
                      name="salePrice"
                      placeholder="799"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* 🔑 Kid Rate Input Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kid Price ($)</label>
                    <input
                      type="number"
                      name="kidPrice"
                      placeholder="450"
                      value={formData.kidPrice}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Days</label>
                    <input
                      type="number"
                      name="days"
                      value={formData.days}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Nights</label>
                    <input
                      type="number"
                      name="nights"
                      value={formData.nights}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Pax 1 to 10 Pricing Tier Inputs */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700">Pax Tier Pricing (1 to 10 Travelers)</label>
                  <p className="text-[11px] text-slate-400">Specify precise pricing for each traveler count tier.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {paxPricing.map((tier) => (
                      <div key={tier.pax} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{tier.pax} Pax ($)</label>
                        <input
                          type="number"
                          placeholder="Price"
                          value={tier.price}
                          onChange={(e) => handlePaxPriceChange(tier.pax, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 4: ITINERARY BUILDER */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">4. Tour Schedule (Itinerary)</h4>
                    <p className="text-[11px] text-slate-400">Specify daily title, description, and planned activities.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <FaPlus className="text-[9px]" />
                    <span>Add Day {itinerary.length + 1}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {itinerary.map((item, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-extrabold text-[10px] uppercase">
                          Day {item.day}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDay(index)}
                          className="text-slate-400 hover:text-rose-600 p-1 text-xs transition-colors cursor-pointer"
                          title="Delete Day"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Day Title *</label>
                          <input
                            type="text"
                            placeholder="e.g. Arrival & Welcome Dinner"
                            value={item.title}
                            onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Activities (Comma separated)</label>
                          <input
                            type="text"
                            placeholder="Airport Transfer, Welcome Dinner"
                            value={item.activities}
                            onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Day Description *</label>
                        <textarea
                          rows="2"
                          placeholder="Describe the schedule and experiences planned for this day..."
                          value={item.description}
                          onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: INCLUSIONS & CAPACITY */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">5. Inclusions & Capacity</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Inclusions (Comma separated)</label>
                    <input
                      type="text"
                      name="inclusions"
                      placeholder="Hotel 4-Star, Meals, Sightseeing"
                      value={formData.inclusions}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Exclusions (Comma separated)</label>
                    <input
                      type="text"
                      name="exclusions"
                      placeholder="Visa Fees, Personal Expenses"
                      value={formData.exclusions}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Available Seats</label>
                    <input
                      type="number"
                      name="availableSeats"
                      value={formData.availableSeats}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity</label>
                    <input
                      type="number"
                      name="maxCapacity"
                      value={formData.maxCapacity}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300"
                    />
                    <span>Featured Package</span>
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
                  <span>{submitting ? 'Saving Package...' : editingId ? 'Update Package' : 'Save Package'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}