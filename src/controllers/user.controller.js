import bcrypt from 'bcryptjs'
import User from '../models/user.models.js';
import jwt from 'jsonwebtoken'
import config from '../config/config.js';
import Session from '../models/session.models.js'
import sendEmail from '../services/email.services.js';
import { getOTPhtml,generateOTP } from '../utils/utils.js';
import OTP from '../models/otp.models.js';

const RegisterUser=async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
       return res.status(400).json({
         message: "All fields are required!!"
       })
    }
    const isUserExists = await User.findOne({
      $or: [
        { email },
        { username }  
       ]
     });
    if(isUserExists){
        return res.status(409).json({
            message:"User already exists"
        })
    }
    const hash=await bcrypt.hash(password,10);
    const user =await User.create({
        username:username,
        email:email,
        password:hash
    })
    const otp=generateOTP();
    const html=getOTPhtml(otp)
    const otpHash=await bcrypt.hash(otp,10);
    await OTP.create({
        userId:user._id,
        otpHash:otpHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    })
    await sendEmail(
     email,
     "🔐 OTP Verification",
     `Your OTP for account verification is ${otp}. This OTP is valid for 10 minutes.`,
     html
    );
    return res.status(201).json({
        message: "Registration successful. Please verify your email to continue."
    });
}
const verifyEmail=async(req,res)=>{
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            message: "Email and OTP are required"
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (user.verified) {
        return res.status(400).json({
            message: "Email already verified"
        });
    }

    const otpDoc = await OTP.findOne({
        userId: user._id
    });

    if (!otpDoc) {
        return res.status(404).json({
            message: "OTP not found"
        });
    }

    if (otpDoc.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpDoc._id });

        return res.status(400).json({
            message: "OTP expired"
        });
    }

    const isOtpCorrect = await bcrypt.compare(
        otp,
        otpDoc.otpHash
    );

    if (!isOtpCorrect) {
        return res.status(401).json({
            message: "OTP is incorrect"
        });
    }
    user.verified = true;  
    await user.save();

    await OTP.deleteOne({
        _id: otpDoc._id
    });
    return res.status(200).json({
        message: "Email verified successfully. Please login to continue."
    });
}
const loginUser=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(401).json({
            message:"All fields are required!!"
        })
    }
    const user=await User.findOne({
        email:email
    }).select("+password")
    if(!user){
        return res.status(401).json({
            message:"User not found!!"
        })
    }
    if(!user.verified){
        return res.status(401).json({
            message:"Please verify the email first!!!"
        })
    }
    const checkPassword=await bcrypt.compare(password,user.password)
    if(!checkPassword){
         return res.status(401).json({
            message:"Email or Password is wrong!!"
        })
    }
    const refresh_token = jwt.sign({
        id:user._id
    },config.JWT_SECRET,{
        expiresIn:'7d'
    })
    const refresh_token_hash=await bcrypt.hash(refresh_token,10)
    const session = await Session.create({
        userId: user._id,
        refreshToken: refresh_token_hash,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    })
    const access_token = jwt.sign({
        id:user._id,
        sessionId: session._id
    },config.JWT_SECRET,{
        expiresIn:'15m'
    })      
    res.cookie('refresh_token',refresh_token,{
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        maxAge: 7*24*60*60*1000
    })
    return res.status(200).json({
        message:"User logged in successfully",
        access_token
    })
}
const getUser = async(req,res)=>{
    const authHeader = req.headers.authorization;

    if (!authHeader) {
    return res.status(401).json({
        message: "Token missing"
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded=jwt.verify(token,config.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if(!user){
        return res.status(400).json({
            message:"User not found!!"
        })
    }
    res.status(200).json({
        message: "User fetched successfully",
        user
    })
}
const getAccessToken=async(req,res)=>{
    const refresh_token=req.cookies.refresh_token
    if(!refresh_token){
        return res.status(400).json({
            message:"refresh token is required for further processing!!!"
        })
    }
    const decoded= jwt.verify(refresh_token,config.JWT_SECRET)
    const session = await Session.findOne({
        userId:decoded.id,
        revoked: false
    })
    if(!session){
        return res.status(400).json({
            message:"refresh token is invalid !!"
        })
    }
    const new_refresh_token = jwt.sign(
       { id: decoded.id },
       config.JWT_SECRET,
       { expiresIn: "7d" }
    );
    const new_refresh_token_hash=await bcrypt.hash(new_refresh_token,10);
    session.refreshToken=new_refresh_token_hash
    await session.save();
    const access_token=await jwt.sign(
        {id: decoded.id},
        config.JWT_SECRET,
        {expiresIn: "15m"}
    );
    res.cookie('refresh_token',new_refresh_token,{
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        maxAge: 7*24*60*60*1000
    })
    return res.status(201).json({
        message:"Access token created successfully",
        access_token
    })
}
const logoutUser=async(req,res)=>{
    const refresh_token=req.cookies.refresh_token
    if(!refresh_token){
        return res.status(400).json({
            message:"refresh token is required for further processing!!!"
        })
    }
    const decoded =jwt.verify(refresh_token,config.JWT_SECRET)
    const session=await Session.findOne({
          userId:decoded.id
    })
    if(!session){
        return res.status(401).json({
            message:"session do not exist"
        })
    }
    if(session.revoked){
      return res.status(400).json({
        message:"refresh token not valid !!"
      })
    }
    session.revoked=true
    await session.save()
    res.clearCookie('refresh_token')
    return res.status(200).json({
        message:"User logged out successfully"
    })
}
const logoutAllUser=async(req,res)=>{
    const refreshToken = req.cookies.refresh_token;
    if(!refreshToken){
        return res.status(400).json({
            message:"refresh token not found!!"
        })
    }
    const decoded=jwt.verify(refreshToken,config.JWT_SECRET);
    await Session.updateMany({
        userId:decoded.id,
        revoked:false
    },{
        revoked:true
    })
    res.clearCookie("refresh_token")
    return res.status(200).json({
        message:"All devices logged out successfully"
    })
}

export {RegisterUser,loginUser,getUser,getAccessToken,logoutUser,logoutAllUser,verifyEmail}