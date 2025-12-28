import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaLeaf, FaSeedling, FaProductHunt, FaDropbox, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import homeImage from '../../assets/home.png'
import fertilizerImage from '../../assets/fertilizer.png'
import pesticideImage from '../../assets/pesticide.png'
import tomatoImage from '../../assets/tomato.png'

const Hero = () => {
  // Images array for carousel
  const images = [
    { src: homeImage, alt: 'Farm Products' },
    { src: fertilizerImage, alt: 'Fertilizers' },
    { src: pesticideImage, alt: 'Pesticides' },
    { src: tomatoImage, alt: 'Fresh Vegetables' }
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  // Navigate to previous image
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  // Navigate to next image
  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  // Go to specific image
  const goToSlide = (index) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className='w-full bg-gradient-to-br from-emerald-50 via-white to-lime-50'>
      <div className='max-w-7xl mx-auto px-6 py-12 md:py-20'>
        <div className='grid md:grid-cols-2 gap-8 items-center'>
          {/* Left Side - Content */}
          <div className='space-y-6 animate-fadeIn'>
           
            

            {/* Main Heading */}
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight'>
              <span className='bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent'>
                Connecting Farmers and User
              </span>
              <br />
              <span className='text-gray-800'>with Quality Products</span>
            </h1>

            {/* Description */}
            <p className='text-gray-600 text-2xl md:text-xl leading-relaxed'>
              Discover premium fertilizers, pesticides, and fresh farm products all in one place. 
              Empowering farmers with the tools they need to grow healthy, abundant crops.
            </p>

            {/* Features */}
            <div className='grid grid-cols-2 gap-4 py-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-emerald-100 rounded-lg'>
                  <FaDropbox className='text-emerald-600 text-xl' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800'>Fertilizers</h3>
                  <p className='text-sm text-gray-600'>Premium quality</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-lime-100 rounded-lg'>
                  <FaLeaf className='text-lime-600 text-xl' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800'>Pesticides</h3>
                  <p className='text-sm text-gray-600'>Safe & effective</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-lime-100 rounded-lg'>
                  <FaProductHunt className='text-lime-600 text-xl' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800'>Farm Product</h3>
                  <p className='text-sm text-gray-600'>Fresh $ Quality</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
  {/* Shop Now -> Products Page */}
  <Link to="/products" className="w-full sm:w-auto">
    <button className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-lime-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200'>
      <FaShoppingCart />
      Shop Now
    </button>
  </Link>

  {/* Learn More -> About Page */}
  <Link to="/about" className="w-full sm:w-auto">
    <button className='w-full flex items-center justify-center gap-2 bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-emerald-50 active:scale-95 transition-all duration-200'>
      Learn More
    </button>
  </Link>
</div>

            {/* Stats */}
            
          </div>

          {/* Right Side - Image Carousel */}
          <div className='relative animate-fadeIn'>
            {/* Decorative Elements */}
            <div className='absolute -top-6 -right-6 w-32 h-32 bg-emerald-200 rounded-full opacity-30 blur-3xl'></div>
            <div className='absolute -bottom-6 -left-6 w-40 h-40 bg-lime-200 rounded-full opacity-30 blur-3xl'></div>
            
            {/* Main Image with Slider */}
            <div className='relative z-10'>
              {/* Image Container */}
              <div className='relative overflow-hidden rounded-3xl shadow-xl h-[500px] md:h-[600px]'>
                <img 
                  src={images[currentImageIndex].src} 
                  alt={images[currentImageIndex].alt} 
                  className='w-full h-full object-cover transition-opacity duration-500'
                  key={currentImageIndex}
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110'
                  aria-label='Previous image'
                >
                  <FaChevronLeft className='text-emerald-600' />
                </button>
                <button
                  onClick={goToNext}
                  className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110'
                  aria-label='Next image'
                >
                  <FaChevronRight className='text-emerald-600' />
                </button>

                {/* Dots Indicator */}
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl px-6 py-3 flex items-center gap-3'>
                <div className='p-2 bg-emerald-100 rounded-lg'>
                  <FaSeedling className='text-emerald-600' />
                </div>
                <div>
                  <p className='font-semibold text-gray-800'>Fresh Products</p>
                  <p className='text-xs text-gray-600'>100% Organic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section - Full Width, Centered */}
        <div className='w-full'>
          {/* Section Heading */}
          <div className='flex justify-center mb-6 md:mb-8 pt-8 md:pt-12 mt-8'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-center'>
              <span className='bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent'>
                On Our Platform We Have
              </span>
            </h1>
          </div>
          
          {/* Stats Cards */}
          <div className='flex justify-center items-center gap-6 md:gap-12 lg:gap-20 flex-wrap pb-8'>
            
          <div className='border border-green-400 px-8 md:px-12 py-6 md:py-8 rounded-xl bg-green-50 text-center'>
            <h3 className='text-3xl font-bold text-emerald-600'>500+</h3>
            <p className='text-sm text-gray-600'>Products</p>
          </div>
          <div className='border border-green-400 px-8 md:px-12 py-6 md:py-8 rounded-xl bg-green-50 text-center'>
            <h3 className='text-3xl font-bold text-lime-600'>1000+</h3>
            <p className='text-sm text-gray-600'>Happy Farmers</p>
          </div>
          <div className='border border-green-400 px-8 md:px-12 py-6 md:py-8 rounded-xl bg-green-50 text-center'>
            <h3 className='text-3xl font-bold text-emerald-600'>95%</h3>
            <p className='text-sm text-gray-600'>Satisfaction Rate</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Hero