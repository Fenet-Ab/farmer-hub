import express from 'express';
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
        { profilePicture: `/uploads/${req.file.filename}` },
        { new: true }
      );

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePicture: updatedUser.profilePicture,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
export default router;