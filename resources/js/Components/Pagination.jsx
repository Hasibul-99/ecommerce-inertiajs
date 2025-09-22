import React from 'react';
import { Link } from '@inertiajs/react';

const Pagination = ({ links, onPageChange }) => {
  // Don't render pagination if there's only one page
  if (links.length <= 3) {
    return null;
  }

  return (
    <div className="gi-pagination flex justify-center mt-[30px]">
      <ul className="flex flex-wrap items-center">
        {links.map((link, index) => {
          // Skip the "&laquo; Previous" link if we're on the first page
          if (index === 0 && link.url === null) {
            return null;
          }
          
          // Skip the "Next &raquo;" link if we're on the last page
          if (index === links.length - 1 && link.url === null) {
            return null;
          }

          // Determine if this is a previous/next link or a page number
          const isPrevious = index === 0;
          const isNext = index === links.length - 1;
          
          // Clean up the label (remove HTML entities)
          let label = link.label;
          if (isPrevious) label = 'Previous';
          if (isNext) label = 'Next';

          return (
            <li key={index} className="mx-[5px]">
              {link.url ? (
                <Link
                  href={link.url}
                  className={`
                    flex items-center justify-center w-[40px] h-[40px] text-[14px] border-[1px] border-solid border-[#eee] rounded-[5px] transition-all duration-[0.3s] ease-in-out
                    ${link.active ? 'bg-[#5caf90] text-[#fff] border-[#5caf90]' : 'text-[#777] hover:bg-[#5caf90] hover:text-[#fff] hover:border-[#5caf90]'}
                    ${(isPrevious || isNext) ? 'px-[15px] w-auto' : ''}
                  `}
                  onClick={(e) => {
                    if (onPageChange) {
                      e.preventDefault();
                      onPageChange(link.url);
                    }
                  }}
                >
                  {label}
                </Link>
              ) : (
                <span 
                  className={`
                    flex items-center justify-center w-[40px] h-[40px] text-[14px] border-[1px] border-solid border-[#eee] rounded-[5px] bg-[#f5f5f5] text-[#999] cursor-not-allowed
                    ${(isPrevious || isNext) ? 'px-[15px] w-auto' : ''}
                  `}
                >
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Pagination;