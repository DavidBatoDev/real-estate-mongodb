import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFormUrl = urlParams.get('searchTerm');
    if (searchTermFormUrl) {
      setSearchTerm(searchTermFormUrl);
    }
  }, [window.location.search]);

  return (
    <header className='bg-white shadow-md border-b-2 border-orange-500 sticky top-0 z-50'>
      <div className='flex items-center justify-between max-w-6xl mx-auto p-4'>
        <Link to="/">
          <h1 className='font-extrabold text-xl sm:text-2xl text-gray-900'>
            <span className='text-gray-900'>Davids</span>
            <span className='text-orange-500'>Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSearch}
          className='relative flex items-center border-2 border-gray-300 rounded-lg overflow-hidden'
        >
          <input
            type="text"
            placeholder='Search...'
            className='bg-transparent outline-none px-3 py-2 w-40 sm:w-64 text-gray-700'
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button type='submit' className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white'>
            <FaSearch />
          </button>
        </form>
        <div className='flex items-center gap-6'>
          <Link to="/" className='text-gray-700 hover:text-orange-500 hidden sm:inline'>
            Home
          </Link>
          <Link to="/about" className='text-gray-700 hover:text-orange-500 hidden sm:inline'>
            About
          </Link>
          <Link to={`${currentUser ? '/profile' : '/signin'}`}>
            {currentUser ? (
              <img
                className='rounded-full h-8 w-8 object-cover border-2 border-orange-500'
                src={currentUser?.avatar}
                alt="profile"
              />
            ) : (
              <button className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg'>
                Sign In
              </button>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
