import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { app } from '../firebase';
import { Link } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { FaEdit, FaPlus, FaSignOutAlt, FaTrashAlt } from 'react-icons/fa';
import { updateUserStart, updateUserSuccess, updateUserFail } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [filePercentage, setFilePercentage] = useState(0);
  const [file, setFile] = useState(null);
  const [showListing, setShowListing] = useState(false);
  const [listing, setListing] = useState([{}]);
  const [formBody, setFormBody] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [showListingError, setShowListingError] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);

  const fetchUserListing = async () => {
    try {
      const res = await fetch(`/api/users/listings/${currentUser._id}`);
      const data = await res.json();
      setListing(data);
    } catch (error) {
      setShowListingError(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserListing();
  }, [currentUser._id, showListing]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormBody({
            ...formBody,
            avatar: downloadURL,
          });
          setFileUploadError(null);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormBody({
      ...formBody,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(null);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formBody),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFail(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess('Profile updated successfully!');
    } catch (error) {
      dispatch(updateUserFail(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFail(data.message));
        return;
      }
      dispatch(updateUserSuccess(null));
      setDeleteModal(false);
      navigate('/signin');
    } catch (error) {
      dispatch(updateUserFail(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      updateUserStart();
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFail(data.message));
        return;
      }
      dispatch(updateUserSuccess(null));
      navigate('/signin');
    } catch (error) {
      dispatch(updateUserFail(error.message));
      console.log(error);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(data.message);
        return;
      }
      fetchUserListing();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Error Container */}
      {error && <div className='bg-red-400 text-white text-center p-3'>{error}</div>}

      {/* Profile Container */}
      <div className='max-w-lg p-5 mx-auto bg-white shadow-md rounded-lg relative mt-10'>
        {/* Delete Modal */}
        {deleteModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-5 rounded-lg shadow-lg'>
              <h2 className='text-xl font-semibold mb-3'>Confirm Delete</h2>
              <p className='text-gray-700 mb-5'>Are you sure you want to delete your account?</p>
              <div className='flex justify-end'>
                <button
                  disabled={loading}
                  className='bg-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600'
                  onClick={handleDeleteUser}
                >
                  Delete
                </button>
                <button
                  disabled={loading}
                  className='bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400'
                  onClick={() => setDeleteModal(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className='text-center mb-8'>
          <div className='relative inline-block'>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              hidden
              ref={fileRef}
              accept='image/*'
            />
            <img
              src={formBody?.avatar || currentUser?.avatar}
              onClick={() => fileRef.current.click()}
              className='rounded-full object-cover h-32 w-32 border-4 border-orange-500 shadow-lg cursor-pointer'
              alt='Profile'
            />
            <FaEdit className='absolute bottom-2 right-2 text-xl text-white bg-orange-500 rounded-full p-1 cursor-pointer' />
          </div>
          <p className='mt-2 text-sm text-gray-500'>
            {fileUploadError ? (
              <span className='text-red-700'>Error uploading image</span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className='text-green-700'>Uploaded</span>
            ) : null}
          </p>
        </div>

        {/* Form Update */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            className='border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
            onChange={handleChange}
            defaultValue={currentUser.username}
            name='username'
            placeholder='Username'
            type='text'
          />

          <input
            className='border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
            onChange={handleChange}
            defaultValue={currentUser.email}
            name='email'
            placeholder='Email'
            type='text'
          />

          <input
            className='border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
            onChange={handleChange}
            placeholder='Update Password'
            type='password'
            name='password'
          />

          <button
            disabled={loading}
            type='submit'
            className='bg-orange-500 py-3 hover:bg-orange-600 text-white rounded-lg uppercase transition duration-300'
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>

        {/* Create Listing Button */}
        <Link to='/create-listing'>
          <button className='mt-5 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 py-3 cursor-pointer text-white rounded-lg w-full transition duration-300'>
            <FaPlus /> Create Listing
          </button>
        </Link>

        {/* Sign Out & Delete Account */}
        <div className='flex justify-between my-4 text-sm font-semibold text-gray-600'>
          <span onClick={() => setDeleteModal(true)} className='cursor-pointer text-red-500 hover:underline'>
            Delete Account
          </span>
          <span onClick={handleSignOut} className='cursor-pointer text-orange-500 hover:underline'>
            <FaSignOutAlt /> Sign-Out
          </span>
        </div>

        {/* Success Message */}
        {updateSuccess && <div className='hover:opacity-95 text-green-500 text-center mt-3'>{updateSuccess}</div>}

        {/* Show Listing Button */}
        <button
          onClick={() => setShowListing((prevState) => !prevState)}
          className='mt-7 flex justify-center w-full font-semibold text-orange-500 hover:text-orange-600 transition duration-300'
        >
          {showListing ? 'Hide Listings' : 'Show Listings'}
        </button>

        {/* Listings Section */}
        {showListing && (
          <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {listing.length === 0 ? (
              <div className='flex flex-col gap-4 items-center'>
                <p className='my-5 text-center text-xl font-semibold'>You have no listings yet</p>
                <Link to='/create-listing'>
                  <button className='bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg w-full'>
                    Create Listing
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <p className='my-5 text-center text-xl font-semibold'>Your Listings</p>
                {listing.map((item, index) => (
                  <div key={index} className='bg-white border shadow-sm rounded-lg p-4'>
                    <Link className='flex items-center gap-4' to={`/listing/${item._id}`}>
                      <img
                        className='h-20 w-20 rounded-md shadow-sm object-cover'
                        src={item.imageUrls[0]}
                        alt='Listing'
                      />
                      <p className='font-bold truncate text-gray-800'>{item.name}</p>
                    </Link>
                    <div className='flex justify-between mt-3'>
                      <button
                        onClick={() => handleDeleteListing(item._id)}
                        className='text-red-600 font-semibold flex items-center gap-1 hover:underline'
                      >
                        <FaTrashAlt /> Delete
                      </button>
                      <Link to={`/update-listing/${item._id}`} className='text-green-500 font-semibold flex items-center gap-1 hover:underline'>
                        <FaEdit /> Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
