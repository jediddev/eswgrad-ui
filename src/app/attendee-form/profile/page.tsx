"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProfilePictureUpdate() {
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [photo, setPhoto] = React.useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = React.useState<string>("");
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [formError, setFormError] = React.useState<string | null>(null);
    const [formSuccess, setFormSuccess] = React.useState<string | null>(null);

    React.useEffect(() => {
        return () => {
            if (photoPreview) URL.revokeObjectURL(photoPreview);
        };
    }, [photoPreview]);

    function fileToDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    function inferImageMimeFromName(name: string): string | null {
        const ext = name.split(".").pop()?.toLowerCase();
        if (!ext) return null;
        if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
        if (ext === "png") return "image/png";
        if (ext === "gif") return "image/gif";
        if (ext === "webp") return "image/webp";
        return null;
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset previous state
        setFormError(null);
        setFormSuccess(null);

        // Basic validation
        if (!file.type.startsWith("image/")) {
            setFormError("Please select a valid image file");
            return;
        }

        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);
        setIsSubmitting(true);

        try {
            if (!email || !password) {
                throw new Error("Email and password are required");
            }

            if (!photo) {
                throw new Error("Please select a photo to upload");
            }

            // Convert photo to data URL
            let dataURI = await fileToDataURL(photo);

            // Handle potential MIME type issues
            if (dataURI.startsWith("data:application/octet-stream;base64,")) {
                const inferred = inferImageMimeFromName(photo.name) || photo.type || "image/jpeg";
                dataURI = dataURI.replace("data:application/octet-stream", `data:${inferred}`);
            }

            // Ensure there is base64 content
            const commaIndex = dataURI.indexOf(",");
            if (commaIndex === -1 || !dataURI.substring(commaIndex + 1)) {
                throw new Error("Selected photo could not be processed. Please try a different image.");
            }

            // Call the update API
            const response = await fetch(
                `https://eswgrad.onrender.com/api/students/update?email=${encodeURIComponent(email)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        photo: dataURI,
                        passcodeRaw: password, // Using passcodeRaw as per the API endpoint
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || "Failed to update profile picture");
            }

            setFormSuccess("Profile picture updated successfully!");
            setPhoto(null);
            setPhotoPreview("");
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (input) input.value = "";
        } catch (error) {
            console.error("Error updating profile picture:", error);
            setFormError(error instanceof Error ? error.message : "Failed to update profile picture");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Update Profile Picture</h1>

                {formError && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                )}

                {formSuccess && (
                    <Alert className="mb-6 bg-green-100 border-green-400 text-green-700">
                        <AlertDescription>{formSuccess}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="password">
                            Passcode
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your 6-digit passcode"
                            minLength={6}
                            maxLength={6}
                            pattern="\d{6}"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="photo">
                            New Profile Picture
                        </label>
                        <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="cursor-pointer"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, GIF, WEBP</p>
                    </div>

                    {photoPreview && (
                        <div className="mt-4 text-center">
                            <p className="text-sm font-medium mb-2">Preview:</p>
                            <div className="inline-block border border-gray-200 rounded-lg overflow-hidden">
                                <img src={photoPreview} alt="Preview" className="max-h-48 mx-auto" />
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Profile Picture"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
