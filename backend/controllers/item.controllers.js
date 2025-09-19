import uploadOnCloudinary from "../config/cloudinary.js";
import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";

export const addItem=async (req,res) => {
    try {
        const {name,category,type,price}=req.body
        const shop=await Shop.findOne({owner:req.userId})
        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }else{
            return res.status(400).json({message:"image is required"})
        }
        const item=await Item.create({
            name,category,type,image,price,shop:shop._id
        })
        shop.items.push(item._id)
        
        await shop.save()
        await shop.populate({
        path: "items",
        options: { sort: { createdAt: -1 } }
      });
        await item.populate("shop")
return res.status(201).json({
    shop,item
})

    } catch (error) {
        return res.status(500).json({message:`add item error ${error}`})
    }
}

export const getItemsByShop=async (req,res)=>{
    try {
        const {shopId}=req.params
        const items=await Item.find({shop:shopId})
        if(!items.length){
           return res.status(400).json({message:"this shop does not have food items"}) 
        }
        return res.status(200).json(items)
    } catch (error) {
         return res.status(500).json({message:`get item error ${error}`})
    }
}

export const getItemsByCity = async (req, res) => {
    try {
        const city = req.params.city;
        console.log("Requested city:", city); // Debug log
        if (!city) {
            return res.status(400).json({ message: "City is required" });
        }

        // Find all active shops in this city
        const shopsInCity = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        });
        console.log("Shops found for city:", shopsInCity.map(s => s.city)); // Debug log

        if (!shopsInCity.length) {
            return res.status(404).json({ message: "No shops found in this city" });
        }

        const shopIds = shopsInCity.map((shop) => shop._id);

        // Find items for these shops
        const items = await Item.find({ shop: { $in: shopIds }, availability: true });
        return res.status(200).json(items);
    } catch (error) {
        console.error("getItemsByCity error:", error); // Debug log
        return res.status(500).json({ message: "Server error" });
    }
};

export const getItemById=async (req,res) => {
    try {
        const {itemId}=req.params
        const item=await Item.findById(itemId)
        if(!item){
            return res.status(400).json({message:"item not found"})
        }
        return res.status(200).json(item)
    } catch (error) {
         return res.status(500).json({message:`get item error ${error}`})
    }
}

export const editItem=async (req,res) => {
    try {
        const {name,category,type,price}=req.body
        const {itemId}=req.params
       
        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }
         const item=await Item.findByIdAndUpdate(itemId,{
            name,category,type,price,image
         },{new:true})
        if(!item){
            return res.status(400).json({message:"item not found"})
        }
        await item.populate("shop")
return res.status(200).json(item)

    } catch (error) {
        return res.status(500).json({message:`edit item error ${error}`})
    }
}

export const deleteItem=async (req,res) => {
    try {
        const {itemId}=req.params
        const item=await Item.findByIdAndDelete(itemId)
        if(!item){
        return res.status(400).json({message:"item not found"})
        }
        const shop=await Shop.findOne({owner:req.userId})
        shop.items=shop.items.filter(i=>i !== item._id)
        await shop.save()
        await shop.populate({
        path: "items",
        options: { sort: { createdAt: -1 } }
      });
return res.status(201).json({
    shop,item
})

    } catch (error) {
        return res.status(500).json({message:`delete item error ${error}`})
    }
}