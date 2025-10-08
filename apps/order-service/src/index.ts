import express, {Request, Response, NextFunction} from "express"
import cors from 'cors'
import { clerkMiddleware } from "@clerk/express";
import {connectOrderDB} from "@repo/order-db"

const app = express();
app.use(cors({
    origin:["http://localhost:3002","http://localhost:3003"],
    credentials:true
}))
const PORT = 8001
app.use(express.json())
app.use(clerkMiddleware())


const start = async () => {
    try {
        app.listen(PORT,()=>{
            console.log(`Order service is running on port ${PORT}`);
        })
        await connectOrderDB()
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();

// app.use("/api/orders", orderRoutes);


app.get('/health', (req : Request, res : Response)=>{
    return res.json({
        status : "ok",
        uptime : process.uptime(),
        timeStamp : Date.now()
    })
})
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Inter Server Error!" });
});




