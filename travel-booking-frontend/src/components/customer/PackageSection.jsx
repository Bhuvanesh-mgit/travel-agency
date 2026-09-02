import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PackageCard from '../../components/packageCard';
import { FaSpinner, FaBoxOpen, FaArrowLeft, FaFilter } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export default function PackagesSection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const destinationId = searchParams.get('destination');
  const searchQuery = searchParams.get('search');

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinationName, setDestinationName] = useState('');

  // Re-runs whenever URL search parameters change (clicking a destination or clearing filters)
  useEffect(() => {
    fetchPackages();
  }, [destinationId, searchQuery]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      let endpoint = `${API_BASE_URL}/api/packages`;
      const queryParts = [];

      if (destinationId) {
        queryParts.push(`destination=${destinationId}`);
      } else {
        // If no destination filter is active, default to featured packages
        queryParts.push(`isFeatured=true`);
      }

      if (searchQuery) {
        queryParts.push(`search=${encodeURIComponent(searchQuery)}`);
      }

      if (queryParts.length > 0) {
        endpoint += `?${queryParts.join('&')}`;
      }

      const res = await fetch(endpoint);
      const data = await res.json();

      if (res.ok && data.success) {
        let list = data.data || [];

        // Fallback: If 'isFeatured=true' returns nothing, fetch all regular packages
        if (list.length === 0 && !destinationId && !searchQuery) {
          const fallbackRes = await fetch(`${API_BASE_URL}/api/packages`);
          const fallbackData = await fallbackRes.json();
          if (fallbackRes.ok) list = fallbackData.data || [];
        }

        setPackages(list);

        // Extract destination name safely for the section heading header
        if (destinationId && list.length > 0) {
          const firstDest = list[0].destination;
          if (typeof firstDest === 'object' && firstDest !== null) {
            setDestinationName(firstDest.name || firstDest.title || 'Selected Destination');
          } else {
            setDestinationName(list[0].locationName || 'Destination');
          }
        } else {
          setDestinationName('');
        }
      }
    } catch (err) {
      console.error('Error fetching packages section:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:pt-20 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-6 mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
              <FaFilter className="text-[10px]" />
              <span>{destinationId ? 'Filtered Destination' : 'Handpicked Holidays'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {destinationName ? `Packages in ${destinationName}` : 'Featured Tour Packages'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {destinationId 
                ? 'Showing exclusive getaways curated for this destination.' 
                : 'Explore top destinations curated by our travel experts.'}
            </p>
          </div>

          {/* Button to reset filter and show all/featured packages */}
          {destinationId && (
            <button
              onClick={() => navigate('/packages')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-xs transition cursor-pointer w-fit"
            >
              <FaArrowLeft className="text-[10px]" /> View All Packages
            </button>
          )}
        </div>

        {/* Dynamic Package Grid / Loading State */}
        <div className="w-full py-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <FaSpinner className="animate-spin text-3xl text-blue-600" />
              <span className="text-xs font-bold">Loading packages...</span>
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg._id || pkg.id} packageData={pkg} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3 shadow-xs max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
                <FaBoxOpen />
              </div>
              <p className="text-sm font-bold text-slate-800">No tour packages available.</p>
              <p className="text-xs text-slate-400">Check back later or add new packages via your admin dashboard.</p>
              {destinationId && (
                <button
                  onClick={() => navigate('/packages')}
                  className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  View All Packages
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}