import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { 
  GiPeach, 
  GiBread, 
  GiCorn, 
  GiCoffeePot, 
  GiFrenchFries, 
  GiHamburger, 
  GiShrimp, 
  GiPopcorn 
} from 'react-icons/gi';

interface CategoryItem {
  id: number;
  name: string;
  icon: string;
  itemCount: number;
  bgColor: string;
  discount?: number;
  slug: string;
}

// Icon mapping function
const getIconComponent = (iconClass: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'fi-tr-peach': GiPeach,
    'fi-tr-bread': GiBread,
    'fi-tr-corn': GiCorn,
    'fi-tr-coffee-pot': GiCoffeePot,
    'fi-tr-french-fries': GiFrenchFries,
    'fi-tr-hamburger-soda': GiHamburger,
    'fi-tr-shrimp': GiShrimp,
    'fi-tr-popcorn': GiPopcorn,
    // 'fi-tr-egg': GiEggCracked,
  };
  
  return iconMap[iconClass] || GiPeach; // fallback icon
};

export default function CategoryIndex() {
  // Mock data for categories - this would come from your backend in a real app
  const categories: CategoryItem[] = [
    { id: 1, name: 'Fruits', icon: 'fi-tr-peach', itemCount: 320, bgColor: 'bg-[#fff6ec]', discount: 30, slug: 'fruits' },
    { id: 2, name: 'Bakery', icon: 'fi-tr-bread', itemCount: 65, bgColor: 'bg-[#e2fde2]', slug: 'bakery' },
    { id: 3, name: 'Vegetables', icon: 'fi-tr-corn', itemCount: 548, bgColor: 'bg-[#ffeae9]', discount: 15, slug: 'vegetables' },
    { id: 4, name: 'Dairy & Milk', icon: 'fi-tr-coffee-pot', itemCount: 48, bgColor: 'bg-[#fde1f5]', discount: 10, slug: 'dairy-milk' },
    { id: 5, name: 'Snack & Spice', icon: 'fi-tr-french-fries', itemCount: 59, bgColor: 'bg-[#ecf0ff]', slug: 'snack-spice' },
    { id: 6, name: 'Juice & Drinks', icon: 'fi-tr-hamburger-soda', itemCount: 845, bgColor: 'bg-[#f9f9d9]', slug: 'juice-drinks' },
    { id: 7, name: 'Seafood', icon: 'fi-tr-shrimp', itemCount: 652, bgColor: 'bg-[#fff6ec]', slug: 'seafood' },
    { id: 8, name: 'Fast Food', icon: 'fi-tr-popcorn', itemCount: 253, bgColor: 'bg-[#e2fde2]', discount: 20, slug: 'fast-food' },
    { id: 9, name: 'Eggs', icon: 'fi-tr-egg', itemCount: 154, bgColor: 'bg-[#ffeae9]', slug: 'eggs' },
  ];

  return (
    <GuestLayout>
      <Head title="Categories" />

      {/* Breadcrumb start */}
      <div className="gi-breadcrumb mb-[40px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-[12px]">
              <div className="flex flex-wrap m-0 p-[15px] border-[1px] border-solid border-[#eee] rounded-b-[5px] border-t-[0] gi_breadcrumb_inner">
                <div className="min-[768px]:w-[50%] w-full px-[12px]">
                  <h2 className="gi-breadcrumb-title text-[#4b5966] block text-[15px] font-Poppins leading-[22px] font-semibold my-[0] mx-auto capitalize max-[767px]:mb-[5px] max-[767px]:text-center">Categories</h2>
                </div>
                <div className="min-[768px]:w-[50%] w-full px-[12px]">
                  {/* gi-breadcrumb-list start */}
                  <ul className="gi-breadcrumb-list text-right max-[767px]:text-center">
                    <li className="gi-breadcrumb-item inline-block text-[14px] font-normal tracking-[0.02rem] leading-[1.2] capitalize"><Link href="/" className="relative text-[#4b5966]">Home</Link></li>
                    <li className="gi-breadcrumb-item inline-block text-[14px] font-normal tracking-[0.02rem] leading-[1.2] capitalize active">Categories</li>
                  </ul>
                  {/* gi-breadcrumb-list end */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb end */}

      {/* Category section */}
      <section className="gi-category py-[40px] max-[767px]:py-[30px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="w-full flex flex-wrap px-[12px] mb-[-15px]">
            <div className="min-[1200px]:w-full basis-auto max-w-full border-content-color">
              <div className="gi-category-block grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {categories.map((category) => {
                  const IconComponent = getIconComponent(category.icon);
                  return (
                    <div key={category.id} className={`gi-cat-box transition-all duration-[0.3s] ease-in-out p-[15px] rounded-[5px] relative ${category.bgColor}`}>
                      <div className="gi-cat-icon h-full p-[15px] flex flex-col items-center justify-center bg-[#fff] relative rounded-[5px] z-[5]">
                        {category.discount && (
                          <span className="gi-lbl px-[5px] absolute top-[0] right-[0] bg-[#5caf90] text-[#fff] text-[12px] font-semibold rounded-bl-[5px] rounded-tr-[5px]">{category.discount}%</span>
                        )}
                        <IconComponent className="transition-all duration-[0.3s] ease-in-out text-[40px] my-[10px] text-[#5caf90] leading-[0]" />
                        <div className="gi-cat-detail text-center">
                          <Link href={`/category/${category.slug}`}>
                            <h4 className="gi-cat-title m-[0] text-[15px] leading-[22px] font-semibold text-[#4b5966] capitalize font-manrope">{category.name}</h4>
                          </Link>
                          <p className="items m-[0] text-[13px] leading-[28px] text-[#777]">{category.itemCount} Items</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}