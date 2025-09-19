import Item from "../models/item.model.js"
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js"

export const getCurrentUser=async (req,res)=>{
    try {
        const userId=req.userId
        if(!userId){
            return res.status(401).json({message:"User not authenticated"})
        }
        
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        return res.status(200).json(user)
    } catch (error) {
        console.error("Get current user error:", error)
        return res.status(500).json({message:`get current user error ${error}`})
    }
}

// controllers/location.controller.j
export const updateUserLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.userId; // JWT middleware se

    // Convert to numbers if they're strings
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates - must be valid numbers"
      });
    }

    // DB me user ki location update karo
    await User.findByIdAndUpdate(userId, {
      location: {
        type: "Point",
        coordinates: [lng, lat]
      }
    },{new:true});

    // Socket se broadcast karo (agar real-time chahiye)
    const io = req.app.get("io");
    if (io) {
      io.emit("user:location:update", {
        userId,
        latitude: lat,
        longitude: lng,
        at: new Date()
      });
    }

    return res.json({
      success: true,
      message: "Location updated"
    });
  } catch (err) {
    console.error("Update location error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};




export const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query;
  console.log(query)
   console.log(city)
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    // पहले उस city के सारे shop IDs निकालो
    const shopsInCity = await Shop.find({
  city: { $regex: new RegExp(`^${city}$`, "i") }
});


    if (shopsInCity.length === 0) {
      return res.status(200).json([]); // उस city में कोई shop नहीं
    }

    const shopIds = shopsInCity.map((s) => s._id);

    // अब उन shops के अंदर items filter करो जो query से match करें
    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).populate("shop", "name city state");

    return res.status(200).json(items);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: `Search error: ${error.message}` });
  }
};
