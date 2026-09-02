import { createContext, useContext, useState } from 'react';

// 1. Create the Context
const BookingContext = createContext(null);

// 2. Create and Export the Provider Component
export const BookingProvider = ({ children }) => {
  const [bookingState, setBookingState] = useState({
    packageData: null,
    travelDate: '',
    travelers: 1,
    totalPrice: 0,
  });

  // Action to initialize booking details when customer selects a package
  const initializeBooking = (pkg, travelers = 1, travelDate = '') => {
    setBookingState({
      packageData: pkg,
      travelers,
      travelDate,
      totalPrice: (pkg.salePrice || pkg.price) * travelers,
    });
  };

  // Action to clear booking state after checkout or cancellation
  const clearBooking = () => {
    setBookingState({
      packageData: null,
      travelDate: '',
      travelers: 1,
      totalPrice: 0,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        setBookingState,
        initializeBooking,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// 3. Export Custom Hook for Easy Access across Components
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;