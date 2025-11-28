import React from 'react'
import { useAuth } from '../hooks/useAuth'
export default function Profile(){
  const { user } = useAuth()
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="p-4 border rounded bg-white">
        <div><strong>Name:</strong> {user?.name}</div>
        <div><strong>Email:</strong> {user?.email}</div>
        <div><strong>Role:</strong> {user?.role}</div>
      </div>
    </div>
  )
}
