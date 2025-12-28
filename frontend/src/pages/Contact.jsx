import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaLeaf,      // Replacing GiPottedPlant
  FaTruck      // Replacing GiTractor (optional, but cleaner)
} from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white pt-5">
      {/* --- Header Section --- */}
      <section className="bg-emerald-900 py-20 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {/* Using FaLeaf as a large background watermark */}
          <FaLeaf className="text-[20rem] absolute -bottom-10 -left-10 rotate-12" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Let's Grow Together</h1>
          <p className="text-emerald-100 text-lg md:text-xl font-medium">
            Have questions about our produce or need advice on fertilizers? Our agricultural experts are here to help.
          </p>
        </div>
      </section>

      {/* --- Main Contact Section --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid lg:grid-cols-5 gap-0">
          
          {/* Left Side: Info */}
          <div className="lg:col-span-2 bg-slate-900 p-10 md:p-16 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-8 text-emerald-500">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Call Us</p>
                    <p className="text-lg font-bold">+(251) 11567-5890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Email Us</p>
                    <p className="text-lg font-bold">support@limat.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Visit our Warehouse</p>
                    <p className="text-md font-bold text-slate-200 leading-tight">
                      123 Green Field Way, <br /> Agricultural Hub, State 54321
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-slate-800">
              <h4 className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <FaWhatsapp className="text-xl" /> Quick Support
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Farmers! Send us a photo of your crop on WhatsApp for instant fertilizer recommendations.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-3 p-10 md:p-16">
            <h3 className="text-3xl font-black text-slate-900 mb-2">Send us a Message</h3>
            <p className="text-slate-500 mb-10 font-medium">We usually respond within 24 hours.</p>
            
            <form className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-medium"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Inquiry Type</label>
                <div className="relative">
                  <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700">
                    <option>Buying Farm Produce</option>
                    <option>Fertilizer Advice</option>
                    <option>Pesticide Inquiry</option>
                    <option>Partnership/Supplying</option>
                    <option>General Question</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Your Message</label>
                <textarea 
                  rows="4"
                  placeholder="How can we help your farm or kitchen today?"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none placeholder:text-slate-300 font-medium"
                ></textarea>
              </div>

              <div className="md:col-span-2 pt-4">
                <button className="w-full md:w-auto bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Replaced GiPottedPlant with FaLeaf */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <FaLeaf className="text-3xl text-emerald-600" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Common Questions</h2>
          <div className="grid gap-6 text-left mt-12">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-900 text-lg">Do you deliver to remote farm locations?</h4>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed font-medium">
                Absolutely. We operate a fleet of all-terrain vehicles specifically for delivering fertilizers and pesticides to rural farm clusters.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-900 text-lg">Is your produce organic certified?</h4>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed font-medium">
                While not all produce is certified organic, we prioritize "Green Label" farmers who use sustainable, traditional farming methods without harsh chemicals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer CTA --- */}
      <footer className="py-16 text-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
          Ready to shop? <Link to="/products" className="text-emerald-600 hover:text-emerald-700 ml-2 transition-colors">Return to Store</Link>
        </p>
      </footer>
    </div>
  );
};

export default Contact;