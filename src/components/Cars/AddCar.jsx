import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Ensure your firebase.js is correctly configured
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dkimpvgzu/image/upload`; // Replace with your Cloudinary URL
const UPLOAD_PRESET = "ml_default"; // Replace with your unsigned upload preset name

const AddCar = () => {
  const [carName, setCarName] = useState("");
  const [carType, setCarType] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // To hold URLs after upload
  const [selectedFiles, setSelectedFiles] = useState([]); // To hold selected files
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Support multiple uploads
    setSelectedFiles(files);
  };

  const uploadImagesToCloudinary = async () => {
    try {
      const uploadedUrls = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.secure_url); // Save the uploaded image URL
        } else {
          console.error("Failed to upload to Cloudinary", response);
        }
      }
      console.log(uploadedUrls)
      setImages(uploadedUrls); // Save all uploaded URLs to state
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images to Cloudinary:", error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to add a car.");
      return;
    }

    try {
      const uploadedUrls = await uploadImagesToCloudinary();

      if (uploadedUrls.length === 0) {
        alert("Please upload at least one image.");
        return;
      }

      await addDoc(collection(db, "cars"), {
        carName,
        carType,
        description,
        images: uploadedUrls, // Store Cloudinary URLs in Firestore
        addedBy: user.uid, // Store the user's unique ID
        addedAt: new Date(), // Timestamp for when the car was added
      });

      alert("Car added successfully!");
      navigate("/productListing");
      setCarName("");
      setCarType("");
      setDescription("");
      setImages([]);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Failed to add car. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10 mb-10 sm:p-4 md:p-8 lg:p-10">
        <h2 className="text-2xl font-semibold text-center mb-6 sm:text-xl lg:text-3xl">
          Add New Car
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="carName">
              Car Name
            </label>
            <input
              type="text"
              id="carName"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:py-1 sm:text-sm lg:py-3 lg:text-lg"
              placeholder="Enter car name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="carType">
              Car Type
            </label>
            <select
              id="carType"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:py-1 sm:text-sm lg:py-3 lg:text-lg"
              required
            >
              <option value="">Select Car Type</option>
              <option value="sedan">Sedan</option>
              <option value="civic">Civic</option>
              <option value="xuv">XUV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:py-1 sm:text-sm lg:py-3 lg:text-lg"
              rows="4"
              placeholder="Enter car description"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="images">
              Upload Images (Max 10)
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full"
            />
            <p className="mt-2 text-xs text-gray-500">You can upload up to 10 images.</p>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 sm:py-1 sm:text-sm lg:py-3 lg:text-lg"
            >
              Add Car
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCar;
