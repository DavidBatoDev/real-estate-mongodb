import {useState} from 'react'
import { app } from '../firebase'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { FaTrash, FaImages } from 'react-icons/fa'
import { set } from 'mongoose'

const CreateListing = () => {
    const [images, setImages] = useState([])
    const [formBody, setFormBody] = useState({
        name: '',
        description: '',
        address: '',
        sale: false,
        rent: false,
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 0,
        bathrooms: 0,
        regularPrice: 0,
        discountedPrice: 0,
        imageUrls: []
    })
    const [loading, setLoading] = useState(false)
    const [imageUploadError, setImageUploadError] = useState(null)

    const handleImageSubmit = (e) => {
        if (images.length === 0) {
            setImageUploadError('Please select images to upload')
            setImages([])
        }
        else if (images.length > 6 || formBody.imageUrls.length + images.length > 6) {
            setImageUploadError('You can only upload 6 images')
            setImages([])
        } else {
            setLoading(true)
            const promises = []
            for (let i = 0; i < images.length; i++) {
               promises.push(storeImage(images[i]))
            }
            Promise.all(promises)
            .then((urls) => {
                setFormBody({...formBody, imageUrls: formBody.imageUrls.concat(urls)})
                setImageUploadError(null)
                setLoading(false)
            })
            setImages([])
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    resolve(downloadURL)
                })
            }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormBody({...formBody, imageUrls: formBody.imageUrls.filter((img, i) => i !== index)})
    }

    console.log(formBody.imageUrls)
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-3'>
            <div className='flex flex-col gap-4 flex-[1]'>
                <input type="text" placeholder='Name' name='name' required
                className='w-full bg-white p-3 rounded-lg border shadow-md'/>

                <textarea type="text" placeholder='Description' name='description' required
                className='w-full bg-white p-3 min-h-16 rounded-lg border shadow-md'>
                </textarea>

                <input type="text" placeholder='Address' name='address' required
                className='w-full bg-white p-3  rounded-lg border shadow-md'/>

                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2 items-center'>
                        <input type="checkbox" name='sale' 
                        className='w-5'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type="checkbox" name='rent' 
                        className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type="checkbox" name='parking' 
                        className='w-5'/>
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type="checkbox" name='furnished' 
                        className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type="checkbox" name='offer' 
                        className='w-5'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-3'>
                    <div className='flex items-center gap-2'>
                        <input type="number" defaultValue={0} id='bedrooms' name='bedrooms' required
                        className='w-24 bg-white p-3  rounded-lg border shadow-md'/>
                        <label htmlFor="bedrooms" className='cursor-pointer'>Beds</label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" defaultValue={0} id='bathrooms' name='bathrooms' required
                        className='w-24 bg-white p-3  rounded-lg border shadow-md'/>
                        <label htmlFor="bathrooms" className='cursor-pointer'>Baths</label>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                        <input type="number" defaultValue={0} id='regularPrice' name='regularPrice' required
                        className='w-32 bg-white p-3 rounded-lg border shadow-md'/>
                        <label htmlFor="regularPrice" className='cursor-pointer'>Regular Price</label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" defaultValue={0} id='regularPrice' name='regularPrice' required
                        className='w-32 bg-white p-3 rounded-lg border shadow-md'/>
                        <label htmlFor="regularPrice" className='cursor-pointer'>Discounted Price</label>
                    </div>
                </div>
            </div>

            <div className='mt-5 sm:mt-0 flex-[1] flex flex-col gap-4'>
                <p className='text-gray-500'>
                    <span className='font-bold text-black'>Images: </span>The first image will be the cover (max 6)
                </p>
                <div className='flex gap-2'>
                    <div className='border cursor-pointer hover:bg-gray-600 hover:text-white border-gray-400 rounded p-3'>
                        <label htmlFor="imageUrls" className='cursor-pointer flex items-center gap-2'>
                            <FaImages /> {images.length > 0 ? `${images.length} IMAGES SELECTED` : 'SELECT IMAGES'}
                        </label>
                        <input id='imageUrls' onChange={e => setImages(e.target.files)} hidden type="file" accept='image/*' multiple name='imageUrls' 
                        className='flex-[2] max-w-48' />
                    </div>
                    <button type='button' onClick={handleImageSubmit} className='hover:bg-orange-500 hover:text-white flex-[1] rounded border-orange-500 border p-3 text-orange-500'>
                        {loading ? 'UPLOADING...' : 'UPLOAD'}
                    </button>
                </div>
                {formBody.imageUrls.length > 0 && (
                <div className='grid grid-cols-3 gap-2'>
                    {formBody.imageUrls.map((image, index) => (
                        <div key={image} className='relative border border-black'>
                            <img src={image}
                            alt={`image${index}`}
                            className='h-20 w-32 object-contain' />
                            <div className='flex justify-center items-center absolute right-1 top-1 bg-white rounded-full w-6 h-6'>
                                <FaTrash onClick={
                                    () => handleRemoveImage(index)
                                } className='text-red-500 cursor-pointer'/>
                            </div>
                        </div>
                    ))}
                </div>
                )}
                <button className='hover:bg-orange-400 rounded p-3 text-white bg-orange-500'>
                    CREATE LISTING
                </button>
                <p className='text-red-700'>
                    {imageUploadError && imageUploadError}
                </p>
            </div>
        </form>
    </main>
  )
}

export default CreateListing
