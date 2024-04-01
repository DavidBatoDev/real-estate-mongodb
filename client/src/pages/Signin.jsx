import React from 'react'

const Signin = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4'>
        <input type="email" placeholder="Email" 
          className='p-3 border-2 shadow-md
          rounded-lg outline-none' />
        <input type="password" placeholder="Password" 
          className='p-3 border-2 shadow-md
          rounded-lg outline-none' />
        <button className='text-white hover:bg-orange-500 bg-orange-400 p-3 rounded-lg shadow-md'>
          Sign In
        </button>
        <button className="hover:bg-slate-200 border border-black p-3 rounded-lg shadow-md">
          Sign In with Google
        </button>
      </form>
      <p className='mt-5'>Don't have an account? <a className='underline text-orange-700' href="signup">Sign Up</a></p>
    </div>
  )
}

export default Signin
