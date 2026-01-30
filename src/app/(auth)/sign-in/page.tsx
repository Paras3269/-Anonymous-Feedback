'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import {z} from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"



const  page = () => {
  
 const [isSubmitting ,setIsSubmitting]  = useState(false)
   

 const router = useRouter();


 //zod implememtation
 const form =  useForm<z.infer<typeof signInSchema>>({
  resolver:zodResolver(signInSchema),
  defaultValues:{
    identifier:'',
    password:''
  }
 })



 const onSubmit = async(data: z.infer<typeof signInSchema>)=>{
   setIsSubmitting(true)
     const result =   await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      })
      setIsSubmitting(false)
      if(result?.url){
          router.replace('/dashboard')
      }
  
  
    if(result?.error?.includes("Please verify your account before login")){
       toast.error(
                <div className="flex flex-col gap-1">
                <span className="font-medium">Email NotVerifed</span>
                <span className="text-sm text-muted-foreground">
                   Please Verify Your email
                     </span>
                    </div>
                     );
    }
      
      if(result?.error?.includes("No user found with this email")){
        toast.error(
                <div className="flex flex-col gap-1">
                <span className="font-medium">Login Failed</span>
                <span className="text-sm text-muted-foreground">
                 Incorrect username or password
                     </span>
                    </div>
                     );
      }

     
 }

  return (
     <div className="flex justify-center items-center 
     min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white
      rounded-lg shadow-md"> 
       <a className='text-xl font-bold
            mb-4 md:mb-0 text-black' href='/'>Mystry Message</a>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold
          tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign in to start your annonymous adventure</p>
        </div>
       
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
         
          <FormField
          name="identifier"
          control={form.control}
          render={({field}) =>(
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="email/username"
                 {...field}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
          />
          <FormField
          name="password"
          control={form.control}
          render={({field}) =>(
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password"
                 {...field}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
          />
           <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
           {
            isSubmitting ? (
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
            
            </>) : ('SignIn')
           }
          </Button>
        </form>
        </Form>
        <div className="text-center mt-4">
          <p>
           Dont have a account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign up</Link>
          </p>
        </div>
      </div>
     </div>
  )
}

export default page