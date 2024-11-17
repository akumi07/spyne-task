import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/firebase'; // Your Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
// Import Swiper.js
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const ProductListPage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // To track image index for hover effect
  const [isHovering, setIsHovering] = useState(false); // Hover state
  const navigate = useNavigate();

  // Fetch cars added by the logged-in user
  const fetchCars = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'cars'), where('addedBy', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const userCars = querySnapshot.docs.map(doc => ({
        id: doc.id, // Add the document ID
        ...doc.data(),
      }));
      setCars(userCars);
      setFilteredCars(userCars);
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const filtered = cars.filter(car =>
      car.carName.toLowerCase().includes(e.target.value.toLowerCase()) ||
      car.carType.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCars(filtered);
  };

  // Handle Card Click for redirection
  const handleCardClick = (id) => {
    navigate(`/productpreview/${id}`);
  };

  // Hover effect to change image every 5 seconds
  useEffect(() => {
    if (isHovering && filteredCars.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % filteredCars[0].images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovering, filteredCars]);

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="mt-10 text-3xl font-extrabold text-gray-800 mb-6">My Cars</h1>

        <div className="mb-4 flex justify-between items-center">
          <div className="w-1/2">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search cars by name or model..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button
            onClick={() => navigate('/addCar')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Car
          </button>
        </div>

        {/* Display the cars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.length > 0 ? (
            filteredCars.map(car => (
              <div
                key={car.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
                onClick={() => handleCardClick(car.id)} // Navigate on card click
              >
                {/* Swiper for image slider */}
                <Swiper
                  navigation
                  pagination={{ clickable: true }}
                  modules={[Navigation, Pagination]}
                  className="h-48 rounded-md"
                  onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)} // Update image index on slide change
                >
                  {car.images && car.images.map((url, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={url}
                        alt={`Car ${car.carName} image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-md"
                        onClick={() => handleCardClick(car.id)} // Handle click to product view page
                        onMouseEnter={() => setIsHovering(true)} // Set hover state
                        onMouseLeave={() => setIsHovering(false)} // Reset hover state
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <h3 className="text-lg font-semibold text-gray-800 mt-4">{car.carName}</h3>
                <p className="text-sm text-gray-600">{car.carType}</p>
                <p className="text-sm text-gray-600">{car.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No cars found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
