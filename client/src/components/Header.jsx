import React, {useState, useEffect} from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Header = () => {
    const navigate = useNavigate()
    const {currentUser} = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFormUrl = urlParams.get('searchTerm');
        if (searchTermFormUrl) {
            setSearchTerm(searchTermFormUrl)
        }
    }, [window.location.search])
    
  return (
    <header className='bg-white shadow-md border-b-orange-400 border-2'>
        <div className='flex items-center justify-between max-w-6xl mx-auto p-3'>
            <Link to="/">
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-black'>Davids</span>
                    <span className='text-orange-400'>Estate</span>
                </h1>
            </Link>
            <form onSubmit={handleSearch} className='p-3 rounded-lg border-2 flex items-center'>
                <input 
                    type="text" 
                    placeholder='Search...'
                    className='bg-transparent outline-none w-32 sm:w-64' 
                    onChange={e => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
                <button type='submit'>
                    <FaSearch className='text-orange-400 cursor-pointer' />
                </button>
            </form>
            <div className='flex gap-4 items-center'>
                <Link to="/">
                    <button className='hover:text-orange-400 hidden sm:inline'>Home</button>
                </Link>
                <Link to="/about">
                    <button className='hover:text-orange-400 hidden sm:inline'>About</button>
                </Link>
                <Link to={`${currentUser ? '/profile' : '/signin'}`}>
                {currentUser ? (
                    <img 
                    className='rounded-full h-7 w-7 object-cover' 
                    src={currentUser?.avatar} alt="profile" />
                ) : 
                    <button className='bg-orange-400 hover:bg-orange-500 text-white p-2 rounded-lg'>Sign In</button>
                }
                </Link>
            </div>
        </div>
    </header>
  )
}

export default Header