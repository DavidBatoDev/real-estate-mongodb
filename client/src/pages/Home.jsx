import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className='bg-gray-50'>
      {/* Hero Section */}
      <div className='flex flex-col gap-4 md:gap-6 py-16 px-4 md:px-8 max-w-6xl mx-auto text-center'>
        <h1 className='text-gray-800 font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight animate-fadeIn'>
          Your Dream <span className='text-orange-500'>Home</span> Awaits
        </h1>
        <h2 className='text-gray-600 font-medium text-2xl md:text-3xl lg:text-4xl animate-fadeIn delay-150'>
          Discover It With Us
        </h2>
        <p className='text-gray-500 text-base md:text-lg animate-fadeIn delay-300'>
          From stunning cityscapes to serene countryside retreats,
          <br />
          Davids Estate has the perfect property for your next chapter.
        </p>
        <Link
          to={'/search'}
          className='text-sm md:text-base text-orange-500 font-bold hover:underline animate-fadeIn delay-450'
        >
          Explore Now &rarr;
        </Link>
      </div>

      {/* Swiper Section */}
      <Swiper navigation className='my-8'>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-64 md:h-[500px] rounded-lg shadow-lg animate-zoomIn'
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing Sections */}
      <div className='max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10'>
        {offerListings && offerListings.length > 0 && (
          <div className='animate-slideIn'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-semibold text-gray-700'>Hot Deals Just For You</h2>
              <Link
                className='text-sm text-orange-500 hover:underline'
                to={'/search?offer=true'}
              >
                View All Offers &rarr;
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className='animate-slideIn delay-200'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-semibold text-gray-700'>Top Rental Picks</h2>
              <Link
                className='text-sm text-orange-500 hover:underline'
                to={'/search?type=rent'}
              >
                See More Rentals &rarr;
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className='animate-slideIn delay-400'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-semibold text-gray-700'>Exclusive Homes for Sale</h2>
              <Link
                className='text-sm text-orange-500 hover:underline'
                to={'/search?type=sale'}
              >
                Browse All Sales &rarr;
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
