import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginationProps {
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export default function Pagination({ links }: PaginationProps) {
  // Don't render pagination if there's only 1 page
  if (links.length <= 3) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {links.map((link, index) => {
              // Skip the "&laquo; Previous" and "Next &raquo;" links if they don't have URLs
              if ((index === 0 || index === links.length - 1) && !link.url) {
                return null;
              }

              return (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.url ? '' : 'cursor-not-allowed'} ${
                    link.active
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } ${
                    index === 0 ? 'rounded-l-md' : ''
                  } ${
                    index === links.length - 1 ? 'rounded-r-md' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}