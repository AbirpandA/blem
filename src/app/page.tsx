"use client"
import React from 'react'
import { useWebContainer } from '@/hooks/useWebContainer'

const Page = () => {
  const webContainerRef = useWebContainer();
  return (
    <div>page</div>
  )
}

export default Page