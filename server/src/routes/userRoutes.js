import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; // Import the User model
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js';

import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

//only admin
router.get('/admin',verifyToken,authorizeRoles('admin'),(req,res)=>{
    res.json({message:'Welcome Admin'})
})

//supplier
router.get('/supplier',verifyToken,authorizeRoles('supplier'),(req,res)=>{
    res.json({message:'Welcome Supplier'})
})

//all three roles
router.get('/user',verifyToken,authorizeRoles('supplier','user','admin'),(req,res)=>{
    res.json({message:'Welcome user'})


});
// Get logged-in user's profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic || null,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});


//user updates own profile
router.put("/update-profile", verifyToken, authorizeRoles("user","supplier","admin"), async (req, res) => {
  const userId = req.user.id; // from JWT token
  const { name, email, currentPassword, newPassword } = req.body;

  // Ensure the current password is provided
  if (!currentPassword) {
    return res.status(400).json({ message: "Current password is required to update profile." });
  }

  const user = await User.findById(userId).select('+password');

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  // Verify current password before allowing changes
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  // Update fields if provided
  if (name) user.name = name;

  // If email is being updated, check for uniqueness first
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use by another account." });
    }
    user.email = email;
  }

  if (newPassword) {
    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


//create/add profile picture (POST for first time, PUT for update)
router.post("/profile-picture",verifyToken,upload.single("profilePic"),async(req,res)=>{
  try {
    if(!req.file){
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    // Update or create profile picture
    user.profilePic = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(201).json({
      message: "Profile picture added successfully",
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error creating profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
})


//uploads /update profile picture+
router.put(
  "/profile-picture",
  verifyToken,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      console.log("Decoded user:", req.user);
      console.log("Uploaded file:", req.file);

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { profilePic: `/uploads/${req.file.filename}` },
        { new: true }
      );

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePic: updatedUser.profilePic,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  //get profile picture
router.get("/profile-picture",verifyToken,async(req,res)=>{
  try{
    const user = await User.findById(req.user.id).select("profilePic");
    if(!user){
      return res.status(404).json({message:"User not Found"})
     }
     
     // Return profile picture or null explicitly
     const profilePic = user.profilePic || null;
     
     res.status(200).json({
      profilePic: profilePic,
      message: profilePic ? "Profile picture found" : "No profile picture set"
    });

  }catch(error){
    console.error("Error getting profile picture",error);
    res.status(500).json({ message: "Server error" });
  }

})
export default router;