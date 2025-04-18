"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import api from "@/utils/api";
import { io } from "socket.io-client";
import PharmacySidebar from "../../sidebar/sidebar";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface Message {
  patientId: string;
  data: string;
  addedDate: string; // YYYY-MM-DD format
  addedTime: string; // HH:MM format
  sender: "pharmacy" | "patient";
  type: "message" | "prescription";
}

const MessageContent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const searchParams = useSearchParams();
  const selectedPatient = searchParams.get("patientId");

  // Reference for the message container to scroll it to the bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Memoize fetchMessages function to prevent unnecessary recreations
  const fetchMessages = useCallback(async () => {
    if (!selectedPatient) {
      toast.error("No patient selected");
      return;
    }

    try {
      const response = await api.post("/pharmacy/patient/messages", {
        patientId: selectedPatient,
      });
      setMessages(response.data);
    } catch (error) {
      if (error instanceof Error && (error as any).response && (error as any).response.status === 404) {
        // Handle 404 error (No messages)
        setMessages([]);
      } else {
        console.error("Request failed:", error);
      }
    }
  }, [selectedPatient]);

    useEffect(() => {
        document.title = "Message | CuraSync";
      }, []);

  useEffect(() => {
    // Early return if running on server or no patient selected
    if (typeof window === "undefined" || !selectedPatient) return;

    fetchMessages();

    const serverUrl = "wss://curasync-backend.onrender.com/chat";
    const token = localStorage.getItem("accessToken");
    const additionalData = { id: selectedPatient };

    const socket = io(serverUrl, {
      auth: { token, additionalData },
    });

    socket.on("connect", () => {
      toast.success("Connected to chat!");
    });

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedPatient, fetchMessages]);

  const handleSendMessage = async () => {
    if (!selectedPatient) {
      toast.error("No patient selected");
      return;
    }

    if (!newMessage.trim()) {
      return;
    }

    const now = new Date();
    const sriLankaDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

    try {
      await api.post("/pharmacy/patient/sendMessage", {
        patientId: selectedPatient,
        message: newMessage,
        addedDate: sriLankaDate.toISOString().split("T")[0],
        addedTime: now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        sender: "pharmacy",
        type: "message",
      });
      toast.success("Message sent successfully!");

      // No need to manually fetch messages here as the socket will handle it
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Request failed:", error);
    }

    setNewMessage("");
  };

  // Sort messages by date and time
  const sortedMessages = [...messages].sort((a, b) => {
    return (
      a.addedDate.localeCompare(b.addedDate) ||
      a.addedTime.localeCompare(b.addedTime)
    );
  });

  // Format date (e.g. "Wed, Mar 28")
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Scroll to the bottom of the chat whenever the messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  let lastDate = "";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
        <PharmacySidebar />
      </div>
      <div className="flex flex-col flex-1 p-4 bg-gray-100">
        <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md p-6 mb-6 max-h-[calc(100vh-150px)]"> {/* Adjusted max-height */}
          {sortedMessages.length === 0 ? (
            <div className="flex justify-center items-center h-32 text-gray-500">
              No messages yet. Start a conversation!
            </div>
          ) : (
            sortedMessages.map((msg, index) => {
              let parsedData;
              try {
                parsedData =
                  typeof msg.data === "string"
                    ? JSON.parse(msg.data)
                    : msg.data;
              } catch (error) {
                console.error("Error parsing msg.data:", error);
                parsedData = { message: msg.data };
              }

              const showDate = msg.addedDate !== lastDate;
              lastDate = msg.addedDate;

              return (
                <React.Fragment key={index}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
                        {formatDate(msg.addedDate)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex mb-4 ${
                      msg.sender === "pharmacy" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === "pharmacy"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-black rounded-bl-none"
                      }`}
                    >
                      <div className="text-sm">
                        {parsedData?.message || "No message"}
                      </div>
                      <div className="flex justify-end mt-1">
                        <span
                          className={`text-xs ${
                            msg.sender === "pharmacy"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {msg.addedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          {/* Reference for scroll to bottom */}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition-colors duration-300"
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

function MessagingLoader() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-64 flex-shrink-0 bg-gray-800 text-white">
        <PharmacySidebar />
      </div>
      <div className="flex flex-col flex-grow bg-gray-50 p-6 items-center justify-center">
        <div className="text-xl font-medium text-gray-600">
          Loading messages...
        </div>
      </div>
    </div>
  );
}

// Wrapper component with Suspense for async loading
const MessagesPage = () => {
  return (
      <Suspense fallback={<MessagingLoader />}>
      <MessageContent />
    </Suspense>
  );
};

export default MessagesPage;
