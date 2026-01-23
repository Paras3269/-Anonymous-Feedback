'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { useSonner } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps={
    message:Message,
    onMessageDelete:(messageId:string) => void
}
 const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
    const handleDeleteConfirm = async() =>{
      const response =  await  axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    
      toast.success(response.data.message);
      onMessageDelete(message._id.toString())
                    
                    }
  return (
    <Card>
    <CardHeader>
        <CardTitle>Message</CardTitle>
         <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"
        size="sm"
        className="flex-shrink-0 w-8 h-8 p-1 cursor-pointer
                    hover:bg-black/80 "
        ><X className="w-4 h-4"/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        <CardDescription className="text-xl font-semibold">{message.content}</CardDescription>
    </CardHeader>
    <CardContent>
    </CardContent>
    </Card>
  )
}

export default MessageCard

