import React from 'react';
import { Head } from '@inertiajs/react';
import { FiTrash2 } from 'react-icons/fi';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
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
    },
    {
      id: 4,
      name: 'Banana Chips Snacks & Spices',
      price: 95.00,
      quantity: 1,
      image: '/assets/img/product-images/4_1.jpg'
    }
  ];

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryCharges = 10.00;
  const totalAmount = subtotal + deliveryCharges;

  return (
    <GuestLayout>
      <Head title="Cart" />
      
      {/* Breadcrumb start */}
      <div className="mb-10 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-3">
              <div className="flex flex-wrap p-4 border border-gray-200 rounded-b-md border-t-0">
                <div className="md:w-1/2 w-full px-3">
                  <h2 className="text-gray-700 text-base font-semibold my-0 mx-auto capitalize md:mb-0 mb-1 md:text-left text-center">Cart Page</h2>
                </div>
                <div className="md:w-1/2 w-full px-3">
                  <ul className="text-right md:text-right text-center">
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize">
                      <Link href="/" className="relative text-gray-700">Home</Link>
                    </li>
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize ml-2 before:content-['/'] before:mr-2">Cart Page</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb end */}

      {/* Cart section */}
      <section className="py-10 md:py-8">
        <h2 className="sr-only">Cart Page</h2>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap w-full">
            {/* Sidebar Area Start */}
            <div className="lg:w-1/3 w-full px-3">
              <div className="p-4 rounded-md border border-gray-200 mb-0">
                {/* Sidebar Summary Block */}
                <div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-normal mb-0 leading-tight relative text-gray-700 lg:text-lg">Summary</h3>
                  </div>
                  <div className="mb-0 border-b-0 mt-4">
                    <h4 className="mb-0 text-lg font-bold tracking-normal leading-tight border-b border-gray-200 text-gray-600 pb-4 relative flex items-center justify-between">Estimate Shipping</h4>
                    <div className="pt-5">
                      <p className="text-gray-600 text-sm mb-2 tracking-normal leading-7 font-light">Enter your destination to get a shipping estimate</p>
                      <form action="#" method="post">
                        <span className="block">
                          <label className="mb-2 text-gray-700 text-sm font-medium tracking-normal leading-none inline-block">Country *</label>
                          <span className="relative flex w-full h-12 border border-gray-200 text-sm p-0 mb-7 rounded-md">
                            <select name="country" id="cart-select-country" className="w-full h-full px-4 rounded-md">
                              <option selected disabled>United States</option>
                              <option value="1">Country 1</option>
                              <option value="2">Country 2</option>
                              <option value="3">Country 3</option>
                              <option value="4">Country 4</option>
                              <option value="5">Country 5</option>
                            </select>
                          </span>
                        </span>
                        <span className="block">
                          <label className="mb-2 text-gray-700 text-sm font-medium tracking-normal leading-none inline-block">State/Province</label>
                          <span className="relative flex w-full h-12 border border-gray-200 text-sm p-0 mb-7 rounded-md">
                            <select name="state" id="cart-select-state" className="w-full h-full px-4 rounded-md">
                              <option selected disabled>Please Select a region, state</option>
                              <option value="1">Region/State 1</option>
                              <option value="2">Region/State 2</option>
                              <option value="3">Region/State 3</option>
                              <option value="4">Region/State 4</option>
                              <option value="5">Region/State 5</option>
                            </select>
                          </span>
                        </span>
                        <span className="block">
                          <label className="mb-2 text-gray-700 text-sm font-medium tracking-normal leading-none inline-block">Zip/Postal Code</label>
                          <input type="text" name="postalcode" placeholder="Zip/Postal Code" className="h-12 bg-transparent border border-gray-200 text-gray-700 text-sm mb-6 px-4 w-full outline-none rounded-md" />
                        </span>
                      </form>
                    </div>
                  </div>
                  <div className="mb-0 border-b-0 mt-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-left text-gray-700 text-sm leading-6 tracking-normal">Sub-Total</span>
                        <span className="text-right text-gray-700 text-sm leading-6 font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-left text-gray-700 text-sm leading-6 tracking-normal">Delivery Charges</span>
                        <span className="text-right text-gray-700 text-sm leading-6 font-medium">${deliveryCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-left text-gray-700 text-sm leading-6 tracking-normal">Coupon Discount</span>
                        <span className="text-right text-emerald-600 text-sm leading-6 font-medium">
                          <a href="#" className="cursor-pointer">Apply Coupon</a>
                        </span>
                      </div>
                      <div className="hidden">
                        <form className="flex border border-gray-200 p-1 rounded-md" name="cart-coupon-form" method="post" action="#">
                          <input className="inline-block align-top leading-9 h-10 text-gray-600 text-sm w-4/5 border-0 bg-transparent text-left px-2 tracking-wide outline-none rounded-md" type="text" required placeholder="Enter Your Coupon Code" name="coupon" value="" />
                          <button type="submit" className="transition-all duration-300 ease-in-out overflow-hidden text-center relative rounded-md py-2 px-4 bg-emerald-600 text-white border-0 text-sm tracking-normal font-medium inline-flex items-center hover:bg-gray-700 hover:text-white">Apply</button>
                        </form>
                      </div>
                      <div className="border-t border-gray-200 pt-5 mb-0 mt-4 flex justify-between items-center">
                        <span className="text-left text-base font-medium text-gray-700 leading-6 tracking-normal">Total Amount</span>
                        <span className="text-right text-base font-medium text-gray-700 leading-6 tracking-normal">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-2/3 w-full px-3 lg:mt-0 mt-8">
              {/* cart content Start */}
              <div>
                <div>
                  <div className="flex flex-wrap w-full">
                    <form action="#" className="w-full">
                      <div className="table-content cart-table-content">
                        <table className="w-full bg-white">
                          <thead className="md:table-header-group md:h-auto md:m-0 md:overflow-visible md:p-0 md:relative md:w-auto hidden">
                            <tr className="bg-white border-b-2 border-gray-200">
                              <th className="text-gray-700 text-sm font-medium pt-4 pb-3 px-4 text-left capitalize align-middle whitespace-nowrap leading-none tracking-normal">Product</th>
                              <th className="text-gray-700 text-sm font-medium pt-4 pb-3 px-4 text-left capitalize align-middle whitespace-nowrap leading-none tracking-normal">Price</th>
                              <th className="text-gray-700 text-sm font-medium pt-4 pb-3 px-4 text-center capitalize align-middle whitespace-nowrap leading-none tracking-normal">Quantity</th>
                              <th className="text-gray-700 text-sm font-medium pt-4 pb-3 px-4 text-left capitalize align-middle whitespace-nowrap leading-none tracking-normal">Total</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItems.map((item) => (
                              <tr key={item.id} className="border-b border-gray-200 md:table-row md:border-b md:block md:mb-0 border mb-4">
                                <td data-label="Product" className="md:w-2/5 text-gray-700 text-base md:py-4 md:px-4 md:text-left w-full md:border-b-0 border-b border-gray-200 flex justify-between items-center text-sm py-2 px-2">
                                  <a href="#" className="text-gray-600 font-normal text-sm flex leading-normal tracking-wide items-center">
                                    <img className="w-14 mr-4" src={item.image} alt={item.name} />
                                    {item.name}
                                  </a>
                                </td>
                                <td data-label="Price" className="text-gray-700 font-medium text-sm md:py-4 md:px-4 md:text-left md:border-b-0 border-b border-gray-200 flex justify-between items-center text-sm py-2 px-2">
                                  <span className="amount tracking-wide">${item.price.toFixed(2)}</span>
                                </td>
                                <td data-label="Quantity" className="text-gray-700 text-base md:py-4 md:px-4 md:text-center md:border-b-0 border-b border-gray-200 flex justify-between items-center text-sm py-2 px-2">
                                  <div className="border border-gray-200 rounded-md h-9 overflow-hidden p-0 relative w-20 flex items-center justify-between my-0 mx-auto md:m-auto m-0">
                                    <input className="border-0 text-gray-700 float-left text-sm h-auto m-0 p-0 text-center w-10 outline-none leading-9 font-semibold" type="text" name="cartqtybutton" value={item.quantity} readOnly />
                                  </div>
                                </td>
                                <td data-label="Total" className="text-gray-700 text-sm font-medium md:py-4 md:px-4 md:text-left md:border-b-0 border-b border-gray-200 flex justify-between items-center text-sm py-2 px-2">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </td>
                                <td data-label="Remove" className="text-gray-700 w-20 text-base md:py-4 md:px-4 md:text-right md:border-b-0 border-b border-gray-200 flex justify-between items-center text-sm py-2 px-2">
                                  <a href="#" className="text-xl my-0 mx-auto">
                                    <FiTrash2 />
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex flex-wrap">
                        <div className="w-full">
                          <div className="pt-8 flex justify-between">
                            <Link href="/products" className="text-gray-700 inline-block underline text-sm leading-5 font-medium tracking-wide">Continue Shopping</Link>
                            <Link href="/checkout" className="transition-all duration-300 ease-in-out overflow-hidden text-center relative rounded-md py-2 px-4 bg-emerald-600 text-white border-0 text-sm tracking-normal font-medium inline-flex items-center hover:bg-gray-700 hover:text-white">Check Out</Link>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* cart content End */}
            </div>
          </div>
        </div>
      </section>
      {/* Cart section End */}
    </GuestLayout>
  );
};

export default Cart;