import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import Navbar from './Navbar';

const ProductPreviewPage = () => {
  const { id } = useParams(); // Get car ID from the URL
  const [car, setCar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // To track the current image
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const carDoc = await getDoc(doc(db, 'cars', id));
          if (carDoc.exists()) {
            setCar(carDoc.data());
          } else {
            console.error('No such document!');
            navigate('/productListing');
          }
        } catch (error) {
          console.error('Error fetching car details:', error);
          navigate('/productListing');
        }
      } else {
        navigate('/login');
      }
    };

    fetchCarDetails();
  }, [id, navigate]);

  // Function to go to next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  // Function to go to previous image
  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length
    );
  };

  // Automatically change image every 2 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 5000); // 2000ms = 2 seconds
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [car]);

  const handleDelete = async () => {
    try {
      const carRef = doc(db, 'cars', id);
      await deleteDoc(carRef);
      console.log('Car deleted successfully!');
      navigate('/productListing'); // Redirect to product listing page
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleUpdate = () => {
    navigate(`/updateProduct/${id}`); // Redirect to update page with car ID
  };

  if (!car) {
    return <p className="text-center mt-20 text-gray-600">Loading car details...</p>;
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          {car.carName}
        </h1>

        {/* Image Slider */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <div className="relative">
            {car.images && car.images.length > 0 ? (
              <div>
                <img
                  src={car.images[currentImageIndex]}
                  alt={`Car ${currentImageIndex + 1}`}
                  className="w-full h-auto object-cover rounded-md shadow-md"
                />
                <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
                  <button
                    onClick={prevImage}
                    className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800"
                  >
                    &#60;
                  </button>
                  <button
                    onClick={nextImage}
                    className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800"
                  >
                    &#62;
                  </button>
                </div>
              </div>
            ) : (
              <p>No images available for this car.</p>
            )}
          </div>
        </div>

        {/* Car Details */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Car Details</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Type:</strong> {car.carType}</li>
            <li><strong>Description:</strong> {car.description}</li>
            <li><strong>Added By:</strong> {car.addedBy}</li>
          </ul>
          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
              onClick={handleUpdate}
            >
              Update
            </button>
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewPage;
