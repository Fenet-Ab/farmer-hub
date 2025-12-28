import React from 'react';
import { GiWheat, GiPlantRoots, GiChemicalDrop, GiGreenhouse } from 'react-icons/gi';
import { FaHandshake, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const About = () => {
  return (
    <div className="min-h-screen bg-white font-poppins pt-5">
      {/* --- Hero Section --- */}
      <section className="relative py-20 bg-[#f8fafc] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
              Cultivating the Future of <span className="text-emerald-600">Agriculture.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed italic">
              "Connecting quality harvests with modern farming solutions. We empower farmers and nourish communities."
            </p>
          </div>
        </div>
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
      </section>

      {/* --- Our Mission & Vision --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000" 
                alt="Green Field" 
                className="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white p-8 rounded-3xl shadow-xl hidden md:block">
                <p className="text-4xl font-black">10k+</p>
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Farmers Supported</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] mb-3">Our Core Story</h2>
                <h3 className="text-3xl font-bold text-slate-900">Empowering the Backbone of Our Nation</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Founded with a vision to bridge the gap between rural excellence and urban demand, 
                  <strong> LIMAT</strong> serves as a comprehensive ecosystem for the agricultural community. 
                  We don't just sell products; we provide the tools for growth.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <FaHandshake className="text-emerald-600 text-2xl mb-3" />
                  <h4 className="font-bold text-slate-900">Direct Sourcing</h4>
                  <p className="text-sm text-slate-500 mt-2">Fresh produce straight from the farm to your table, ensuring maximum profit for growers.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <FaShieldAlt className="text-emerald-600 text-2xl mb-3" />
                  <h4 className="font-bold text-slate-900">Quality Inputs</h4>
                  <p className="text-sm text-slate-500 mt-2">Certified fertilizers and pesticides that protect crops and enhance yield safely.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- What We Offer (The Pillars) --- */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black">Everything a Farm Needs</h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Pillar 1 */}
            <div className="group p-8 rounded-[2rem] bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-all">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GiPlantRoots className="text-emerald-500 text-3xl" />
              </div>
              <h4 className="text-xl font-bold mb-4">Farmer Produce</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                From organic grains to fresh vegetables, we provide a marketplace for farmers to sell their harvests at fair market prices.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group p-8 rounded-[2rem] bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-all">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GiChemicalDrop className="text-emerald-500 text-3xl" />
              </div>
              <h4 className="text-xl font-bold mb-4">Certified Pesticides</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Eco-friendly and effective crop protection solutions to keep harvests healthy and free from destructive pests.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group p-8 rounded-[2rem] bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-all">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GiWheat className="text-emerald-500 text-3xl" />
              </div>
              <h4 className="text-xl font-bold mb-4">Premium Fertilizers</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nutrient-rich soil enhancers designed to revitalize land and maximize crop potential for a sustainable future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Why Choose Us --- */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-50 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <FaLeaf className="absolute -top-10 -right-10 text-emerald-100 text-[15rem] rotate-12" />
            
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 relative z-10">
              Join Us in Growing a Sustainable World
            </h2>
            <p className="text-slate-600 mb-10 max-w-2xl mx-auto relative z-10 italic">
              Whether you are a consumer looking for healthy food or a farmer looking for the best industrial inputs, 
              LIMAT is your trusted partner.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
           
  <Link to="/products">
    <button className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-200">
      Browse Products
    </button>
  </Link>
  
  <Link to="/contact">
    <button className="bg-white text-slate-900 border border-slate-200 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
      Contact Support
    </button>
  </Link>

            </div>
          </div>
        </div>
      </section>

      {/* --- Values Footer --- */}
      <footer className="pb-16 text-center">
        <div className="flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           <GiGreenhouse size={40} />
           <GiPlantRoots size={40} />
           <GiWheat size={40} />
        </div>
        <p className="text-xs font-bold text-slate-400 mt-6 uppercase tracking-widest">Est. 2024 • Limat Agricultural Solutions</p>
      </footer>
    </div>
  );
};

export default About;