import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const About = () => {
  return (
    <main className='bg-gray-50 text-gray-800'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-10'>
        <div className='max-w-6xl mx-auto text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>About Us</h1>
          <p className='text-lg md:text-xl'>
            Welcome to DavidsEstate, where your dream home awaits. We are dedicated to helping you find the perfect place to call home.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className='py-16 px-6'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-6'>Our Mission</h2>
          <p className='text-lg leading-relaxed text-gray-600'>
            At DavidsEstate, our mission is to simplify the process of finding and renting or buying property. We strive to provide a seamless and enjoyable experience for our users, whether they are looking for a cozy cottage by the lake or a modern penthouse in the city.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className='bg-white py-16 px-6'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>Meet Our Team</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
            {/* Team Member 1 */}
            <div className='bg-gray-100 rounded-lg shadow-lg p-6 text-center'>
              <img src='/img/team1.jpg' alt='Team Member 1' className='h-24 w-24 rounded-full mx-auto mb-4 object-cover' />
              <h3 className='text-xl font-semibold mb-2'>DavidDev</h3>
              <p className='text-gray-600 mb-4'>Founder & CEO</p>
              <div className='flex justify-center space-x-4'>
                <a href='#' className='text-blue-500 hover:text-blue-700'><FaTwitter size={20} /></a>
                <a href='#' className='text-blue-600 hover:text-blue-800'><FaLinkedin size={20} /></a>
                <a href='#' className='text-gray-900 hover:text-gray-700'><FaGithub size={20} /></a>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className='bg-gray-100 rounded-lg shadow-lg p-6 text-center'>
              <img src='/img/team2.jpg' alt='Team Member 2' className='h-24 w-24 rounded-full mx-auto mb-4 object-cover' />
              <h3 className='text-xl font-semibold mb-2'>EnriquezDev</h3>
              <p className='text-gray-600 mb-4'>Chief Operating Officer</p>
              <div className='flex justify-center space-x-4'>
                <a href='#' className='text-blue-500 hover:text-blue-700'><FaTwitter size={20} /></a>
                <a href='#' className='text-blue-600 hover:text-blue-800'><FaLinkedin size={20} /></a>
                <a href='#' className='text-gray-900 hover:text-gray-700'><FaGithub size={20} /></a>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className='bg-gray-100 rounded-lg shadow-lg p-6 text-center'>
              <img src='/img/team3.jpg' alt='Team Member 3' className='h-24 w-24 rounded-full mx-auto mb-4 object-cover' />
              <h3 className='text-xl font-semibold mb-2'>BatoDev</h3>
              <p className='text-gray-600 mb-4'>Chief Technology Officer</p>
              <div className='flex justify-center space-x-4'>
                <a href='#' className='text-blue-500 hover:text-blue-700'><FaTwitter size={20} /></a>
                <a href='#' className='text-blue-600 hover:text-blue-800'><FaLinkedin size={20} /></a>
                <a href='#' className='text-gray-900 hover:text-gray-700'><FaGithub size={20} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className='bg-orange-500 text-white py-16 px-6'>
        <div className='max-w-6xl mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-6'>Join Us on Our Journey</h2>
          <p className='text-lg leading-relaxed mb-6'>
            We are continuously growing and evolving to better serve you. Stay tuned for exciting new updates and features. Get in touch with us today to learn more!
          </p>
          <a href='/contact' className='bg-white text-orange-500 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition'>
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
};

export default About;
