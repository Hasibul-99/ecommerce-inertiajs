import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { PageProps } from '@/types';
import InputError from '@/Components/Core/InputError';
import { FiChevronRight, FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiTwitter, FiInstagram, FiSend } from 'react-icons/fi';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactUsProps extends PageProps {
  cartCount?: number;
  wishlistCount?: number;
}

export default function ContactUs({
  auth,
  cartCount = 0,
  wishlistCount = 0
}: ContactUsProps) {
  const { data, setData, post, processing, errors, reset } = useForm<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('contact.submit'), {
      onSuccess: () => {
        reset();
        alert('Thank you for your message! We will get back to you soon.');
      },
    });
  };

  const contactInfo = [
    {
      id: 1,
      icon: FiMapPin,
      title: 'Visit Us',
      content: '123 Main Street, Anytown, CA 12345',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 2,
      icon: FiPhone,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      color: 'bg-green-50 text-green-600'
    },
    {
      id: 3,
      icon: FiMail,
      title: 'Email Us',
      content: 'info@grabit.com',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      id: 4,
      icon: FiClock,
      title: 'Business Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM',
      color: 'bg-purple-50 text-purple-600'
    },
  ];

  return (
    <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
      <Head title="Contact Us" />

      {/* Breadcrumb */}
      <div className="bg-grabit-bg-light py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-grabit-gray">
            <Link href="/" className="hover:text-grabit-primary">Home</Link>
            <FiChevronRight className="w-4 h-4" />
            <span className="text-grabit-dark">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-grabit-primary to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <div
                key={info.id}
                className="bg-white border border-grabit-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-grabit-dark mb-2">
                  {info.title}
                </h3>
                <p className="text-sm text-grabit-gray">
                  {info.content}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="bg-grabit-bg-light py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white border border-grabit-border rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold text-grabit-dark mb-2">
                Send Us a Message
              </h2>
              <p className="text-grabit-gray mb-6">
                Fill out the form below and we'll get back to you shortly.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-grabit-dark mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                      />
                      <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-grabit-dark mb-2">
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                      />
                      <InputError message={errors.email} className="mt-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-grabit-dark mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                      />
                      <InputError message={errors.phone} className="mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-grabit-dark mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="How can we help?"
                        className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                        value={data.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                      />
                      <InputError message={errors.subject} className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-grabit-dark mb-2">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us what you need..."
                      className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary resize-none"
                      value={data.message}
                      onChange={(e) => setData('message', e.target.value)}
                      required
                    ></textarea>
                    <InputError message={errors.message} className="mt-1" />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-grabit-primary hover:bg-grabit-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={processing}
                  >
                    {processing ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Office Info & Map */}
            <div className="space-y-6">
              {/* Office Hours */}
              <div className="bg-white border border-grabit-border rounded-lg p-8">
                <h3 className="text-xl font-heading font-semibold text-grabit-dark mb-4">
                  Visit Our Office
                </h3>
                <p className="text-grabit-gray mb-6">
                  Come visit us at our office or contact us through any of the methods below.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-grabit-primary mt-1" />
                    <div>
                      <p className="font-medium text-grabit-dark">Address</p>
                      <p className="text-sm text-grabit-gray">123 Main Street, Anytown, CA 12345</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiClock className="w-5 h-5 text-grabit-primary mt-1" />
                    <div>
                      <p className="font-medium text-grabit-dark">Working Hours</p>
                      <p className="text-sm text-grabit-gray">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-sm text-grabit-gray">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-sm text-grabit-gray">Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-grabit-border">
                  <p className="text-sm font-medium text-grabit-dark mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 bg-grabit-bg-light hover:bg-grabit-primary hover:text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <FiFacebook className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-grabit-bg-light hover:bg-grabit-primary hover:text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <FiTwitter className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-grabit-bg-light hover:bg-grabit-primary hover:text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <FiInstagram className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white border border-grabit-border rounded-lg overflow-hidden h-64">
                <div className="w-full h-full bg-grabit-bg-light flex items-center justify-center">
                  <div className="text-center">
                    <FiMapPin className="w-12 h-12 text-grabit-primary mx-auto mb-2" />
                    <p className="text-grabit-gray">Map will be displayed here</p>
                    <p className="text-sm text-grabit-gray">Integrate Google Maps or similar service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-grabit-dark mb-3">
            Frequently Asked <span className="text-grabit-primary">Questions</span>
          </h2>
          <p className="text-grabit-gray max-w-2xl mx-auto">
            Quick answers to common questions
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-white border border-grabit-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-grabit-dark mb-2">What are your shipping options?</h3>
            <p className="text-grabit-gray">
              We offer standard and express shipping. Free shipping is available on orders over $200.
            </p>
          </div>

          <div className="bg-white border border-grabit-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-grabit-dark mb-2">What is your return policy?</h3>
            <p className="text-grabit-gray">
              We accept returns within 30 days of purchase. Items must be in original condition with tags attached.
            </p>
          </div>

          <div className="bg-white border border-grabit-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-grabit-dark mb-2">How can I track my order?</h3>
            <p className="text-grabit-gray">
              Once your order ships, you'll receive a tracking number via email to monitor your delivery.
            </p>
          </div>
        </div>
      </section>
    </FrontendLayout>
  );
}
