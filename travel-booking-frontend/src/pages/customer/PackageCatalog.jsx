import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PackageCard from '../../components/PackageCard';
import { FaSpinner, FaBoxOpen, FaArrowLeft, FaFilter } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export default function PackagesCatalog() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const destinationId = searchParams.get('destination');
  const searchQuery = searchParams.get('search');

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destinationName, setDestinationName] = useState('');

  // Re-runs whenever the URL query parameters change (switching between specific destination or all packages)
  useEffect(() => {
    fetchPackages();
  }, [destinationId, searchQuery]);

  const fetchPackages = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint = `${API_BASE_URL}/api/packages`;
      const queryParts = [];

      if (destinationId) {
        queryParts.push(`destination=${destinationId}`);
      }
      if (searchQuery) {
        queryParts.push(`search=${encodeURIComponent(searchQuery)}`);
      }

      if (queryParts.length > 0) {
        endpoint += `?${queryParts.join('&')}`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (response.ok && data.success) {
        const results = data.data || [];
        setPackages(results);

        // Extract destination name safely for the heading if filtered
        if (destinationId && results.length > 0) {
          const firstDest = results[0].destination;
          if (typeof firstDest === 'object' && firstDest !== null) {
            setDestinationName(firstDest.name || firstDest.title || 'Selected Destination');
          } else {
            setDestinationName(results[0].locationName || 'Destination');
          }
        } else {
          setDestinationName('');
        }
      } else {
        setError(data.message || 'Failed to fetch packages.');
      }
    } catch (err) {
      console.error('Error fetching catalog packages:', err);
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 border-b border-slate-200/80 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
              <FaFilter className="text-[10px]" />
              <span>{destinationId ? 'Filtered Destination' : 'All Itineraries'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {destinationName ? `Packages in ${destinationName}` : 'All Tour Packages'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {destinationId 
                ? `Showing exclusive getaways curated for this destination.`
                : 'Browse our complete catalog of world-class travel packages.'}
            </p>
          </div>

          {destinationId && (
            <button
              onClick={() => navigate('/packages')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-xs transition cursor-pointer w-fit"
            >
              <FaArrowLeft className="text-[10px]" /> View All Packages
            </button>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
            <span className="text-xs font-bold">Loading packages...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="p-4 max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          </div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id || pkg.id} packageData={pkg} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4 shadow-xs max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
              <FaBoxOpen />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No packages found</h3>
              <p className="text-xs text-slate-400">
                There are no available tour packages for this destination right now.
              </p>
            </div>
            <button
              onClick={() => navigate('/packages')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              Browse All Packages
            </button>
          </div>
        )}

      </div>
    </div>
  );
}