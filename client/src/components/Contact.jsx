import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/users/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 max-w-lg w-full'>
        <h2 className='text-xl font-semibold mb-4'>Contact Landlord</h2>
        <p className='mb-4'>
          You are contacting <span className='font-bold'>{landlord?.username}</span> about{' '}
          <span className='font-bold'>{listing.name}</span>.
        </p>
        <textarea
          className='w-full h-32 p-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none mb-4'
          name='message'
          id='message'
          placeholder='Enter your message here...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div className='flex justify-end gap-4'>
          <button
            className='bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-all duration-200'
            onClick={() => setMessage('')}
          >
            Clear
          </button>
          <Link
            to={`mailto:${landlord?.email}?subject=About ${listing.name}&body=${message}`}
            className='bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-all duration-200'
          >
            Send Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
