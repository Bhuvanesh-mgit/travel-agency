import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCompass, FaArrowRight, FaSpinner } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export default function Destination() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Fetch live destinations and packages in parallel
      const [destRes, pkgRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/destinations`),
        fetch(`${API_BASE_URL}/api/packages`),
      ]);

      const destData = await destRes.json();
      const pkgData = await pkgRes.json();

      if (destRes.ok) {
        setDestinations(destData.data || []);
      } else {
        throw new Error(destData.message || 'Failed to fetch destinations.');
      }

      if (pkgRes.ok) {
        setPackages(pkgData.data || []);
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError('Could not load destinations from the server.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to count active packages for each destination dynamically
  const getPackageCountForDestination = (destId) => {
    return packages.filter((pkg) => {
      const pkgDestId = pkg.destination?._id || pkg.destination;
      return pkgDestId === destId;
    }).length;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 mt-7">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 flex items-center justify-center gap-1.5">
            <FaCompass /> Explore the World
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Top Destinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            Handpicked travel locations curated for unforgettable experiences.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
            <span className="text-xs font-bold">Loading live destinations...</span>
          </div>
        ) : error ? (
          /* Error State */
          <div className="py-12 text-center">
            <div className="p-4 max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-semibold">
              {error}
            </div>
            <button
              type="button"
              onClick={fetchData}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
            >
              Try Again
            </button>
          </div>
        ) : destinations.length > 0 ? (
          /* Destinations Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {destinations.map((dest) => {
              const destId = dest._id || dest.id;
              const count = getPackageCountForDestination(destId);

              return (
                <div
                  key={destId}
                  className="group relative h-80 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  {/* Image (Handles Cloudinary links or relative local upload paths) */}
                  <img
                    src={dest.image || '/uploads/packages/default-destination.jpg'}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/uploads/packages/default-destination.jpg';
                    }}
                  />

                  {/* Gradient Overlay for Readable Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <span className="px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                      {dest.continent || 'Global'}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                      {count} {count === 1 ? 'Tour Package' : 'Tour Packages'}
                    </span>
                  </div>

                  {/* Bottom Card Content */}
                  <div className="absolute bottom-5 left-5 right-5 text-white flex items-end justify-between z-10">
                    <div>
                      <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                        <FaMapMarkerAlt /> {dest.country}
                      </div>
                      <h3 className="text-2xl font-black leading-tight">
                        {dest.name}
                      </h3>
                    </div>

                    {/* Explore Link (Filters /packages by destination ID) */}
                    <Link
                      to={`/packages?destination=${destId}`}
                      className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300 shadow-sm"
                      title={`Explore packages in ${dest.name}`}
                    >
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center text-slate-400 text-xs font-semibold">
            No destinations found in database.
          </div>
        )}

      </div>
    </div>
  );
}