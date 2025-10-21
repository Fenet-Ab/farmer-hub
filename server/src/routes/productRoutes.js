import express from 'express';

import Product from '../models/productModel.js';
import verifyToken from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

//create a new product only for supplier
router.post(
    '/create',
    verifyToken,
    upload.single("image"),
    async(req,res)=>{
        try {
            //check if the user is supplier
            if(req.user.role !== 'supplier'){
                return res.status(403).json({
                    message:"Access denied only for suppliers"
                })
            }
            if(!req.file){
                return res.status(400).json({
                    message:"image is required"
                })
            }
            const {name,description,price,quantity,category}=req.body;
            if(!name || !description || !price || !quantity || !category){
                return res.status(400).json({
                    message:"All fields are required"

                })
            }
            const product   = new Product({
                name,
                description,
                price,
                quantity,
                category,
                image:`/uploads/${req.file.filename}`,
                supplier:req.user.id,
            })
            await product.save();
            res.status(201).json({
                message:"product created successfully",
                product
            })
        } catch (error) {
            console.error("Error creating product",error.message);
            return res.status(500).json({
                message:"server error"
            })
            
        }
    }
);
// get all product
router.get("/",async(req,res)=>{
    try {
        const product = await Product.find()
        .populate("supplier","name email")
        .sort({createdAt: -1});
        if(!product.length){
            return res.status(404).json({
                message:"product not found"
            })
        }
        res.status(200).json({
            success:true,
            count:product.length
            ,product});
        
    } catch (error) {
        console.error("error fetching product",error.message);
        res.status(500).json({
            success:false,
            message:"server error while fetching product"
        })
        
    }
})
// get  product by id
router.get("/:id",async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id)
        .populate("supplier","name email")
        
        if(!product){
            return res.status(404).json({
                message:"product not found"
            })
        }
        res.status(200).json({
            success:true
            ,product});
        
    } catch (error) {
        console.error("error fetching product",error.message);
        res.status(500).json({
            success:false,
            message:"server error while fetching product"
        })
        
    }
})

//update product
router.put("/:id",verifyToken,upload.single("image"),async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        
        if(!product){
            return res.status(404).json({message:"product not found"})
        }
        //check ownership
        if(product.supplier.toString() !== req.user.id){
            return res.status(403).json({
                message:"Access denied"
            })
        }
        //update fields
        const{name,description,price,quantity,category}=req.body;
        if(name) product.name=name;
        if(description)product.description=description;
        if(price) product.price=price;
        if(quantity) product.quantity=quantity;
        if(category) product.category=category;

        //update image
        if(req.file){
            product.image=`/uploads/${req.file.filename}`;
        }
        await product.save();
        res.status(200).json({
            message:"product updated successfully",
            product,
        })
        
    } catch (error) {
        console.error("error updating product",error);
        res.status(500).json({message:"server error"})
        
    }
})
//delete product
router.delete("/:id",verifyToken,async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        
        if(!product){
            return res.status(404).json({message:"product not found"})
        }
        //check ownership
        if(product.supplier.toString() !== req.user.id){
            return res.status(403).json({
                message:"Access denied"
            })
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message:"product deleted successfully",
        })
        
    } catch (error) {
        console.error("error deleting product",error);
        res.status(500).json({message:"server error"})
        
    }
})
export default router;