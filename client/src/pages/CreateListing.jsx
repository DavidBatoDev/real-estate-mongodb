import { useState } from 'react';
import { app } from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FaTrash, FaImages } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [images, setImages] = useState([]);
  const [formBody, setFormBody] = useState({
    name: '',
    description: '',
    address: '',
    type: 'rent',
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 50,
    imageUrls: [],
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSubmit = (e) => {
    if (images.length === 0) {
      setImageUploadError('Please select images to upload');
      setImages([]);
    } else if (images.length > 6 || formBody.imageUrls.length + images.length > 6) {
      setImageUploadError('You can only upload 6 images');
      setImages([]);
    } else {
      setUploading(true);
      const promises = [];
      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormBody({ ...formBody, imageUrls: formBody.imageUrls.concat(urls) });
          setImageUploadError(null);
          setUploading(false);
          setImages([]);
        })
        .catch((error) => {
          setImageUploadError(error.message);
          setImages([]);
        });
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormBody({ ...formBody, imageUrls: formBody.imageUrls.filter((img, i) => i !== index) });
  };

  const handleChange = (e) => {
    if (e.target.type === 'checkbox' && e.target.name !== 'type') {
      setFormBody({
        ...formBody,
        [e.target.name]: e.target.checked,
      });
    } else {
      setFormBody({
        ...formBody,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formBody.imageUrls.length === 0) return setError('Please upload images');
      if (formBody.offer && formBody.discountedPrice === 0) return setError('Please enter discounted price');
      if (+formBody.regularPrice < +formBody.discountedPrice) return setError('Discounted price cannot be greater than regular price');
      setLoading(true);
      setError(null);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formBody,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      }
      setLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold text-center my-7'>Create a Listing</h1>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md space-y-6'>
        {/* Form Section */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-4'>
            <input
              onChange={handleChange}
              value={formBody.name}
              type='text'
              placeholder='Name'
              name='name'
              required
              className='w-full bg-gray-50 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500'
            />

            <textarea
              onChange={handleChange}
              value={formBody.description}
              placeholder='Description'
              name='description'
              required
              className='w-full bg-gray-50 p-3 min-h-20 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500'
            />

            <input
              onChange={handleChange}
              value={formBody.address}
              type='text'
              placeholder='Address'
              name='address'
              required
              className='w-full bg-gray-50 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500'
            />

            {/* Property Type and Features */}
            <div className='grid grid-cols-2 gap-6'>
              <div className='flex flex-col'>
                <label className='font-semibold mb-2'>Property Type</label>
                <div className='flex gap-4'>
                  <label className='flex items-center gap-2'>
                    <input
                      onChange={handleChange}
                      checked={formBody.type === 'sale'}
                      type='radio'
                      value='sale'
                      name='type'
                      className='h-5 w-5 text-orange-500 focus:ring-orange-500'
                    />
                    Sell
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      onChange={handleChange}
                      checked={formBody.type === 'rent'}
                      type='radio'
                      value='rent'
                      name='type'
                      className='h-5 w-5 text-orange-500 focus:ring-orange-500'
                    />
                    Rent
                  </label>
                </div>
              </div>

              <div className='flex flex-col'>
                <label className='font-semibold mb-2'>Features</label>
                <div className='flex flex-wrap gap-4'>
                  <label className='flex items-center gap-2'>
                    <input
                      checked={formBody.parking}
                      onChange={handleChange}
                      type='checkbox'
                      name='parking'
                      className='h-5 w-5 text-orange-500 focus:ring-orange-500'
                    />
                    Parking Spot
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      onChange={handleChange}
                      checked={formBody.furnished}
                      type='checkbox'
                      name='furnished'
                      className='h-5 w-5 text-orange-500 focus:ring-orange-500'
                    />
                    Furnished
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      onChange={handleChange}
                      checked={formBody.offer}
                      type='checkbox'
                      name='offer'
                      className='h-5 w-5 text-orange-500 focus:ring-orange-500'
                    />
                    Offer
                  </label>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className='flex gap-6'>
              <div className='flex flex-col'>
                <label htmlFor='bedrooms' className='font-semibold mb-2'>
                  Bedrooms
                </label>
                <input
                  onChange={handleChange}
                  value={formBody.bedrooms}
                  type='number'
                  id='bedrooms'
                  name='bedrooms'
                  required
                  className='w-full bg-gray-50 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500'
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='bathrooms' className='font-semibold mb-2'>
                  Bathrooms
                </label>
                <input
                  onChange={handleChange}
                  value={formBody.bathrooms}
                  type='number'
                  id='bathrooms'
                  name='bathrooms'
                  required
                  className='w-full bg-gray-50 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500'
                />
              </div>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='regularPrice' className='font-semibold mb-2'>
                Regular Price
              </label>
              <input
                type='number'
                onChange={handleChange}
                value={formBody.regularPrice}
                min='50'
                id='regularPrice'
                name='regularPrice'
                required
                className='w-full bg-gray-50 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500'
              />
              {formBody.type === 'rent' && <small className='text-gray-500'>($ / month)</small>}
            </div>

            {formBody.offer && (
              <div className='flex flex-col'>
                <label htmlFor='discountedPrice' className='font-semibold mb-2'>
                  Discounted Price
                </label>
                <input
                  type='number'
                  onChange={handleChange}
                  value={formBody.discountedPrice}
                  min='50'
                  max={+formBody.regularPrice}
                  id='discountedPrice'
                  name='discountedPrice'
                  required
                  className='w-full bg-gray-50 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500'
                />
                {formBody.type === 'rent' && <small className='text-gray-500'>($ / month)</small>}
              </div>
            )}
          </div>

          {/* Image Upload Section */}
          <div className='flex flex-col gap-4'>
            <p className='text-gray-500'>
              <span className='font-bold text-black'>Images: </span>The first image will be the cover (max 6)
            </p>
            <div className='flex gap-2'>
              <div className='border cursor-pointer hover:bg-gray-600 hover:text-white border-gray-400 rounded p-3'>
                <label htmlFor='imageUrls' className='cursor-pointer flex items-center gap-2'>
                  <FaImages /> {images.length > 0 ? `${images.length} IMAGES SELECTED` : 'SELECT IMAGES'}
                </label>
                <input
                  id='imageUrls'
                  onChange={(e) => setImages(e.target.files)}
                  hidden
                  type='file'
                  accept='image/*'
                  multiple
                  name='imageUrls'
                  className='flex-[2] max-w-48'
                />
              </div>
              <button
                disabled={uploading || loading}
                type='button'
                onClick={handleImageSubmit}
                className='hover:bg-orange-500 hover:text-white flex-[1] rounded border-orange-500 border p-3 text-orange-500 transition-all duration-300'
              >
                {uploading ? 'UPLOADING...' : 'UPLOAD'}
              </button>
            </div>

            {/* Display Uploaded Images */}
            {formBody.imageUrls.length > 0 && (
              <div className='grid grid-cols-3 gap-2'>
                {formBody.imageUrls.map((image, index) => (
                  <div key={image} className='relative border rounded-lg overflow-hidden'>
                    <img src={image} alt={`image${index}`} className='h-20 w-32 object-cover' />
                    <div className='absolute right-1 top-1 bg-white rounded-full w-6 h-6 flex justify-center items-center'>
                      <FaTrash onClick={() => handleRemoveImage(index)} className='text-red-500 cursor-pointer' />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button and Error Messages */}
        <button
          disabled={uploading || loading}
          type='submit'
          className='bg-orange-500 py-3 text-white rounded-lg shadow-lg hover:bg-orange-600 transition-all duration-300'
        >
          CREATE LISTING
        </button>
        <p className='text-center text-red-700'>{imageUploadError && imageUploadError}{error && error}</p>
      </form>
    </main>
  );
};

export default CreateListing;
