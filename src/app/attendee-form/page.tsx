"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AttendeeForm() {
    const [name, setName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [dob, setDob] = React.useState<Date | undefined>(undefined);
    const [gender, setGender] = React.useState<string>("");
    const [phone, setPhone] = React.useState<string>("");
    const [address, setAddress] = React.useState<string>("");
    const [role, setRole] = React.useState<string>("attendee");
    const [registerDate, setRegisterDate] = React.useState<Date | undefined>(undefined);
    const [photoError, setPhotoError] = React.useState<string>("");
    const [photoPreview, setPhotoPreview] = React.useState<string>("");
    const [section, setSection] = React.useState<string>("A");
    const [submitted, setSubmitted] = React.useState<boolean>(false);
    const [hasFilled, setHasFilled] = React.useState<boolean>(false);

    React.useEffect(() => {
        // Check localStorage on client-side only
        const alreadyFilled = typeof window !== "undefined" && localStorage.getItem("filled") === "true";
        setHasFilled(alreadyFilled);

        return () => {
            if (photoPreview) URL.revokeObjectURL(photoPreview);
        };
    }, [photoPreview]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const gender = formData.get("gender");
        const phone = formData.get("phone");
        const address = formData.get("address");
        const photo = formData.get("photo") as File | null;
        if (!photo) {
            setPhotoError("Photo is required.");
            return;
        }
        let dataURI = "";
        if (photo) {
            const arrayBuffer = await photo.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            let binary = "";
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);
            dataURI = `data:${photo.type};base64,${base64}`;
        }

        const response = await fetch("https://eswgrad.onrender.com/api/students/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                dob,
                gender,
                phone,
                address,
                photo: dataURI,
                section,
                role: role || "attendee",
            }),
        });

        if (!response.ok) {
            let message = "Network response was not ok";
            try {
                const err = await response.json();
                if (err?.message) message = err.message;
            } catch {}
            console.log(response);
            throw new Error(message);
        }

        const data = await response.json();
        if (typeof window !== "undefined") {
            localStorage.setItem("filled", "true");
        }
        setSubmitted(true);
        console.log(data);
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">✅ Form Submitted Successfully</h1>
            </div>
        );
    }

    if (hasFilled) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">☹️ You have already filled the form</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col w-full max-w-xl items-center justify-center p-8 bg-esecondary border-b-8 border-eprimary">
                <h1 className="text-3xl font-bold text-white">Attendee Form</h1>
                <p className="text-md mt-1 text-white/50">Fill out the form below to register for grad.</p>
            </div>
            <Alert className="bg-black/10 max-w-xl rounded-t-none mx-auto">
                <AlertTitle>Please Note</AlertTitle>
                <AlertDescription>You can fill out this form only once.</AlertDescription>
            </Alert>
            <form onSubmit={onSubmit} className="w-full max-w-xl p-8 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="name">
                        Full Name
                    </label>
                    <Input
                        id="name"
                        className="w-full mt-1"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="section">
                        Section
                    </label>
                    <select
                        id="section"
                        name="section"
                        className="w-full mt-1 border rounded-md px-3 py-2 bg-white text-sm"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                    >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="email">
                        Email
                    </label>
                    <Input
                        id="email"
                        className="w-full mt-1"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="password">
                        Passcode (6-digit)
                    </label>
                    <Input
                        id="password"
                        className="w-full mt-1"
                        name="password"
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={password}
                        maxLength={6}
                        onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, "");
                            setPassword(digitsOnly);
                        }}
                        placeholder="Enter your passcode"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="dob">
                        Date of birth
                    </label>
                    <DatePicker className="w-full mt-1" value={dob} onChange={setDob} />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="gender">
                        Gender
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        className="w-full mt-1 border rounded-md px-3 py-2 bg-white text-sm"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="phone">
                        Phone Number
                    </label>
                    <Input
                        id="phone"
                        className="w-full mt-1"
                        name="phone"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="address">
                        Address
                    </label>
                    <Input
                        id="address"
                        className="w-full mt-1"
                        name="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="photo">
                        Photo
                    </label>
                    <Input
                        id="photo"
                        className="w-full mt-1"
                        name="photo"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) {
                                setPhotoError("");
                                setPhotoPreview("");
                                return;
                            }
                            const isValidType = ["image/jpeg", "image/png"].includes(file.type);
                            const isValidSize = file.size <= 1024 * 1024; // 1MB
                            if (!isValidType || !isValidSize) {
                                setPhotoError("Only JPG/PNG up to 1MB are allowed.");
                                e.currentTarget.value = "";
                                setPhotoPreview("");
                                return;
                            }
                            setPhotoError("");
                            const url = URL.createObjectURL(file);
                            setPhotoPreview(url);
                        }}
                    />
                    {photoError && <p className="text-sm text-red-600 mt-1">{photoError}</p>}
                    {photoPreview && (
                        <img
                            src={photoPreview}
                            alt="Photo preview"
                            className="mt-2 mx-auto h-24 w-24 rounded-full object-cover border"
                        />
                    )}
                    <Button className="w-full mt-4 bg-esecondary" type="submit">
                        Register
                    </Button>
                </div>
            </form>
        </div>
    );
}
