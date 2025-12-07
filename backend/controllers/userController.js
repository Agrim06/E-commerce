import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// @desc   Register new user
// @route  POST /api/users/register
// @access Public

export const registerUser = asyncHandler(async(req, res) =>{
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)           
    });
    }else{
        res.status(400);
        throw new Error("Invalid user data");
    }
});


// @desc   Auth user & get token
// @route  POST /api/users/login
// @access Public

export const authUser = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))) {
        res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
    }else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
});
    

// @desc   Get user profile
// @route  GET /api/users/profile
// @access Private

export const getUserprofile = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user._id);
    if(user){
       res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private

export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    }else{
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc   Google login
// @route  POST /api/users/google-login
// @access Public

export const googleLogin = asyncHandler(async (req,res) => {
    const { idToken } = req.body;

    if(!idToken){
        res.status(500);
        throw new Error("No Id token provided");
    }
    
    const ticket = await client.verifyIdToken({
        idToken,
        audience : process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    if(!email){
        res.status(400);
        throw new Error("Google account has no e-mail.");
    }

    let user = await User.findOne({ email });

    if(!user){
        user = await User.create({
            name : name || email.split("@")[0],
            email,
            password : sub,
        });
    }

    user.name = name || user.name;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
    });    
});