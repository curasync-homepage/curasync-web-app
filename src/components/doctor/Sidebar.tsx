import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Bell, LogOut,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';

interface DoctorProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  specialization: string;
  profilePic: string;
}

const DoctorSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>({
    firstName: '',
    lastName: '',
    fullName: '',
    specialization: '',
    profilePic: '',
  });

  const navigationItems = [
    { href: '/dashboard/doctor', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/doctor/patients', icon: Users, label: 'Patients' },
    { href: '/dashboard/doctor/doctors', icon: Users, label: 'Doctors' },
    { href: '/dashboard/doctor/notification', icon: Bell, label: 'Requests' },
    { href: '/dashboard/doctor/settings', icon: User, label: 'Profile' },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fetchDoctorProfile = async () => {
      try {
        const response = await api.get('/doctor/profile');
        if (response.data) {
          setDoctorProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch doctor profile:', error);
      }
    };

    fetchDoctorProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('id');
    router.push('/auth/login/doctor');
    toast.success("Logged out successfully");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed top-0 left-0 h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white">
              <Image 
                src="/assets/logo/logo.png" 
                alt="CuraSync Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">CuraSync</span>
          </Link>
          
          <div className="mt-8 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center">
          {doctorProfile.profilePic ? (
            <Image 
              src={doctorProfile.profilePic}
              alt="Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
              {doctorProfile.firstName?.[0]}{doctorProfile.lastName?.[0]}
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {doctorProfile.fullName || 'Loading...'}
            </p>
            <p className="text-xs text-gray-500">
              {doctorProfile.specialization || 'General Practitioner'}
            </p>
          </div>
        </div>
        <button 
          className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DoctorSidebar;