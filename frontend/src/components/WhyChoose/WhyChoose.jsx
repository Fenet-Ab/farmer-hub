import React from 'react'
import { FaAward, FaTruck, FaShieldAlt, FaUsers, FaClock, FaHeadset } from 'react-icons/fa'

const WhyChoose = () => {
  const features = [
    {
      id: 1,
      icon: <FaAward className='text-5xl' />,
      title: 'Quality Products',
      description: 'Premium certified products sourced from trusted suppliers. Quality guaranteed for all your farming needs.',
      color: 'text-emerald-600'
    },
    {
      id: 2,
      icon: <FaTruck className='text-5xl' />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery service to your farm or doorstep. We ensure your products arrive on time.',
      color: 'text-lime-600'
    },
    {
      id: 3,
      icon: <FaShieldAlt className='text-5xl' />,
      title: 'Safe & Secure',
      description: '100% safe transactions and secure payment options. Your data and money are always protected & refund if not satisfied by our product.',
      color: 'text-emerald-600'
    },
    {
      id: 4,
      icon: <FaUsers className='text-5xl' />,
      title: 'Trusted by Thousands',
      description: 'Over 1000+ satisfied farmers trust our platform for all their agricultural needs.',
      color: 'text-lime-600'
    },
    {
      id: 5,
      icon: <FaClock className='text-5xl' />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support ready to assist you with any questions or concerns.',
      color: 'text-emerald-600'
    },
    {
      id: 6,
      icon: <FaHeadset className='text-5xl' />,
      title: 'Expert Guidance',
      description: 'Professional agricultural advice from experienced farmers to help maximize your yield.',
      color: 'text-lime-600'
    }
  ]

  return (
    <div className='w-full bg-gradient-to-br from-emerald-50 via-white to-lime-50 py-12 md:py-20'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Section Header */}
        <div className='text-center mb-12 md:mb-16'>
          <h2 className='text-4xl md:text-5xl font-extrabold mb-4'>
            <span className='bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent'>
              Why Choose Us
            </span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            We're committed to providing you with the best agricultural products and services
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
          {features.map((feature) => (
            <div
              key={feature.id}
              className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group border-2 border-transparent hover:border-emerald-200'
            >
              {/* Icon */}
              <div className={`mb-6 ${feature.color} flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className='text-xl font-bold text-gray-800 mb-3 text-center'>
                {feature.title}
              </h3>

              {/* Description */}
              <p className='text-gray-600 text-center leading-relaxed'>
                {feature.description}
              </p>

              {/* Decorative Element */}
              <div className='mt-6 flex justify-center'>
                <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${feature.color === 'text-emerald-600' ? 'from-emerald-500 to-lime-500' : 'from-lime-500 to-emerald-500'}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className='mt-12 md:mt-16 text-center'>
          <div className='w-full max-w-7xl mx-auto bg-gradient-to-r from-emerald-700 to-lime-400 rounded-2xl p-8 md:p-12 shadow-2xl'>
            <h3 className='text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4'>
              Join Our Growing Community
            </h3>
            <p className='text-white/90 mb-6 text-lg md:text-xl max-w-2xl mx-auto'>
              Experience the difference of premium agricultural products and services
            </p>
            <button className='bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-lg'>
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhyChoose