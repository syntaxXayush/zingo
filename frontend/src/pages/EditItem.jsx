import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../utils/config";
import { useDispatch, useSelector } from "react-redux";
import { setShop } from "../redux/userSlice";

export default function EditItem() {
  const { shop } = useSelector((state) => state.user);
  const { itemId } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("veg");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("type", type);
      formData.append("category", category);
      formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/item/edititem/${itemId}`,
        formData,
        { withCredentials: true }
      );

      const updatedItem = result.data;
      const updatedItems = shop.items.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      );
      dispatch(setShop({ ...shop, items: updatedItems }));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSelectedItem = useCallback(async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/getbyid/${itemId}`,
        { withCredentials: true }
      );
      setSelectedItem(result.data);
    } catch (error) {
      console.log(error);
    }
  }, [itemId]);

  useEffect(() => {
    fetchSelectedItem();
  }, [fetchSelectedItem]);

  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name);
      setPrice(selectedItem.price);
      setFrontendImage(selectedItem.image);
      setCategory(selectedItem.category);
      setType(selectedItem.type);
    }
  }, [selectedItem]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white/90 via-primary/5 to-white/90 p-8 backdrop-blur-xl">
      {/* Back button */}
      <div
        className="absolute top-6 left-6 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <MdKeyboardBackspace className="w-8 h-8 text-primary hover:scale-110 transition-transform" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 border border-primary/20 shadow-xl rounded-2xl p-8 max-w-lg w-full space-y-6 backdrop-blur-xl"
      >
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-primary via-pink-500 to-yellow-400 bg-clip-text text-transparent">
          Edit Food Item
        </h2>

        {/* Name */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            placeholder="Enter Food Name"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/60 focus:outline-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/60 focus:outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/60 focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/60 focus:outline-none"
          />
          {frontendImage && (
            <img
              src={frontendImage}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/60 focus:outline-none"
          >
            <option value="veg">Veg</option>
            <option value="non veg">Non Veg</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary/80 to-pink-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md hover:scale-105 transition-transform"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
