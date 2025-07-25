"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, X, Paperclip } from "lucide-react"

// Mock AI response
const MOCK_AI_RESPONSE = "Chào bạn! Tôi là một chatbot nhỏ. Bạn có câu hỏi gì không?"
const MOCK_AI_RESPONSE_WITH_FILES = "Tôi sẽ tạo ghi chú dựa trên nội dung của tệp bạn đã gửi."

interface ChatMessage {
  id: string
  role: "user" | "ai"
  content: string
  attachments?: { name: string; url?: string; contentType?: string }[]
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === "" && !files) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      attachments: files ? Array.from(files).map((file) => ({ name: file.name, contentType: file.type })) : undefined,
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInput("")
    setFiles(null)
    setSelectedFileNames([]) // Clear selected file names
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Clear file input
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponseContent = files ? MOCK_AI_RESPONSE_WITH_FILES : MOCK_AI_RESPONSE
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString() + "-ai",
          role: "ai",
          content: aiResponseContent,
        },
      ])
    }, 1000) // Simulate a 1-second delay for AI response
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files)
      setSelectedFileNames(Array.from(e.target.files).map((file) => file.name))
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          aria-label="Mở khung chat"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 h-[500px] flex flex-col shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-lg font-semibold">Chatbot</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Đóng khung chat">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {messages.map((m) => (
                <div key={m.id} className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-2 rounded-lg ${
                      m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{m.content}</p>
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mt-1 text-sm opacity-80">
                        {m.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            <span>{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t flex flex-col items-start gap-2">
            {" "}
            {/* Thay đổi ở đây */}
            {selectedFileNames.length > 0 && (
              <div className="w-full flex flex-wrap gap-2">
                {" "}
                {/* Thay đổi ở đây */}
                {selectedFileNames.map((fileName, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 border border-gray-300 max-w-full overflow-hidden whitespace-nowrap text-ellipsis" // Thay đổi ở đây
                  >
                    <Paperclip className="w-3 h-3 shrink-0" /> {/* Thêm shrink-0 */}
                    {fileName}
                  </span>
                ))}
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label="Đính kèm tệp"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </Button>
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                aria-label="Tải lên tệp"
              />
              <Input
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow"
                aria-label="Trường nhập tin nhắn"
              />
              <Button type="submit" aria-label="Gửi tin nhắn">
                Gửi
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
