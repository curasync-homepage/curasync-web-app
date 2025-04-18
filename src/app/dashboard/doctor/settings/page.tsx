"use client";
import React, { useState, useEffect } from "react";
import {
  LogOut,
  Settings as SettingsIcon,
  Upload,
  Loader2,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/doctor/Sidebar";
import { toast } from "sonner";
import api from "@/utils/api";

interface DoctorProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  slmcRegisterNumber: string;
  nic: string;
  phoneNumber: string;
  specialization: string | null;
  education: string[];
  certifications: string[];
  yearsOfExperience: string | null;
  rating: string | null;
  currentWorkingHospitals: string[];
  availability: string | null;
  description: string | null;
  profilePic: string | null;
}

const SettingsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [newEducation, setNewEducation] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "doctor") {
      router.push("/auth/login/doctor");
      return;
    }
    fetchDoctorProfile();
  }, [router]);

  const fetchDoctorProfile = async () => {
    try {
      const response = await api.get('/doctor/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch doctor profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-white text-gray-900">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {/* Profile Header Skeleton */}
              <div className="flex items-center pb-8 border-b border-gray-200">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="ml-6 space-y-2">
                  <div className="h-6 bg-gray-200 w-48 rounded"></div>
                  <div className="h-4 bg-gray-200 w-32 rounded"></div>
                </div>
              </div>

              {/* Personal Info Skeleton */}
              <div className="mt-6">
                <div className="h-6 bg-gray-200 w-1/5 mb-4 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Skeleton */}
              <div className="mt-6">
                <div className="h-6 bg-gray-200 w-1/5 mb-4 rounded"></div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                    <div className="w-20 h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Certifications Skeleton */}
              <div className="mt-6">
                <div className="h-6 bg-gray-200 w-1/5 mb-4 rounded"></div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                    <div className="w-20 h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* About Skeleton */}
              <div className="mt-6">
                <div className="h-6 bg-gray-200 w-1/5 mb-4 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>

              {/* Save Button Skeleton */}
              <div className="mt-8 pt-6 border-t">
                <div className="h-10 bg-gray-200 w-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      toast.error("Only JPG, PNG, GIF, or WebP images are allowed");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "curasync_preset"
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxurgfxgr"}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      
      setProfile(prev => prev ? {
        ...prev,
        profilePic: data.secure_url
      } : null);

      toast.success("Profile picture uploaded successfully");
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const removeProfilePic = () => {
    setProfile(prev => prev ? { ...prev, profilePic: null } : null);
    toast.success("Profile picture removed");
  };

  const handleProfileChange = (
    field: keyof DoctorProfile,
    value: string | string[] | null
  ) => {
    if (!profile) return;
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleAddEducation = () => {
    if (!profile || !newEducation.trim()) return;
    setProfile(prev => prev ? {
      ...prev,
      education: [...prev.education, newEducation.trim()]
    } : null);
    setNewEducation('');
  };

  const handleRemoveEducation = (index: number) => {
    setProfile(prev => prev ? {
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    } : null);
  };

  const handleAddCertification = () => {
    if (!profile || !newCertification.trim()) return;
    setProfile(prev => prev ? {
      ...prev,
      certifications: [...prev.certifications, newCertification.trim()]
    } : null);
    setNewCertification('');
  };

  const handleRemoveCertification = (index: number) => {
    setProfile(prev => prev ? {
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    } : null);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      await api.post("/doctor/profile", {
        firstName: profile.firstName,
        lastName: profile.lastName,
        fullName: profile.fullName,
        email: profile.email,
        slmcRegisterNumber: profile.slmcRegisterNumber,
        nic: profile.nic,
        phoneNumber: profile.phoneNumber,
        specialization: profile.specialization,
        education: profile.education,
        certifications: profile.certifications,
        yearsOfExperience: profile.yearsOfExperience,
        currentWorkingHospitals: profile.currentWorkingHospitals,
        availability: profile.availability,
        description: profile.description,
        profilePic: profile.profilePic
      });
      
      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login/doctor');
    toast.success('Logged out successfully');
  };

  if (!profile) {
    return <div className="min-h-screen bg-gray-50 p-8">Failed to load profile data</div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-white text-gray-900">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center pb-8 border-b border-gray-200">
              <div className="relative w-20 h-20 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center">
                {isUploading ? (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : profile.profilePic ? (
                  <>
                    <Image
                      src={profile.profilePic}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={removeProfilePic}
                      className="absolute top-1 right-6 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      title="Remove profile picture"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <span className="text-blue-600 text-2xl font-semibold">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </span>
                )}
                
                <label htmlFor="profile-pic" className="absolute bottom-2 right-5 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md">
                  <Upload size={16} />
                  <input
                    type="file"
                    id="profile-pic"
                    className="hidden"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
              <div className="ml-6">
                <p className="text-xl font-medium">{profile.fullName}</p>
                <p className="text-base text-blue-500">{profile.email}</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-6 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={profile.specialization || ''}
                  onChange={(e) => handleProfileChange('specialization', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="text"
                  value={profile.yearsOfExperience || ''}
                  onChange={(e) => handleProfileChange('yearsOfExperience', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Hospital</label>
                <input
                  type="text"
                  value={profile.currentWorkingHospitals.join(', ')}
                  onChange={(e) => handleProfileChange('currentWorkingHospitals', e.target.value.split(',').map(h => h.trim()))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <input
                  type="text"
                  value={profile.availability || ''}
                  onChange={(e) => handleProfileChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Education</h2>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span>{edu}</span>
                    <button
                      onClick={() => handleRemoveEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEducation}
                    onChange={(e) => setNewEducation(e.target.value)}
                    placeholder="Add new education"
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddEducation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Certifications</h2>
              <div className="space-y-4">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span>{cert}</span>
                    <button
                      onClick={() => handleRemoveCertification(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add new certification"
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddCertification}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <textarea
                value={profile.description || ''}
                onChange={(e) => handleProfileChange('description', e.target.value)}
                rows={4}
                placeholder="Tell us about yourself and your practice"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-8 pt-6 border-t flex justify-between">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;