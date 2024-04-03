import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const {currentUser} = useSelector(state => state.user)
  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
        <img className='rounded-full object-cover h-24 w-24 cursor-pointer self-center mt-2' 
        src={currentUser.avatar} alt="Profile" />
        <input className='border p-3 rounded-lg' 
          name='username' placeholder='Username' type="text" />

        <input className='border p-3 rounded-lg' 
          name='email' placeholder='Email' type="text" />

        <input className='border p-3 rounded-lg' 
          name='password' placeholder='Passoword' type="text" />

        <button className='bg-orange-400 p-3 hover:opacity-95 text-white rounded-lg uppercase'>Update</button>
      </form>
      <div className='flex justify-between my-2 text-red-700 font-semibold'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign-Out</span>
      </div>
    </div>
  )
}

export default Profile
