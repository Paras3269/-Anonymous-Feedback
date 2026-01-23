'use client'

import { veifySchema } from '@/schemas/verifySchema'
import { useParams, useRouter } from 'next/navigation'
import {  useForm } from 'react-hook-form'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username:string}>()
  

     const form =  useForm<z.infer<typeof veifySchema>>({
      resolver:zodResolver(veifySchema),
     })

     const onSubmit = async(data:z.infer<typeof veifySchema>) =>{
      try {
      const response =   await axios.post(`/api/verify-code`,{
          username:params.username,
          code:data.code
        })
        toast.success('Success',{
          description:response.data.message
        })
        router.replace('/sign-in')
        
      } catch (error) {
        console.error("Error in singup",error)
             const axiosError = error as AxiosError<ApiResponse>;
              let errorMessage = axiosError.response?.data.message
             toast.error(
                <div className="flex flex-col gap-1">
                <span className="font-medium">SignIn failed</span>
                <span className="text-sm text-muted-foreground">
                 {errorMessage}
                     </span>
                    </div>
                     );
              
      }
     }
  return (
    <div className='flex justify-center items-center
    min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white
      rounded-lg shadow-md'>
        <div className='tect-center'>
            <h1 className='text-4xl font-extrabold
            tracking-tight lg:text-5xl mb-6'>Verify Your Account</h1>
            <p className='mb-4'>Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          name="code"
          control={form.control}
          render={({field}) =>(
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code"
                 {...field}
              />
              </FormControl>
              <FormMessage/>
            </FormItem> )} 
             />
         <Button type='submit'>Sumbit</Button>
        </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount