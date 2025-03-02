import Link from 'next/link';
import { FaChartBar, FaCog, FaEnvelope, FaFlask, FaUserMd, FaPrescriptionBottleAlt, FaBell } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div>
      <aside className="w-64 border-r p-6 flex flex-col h-full">
        <nav className="mt-12 space-y-6 flex-grow">
          <Link href="/dashboard/patient/doctor" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaUserMd className="w-5 h-5" />
            <span>Doctor</span>
          </Link>
          <Link href="/dashboard/patient/timeline" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaChartBar className="w-5 h-5" />
            <span>Timeline</span>
          </Link>
          <Link href="/dashboard/patient/laboratory" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaFlask className="w-5 h-5" />
            <span>Laboratory</span>
          </Link>
          <Link href="/dashboard/patient/visualization" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaFlask className="w-5 h-5" />
            <span>Visualization</span>
          </Link>
          <Link href="/dashboard/patient/pharmacy" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaPrescriptionBottleAlt className="w-5 h-5" />
            <span>Pharmacy</span>
          </Link>
          <Link href="/dashboard/patient/message" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaEnvelope className="w-5 h-5" />
            <span>Messaging</span>
          </Link>
          <Link href="/dashboard/patient/notification" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaBell className="w-5 h-5" />
            <span>Notification</span>
          </Link>
          <Link href="/dashboard/patient/settings" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaCog className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
        {/* Sidebar profile */}
        <div className="mt-auto flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <Link href="/dashboard/patient" className="text-gray-700 hover:text-blue-600">
          <span>Profile</span>
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;