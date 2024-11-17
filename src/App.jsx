import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Herosection from "./components/Herosection";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import CarList from './components/Cars/CarList';
import AddCar from './components/Cars/AddCar';
import Register from './components/Register';
import ProductListPage from './components/ProductListPage';
import ProductPreview from './components/ProductPreview';
import UpdateProductPage from './components/UpdateProductPage';
import ApiDocs from './components/ApiDocs';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Herosection />} />
        <Route path="/api/docs" element={<ApiDocs/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<CarList />} />
        <Route path="/AddCar" element={<AddCar />} />
        <Route path="/productListing" element={<ProductListPage />} />
        <Route path="/productpreview/:id" element={<ProductPreview />} />
        <Route path="/updateProduct/:id" element={<UpdateProductPage/>}/>
      </Routes>
    </Router>
  );
}
