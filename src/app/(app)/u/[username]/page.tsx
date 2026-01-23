'use client'

import { Button } from '@/components/ui/button'
import { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { Loader2 } from "lucide-react"
import { send } from 'process'
import { toast } from "sonner"
const page = () => {

  const defaultMessages: string[] = [
  "What's something you've always wanted to try but have been too afraid to do?",
  "If you could live in any fictional world, which one would it be and why?",
  "What's the best piece of advice you've ever received?"
]
  const [isLoading,setIsLoading] = useState(false)
  const [isLoading1,setIsLoading1] = useState(false)
  const[message,setMessage] = useState('')
  const [error,setError] =useState(false)
  const [suggestedMessage,setSuggestMessages] = useState<string[]>(defaultMessages)
const params = useParams<{username:string}>()
  const getSuggestMessage = async()=>{
    try {
      setIsLoading(true)
       const response  =  await axios.post('/api/suggest-messages')
       console.log(response.data);
        const rawMessage = response.data
        const messagesArray = rawMessage.split('||').map((msg:string)=>msg.trim())
        setSuggestMessages(messagesArray)



    } catch (error) {
      console.error(error)
    }finally{
      setIsLoading(false)
    }
  }

  const sendMessage = async() =>{
      try {
          setError(false)
          setIsLoading1(true)
        const response = await axios.post('/api/send-message',{
          content:message,
          username:params.username
        })
        console.log(response);
        setMessage("")
        
      
      } catch (error) {
        console.log(error);
        toast.error("User not accepting message")
        setError(true)
      }finally{
        setIsLoading1(false)
      }
  }





  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded
    w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 text-center">Public Profile Link</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Send Anonymous Message to @{params.username}</h2>{' '}
          <div className="flex items-center ">
            <input 
            type="text"
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            placeholder='Type your question?'
            className={`w-full rounded-md border ${error ? "border-red-500":"border-gray-300"} px-4 py-3 text-sm
         focus:outline-none focus:ring-0`} />
         {error&&<p className="text-red-500 mt-1 text-sm">User is not accepting Message</p>}
          </div>
          <div className='flex justify-center mt-5'>
          <Button className=' cursor-pointer
                    hover:bg-black/80 transition-all'
                    onClick={sendMessage}
                    
                    >{
                       isLoading1?(
                    <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                     Please wait
                    </>
                  ):(
                    "Send It"
                  )

                    }</Button>
          </div>
          <div className='flex mt-20'>
             <Button className='p-5  cursor-pointer
                    hover:bg-black/80' onClick={getSuggestMessage}>
                {
                  isLoading?(
                    <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                     Please wait
                    </>
                  ):(
                    "Suggest Messages"
                  )
                }


             </Button>
          </div>
          <p className='font-semibold mt-5'>Click on any message below to select it.</p>
          <div className='w-full rounded-md border border-gray-200 px-4 py-3 text-sm
         focus:outline-none focus:ring-0 focus:border-gray-300'>
            <h2 className="text-lg font-semibold mb-2">Messages</h2>
                  <div className='space-y-3'>
                      {
                        suggestedMessage.map((msg,index)=>(
                          <Button
                          key={index}
                          onClick={()=>setMessage(msg)}
                           className="w-full text-left rounded-md border border-gray-200 px-4 py-3 text-sm bg-white
                   hover:bg-gray-300 transition text-black
                   focus:outline-none focus:ring-0
                  cursor-pointer
                   
                   "
                          >{msg}</Button>
                        ))
                      }
                  </div>
          </div>
        </div>
          <h3 className="text-xl font-bold mb-4 text-center">Get Your Message Board</h3>
          <div className='flex justify-center'>
            <Link href='/sign-up'>
                 <Button className='w-full md:w-auto  cursor-pointer
                    hover:bg-black/80 transition-all'>Create Your Account </Button>
                    </Link>
          </div>
        </div>
  )
}

export default page