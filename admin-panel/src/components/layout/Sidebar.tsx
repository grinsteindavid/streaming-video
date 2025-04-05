'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: 'ChartBarIcon' },
    { name: 'Content Library', href: '/content', icon: 'FilmIcon' },
    { name: 'Upload', href: '/upload', icon: 'CloudUploadIcon' },
    { name: 'Analytics', href: '/analytics', icon: 'ChartPieIcon' },
    { name: 'Settings', href: '/settings', icon: 'CogIcon' },
  ];

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-gray-800 dark:bg-gray-900">
        <div className="flex items-center h-16 px-4 bg-gray-900 dark:bg-black">
          <h1 className="text-xl font-bold text-white">Video Admin</h1>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
