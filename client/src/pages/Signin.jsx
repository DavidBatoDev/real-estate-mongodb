import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  signInStart, 
  signInSuccess, 
  signInFail 
} from '../redux/user/userSlice'

const Signin = () => {
  const [formBody, setFormBody] = useState({
    email: '',
    password: ''
  })
  const {loading, error} = useSelector(state => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = e => {
    setFormBody({
      ...formBody,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      // Fetching data from the backend
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
      })
      // Parsing the response
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFail(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate('/') // Redirect to the home page

    } catch (error) {
      dispatch(signInFail(error.message))
      console.log(error.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          value={formBody.email} 
          onChange={handleChange}
          name='email'
          type="email" 
          placeholder="Email" 
          className='p-3 border-2 shadow-md
          rounded-lg outline-none' />
        <input 
          value={formBody.password}
          onChange={handleChange}
          name='password'
          type="password" 
          placeholder="Password" 
          className='p-3 border-2 shadow-md
          rounded-lg outline-none' />
        <button type='submit' disabled={loading} className='text-white hover:bg-orange-500 bg-orange-400 p-3 rounded-lg shadow-md'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <button className="hover:bg-slate-200 border border-black p-3 rounded-lg shadow-md">
          Sign In with Google
        </button>
      </form>
      <div className='mt-5'>Don't have an account?
        <Link to={'/signup'}>
          <span className='ml-1 underline text-orange-700 cursor-pointer'>
            Sign Up
          </span>
        </Link>
      </div>
      {error && <div className='text-red-500 text-center mt-3'>{error}</div>}
    </div>
  )
}

export default Signin
