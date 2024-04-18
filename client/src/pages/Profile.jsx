import React, {useState, useEffect ,useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { app } from '../firebase'
import { Link } from 'react-router-dom'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { FaEdit, FaPlus, FaTimes } from 'react-icons/fa'
import { updateUserStart, updateUserSuccess, updateUserFail } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { set } from 'mongoose'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector(state => state.user)
  const [filePercentage, setFilePercentage] = useState(0)
  const [file, setFile] = useState(null)
  const [showListing, setShowListing] = useState(false)
  const [listing, setListing] = useState([{}])
  const [formBody, setFormBody] = useState({})
  const [deleteModal, setDeleteModal] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(null)
  const [showListingError, setShowListingError] = useState(null)
  const [fileUploadError, setFileUploadError] = useState(null)

  const fetchUserListing = async () => {
    try {
      const res = await fetch(`/api/users/listings/${currentUser._id}`)
      const data = await res.json()
      setListing(data)
    } catch (error) {
      showListingError(error.message)
      console.log(error)
    }
  }
  useEffect(() => {
    fetchUserListing()
  }, [currentUser._id, showListing])

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  
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
        setFileUploadError(null)
      })
    }
    )
  }
  
  const handleChange = e => {
    setFormBody({
      ...formBody,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setUpdateSuccess(null)
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
      })

      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFail(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess('Profile updated successfully!')
    } catch (error) {
      dispatch(updateUserFail(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      console.log(data)
      if (data.success === false) {
        dispatch(updateUserFail(data.message))
        return
      }
      dispatch(updateUserSuccess(null))
      setDeleteModal(false)
      navigate('/signin')
    } catch (error) {
      dispatch(updateUserFail(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      updateUserStart()
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFail(data.message))
        return 
      }
      dispatch(updateUserSuccess(null))
      navigate('/signin')
    } catch (error) {
      dispatch(updateUserFail(error.message))
      console.log(error)
    }
  }

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
        setShowListingError(data.message)
        return
      }
      fetchUserListing()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    {/* error container */}
    {error && <div className='bg-red-400 text-white text-center p-3'>{error}</div>}
    <div className='max-w-lg p-3 mx-auto relative'>
      {/* Delete Modal */}
      {deleteModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-5 rounded-lg'>
            <h2 className='text-xl font-semibold mb-3'>Confirm Delete</h2>
            <p className='text-gray-700 mb-5'>Are you sure you want to delete your account?</p>
            <div className='flex justify-end'>
              <button disabled={loading} className='bg-red-500 text-white px-4 py-2 rounded-lg mr-2' onClick={handleDeleteUser}>Delete</button>
              <button disabled={loading} className='bg-gray-300 text-gray-700 px-4 py-2 rounded-lg' onClick={() => setDeleteModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      {/* Form update */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='relative self-center'>
          <input onChange={e => setFile(e.target.files[0])} type="file" disabled={deleteModal} hidden ref={fileRef} accept='images/*'/>
          <img src={formBody?.avatar || currentUser?.avatar} onClick={() => fileRef.current.click()} 
            className={`rounded-full object-cover h-24 w-24 cursor-pointer mt-2 ${deleteModal && 'opacity-20'}`} 
            alt="Profile" />
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
          defaultValue={currentUser.username}
          name='username' placeholder='Username' type="text" />

        <input className='border p-3 rounded-lg'
          onChange={handleChange}
          defaultValue={currentUser.email} 
          name='email' placeholder='Email' type="text" />

        <input className='border p-3 rounded-lg' 
          onChange={handleChange}
          defaultValue={currentUser.password}
          name='password' placeholder='Passoword' type="text" />

      <button disabled={loading} type='submit' className='bg-orange-500 p-3 hover:bg-orange-600 text-white rounded-lg uppercase'>
        {loading ? 'Loading...' : 'Update'}
      </button>
      </form>
      {/* From Update */}
      <Link to={"/create-listing"}>
        <button className='mt-4 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 p-3 cursor-pointer text-white rounded-lg w-full'>
          <FaPlus /> CREATE LISTING
        </button>
      </Link>
      <div className='flex justify-between my-2 text-red-700 font-semibold'>
        <span onClick={() => setDeleteModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer'>Sign-Out</span>
      </div>
      {updateSuccess && <div className='hover:opacity-95 text-green-500 text-center mt-3'>{updateSuccess}</div>}
      {/* Show Listing */}
      <button onClick={() => setShowListing(prevState => !prevState)} className='mt-7 flex justify-center w-full font-semibold text-green-500'>
        {showListing ? 'Hide Listings' : 'Show Listings'}
      </button>
      {showListing && (
      <>
      <div className='h-max flex flex-col items-center gap-4'>
        {listing.length === 0 && (
          <div className='mt-10 flex flex-col gap-4 items-center'>
            <p className='my-5 text-center text-2xl font-semibold'>You have no listing yet</p>
            <Link to='/create-listing'>
              <button className='bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg'>Create Listing</button>
            </Link>
          </div>
        
        )}
        {listing.map((item, index) => (
          <>
          <p className='my-5 text-center text-2xl font-semibold'>Your Listings</p>
          <div key={index} className='cursor-pointer flex items-center w-full border shadow-md rounded-lg'>
            <Link className='flex items-center w-[85%]' to={`/listing/${item._id}`}>
              <img className='h-20 w-32 shadow-md object-contain' 
                src={item.imageUrls[0]} alt="p" />
              <p className='ml-2 font-bold truncate'>{item.name}</p>
            </Link>
            <div className='flex flex-col justify-around pr-2 border h-full p-2 w-20'>
              <button onClick={() => handleDeleteListing(item._id)} className='text-red-600 font-semibold'>DELETE</button>
              <button className='text-green-500 font-semibold'>EDIT</button>
            </div>
          </div>
          </>
        ))}
      </div>
      </>
      )}
    </div>
    </>
  )
}

export default Profile
