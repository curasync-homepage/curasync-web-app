"use client";
import React, { useEffect, useState } from "react";
import PharmacySidebar from "../sidebar/sidebar";
import api from "@/utils/api";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageCircle} from "lucide-react";

interface Patient {
    patientId: string;
    firstName: string;
    lastName: string;
    profilePic?: string; 
}

const PatientList = () => {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState("");

      useEffect(() => {
          document.title = "Patient List | CuraSync";
        }, []);

    useEffect(() => {
        fetchList();
    }, []);

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await api.get("/pharmacy/patients");
            setPatients(response.data);
            console.log(response);
        } catch (error) {
            toast.error("Error fetching patient list");
            console.error("Error fetching patient list:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter((patient) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchLower) ||
            patient.patientId.toLowerCase().includes(searchLower)
        );
    });

    const messagePage = (patientId: string) => {
        router.push(`/dashboard/pharmacy/patient/message?patientId=${patientId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
                <PharmacySidebar />
            </div>
            <div className="flex flex-col w-full h-screen bg-gray-50 p-8 overflow-y-auto">
              <div className="mb-8">
                <div className="h-10 bg-gray-200 rounded-xl w-64 mb-4 animate-pulse"></div>
              </div>
              <div className="space-y-8">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="h-8 bg-gray-200 rounded-xl w-64 mb-6 animate-pulse"></div>
                    <div className="space-y-4">
                      <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                      <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
                <PharmacySidebar />
            </div>
            <main className="flex-grow overflow-y-auto bg-white rounded-lg shadow-lg p-6 mb-6 space-y-4">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Patient List</h1>
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="relative flex-grow max-w-2xl">
                        <input
                            type="text"
                            placeholder="Search patients by name or ID..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center space-x-2">
                        <span className="text-lg text-gray-500">Loading patients...</span>
                        <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredPatients.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold p-4 border-b">Selected Patients</h2>
                        <div className="divide-y">
                            {filteredPatients.map((patient) => (
                                <div
                                    key={patient.patientId}
                                    className="p-4 flex items-center justify-between hover:bg-blue-50"
                                >
                                    <div className="flex-1 flex items-center gap-4">
                                        <img
                                            src={patient.profilePic || "/placeholder-profile.png"}
                                            alt={`${patient.firstName} ${patient.lastName}`}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-medium text-gray-800">
                                                {patient.firstName} {patient.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500">{patient.patientId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => messagePage(patient.patientId)}
                                            className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                                        >
                                            <MessageCircle className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No patients found.</p>
                )}
            </main>
        </div>
    );
};

export default PatientList;
