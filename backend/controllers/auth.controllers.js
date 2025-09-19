import sendMail from "../config/mail.js"
import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signUp=async (req,res)=>{
    try {
        const {fullName,email,password,role,mobile}=req.body
        const findByEmail=await User.findOne({email})
        if(findByEmail){
            return res.status(400).json({message:"Email already exist !"})
        }

        if(password && password.length<6){
            return res.status(400).json({message:"password must be atleast 6 characters "})
        }

        const hashedPassword=await bcrypt.hash(password,10)

         const user=await User.create({
            fullName,
            email,
            role,
            mobile,
            password:hashedPassword
        })
        const token=await genToken(user._id)

        res.cookie("token",token,{
             httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:true,
            sameSite:"none"
        })

     return res.status(201).json(user) 

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`signup error ${error}`})
    }
}

export const signIn=async (req,res)=>{
    try {
        const {password,email}=req.body
       
         const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found !"})
        }

     const isMatch=await bcrypt.compare(password,user.password)

       if(!isMatch){
         return res.status(400).json({message:"Incorrect Password !"})
       }

        const token=await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:true,
            sameSite:"none"
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message:`signin error ${error}`})
    }
}


export const signOut=async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"sign out successfully"})
    } catch (error) {
        return res.status(500).json({message:`signout error ${error}`})
    }
}
export const googleAuth=async (req,res)=>{
    try {
        const {fullName,email,role,mobile}=req.body
        let user=await User.findOne({email})
        if(!user){
          user=await User.create({
            fullName,
            email,
            role,mobile
        })
        }
        const token=await genToken(user._id)

        res.cookie("token",token,{
             httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:true,
            sameSite:"none"
        })

        return res.status(201).json(user)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`signupwithgoogle error ${error}`})
    }
}

export const sendOtp=async (req,res)=>{
    try {
        const {email}=req.body
        const user =await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        const otp=Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp=otp,
        user.otpExpires=Date.now() + 5*60*1000
        user.isOtpVerified=false

       await user.save()
       await sendMail(email,otp)
       return res.status(200).json({message:"email successfully send"})

    } catch (error) {
         return res.status(500).json({message:`send otp error ${error}`})
    }
}


export const verifyOtp=async (req,res)=>{
    try {
       const {email,otp}=req.body
     const user =await User.findOne({email})

     if(!user || user.resetOtp!==otp || user.otpExpires < Date.now() ){
        return res.status(400).json({message:"invalid/expired otp"})
     }

     user.isOtpVerified=true
     user.resetOtp=undefined
     user.otpExpires=undefined
await user.save()
return res.status(200).json({message:"otp verified"})
    } catch (error) {
         return res.status(500).json({message:`verify otp error ${error}`})
    }
}

export const resetPassword=async (req,res)=>{
    try {
        const {email,password}=req.body
        const user =await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"otp verfication required"})
        }

        const hashedPassword=await bcrypt.hash(password,10)
        user.password=hashedPassword
        user.isOtpVerified=false
await user.save()

return res.status(200).json({message:"password reset successfully"})

    } catch (error) {
         return res.status(500).json({message:`reset otp error ${error}`})
    }
}




