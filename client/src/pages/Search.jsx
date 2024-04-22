import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ListingItem from '../components/ListingItem'

const Search = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc'
    })
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    const [error, setError] = useState('')
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFormUrl = urlParams.get('searchTerm');
        const typeFormUrl = urlParams.get('type');
        const parkingFormUrl = urlParams.get('parking');
        const furnishedFormUrl = urlParams.get('furnished');
        const offerFormUrl = urlParams.get('offer');
        const sortFormUrl = urlParams.get('sort');
        const orderFormUrl = urlParams.get('order');
        if (
            searchTermFormUrl ||
            typeFormUrl ||
            parkingFormUrl ||
            furnishedFormUrl ||
            offerFormUrl ||
            sortFormUrl ||
            orderFormUrl
        ) {
            setFormData({
                searchTerm: searchTermFormUrl || '',
                type: typeFormUrl || 'all',
                parking: parkingFormUrl === 'true' ? true : false,
                furnished: furnishedFormUrl === 'true' ? true : false,
                offer: offerFormUrl === 'true' ? true : false, 
                sort: sortFormUrl || 'createdAt' ,
                order: orderFormUrl || 'desc'
            })
        }
        
        const fetchListings = async () => {
            setLoading(true)
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json()
            if (data.length > 8) {
                setShowMore(true)
            }
            if (data.success === false) {
                setError(data.message)
                setLoading(false)
                return
            }
            setListings(data)
            setLoading(false)
            setError('')
        }

        fetchListings()
    }, [window.location.search])

    const handleChange = (e) => {
        if (
          e.target.id === 'all' ||
          e.target.id === 'rent' ||
          e.target.id === 'sale'
        ) {
          setFormData({ ...formData, type: e.target.id });
        }
    
        if (e.target.id === 'searchTerm') {
            setFormData({ ...formData, searchTerm: e.target.value });
        }
    
        if (
          e.target.id === 'parking' ||
          e.target.id === 'furnished' ||
          e.target.id === 'offer'
        ) {
          setFormData({
            ...formData,
            [e.target.id]: e.target.checked,
          });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', formData.searchTerm);
        urlParams.set('type', formData.type);
        urlParams.set('parking', formData.parking);
        urlParams.set('furnished', formData.furnished);
        urlParams.set('offer', formData.offer);
        urlParams.set('sort', formData.sort);
        urlParams.set('order', formData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length
        const startIndex = numberOfListings
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString()
        console.log(searchQuery)
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json()
        if (data.length < 9) {
            setShowMore(false)
        }
        setListings([...listings, ...data])
    }
    
    console.log(listings)

  return (
    <div className='flex flex-col md:flex-row'>
      <div className="p-7 border-b-2 md:border-r-2 md:h-screen">
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap'>Searh Term:</label>
                <input 
                    type="text" 
                    id='searchTerm' 
                    placeholder='Search Term...'
                    className='border rounded-lg p-3 w-full'
                    value={formData.searchTerm}
                    onChange={handleChange}
                />
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label>Type: </label>
                <div className='flex gap-2'>
                    <input 
                        type="checkbox" 
                        id='all'
                        className='w-5'
                        checked={formData.type === 'all'}
                        onChange={handleChange}/>
                    <span>Rent & Sale</span>
                </div>
                <div className='flex gap-2'>
                    <input 
                        type="checkbox" 
                        id='rent'
                        checked={formData.type === 'rent'}
                        onChange={handleChange}
                        className='w-5'/>
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input 
                        type="checkbox" 
                        id='sale'
                        checked={formData.type === 'sale'}
                        onChange={handleChange}
                        className='w-5'/>
                    <span>Sale</span>
                </div>
                <div className='flex gap-2'>
                    <input 
                        type="checkbox" 
                        id='offer'
                        checked={formData.offer}
                        onChange={handleChange}
                        className='w-5'/>
                    <span>Offer</span>
                </div>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label>Amenities: </label>
                <div className='flex gap-2'>
                    <input 
                        type="checkbox" 
                        id='parking'
                        checked={formData.parking}
                        onChange={handleChange}
                        className='w-5'/>
                    <span>Parking</span>
                </div>
                <div className='flex gap-2'>
                    <input 
                        type="checkbox" 
                        id='furnished'
                        checked={formData.furnished}
                        onChange={handleChange}
                        className='w-5'/>
                    <span>Furnished</span>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <label>Sort: </label>
                <select
                    defaultValue={formData.sort + '_' + formData.order}
                    onChange={handleChange}
                    className='p-2 border rounded-lg' 
                    id="sort_order">
                    <option value={'regularPrice_desc'}>Price high to low</option>
                    <option value={'regularPrice_asc'}>Price low to high</option>
                    <option value={'createdAt_desc'}>Most recent</option>
                    <option value={'createdAt_asc'}>Least recent</option>
                </select>
            </div>
            <button type='submit' className='bg-orange-500 p-3 text-white rounded-lg font-semibold hover:bg-orange-600'>Search</button>
        </form>
      </div>

      <div className="flex-1">
      <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-7 pb-3 flex flex-col flex-wrap gap-3 sm:flex-row'>
            {!loading && !error && listings.length === 0 && (
                <p className='text-xl text-center font-semibold text-slate-700'>No listing found!</p>
            )}
            {loading && (
                <div className='flex justify-center'>
                    <Box sx={{ display: 'hidden', marginTop: '50px' ,height: 'max-content', width: 'max-content' }}>
                        <CircularProgress sx={{ display: 'hiddden', height:10, width: 10 }} />
                    </Box>
                </div>
            )}
            {!loading &&
                listings &&
                listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
            {showMore && (
                <button onClick={onShowMoreClick} className='pl-10 pb-4 text-orange-500 underline font-semibold hover:text-orange-400'>
                    Show More
                </button>
            )}
        {error && <p className='text-center text-2xl mt-20 font-semibold text-red-500'>{error}</p>}
      </div>
    </div>
  )
}

export default Search
