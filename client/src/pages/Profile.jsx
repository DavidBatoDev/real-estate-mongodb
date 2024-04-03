import React, {useState, useEffect ,useRef} from 'react'
import { useSelector } from 'react-redux'
import { app } from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { FaEdit } from 'react-icons/fa'

const Profile = () => {
  const fileRef = useRef(null)
  const {currentUser} = useSelector(state => state.user)
  const [file, setFile] = useState(null)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(null)
  const [formBody, setFormBody] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: '',
    avatar: currentUser.avatar
  })
  
  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleChange = e => {
    setFormBody({
      ...formBody,
      [e.target.name]: e.target.value
    })
  }

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setFilePercentage(Math.round(progress))
    }, 
    (error) => {
      setFileUploadError(error.message)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
      .then((downloadURL) => {
        setFormBody({
          ...formBody,
          avatar: downloadURL
        })
      })
    }
    )
  }

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
        <div className='relative self-center'>
          <input onChange={e => setFile(e.target.files[0])} type="file" hidden ref={fileRef} accept='images/*'/>
          <img onClick={() => fileRef.current.click()} 
            className='rounded-full object-cover h-24 w-24 cursor-pointer mt-2' 
            src={formBody.avatar} alt="Profile" />
          <FaEdit className='absolute right-2 bottom-2 text-lg' />
        </div>
        <p className='text-center'>
        {fileUploadError ? (
          <span className='text-red-700'>
            Error Image Upload
          </span>
        ) : filePercentage > 0 && filePercentage < 100 ? (
          <span className='text-slate-700'>
            {`Uploading ${filePercentage}%`}
          </span>
        ) : filePercentage === 100 ? (
          <span className='text-green-700'>
            Uploaded
          </span>
        ) : null}
        </p>
        <input className='border p-3 rounded-lg' 
          onChange={handleChange}
          value={formBody.username}
          name='username' placeholder='Username' type="text" />

        <input className='border p-3 rounded-lg'
          onChange={handleChange}
          value={formBody.email}  
          name='email' placeholder='Email' type="text" />

        <input className='border p-3 rounded-lg' 
          onChange={handleChange}
          value={formBody.password}
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
