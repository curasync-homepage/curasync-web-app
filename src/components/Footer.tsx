import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/">
              <div className="flex items-center">
                <div className="relative w-10 h-10">
                  <Image
                    src="/assets/logo/logo.png"
                    alt="CuraSync Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <span className="ml-2 text-xl font-bold text-blue-600">CuraSync</span>
              </div>
            </Link>
            <p className="mt-4 text-gray-600">
              Connecting healthcare professionals with patients for better care.
            </p>
          </div>
          <div className="md:col-span-1 md:col-start-4">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect</h3>
            <div className="mt-4 space-y-2">
              <a href="mailto:curasync.info@gmail.com" className="block text-gray-600 hover:text-purple-600">
                curasync.info@gmail.com
              </a>
              <div className="flex space-x-6 mt-4">
                <a href="https://x.com/CuraSync_Health" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                  <div className="relative w-6 h-6">
                    <Image src="/assets/icons/x.svg" alt="X (Twitter)" fill style={{ objectFit: 'contain' }} />
                  </div>
                </a>
                <a href="https://www.instagram.com/curasync" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                  <div className="relative w-6 h-6">
                    <Image src="/assets/icons/ig.svg" alt="Instagram" fill style={{ objectFit: 'contain' }} />
                  </div>
                </a>
                <a href="https://www.linkedin.com/company/curasync/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                  <div className="relative w-6 h-6">
                    <Image src="/assets/icons/lin.svg" alt="LinkdIn" fill style={{ objectFit: 'contain' }} />
                  </div>
                </a>
                <a href="https://github.com/CuraSync" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                  <div className="relative w-6 h-6">
                    <Image src="/assets/icons/gh.svg" alt="GitHub" fill style={{ objectFit: 'contain' }} />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} CuraSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;