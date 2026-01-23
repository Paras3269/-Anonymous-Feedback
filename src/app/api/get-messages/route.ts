import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth';
import mongoose from "mongoose";

export async function GET(reqest:Request){
    await dbConnect()
    const session =   await getServerSession(authOptions)
    const user: User = session?.user 
    
     

  if(!session || !session.user){
    return Response.json(
        {
            success:false,
            message:"Not Authenticated"
        },
        {
            status:401
        }
    )
  }

 const userId = new mongoose.Types.ObjectId(user._id);
 try {
     const user = await UserModel.aggregate([
        {$match:{_id:userId}},
        {$unwind:"$message"},
        {$sort:{"message.createdAt":-1}},
        {$group:{_id:'$_id',message:{$push:"$message"}}}
     ])
   console.log(user);
   
     

     if(!user || user.length ===0){
        return Response.json(
        {
            success:false,
            message:"No message found"
        },
        {
            status:404
        }
    )
     }

     return Response.json(
        {
            success:true,
            messages:user[0].message
        },
        {
            status:200
        }
    )
 } catch (error) {
    console.log("An unexpected error occured:",error)
     return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {
                status:500
            }
        )
 }
}