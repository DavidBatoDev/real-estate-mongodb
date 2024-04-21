import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Contact = ({ listing }) => {
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')

    console.log(listing.userRef)

    useEffect(() =>  {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/users/${listing.userRef}`)
                const data = await res.json()
                if (data.success === false) {
                    return
                }
                console.log(data)
                setLandlord(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchLandlord()
    }, [listing.userRef])

    console.log(landlord)

    return (
        <div className='flex flex-col gap-2'>
            <p>
                Contact: <span className='font-semibold'>{landlord?.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span>
            </p>
            <textarea 
            className='w-full h-28 border-3 p-3 shadow-md min-h-20 rounded'
            name="message" 
            id="message" 
            cols="30" 
            rows="10"
            placeholder='Enter your message here...'
            value={message} 
            onChange={(e) => setMessage(e.target.value)}>   
            </textarea>

            <Link 
                to={`mailto:${landlord?.email}?subject=About ${listing.name}&body=${message}`}
                className='bg-slate-700 text-white p-3 rounded text-center'>
            Send Message
            </Link>
        </div>
    )
}

export default Contact
