import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { MdKeyboardBackspace } from "react-icons/md"
import axios from "axios"
import { serverUrl } from "../utils/config"
import { useDispatch } from "react-redux"
import { setShop } from "../redux/userSlice"

export default function AddItem() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState("")
  const [type, setType] = useState("veg")
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()

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
  ]

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("price", price)
      formData.append("type", type)
      formData.append("category", category)
      formData.append("image", backendImage)

      const result = await axios.post(`${serverUrl}/api/item/additem`, formData, {
        withCredentials: true,
      })
      dispatch(setShop(result.data.shop))
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500" />

      {/* Back Button */}
      <div
        className="absolute top-6 left-6 z-10 cursor-pointer flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        onClick={() => navigate("/")}
      >
        <MdKeyboardBackspace className="w-6 h-6" />
        <span className="font-medium">Back</span>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-background/80 backdrop-blur-lg border border-border/50 shadow-xl rounded-3xl p-8 w-full max-w-lg animate-fade-in-up"
      >
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
          Add New Food Item
        </h2>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-foreground mb-2">Name</label>
          <input
            type="text"
            value={name}
            placeholder="Enter food name"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-border/50 bg-background/60 p-3 focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        {/* Price */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-foreground mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            className="w-full rounded-xl border border-border/50 bg-background/60 p-3 focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full rounded-xl border border-border/50 bg-background/60 p-3 focus:ring-2 focus:ring-primary/40 focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-foreground mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full rounded-xl border border-border/50 bg-background/60 p-3 focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
          {frontendImage && (
            <img
              src={frontendImage}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-xl border border-border/40 shadow-md"
            />
          )}
        </div>

        {/* Type */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-foreground mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full rounded-xl border border-border/50 bg-background/60 p-3 focus:ring-2 focus:ring-primary/40 focus:outline-none"
          >
            <option value="veg">Veg</option>
            <option value="non veg">Non Veg</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <FaPlus className="text-lg" /> Add Item
        </button>
      </form>
    </div>
  )
}
