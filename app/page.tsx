"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AppSidebar } from "@/components/app-sidebar"
import { MainContent } from "@/components/main-content"
import { FlashcardPanel } from "@/components/flashcard-panel"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function NotePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeFile, setActiveFile] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileFlashcards, setFileFlashcards] = useState<{ [key: string]: any[] }>({})
  const [fileFlashcardStates, setFileFlashcardStates] = useState<{ [key: string]: boolean }>({})

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileSelect = (file: any) => {
    setActiveFile(file)
  }

  const handleGenerateFlashcards = () => {
    if (!activeFile) return

    const generatedCards = [
      {
        id: 1,
        front: "What is the main concept discussed in this note?",
        back: "The main concept covers the fundamental principles of the topic with detailed explanations and examples.",
      },
      {
        id: 2,
        front: "Key takeaway from the content",
        back: "Understanding the relationship between different elements and how they interact in real-world scenarios.",
      },
      {
        id: 3,
        front: "Important definition to remember",
        back: "A comprehensive definition that encompasses all the essential characteristics and properties.",
      },
    ]

    setFileFlashcards((prev) => ({
      ...prev,
      [activeFile.id]: generatedCards,
    }))
    setFileFlashcardStates((prev) => ({
      ...prev,
      [activeFile.id]: true,
    }))
  }

  const handleCloseFlashcards = () => {
    if (!activeFile) return
    setFileFlashcardStates((prev) => ({
      ...prev,
      [activeFile.id]: false,
    }))
  }

  const currentFileFlashcards = activeFile ? fileFlashcards[activeFile.id] || [] : []
  const showFlashcards = activeFile ? fileFlashcardStates[activeFile.id] || false : false

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-gray-50">
        <AppSidebar onFileSelect={handleFileSelect} />
        <SidebarInset className="flex flex-col flex-1">
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <MainContent
              activeFile={activeFile}
              onGenerateFlashcards={handleGenerateFlashcards}
              hasFlashcards={showFlashcards}
            />
            {showFlashcards && (
              <FlashcardPanel
                isOpen={showFlashcards}
                onClose={handleCloseFlashcards}
                flashcards={currentFileFlashcards}
              />
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
