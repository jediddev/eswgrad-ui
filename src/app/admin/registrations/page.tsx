"use client";
import { useEffect, useState } from "react";

interface Registration {
    _id: string;
    name: string;
    email: string;
    dob: string;
    phone: string;
    address: string;
    section: string;
    photo: string;
    role: string;
    gender: string;
}

export default function Registrations() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRegistrations = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("adminToken");
                const response = await fetch("https://eswgrad.onrender.com/api/students/get-all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch registrations");
                }

                const data = await response.json();
                console.log("API Response:", data);

                // Check if data.students exists and is an array
                if (data.success && Array.isArray(data.students)) {
                    setRegistrations(data.students);
                } else {
                    console.error("Unexpected API response format:", data);
                    setRegistrations([]);
                }
            } catch (error) {
                console.error("Error fetching registrations:", error);
                setRegistrations([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            setIsAuth(true);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full border-4 border-white/20 border-t-white animate-spin mb-4" />
                    <p className="text-sm opacity-80">Loading registrations...</p>
                </div>
            </div>
        );
    }

    if (!isAuth) {
        return (
            <div className="flex flex-col items-center min-h-screen">
                <h1 className="text-2xl font-bold">☹️ You are not authorized to view this page</h1>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-black text-white flex flex-col items-center min-h-screen">
                <h1 className="text-2xl font-semibold mt-8 mb-6 text-white">Grad Registrations</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-0 mt-4">
                    {registrations.map((registration) => (
                        <div className="flex flex-col p-6 border border-white/10" key={registration._id}>
                            {(() => {
                                let src = registration.photo || "";
                                if (src.startsWith("data:application/octet-stream;base64,")) {
                                    src = src.replace("data:application/octet-stream", "data:image/jpeg");
                                }
                                const comma = src.indexOf(",");
                                const b64 = comma >= 0 ? src.substring(comma + 1) : "";
                                const valid = Boolean(b64);
                                return valid ? (
                                    <img src={src} alt="" className="w-20 h-20 rounded-lg object-cover mb-4" />
                                ) : (
                                    <div className="w-20 h-20 rounded-lg bg-white/10 mb-4 flex items-center justify-center">
                                        <span className="text-xs opacity-70">No Photo</span>
                                    </div>
                                );
                            })()}
                            <h1 className="font-bold">{registration.name}</h1>
                            <p className="font-semibold opacity-70">{registration.email}</p>
                            <p>
                                <span className="opacity-70">ID:</span>{" "}
                                <span className="font-semibold">{registration._id}</span>
                            </p>
                            <p>
                                <span className="opacity-70">Role:</span>{" "}
                                <span className="font-semibold">{registration.role}</span>
                            </p>
                            <p>
                                <span className="opacity-70">Gender:</span>{" "}
                                <span className="font-semibold">{registration.gender}</span>
                            </p>
                            <p>
                                <span className="opacity-70">DOB:</span>{" "}
                                <span className="font-semibold">{new Date(registration.dob).toLocaleDateString()}</span>
                            </p>
                            <p>
                                <span className="opacity-70">Phone:</span>{" "}
                                <span className="font-semibold">{registration.phone}</span>
                            </p>
                            <p>
                                <span className="opacity-70">Address:</span>{" "}
                                <span className="font-semibold">{registration.address}</span>
                            </p>
                            <p>
                                <span className="opacity-70">Section:</span>{" "}
                                <span className="font-semibold">{registration.section}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
