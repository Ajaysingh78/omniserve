import mongoose from 'mongoose';



const connectToMongoDB = async (): Promise<void> => {
   
   if(!process.env.MONGO_URI) {
      throw new Error("MongoDB environment variables are missing");
   }
   await mongoose.connect(process.env.MONGO_URI as string);
   console.log('MongoDB connected');
   
};

export default connectToMongoDB;
