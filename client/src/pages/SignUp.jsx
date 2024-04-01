import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate()
  const [formBody, setFormBody] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setFormBody({
      ...formBody,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
      });
      const data = await res.json()
      if (data.success === false) {
        setError(data.message)
        setLoading(false)
        return
      }
      setLoading(false)
      setError('')
      navigate('/signin')
    } catch (error) {
      setLoading(false)
      console.log(error.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder="Username" 
          className='p-3 border-2 shadow-md
          rounded-lg outline-none'
          onChange={handleChange}
          value={formBody.username}
          name='username' />
        <input type="email" placeholder="Email" 
          className='p-3 border-2 shadow-md
          rounded-lg outline-none'
          onChange={handleChange}
          value={formBody.email}
          name='email' />
        <input type="password" placeholder="Password" 
          className='p-3 border-2 shadow-md
          rounded-lg outline-none'
          onChange={handleChange}
          value={formBody.password}
          name='password' />
        <button disabled={loading} type='submit' 
          className={`text-white hover:bg-orange-500 bg-orange-400 p-3 rounded-lg shadow-md ${loading && 'bg-black'}`}>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <button className="hover:bg-slate-100 border border-black p-3 rounded-lg shadow-md">
          Sign Up with Google
        </button>
      </form>
      <div className='mt-5'>Have an account?
        <Link to={'/signin'}>
          <span className='ml-1 underline text-orange-700 cursor-pointer'>
            Sign In
          </span>
        </Link>
      </div>
      {error && <div className='text-red-500 text-center mt-3'>{error}</div>}
    </div>
  )
}

export default SignUp
