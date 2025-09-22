import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/Core/InputError';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactUs() {
  const { data, setData, post, processing, errors, reset } = useForm<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    post(route('contact.submit'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <GuestLayout>
      <Head title="Contact Us" />

      {/* Breadcrumb start */}
      <div className="gi-breadcrumb mb-[40px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-[12px]">
              <div className="flex flex-wrap m-0 p-[15px] border-[1px] border-solid border-[#eee] rounded-b-[5px] border-t-[0] gi_breadcrumb_inner">
                <div className="min-[768px]:w-[50%] w-full px-[12px]">
                  <h2 className="gi-breadcrumb-title text-[#4b5966] block text-[15px] font-Poppins leading-[22px] font-semibold my-[0] mx-auto capitalize max-[767px]:mb-[5px] max-[767px]:text-center">Contact Us</h2>
                </div>
                <div className="min-[768px]:w-[50%] w-full px-[12px]">
                  {/* gi-breadcrumb-list start */}
                  <ul className="gi-breadcrumb-list text-right max-[767px]:text-center">
                    <li className="gi-breadcrumb-item inline-block text-[14px] font-normal tracking-[0.02rem] leading-[1.2] capitalize"><Link href="/" className="relative text-[#4b5966]">Home</Link></li>
                    <li className="gi-breadcrumb-item inline-block text-[14px] font-normal tracking-[0.02rem] leading-[1.2] capitalize active">Contact Us</li>
                  </ul>
                  {/* gi-breadcrumb-list end */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb end */}

      {/* Contact section */}
      <section className="gi-contact-section py-[40px] max-[767px]:py-[30px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="section-title-2 w-full mb-[20px] pb-[20px] flex flex-col justify-center items-center">
            <h2 className="gi-title mb-[0] font-manrope text-[26px] font-semibold text-[#4b5966] relative inline p-[0] capitalize leading-[1]">Get In <span className="text-[#5caf90]">Touch</span></h2>
            <p className="max-w-[400px] mt-[15px] text-[14px] text-[#777] text-center leading-[23px]">
              We'd love to hear from you! Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="flex flex-wrap w-full">
            {/* Contact Information */}
            <div className="min-[992px]:w-[33.33%] min-[768px]:w-[50%] w-full px-[12px]">
              <div className="gi-contact-info mb-[30px]">
                <div className="gi-contact-info-item mb-[20px] pb-[20px] border-b-[1px] border-solid border-[#eee]">
                  <h4 className="text-[18px] font-medium text-[#4b5966] mb-[10px]">Contact Info</h4>
                  <ul className="p-0 m-0 list-none">
                    <li className="flex items-start mb-[10px]">
                      <i className="fi-ts-marker mr-[10px] text-[#5caf90] mt-[3px]"></i>
                      <p className="text-[14px] text-[#777] m-0">123 Main Street, Anytown, CA 12345</p>
                    </li>
                    <li className="flex items-start mb-[10px]">
                      <i className="fi-ts-phone-call mr-[10px] text-[#5caf90] mt-[3px]"></i>
                      <p className="text-[14px] text-[#777] m-0">+1 (555) 123-4567</p>
                    </li>
                    <li className="flex items-start mb-[10px]">
                      <i className="fi-ts-envelope mr-[10px] text-[#5caf90] mt-[3px]"></i>
                      <p className="text-[14px] text-[#777] m-0">info@grabit.com</p>
                    </li>
                  </ul>
                </div>
                <div className="gi-contact-info-item">
                  <h4 className="text-[18px] font-medium text-[#4b5966] mb-[10px]">Follow Us</h4>
                  <ul className="gi-social flex p-0 m-0 list-none">
                    <li className="mr-[10px]"><a href="#" className="w-[35px] h-[35px] flex items-center justify-center bg-[#f8f8fb] rounded-[5px] text-[#777] hover:bg-[#5caf90] hover:text-white transition-all duration-300"><i className="fi-brands-facebook"></i></a></li>
                    <li className="mr-[10px]"><a href="#" className="w-[35px] h-[35px] flex items-center justify-center bg-[#f8f8fb] rounded-[5px] text-[#777] hover:bg-[#5caf90] hover:text-white transition-all duration-300"><i className="fi-brands-twitter"></i></a></li>
                    <li className="mr-[10px]"><a href="#" className="w-[35px] h-[35px] flex items-center justify-center bg-[#f8f8fb] rounded-[5px] text-[#777] hover:bg-[#5caf90] hover:text-white transition-all duration-300"><i className="fi-brands-instagram"></i></a></li>
                    <li className="mr-[10px]"><a href="#" className="w-[35px] h-[35px] flex items-center justify-center bg-[#f8f8fb] rounded-[5px] text-[#777] hover:bg-[#5caf90] hover:text-white transition-all duration-300"><i className="fi-brands-youtube"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="min-[992px]:w-[66.67%] min-[768px]:w-[50%] w-full px-[12px]">
              <div className="gi-contact-form p-[30px] border-[1px] border-solid border-[#eee] rounded-[5px]">
                <h4 className="text-[18px] font-medium text-[#4b5966] mb-[20px]">Send Message</h4>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-wrap -mx-[12px]">
                    <div className="min-[768px]:w-[50%] w-full px-[12px] mb-[20px]">
                      <input 
                        type="text" 
                        placeholder="Your Name *" 
                        className="w-full h-[45px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[14px] text-[#777] focus:outline-none focus:border-[#5caf90]" 
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                      />
                      <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="min-[768px]:w-[50%] w-full px-[12px] mb-[20px]">
                      <input 
                        type="email" 
                        placeholder="Your Email *" 
                        className="w-full h-[45px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[14px] text-[#777] focus:outline-none focus:border-[#5caf90]" 
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                      />
                      <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div className="min-[768px]:w-[50%] w-full px-[12px] mb-[20px]">
                      <input 
                        type="tel" 
                        placeholder="Your Phone" 
                        className="w-full h-[45px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[14px] text-[#777] focus:outline-none focus:border-[#5caf90]" 
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                      />
                      <InputError message={errors.phone} className="mt-2" />
                    </div>
                    <div className="min-[768px]:w-[50%] w-full px-[12px] mb-[20px]">
                      <input 
                        type="text" 
                        placeholder="Subject" 
                        className="w-full h-[45px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[14px] text-[#777] focus:outline-none focus:border-[#5caf90]" 
                        value={data.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                      />
                      <InputError message={errors.subject} className="mt-2" />
                    </div>
                    <div className="w-full px-[12px] mb-[20px]">
                      <textarea 
                        placeholder="Your Message *" 
                        className="w-full h-[120px] p-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[14px] text-[#777] focus:outline-none focus:border-[#5caf90] resize-none" 
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        required
                      ></textarea>
                      <InputError message={errors.message} className="mt-2" />
                    </div>
                    <div className="w-full px-[12px]">
                      <button 
                        type="submit" 
                        className="bg-[#5caf90] text-white py-[10px] px-[30px] rounded-[5px] text-[14px] font-medium transition-all duration-300 hover:bg-[#4a9a7d] disabled:opacity-70"
                        disabled={processing}
                      >
                        {processing ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact section End */}

      {/* Map Section */}
      <section className="gi-map-section py-[40px] max-[767px]:py-[30px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="w-full px-[12px]">
            <div className="gi-map-wrapper h-[400px] border-[1px] border-solid border-[#eee] rounded-[5px] overflow-hidden">
              {/* Replace with actual map component or iframe */}
              <div className="w-full h-full bg-[#f8f8fb] flex items-center justify-center">
                <p className="text-[16px] text-[#777]">Map will be displayed here</p>
                {/* You can integrate Google Maps or other map services here */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Map Section End */}
    </GuestLayout>
  );
}