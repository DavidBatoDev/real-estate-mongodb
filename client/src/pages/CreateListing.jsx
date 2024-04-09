import React from 'react'

const CreateListing = () => {
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
                    <div className='border border-gray-400 rounded p-3'>
                        <input type="file" accept='image/*' multiple name='imageUrls' 
                        className='flex-[2] max-w-48' />
                    </div>
                    <button className='flex-[1] rounded border-orange-500 border p-3 text-orange-500'>
                        UPLOAD
                    </button>
                </div>
                <button className='hover:bg-orange-400 rounded p-3 text-white bg-orange-500'>
                    CREATE LISTING
                </button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing
