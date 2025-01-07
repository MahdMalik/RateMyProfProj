'use client'
import Image from "next/image";
import {useState} from "react";
import { Box, Stack, TextField, Button } from "@mui/material";

export default function Home() 
{
  //setting initial state of messages to have this first message
  const [messages, setMessages] = useState([{
    role: "model",
    parts: [{text: "Hi! I'm the Rate My Professor support assistant. How can I help you today?"}]
  }])
  const [message, setMessage] = useState('')
  //function to send a message
  const sendMessage = async() => 
    {
      //first update list of messages to include what the user just sent
      setMessages((messages) => [
        ...messages,
        {role: "user", parts: [{text: message}]},
      ])
      setMessage('')
      //go to backend to get the model's next message
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify([...messages, {role: "user", parts: [{text: message}]}])
      })
      const newMessage = await response.json()
      setMessages((messages) => [
        ...messages,
        {role: "model", parts: [{text: newMessage.message}]}
      ])
    }
  return (
    <Box width = "100vw" height = "100vh" display = "flex" flexDirection = "column" justifyContent = "center" alignItems = "center">
      <Stack direction = "column" width = "500px" height = "700px" border = "1px solid black" p = {2} spacing = {3}>
        <Stack direction = "column" spacing = {2} flexGrow = {1} overflow = {'auto'} maxHeight = {'100%'}>
          {
            messages.map((message, index) => (
              <Box key = {index} display = "flex" justifyContent = {message.role === "model" ? 'flex-start' : 'flex-end'}>
                  <Box bgcolor = {message.role === 'model' ? "primary.main" : "secondary.main"} color = "white" border = {16} p = {3}>
                    {message.parts[0].text}
                  </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack direction = "row" spacing = {2}>
            <TextField label = "Message" fullWidth value = {message} onChange = {(e) => { setMessage(e.target.value) }}/>
            <Button variant = "contained" onClick = {sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  )
}