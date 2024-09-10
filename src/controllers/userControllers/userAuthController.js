import express from 'express';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import User from '../../model/user.js';
import jwt from 'jsonwebtoken'

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ahmd.work12@gmail.com',
      pass: 'zzxq wdyc oiop uejo',
    },
  });

export const userSignup = async (req, res) => {
    const { name, email, mobile, password, dob } = req.body;

    try {
      // Check if the user already exists by email or mobile
      const existingUser = await User.findOne({
        $or: [{ email }, { mobile }],
      });
  
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email or mobile number' });
      }
  
      const generatedOTP= Math.floor(100000 + Math.random() * 900000)
      const hashedPass = bcryptjs.hashSync(password, 2)
  
      // Set OTP expiration time (e.g., 10 minutes)
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  
      // Send OTP to user's email using nodemailer
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your OTP for Signup',
        text: `Your OTP is ${generatedOTP}. It will expire in 10 minutes.`,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`Generated otp is ${generatedOTP}`)
  
      // Temporarily save user with the OTP and expiration time (user not yet verified)
      const newUser = new User({
        name,
        email,
        mobile,
        dob,
        password:hashedPass,  // Hash the password before saving in production
        otp:generatedOTP,
        otpExpires,
      });
  
      await newUser.save();
  
      // Send success response
      return res.status(200).json({ success: true, userId: newUser._id, message: 'OTP sent to your email' });
  
    } catch (error) {
      console.error('Error during signup:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const verifyOtp = async(req, res)=>{
    console.log('req body',req.body);
    const { email, otp } = req.body;
    console.log('type of', typeof(otp))
    console.log(`userid and otp si ${email, otp}`);

  try {
    // Find the user by ID
    const user = await User.findOne({email});
    console.log(user);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the OTP matches and is not expired
    if (user.otp == otp ) {
      // Mark the user as verified
      user.isVerified = true;
      await user.save();

      return res.status(200).json({ success: true, message: 'OTP verified. Signup complete.' });
    } else {
        console.log('else here');
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

export const setSelectedPreferences = async (req, res) => {
    const { email, selectedCategories } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.preferences = selectedCategories;

        await user.save();
        // const token = jwt.sign({ id: user._id.toString(), role: 'User', username: user.name }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

        res.json({ success: true, message: 'Preferences updated successfully'});
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};




export const login = async (req, res) => {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both email/mobile and password' });
    }

    try {
        // Find user by email or mobile
        const user = await User.findOne({
            $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if password matches
        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Adjust the expiration time as needed
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token // Send the token to the client
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
