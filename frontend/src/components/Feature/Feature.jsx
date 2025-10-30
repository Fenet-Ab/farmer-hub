import React from 'react'
import { Link } from 'react-router-dom'


// Import images
import fertilizerImg from '../../assets/fertilizer.png'
import pesticideImg from '../../assets/pesticide.png'
import coffeeImg from '../../assets/coffee.png'
import tomatoImg from '../../assets/tomato.png'

const Feature = () => {
  const features = [
    {
      id: 1,
      title: 'Fertilizers',
      description: 'Premium quality fertilizers to boost your crop growth and maximize yield. From organic to synthetic options.',
      
      image: fertilizerImg,
      link: '/products?category=fertilizers'
    },
    {
      id: 2,
      title: 'Pesticides',
      description: 'Safe and effective pesticides to protect your crops from pests and diseases. Certified and environmentally friendly.',
      
      image: pesticideImg,
      link: '/products?category=pesticides'
    },
    {
      id: 3,
      title: 'Fresh Farm Products',
      description: 'Directly sourced from local farmers. Fresh vegetables, fruits, and grains delivered to your doorstep.',
    
      image: tomatoImg,
      link: '/products?category=farm-products'
    },
    {
      id: 4,
      title: 'Premium Coffee',
      description: 'Exquisite Ethiopian coffee beans. Premium quality, freshly roasted for the perfect cup every time.',
      
      image: coffeeImg,
      link: '/products?category=coffee'
    }
  ]

  return (
    <div className='w-full bg-white py-12 md:py-20'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-extrabold mb-4'>
            <span className='bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent'>
              What We Offer
            </span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Everything you need for successful farming and fresh products at your fingertips
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 '>
          {features.map((feature) => (
            <div
              key={feature.id}
              className='bg-white border-2 border-gray-200 rounded-xl overflow-hidden  hover:shadow-2xl transition-all duration-300 hover:scale-105 group'
            >
              {/* Image at the top */}
              <div className='relative h-48 bg-gradient-to-br from-emerald-50 to-lime-50 overflow-hidden'>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                />
                {/* Icon overlay */}
                {/* <div className='absolute top-4 left-4 bg-white/90 p-3 rounded-xl shadow-lg'>
                  {feature.icon}
                </div> */}
              </div>

              {/* Content */}
              <div className='p-6 flex flex-col h-[calc(100%-192px)]'>
                {/* Title */}
                <h3 className='text-xl font-bold text-gray-800 mb-3'>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className='text-gray-600 text-sm mb-4 flex-grow leading-relaxed'>
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <Link
                  to={feature.link}
                  className='mt-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-lime-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200'
                >
                  Learn More
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 7l5 5m0 0l-5 5m5-5H6'
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Feature