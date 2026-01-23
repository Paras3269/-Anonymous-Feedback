import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions : NextAuthOptions= {
    providers:[
        CredentialsProvider({
            id:'credentials',
            name:"Credentials",
            credentials:{
                identifier:{label:"Email or Username",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect()
                
                try {
                   const user =  await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this email')
                    }

                    if(!user.isVerified){
                        throw new Error ('Please verify your account before login')
                    }

                   const isPasswordCorrect =  await bcrypt.compare(credentials.password,user.password)
                   if(isPasswordCorrect){
                       return{  _id: user._id.toString(),
                         email: user.email,
                         username: user.username,
                          isVerified: user.isVerified,
                    isAcceptingMessage: user.isAcceptingMessage}
                   }else{
                    throw new Error('Incorrect Password')
                   }
                } catch (error:any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessage=user.isAcceptingMessage;
                token.username = user.username
            }
            return token
        },
        async session({session,token}) {
            if(token){
                 session.user = {
      _id: token._id as string,
      isVerified: token.isVerified as boolean,
      isAcceptingMessage: token.isAcceptingMessage as boolean,
      username: token.username as string,
      email: session.user?.email ?? "",
    }
            }
            return session
        }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy: "jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}