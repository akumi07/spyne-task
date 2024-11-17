import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Navbar from './Navbar';

const UpdateProductPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [carName, setCarName] = useState('');
  const [carType, setCarType] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const carDoc = await getDoc(doc(db, 'cars', id));
          if (carDoc.exists()) {
            setCar(carDoc.data());
            setCarName(carDoc.data().carName);
            setCarType(carDoc.data().carType);
            setDescription(carDoc.data().description);
            setImages(carDoc.data().images || []);
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

  const handleUpdate = async () => {
    try {
      const carRef = doc(db, 'cars', id);
      await updateDoc(carRef, {
        carName,
        carType,
        description,
        images, // You can handle image updates as needed
      });
      console.log("Car updated successfully!");
      navigate('/productListing');
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Update {carName}</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block text-gray-700">Car Name</label>
            <input
              type="text"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Car Type</label>
            <input
              type="text"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* Add a way to update images if necessary */}
          <div className="mt-6">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductPage;
