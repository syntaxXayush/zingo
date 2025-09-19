import { useState } from "react";
import { FaUtensils } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

export default function EditShop() {
  const { shop } = useSelector((state) => state.user);
  const [name, setName] = useState(shop?.name || "");
  const [city, setCity] = useState(shop?.city || "");
  const [state, setState] = useState(shop?.state || "");
  const [address, setAddress] = useState(shop?.address || "");
  const [frontendImage, setFrontendImage] = useState(shop?.image || "");

  const navigate = useNavigate();

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFrontendImage(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Shop details saved!");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white/90 via-primary/5 to-white/90 p-8 backdrop-blur-xl">
      {/* Back Button */}
      <div
        className="absolute top-6 left-6 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <MdKeyboardBackspace className="w-8 h-8 text-primary hover:scale-110 transition-transform" />
      </div>

      {/* Form Card */}
      <div className="max-w-lg w-full bg-white/70 border border-primary/20 shadow-xl rounded-2xl p-8 backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-pink-100 p-6 rounded-full mb-6 shadow-md">
            <FaUtensils className="text-pink-500 w-16 h-16" />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary via-pink-500 to-yellow-400 bg-clip-text text-transparent">
            {!shop ? "Add Shop" : "Edit Shop"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter Shop Name"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/60 focus:outline-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Shop Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/60 focus:outline-none"
            />
            {frontendImage && (
              <div className="mt-3">
                <img
                  src={frontendImage}
                  alt="Shop Preview"
                  className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* City + State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Enter City"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                placeholder="Enter State"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/60 focus:outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter Address"
              rows="3"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/60 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary/80 to-pink-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md hover:scale-105 transition-transform"
          >
            Save Shop
          </button>
        </form>
      </div>
    </div>
  );
}
