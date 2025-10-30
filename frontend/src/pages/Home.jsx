import React from 'react'
import Hero from '../components/Hero/Hero'
import Feature from '../components/Feature/Feature'
import WhyChoose from '../components/WhyChoose/WhyChoose'
import Navbar from '../components/navbar/Navbar'

const Home = () => {
  return (
    <div className='bg-gradient-to-br from-emerald-50 via-white to-lime-50'>
        
        <Hero/>
        <Feature/>
        <WhyChoose/>
    </div>
  )
}

export default Home