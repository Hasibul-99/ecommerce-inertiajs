import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { FiCreditCard, FiCheckCircle } from 'react-icons/fi';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Checkout: React.FC = () => {
  // Mock data for cart items
  const cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Crunchy Triangle Chips Snacks',
      price: 56.00,
      quantity: 1,
      image: '/assets/img/product-images/1_1.jpg'
    },
    {
      id: 2,
      name: 'Dates Value Pack Pouch',
      price: 75.00,
      quantity: 1,
      image: '/assets/img/product-images/2_1.jpg'
    },
    {
      id: 3,
      name: 'Californian Almonds Value Pack',
      price: 48.00,
      quantity: 1,
      image: '/assets/img/product-images/3_1.jpg'
    }
  ];

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryCharges = 10.00;
  const totalAmount = subtotal + deliveryCharges;

  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  return (
    <GuestLayout>
      <Head title="Checkout" />
      
      {/* Breadcrumb start */}
      <div className="mb-10 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-3">
              <div className="flex flex-wrap p-4 border border-gray-200 rounded-b-md border-t-0">
                <div className="md:w-1/2 w-full px-3">
                  <h2 className="text-gray-700 text-base font-semibold my-0 mx-auto capitalize md:mb-0 mb-1 md:text-left text-center">Checkout</h2>
                </div>
                <div className="md:w-1/2 w-full px-3">
                  <ul className="text-right md:text-right text-center">
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize">
                      <Link href="/" className="relative text-gray-700">Home</Link>
                    </li>
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize ml-2 before:content-['/'] before:mr-2">
                      <Link href="/cart" className="relative text-gray-700">Cart</Link>
                    </li>
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize ml-2 before:content-['/'] before:mr-2">Checkout</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb end */}

      {/* Checkout section */}
      <section className="py-10 md:py-8">
        <h2 className="sr-only">Checkout Page</h2>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-3">
            {/* Billing Details */}
            <div className="lg:w-8/12 w-full px-3">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Billing Details</h3>
                <form className="flex flex-wrap -mx-3">
                  <div className="md:w-1/2 w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstName">First Name *</label>
                    <input 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                      type="text" 
                      id="firstName" 
                      required 
                    />
                  </div>
                  <div className="md:w-1/2 w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastName">Last Name *</label>
                    <input 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                      type="text" 
                      id="lastName" 
                      required 
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="companyName">Company Name (Optional)</label>
                    <input 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                      type="text" 
                      id="companyName" 
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">Country / Region *</label>
                    <select 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                      id="country" 
                      required
                    >
                      <option value="">Select a country / region</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="streetAddress">Street Address *</label>
                    <input 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500 mb-3" 
                      type="text" 
                      id="streetAddress" 
                      placeholder="House number and street name" 
                      required 
                    />
                    <input 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                      type="text" 
                      placeholder="Apartment, suite, unit, etc. (optional)" 
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">Town / City *</label>
                    <input 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                      type="text" 
                      id="city" 
                      required 
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="state">State / Province *</label>
                    <select 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                      id="state" 
                      required
                    >
                      <option value="">Select a state</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      {/* More states would go here */}
                    </select>
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="postcode">Postcode / ZIP *</label>
                    <input 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                      type="text" 
                      id="postcode" 
                      required 
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">Phone *</label>
                    <input 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                      type="tel" 
                      id="phone" 
                      required 
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Email Address *</label>
                    <input 
                      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                      type="email" 
                      id="email" 
                      required 
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <div className="flex items-center">
                      <input 
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                        type="checkbox" 
                        id="createAccount" 
                      />
                      <label className="ml-2 block text-gray-700 text-sm" htmlFor="createAccount">
                        Create an account?
                      </label>
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Payment Method</h3>
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <input 
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded-full" 
                        type="radio" 
                        id="creditCard" 
                        name="paymentMethod" 
                        value="credit-card" 
                        checked={paymentMethod === 'credit-card'}
                        onChange={() => setPaymentMethod('credit-card')}
                      />
                      <label className="ml-2 block text-gray-700 text-sm font-medium" htmlFor="creditCard">
                        Credit Card / Debit Card <FiCreditCard className="inline ml-1" />
                      </label>
                    </div>
                    {paymentMethod === 'credit-card' && (
                      <div className="pl-6 mt-3">
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cardNumber">Card Number *</label>
                          <input 
                            className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                            type="text" 
                            id="cardNumber" 
                            placeholder="1234 5678 9012 3456" 
                            required 
                          />
                        </div>
                        <div className="flex flex-wrap -mx-2 mb-3">
                          <div className="w-1/2 px-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="expDate">Expiration Date *</label>
                            <input 
                              className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                              type="text" 
                              id="expDate" 
                              placeholder="MM / YY" 
                              required 
                            />
                          </div>
                          <div className="w-1/2 px-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cvv">CVV *</label>
                            <input 
                              className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                              type="text" 
                              id="cvv" 
                              placeholder="123" 
                              required 
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="nameOnCard">Name on Card *</label>
                          <input 
                            className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
                            type="text" 
                            id="nameOnCard" 
                            required 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <input 
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded-full" 
                        type="radio" 
                        id="paypal" 
                        name="paymentMethod" 
                        value="paypal" 
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                      />
                      <label className="ml-2 block text-gray-700 text-sm font-medium" htmlFor="paypal">
                        PayPal
                      </label>
                    </div>
                    {paymentMethod === 'paypal' && (
                      <div className="pl-6 mt-3">
                        <p className="text-sm text-gray-600">You will be redirected to PayPal to complete your purchase securely.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-start">
                  <input 
                    className="h-4 w-4 mt-1 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                    type="checkbox" 
                    id="termsConditions" 
                    required 
                  />
                  <label className="ml-2 block text-gray-700 text-sm" htmlFor="termsConditions">
                    I have read and agree to the website <a href="#" className="text-emerald-600 hover:underline">terms and conditions</a> *
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="transition-all duration-300 ease-in-out overflow-hidden text-center relative rounded-md py-3 px-6 bg-emerald-600 text-white border-0 text-sm tracking-normal font-medium inline-flex items-center hover:bg-gray-700 hover:text-white"
              >
                Place Order <FiCheckCircle className="ml-2" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:w-4/12 w-full px-3 lg:mt-0 mt-8">
              <div className="border border-gray-200 rounded-md p-6 sticky top-32">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Order</h3>
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between font-medium text-gray-700 mb-2">
                    <span>Product</span>
                    <span>Total</span>
                  </div>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-600 text-sm mb-2">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between text-gray-600 text-sm mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Shipping</span>
                    <span>${deliveryCharges.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-medium text-gray-700">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Checkout section End */}
    </GuestLayout>
  );
};

export default Checkout;