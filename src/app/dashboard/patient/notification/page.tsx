"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import Sidebar from "../sidebar/sidebar";
import { toast } from "sonner";

interface Request {
  _id: string;
  addedDate: string;
  addedTime: string;
  status: string;
  labId?: string;
  labName?: string;
  pharmacyId?: string;
  pharmacyName?: string;
  doctorId?: string;
  firstName?: string;
  lastName?: string;
}

const PatientRequestPage = () => {
  const [labRequests, setLabRequests] = useState<Request[]>([]);
  const [pharmacyRequests, setPharmacyRequests] = useState<Request[]>([]);
  const [doctorRequests, setDoctorRequests] = useState<Request[]>([]);
  const [acceptedLabRequests, setAcceptedLabRequests] = useState<Request[]>([]);
  const [acceptedPharmacyRequests, setAcceptedPharmacyRequests] = useState<Request[]>([]);
  const [acceptedDoctorRequests, setAcceptedDoctorRequests] = useState<Request[]>([]);
  const [activeTab, setActiveTab] = useState<string>("lab");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [labRes, pharmacyRes, doctorRes] = await Promise.all([
        api.get("/patient/laboratory/request"),
        api.get("/patient/pharmacy/request"),
        api.get("/patient/doctor/request"),
      ]);

      const pendingLab = labRes.data.filter((req: Request) => req.status === "false");
      const acceptedLab = labRes.data.filter((req: Request) => req.status === "true");

      const pendingPharmacy = pharmacyRes.data.filter((req: Request) => req.status === "false");
      const acceptedPharmacy = pharmacyRes.data.filter((req: Request) => req.status === "true");

      const pendingDoctor = doctorRes.data.filter((req: Request) => req.status === "false");
      const acceptedDoctor = doctorRes.data.filter((req: Request) => req.status === "true");

      setLabRequests(pendingLab);
      setPharmacyRequests(pendingPharmacy);
      setDoctorRequests(pendingDoctor);

      setAcceptedLabRequests(acceptedLab);
      setAcceptedPharmacyRequests(acceptedPharmacy);
      setAcceptedDoctorRequests(acceptedDoctor);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Error fetching requests. Please try again.");
    }
  };

  const handleAcceptRequest = async (_id: string, type: string) => {
    try {
      await api.post("/patient/request/accept", { requestId: _id });
      toast.success("Request accepted successfully");
      
      const moveRequest = (
        requests: Request[],
        setRequests: React.Dispatch<React.SetStateAction<Request[]>>,
        setAcceptedRequests: React.Dispatch<React.SetStateAction<Request[]>>
      ) => {
        const acceptedRequest = requests.find((req) => req._id === _id);
        if (!acceptedRequest) return;

        setRequests((prev) => prev.filter((req) => req._id !== _id));
        setAcceptedRequests((prev) => [
          ...prev,
          {
            ...acceptedRequest,
            status: "true",
            addedDate: new Date().toISOString().split("T")[0],
            addedTime: new Date().toLocaleTimeString(),
          } as Request,
        ]);
      };

      switch (type) {
        case "lab":
          moveRequest(labRequests, setLabRequests, setAcceptedLabRequests);
          break;
        case "pharmacy":
          moveRequest(pharmacyRequests, setPharmacyRequests, setAcceptedPharmacyRequests);
          break;
        case "doctor":
          moveRequest(doctorRequests, setDoctorRequests, setAcceptedDoctorRequests);
          break;
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Error accepting request. Please try again.");
    }
  };

  const renderLabTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isAccepted ? "Accepted Laboratory Requests" : "Laboratory Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-center">Lab ID</th>
              <th className="border p-3 text-center">Lab Name</th>
              <th className="border p-3 text-center">Added Date</th>
              <th className="border p-3 text-center">Added Time</th>
              {!isAccepted && <th className="border p-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border hover:bg-gray-50">
                <td className="border p-3 text-gray-700">{request.labId}</td>
                <td className="border p-3 text-gray-700">{request.labName}</td>
                <td className="border p-3 text-gray-700">{request.addedDate}</td>
                <td className="border p-3 text-gray-700">{request.addedTime}</td>
                {!isAccepted && (
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => handleAcceptRequest(request._id, "lab")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No {isAccepted ? "accepted laboratory" : "laboratory"} requests.
        </p>
      )}
    </div>
  );

  const renderPharmacyTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isAccepted ? "Accepted Pharmacy Requests" : "Pharmacy Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-center">Pharmacy ID</th>
              <th className="border p-3 text-center">Pharmacy Name</th>
              <th className="border p-3 text-center">Added Date</th>
              <th className="border p-3 text-center">Added Time</th>
              {!isAccepted && <th className="border p-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border hover:bg-gray-50">
                <td className="border p-3 text-gray-700">{request.pharmacyId}</td>
                <td className="border p-3 text-gray-700">{request.pharmacyName}</td>
                <td className="border p-3 text-gray-700">{request.addedDate}</td>
                <td className="border p-3 text-gray-700">{request.addedTime}</td>
                {!isAccepted && (
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => handleAcceptRequest(request._id, "pharmacy")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No {isAccepted ? "accepted pharmacy" : "pharmacy"} requests.
        </p>
      )}
    </div>
  );

  const renderDoctorTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isAccepted ? "Accepted Doctor Requests" : "Doctor Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-center">Doctor ID</th>
              <th className="border p-3 text-center">Doctor Name</th>
              <th className="border p-3 text-center">Added Date</th>
              <th className="border p-3 text-center">Added Time</th>
              {!isAccepted && <th className="border p-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border hover:bg-gray-50">
                <td className="border p-3 text-gray-700">{request.doctorId}</td>
                <td className="border p-3 text-gray-700">
                  {request.firstName} {request.lastName}
                </td>
                <td className="border p-3 text-gray-700">{request.addedDate}</td>
                <td className="border p-3 text-gray-700">{request.addedTime}</td>
                {!isAccepted && (
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => handleAcceptRequest(request._id, "doctor")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No {isAccepted ? "accepted doctor" : "doctor"} requests.
        </p>
      )}
    </div>
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full h-screen bg-gray-100 p-4 overflow-y-auto">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "lab" ? "bg-blue-700" : "bg-blue-600"
            } text-white hover:bg-blue-700 transition-colors`}
            onClick={() => setActiveTab("lab")}
          >
            Laboratory Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "pharmacy" ? "bg-blue-700" : "bg-blue-600"
            } text-white hover:bg-blue-700 transition-colors`}
            onClick={() => setActiveTab("pharmacy")}
          >
            Pharmacy Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "doctor" ? "bg-blue-700" : "bg-blue-600"
            } text-white hover:bg-blue-700 transition-colors`}
            onClick={() => setActiveTab("doctor")}
          >
            Doctor Requests
          </button>
        </div>

        {activeTab === "lab" && (
          <>
            {renderLabTable(labRequests, false)}
            {renderLabTable(acceptedLabRequests, true)}
          </>
        )}

        {activeTab === "pharmacy" && (
          <>
            {renderPharmacyTable(pharmacyRequests, false)}
            {renderPharmacyTable(acceptedPharmacyRequests, true)}
          </>
        )}

        {activeTab === "doctor" && (
          <>
            {renderDoctorTable(doctorRequests, false)}
            {renderDoctorTable(acceptedDoctorRequests, true)}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientRequestPage;