const mongoose=require('mongoose')
const connectDB = async () => {
    try {
        const con = await mongoose.connect('mongodb://localhost:27017/hospitalDB')
        console.log(`MongoDB Connected: ${con.connection.host}`)
    }
    catch(error)
    {
    console.error('Database connection failed:', error.message)
    process.exit(1)
    }
}
module.exports=connectDB