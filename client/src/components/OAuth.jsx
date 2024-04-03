import React from 'react'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth' 
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { app } from '../firebase'
import { 
    signInSuccess,
    signInFail
  } from '../redux/user/userSlice'

const OAuth = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            })
            const data = await res.json()
            if (data.success === false) {
                console.log(data.message)
                dispatch(signInFail(data.message))
                return
            }
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <div onClick={handleGoogleClick} type='button' className='hover:bg-slate-50 cursor-pointer border border-black bg-white p-3 rounded-lg text-center shadow-md'>
        Continue with google
    </div>
  )
}

export default OAuth
