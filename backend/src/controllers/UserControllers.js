
const {User , UserDetails, UserStats}=require("../model/User")

const cloudinary=require('../config/cloudinary')

const bcrypt=require("bcrypt")

const jwt=require("jsonwebtoken")

const register=async(req,res)=>{

    try{

        const { name,role,email,password}=req.body;

        console.log(password)

        const hashPassword=await bcrypt.hash(password,10);

        console.log(hashPassword)

        const user=await User.create({
            name,role,email,password:hashPassword
        });

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );


        // Store token in HTTP-only cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // true in production with HTTPS
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });
       


        res.status(200).json({
            message:"user registered successfully",
            user:{
                email:user.email,
                role:user.role,
                id:user._id,
                name:user.name
            },
            token:accessToken
        })

    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }

}

const login=async(req,res)=>{

    try{

        const email=req.body.email;
        const  password=req.body.password;
        
        const user = await User.findOne({ email });

        console.log("Email received:", email);
        console.log("User found:", !!user);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        console.log("Password correct:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Store token in HTTP-only cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // true in production with HTTPS
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });



            
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                role: user.role,
                email: user.email,
            },
            token:accessToken

        });

    } 
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const createProfile=async(req,res)=>{
    try{

        console.log(req.body)


        const { city, pinCode , address, phoneNumber}=req.body;

        const coordinates = JSON.parse(req.body.coordinates);

        console.log(req.body)
        const user=req.user.userId;
        console.log(user)

        await UserStats.create({
            user: user,
            points: 0,
            itemsAdded: 0
        });

        let profileImage = null;
        if (req.file) {
            profileImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "ngo-app/user-profiles",
                        resource_type: "image"
                    },
                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }

                    }
                );

                stream.end(req.file.buffer);
            });
        }

        const userProfile=await UserDetails.create({
            city,pinCode,address,coordinates , user:user , profile:profileImage , phoneNumber
        })

        res.status(200).json({
            message:"profile created success",
            data:userProfile,
            
        })
    }

    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getProfile=async(req,res)=>{

    try{

        const user=req.user.userId;

        const profile=await UserDetails.findOne({user}).populate("user")

        res.status(200).json({
            message:"successfull",
            profile
        })
    }
    catch(err){
        console.log(`${err}`)
    }
}




module.exports = {
    register,
    login,
    createProfile,
    getProfile
}