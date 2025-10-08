import express, {Request, Response, NextFunction} from "express"
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { shouldBeUser } from "./middleware/middleware.js";
import productRouter from "./routes/product.route.js"
import categoryRouter from "./routes/category.route.js"

const app = express();
app.use(cors({
    origin:["http://localhost:3002","http://localhost:3003"],
    credentials:true
}))

app.use(express.json())
app.use(clerkMiddleware())

const PORT = 8000

app.get('/test', shouldBeUser, (req : Request, res : Response)=>{
    return res.json({
        message: "You are logged in",
        userId : req.userId
    })
})

app.use('/products',productRouter)
app.use('/category',categoryRouter)


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




app.listen(PORT,()=>{
    console.log(`Product service is running on port ${PORT}`);
    
})

