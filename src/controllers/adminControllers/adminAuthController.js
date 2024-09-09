import Admin from "../../model/admin.js"
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
    console.log('coming hree')
    const { username, password } = req.body

    try {
        const isAdmin = await Admin.findOne({ username })
        console.log(`is admin ${isAdmin}`)
        if (!isAdmin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        if (isAdmin && isAdmin.password != password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: isAdmin._id.toString(), role: 'Admin', username: isAdmin.username }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        res.status(200).json({ success: true,message: 'Admin logged in successfully' , token :token});
    } catch (error) {
        console.log(`Error at admin login ${error}`)
    }



}