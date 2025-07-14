import React from 'react'
import MyBooks from '../_components/borrowed'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <MyBooks/>
      </main>
    </div>
  )
}

export default page
