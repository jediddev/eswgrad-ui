

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

useEffect(() => {
    const fetchRegistrations = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch("https://eswgrad.onrender.com/api/students/get-all", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch registrations');
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

    if (!isAuth) {
        return (
            <div className="flex flex-col items-center min-h-screen">
                <h1 className="text-2xl font-bold">☹️ You are not authorized to view this page</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>Registrations</h1>
            <div className="flex flex-col items-center min-h-screen">
                <h1 className="text-2xl font-bold">Registrations</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {registrations.map((registration) => (
                        <div className="flex flex-col p-4 shadow-lg rounded-lg border border-slate-300"  key={registration._id}>
                            <img src={registration.photo} alt="" className="w-20 h-20 rounded-full object-cover mb-1" />
                            <h1 className="font-bold">{registration.name}</h1>
                            <p className="font-semibold opacity-70">{registration.email}</p>
                            <p><span className="opacity-70">ID:</span> <span className="font-semibold">{registration._id}</span></p>
                            <p><span className="opacity-70">Role:</span> <span className="font-semibold">{registration.role}</span></p>
                            <p><span className="opacity-70">Gender:</span> <span className="font-semibold">{registration.gender}</span></p>
                            <p><span className="opacity-70">DOB:</span> <span className="font-semibold">{new Date(registration.dob).toLocaleDateString()}</span></p>
                            <p><span className="opacity-70">Phone:</span> <span className="font-semibold">{registration.phone}</span></p>
                            <p><span className="opacity-70">Address:</span> <span className="font-semibold">{registration.address}</span></p>
                            <p><span className="opacity-70">Section:</span> <span className="font-semibold">{registration.section}</span></p>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}