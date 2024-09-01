import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarker, FaParking } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { listingId } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          setError(true);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchListing();
  }, [listingId]);

  return (
    <main>
      {loading && (
        <div className='flex justify-center items-center min-h-screen'>
          <CircularProgress />
        </div>
      )}
      {!loading && !error && listing && (
        <>
          <Swiper navigation className='h-[500px]'>
            {listing.imageUrls &&
              listing.imageUrls.map((image, index) => (
                <SwiperSlide key={index}>
                  <div
                    className='h-full w-full bg-cover bg-center rounded-xl shadow-lg'
                    style={{
                      backgroundImage: `url(${image})`,
                    }}
                  ></div>
                </SwiperSlide>
              ))}
          </Swiper>
          <div className='max-w-4xl mx-auto p-6 my-6 bg-white shadow-lg rounded-lg'>
            <h1 className='text-3xl font-bold mb-4 text-gray-800'>{listing.name}</h1>
            <div className='flex justify-between items-center mb-4'>
              <div className='text-gray-700'>
                <FaMapMarker className='inline-block text-orange-500 mr-2' />
                <span className='font-semibold'>{listing.address}</span>
              </div>
              <div className='flex gap-4'>
                {listing.offer && (
                  <div className='text-sm font-semibold text-gray-500 line-through'>
                    ${listing.regularPrice}
                  </div>
                )}
                <div className='text-3xl font-bold text-gray-800'>
                  ${listing.offer ? listing.discountedPrice : listing.regularPrice}
                  {listing.type === 'rent' && <span className='text-lg'>/month</span>}
                </div>
              </div>
            </div>
            <div className='flex gap-4 mb-4'>
              <span
                className={`inline-block py-2 px-4 rounded-full text-white text-sm font-semibold ${
                  listing.type === 'rent'
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                    : 'bg-gradient-to-r from-red-400 to-red-500'
                }`}
              >
                For {listing.type === 'rent' ? 'Rent' : 'Sale'}
              </span>
              {listing.offer && (
                <span className='inline-block py-2 px-4 rounded-full bg-green-500 text-white text-sm font-semibold'>
                  Discounted
                </span>
              )}
            </div>
            <div className='text-gray-600 mb-4'>
              <p className='text-lg font-semibold'>Description</p>
              <p className='leading-relaxed'>{listing.description}</p>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-800'>
              <div className='flex items-center'>
                <FaBed className='text-orange-500 text-2xl mr-2' />
                <span>{listing.bedrooms} Beds</span>
              </div>
              <div className='flex items-center'>
                <FaBath className='text-orange-500 text-2xl mr-2' />
                <span>{listing.bathrooms} Baths</span>
              </div>
              <div className='flex items-center'>
                <FaParking className='text-orange-500 text-2xl mr-2' />
                <span>{listing.parking ? 'Parking Available' : 'No Parking'}</span>
              </div>
              <div className='flex items-center'>
                <FaChair className='text-orange-500 text-2xl mr-2' />
                <span>{listing.furnishing ? 'Furnished' : 'Unfurnished'}</span>
              </div>
            </div>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='mt-6 py-3 px-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out'
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
