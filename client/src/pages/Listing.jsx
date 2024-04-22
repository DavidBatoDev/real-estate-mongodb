import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import { 
    FaBath, 
    FaBed, 
    FaChair, 
    FaMapMarker, 
    FaParking
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

const Listing = () => {
    SwiperCore.use([Navigation])
    const {currentUser} = useSelector(state => state.user)
    const [contact, setContact] = useState(false)
    const [listing, setListing] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const {listingId} = useParams()
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${listingId}`)
                const data = await res.json()
                if (data.success === false) {
                    setLoading(false)
                    setError(true)
                    return
                }
                setListing(data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                setError(true)
            }
        }
        fetchListing()
    }, [listingId])

    return (
        <main>
            {loading && (
            <div className='flex justify-center'>
                <Box sx={{ display: 'hidfden', marginTop: '50px' ,height: 'max-content', width: 'max-content' }}>
                    <CircularProgress sx={{ display: 'hiddden', height:10, width: 10 }} />
                </Box>
            </div>
            )}
            {listing && !loading && !error && (
            <div>
                <Swiper navigation>
                    {listing.imageUrls && listing.imageUrls.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div className='h-[500px]' style={{
                            background: `url(${image}) center center no-repeat`,
                            backgroundSize: 'cover',
                        }} />
                    </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            )}
            {!loading && (
            <div className='flex flex-col max-w-4xl mx-auto p-3 my-3 gap-4'>
                <p className='flex-wrap text-2xl font-semibold'>
                    {listing.name}
                </p>
                <div className={`w-max relative mt-1`}>
                    <p className={`${!listing.offer && 'hidden'} 
                        text-lg absolute top-[-20px] right-6 text-gray-500 font-light line-through`}>
                            ${listing.regularPrice}
                    </p>
                    <p className='text-2xl font-semibold relative'>
                        $<span>{listing.offer ? listing.discountedPrice : listing.regularPrice}</span>
                        <span className='text-sm'>{listing.type === 'rent' ? '/month':''}</span> 
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <FaMapMarker className='text-orange-400' />
                    <p className='text-sm text-gray-600 font-bold'>
                        {listing.address}
                    </p>
                </div>
                <div className='flex gap-3'>
                    <div className={`bg-${listing.type === 'rent' ? 'orange':'red'}-500 text-white text-center p-1 rounded w-48`}>
                        For {listing.type === 'rent' ? 'Rent':'Sale'}
                    </div>
                    {listing.offer && (
                    <div className='bg-green-800 text-white text-center p-1 rounded w-48'>
                        Discounted
                    </div>
                    )}
                </div>
                <div className='w-full'>
                    <p className='text-lg font-semibold'>Description</p>
                    <p className='text-gray-500 whitespace-normal break-words w-full'>{listing.description}</p>
                </div>
                <div className='flex gap-4 flex-wrap'>
                    <div className='flex gap-2 items-center'>
                        <FaBed className='text-orange-400 text-xl' />
                        <span className='font-semibold'>{listing.bedrooms} Beds</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <FaBath className='text-orange-400 text-xl' />
                        <span className='font-semibold'>{listing.bathrooms} Baths</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <FaParking className='text-orange-400 text-xl' />
                        <span className='font-semibold'>{listing.parking ? "Parking" : "No Parking"}</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <FaChair className='text-orange-400 text-xl' />
                        <span className='font-semibold'>{listing.furnishing ? "Furnished" : "Unfurnished"}</span>
                    </div>
                </div>
                {currentUser && listing.userRef !== currentUser._id && !contact && (
                    <button onClick={() => setContact(true)} className='p-3 mt-5 bg-orange-500 text-red rounded text-white'>
                        Contact Landlord
                    </button>
                )}
                {contact && (<Contact listing={listing} />)}
            </div>
            )}
        </main>
    )
}

export default Listing
