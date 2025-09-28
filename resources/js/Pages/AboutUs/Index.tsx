import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { FaTruck, FaSeedling, FaPercent, FaDonate } from 'react-icons/fa';

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function AboutUs() {
  // Mock data for services
  const services: ServiceItem[] = [
    { 
      id: 1, 
      title: 'Free Shipping', 
      description: 'Free shipping on all US order or order above $200', 
      icon: 'FaTruck' 
    },
    { 
      id: 2, 
      title: '24X7 Support', 
      description: 'Contact us 24 hours a day, 7 days a week', 
      icon: 'FaSeedling' 
    },
    { 
      id: 3, 
      title: '30 Days Return', 
      description: 'Simply return it within 30 days for an exchange', 
      icon: 'FaPercent' 
    },
    { 
      id: 4, 
      title: 'Payment Secure', 
      description: 'Contact us 24 hours a day, 7 days a week', 
      icon: 'FaDonate' 
    },
  ];

  const iconMap = (iconName: string) => {
    switch (iconName) {
      case 'FaTruck':
        return <FaTruck className="text-[40px] text-[#5caf90] leading-[0]" />;
      case 'FaSeedling':
        return <FaSeedling className="text-[40px] text-[#5caf90] leading-[0]" />;
      case 'FaPercent':
        return <FaPercent className="text-[40px] text-[#5caf90] leading-[0]" />;
      case 'FaDonate':
        return <FaDonate className="text-[40px] text-[#5caf90] leading-[0]" />;
      default:
        return null;
    }
  };

  return (
    <GuestLayout>
      <Head title="About Us" />

      {/* Breadcrumb start */}
      <div className="gi-breadcrumb mb-[40px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-[12px]">
              <div className="flex flex-wrap m-0 p-[15px] border-[1px] border-solid border-[#eee] rounded-b-[5px] border-t-[0] gi_breadcrumb_inner">
                <div className="min-[768px]:w-[50%] w-full px-[12px]">
                  <h2 className="gi-breadcrumb-title text-[#4b5966] block text-[15px] font-Poppins leading-[22px] font-semibold my-[0] mx-auto capitalize max-[767px]:mb-[5px] max-[767px]:text-center">About Us</h2>
                </div>
                <div className="min-[768px]:w-[50%] w-full px-[12px]">
                  {/* gi-breadcrumb-list start */}
                  <ul className="gi-breadcrumb-list text-right max-[767px]:text-center">
                    <li className="gi-breadcrumb-item inline-block text-[14px] font-normal tracking-[0.02rem] leading-[1.2] capitalize"><Link href="/" className="relative text-[#4b5966]">Home</Link></li>
                    <li className="gi-breadcrumb-item inline-block text-[14px] font-normal tracking-[0.02rem] leading-[1.2] capitalize active">About Us</li>
                  </ul>
                  {/* gi-breadcrumb-list end */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb end */}

      {/* About section */}
      <section className="gi-about py-[40px] max-[767px]:py-[30px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="flex flex-wrap">
            <div className="min-[1200px]:w-[50%] min-[768px]:w-full px-[12px]">
              <div className="gi-about-img">
                <img src="/assets/img/common/about.png" className="v-img w-full rounded-[5px] max-[1199px]:max-w-[600px] max-[199px]:mb-[30px]" alt="about" />
              </div>
            </div>
            <div className="min-[1200px]:w-[50%] min-[768px]:w-full px-[12px]">
              <div className="gi-about-detail h-full flex flex-col justify-center max-[1199px]:mt-[30px]">
                <div className="section-title pt-[0] flex flex-col mb-[20px]">
                  <h2 className="mb-[15px] font-manrope text-[26px] font-semibold text-[#4b5966] relative inline p-[0] capitalize leading-[1]">Who We <span className="text-[#5caf90]">Are?</span></h2>
                  <p className="m-0 text-[#777] text-[18px] font-medium uppercase max-[991px]:text-[17px] max-[767px]:text-[16px] max-[575px]:text-[15px]">
                    We're here to serve only the best products for you. Enriching your homes with the best essentials.
                  </p>
                </div>
                <p className="text-[#777] text-[14px] font-normal mb-[16px]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                  been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book. It has survived not only five
                  centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                </p>
                <p className="text-[#777] text-[14px] font-normal mb-[16px]">
                  Lorem Ipsum has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged.
                </p>
                <p className="text-[#777] text-[14px] font-normal mb-[16px]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                  been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About section End */}

      {/* Service Section */}
      <section className="gi-service-section py-[40px] max-[767px]:py-[30px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="section-title-2 w-full mb-[20px] pb-[20px] flex flex-col justify-center items-center">
            <h2 className="gi-title mb-[0] font-manrope text-[26px] font-semibold text-[#4b5966] relative inline p-[0] capitalize leading-[1]">Our <span className="text-[#5caf90]">Services</span></h2>
            <p className="max-w-[400px] mt-[15px] text-[14px] text-[#777] text-center leading-[23px]">
              Customer service should not be a department. It should be the entire company.
            </p>
          </div>
          <div className="flex flex-wrap w-full my-[-12px]">
            {services.map((service) => (
              <div key={service.id} className="py-[12px] px-[12px] min-[992px]:w-[25%] min-[576px]:w-[50%] w-full">
                <div className="gi-ser-inner p-[30px] transition-all duration-[0.3s] ease delay-[0s] cursor-pointer border-[1px] border-solid border-[#eee] h-full flex items-center justify-center flex-col text-center nh-[#fff] rounded-[5px]">
                  <div className="gi-service-image mb-[15px]">
                    {iconMap(service.icon)}
                  </div>
                  <div className="gi-service-desc">
                    <h3 className="mb-[10px] text-[18px] font-medium text-[#4b5966] tracking-[0.6px] font-Poppins leading-[1.2] max-[575px]:text-[16px]">{service.title}</h3>
                    <p className="m-[0] text-[14px] text-[#777] leading-[1.5] tracking-[0.5px] font-light">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Service Section End */}

      {/* Testimonials Section */}
      <section className="gi-testimonials-section py-[40px] max-[767px]:py-[30px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-[12px]">
              <h3 className="hidden">Testimonials</h3>
              <div className="testim-bg py-[80px] max-[575px]:py-[60px] bg-[#f8f8fb] border-[1px] border-solid border-[#eee] rounded-[5px]">
                <div className="gi-test-outer gi-test-section max-w-[700px] m-auto flex justify-center items-center relative">
                  <div className="gi-test-item my-[0] mx-auto py-[0] px-[15px] relative">
                    <div className="gi-test-inner max-w-[730px] my-[0] mx-auto cursor-pointer">
                      <div className="gi-test-img w-[100px] mx-auto mt-auto mb-[30px] block">
                        <img alt="testimonial" title="testimonial" src="/assets/img/user/1.jpg" className="rounded-[50%]" />
                      </div>
                      <div className="gi-test-content flex flex-col">
                        <p className="gi-test-desc text-[16px] text-[#777] text-center leading-[26px] mb-[20px] font-normal">
                          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                        </p>
                        <div className="gi-test-bottom flex flex-col items-center">
                          <div className="gi-test-name text-[18px] text-[#4b5966] font-semibold mb-[5px]">John Doe</div>
                          <div className="gi-test-designation text-[14px] text-[#777] font-normal">Happy Customer</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section End */}
    </GuestLayout>
  );
}