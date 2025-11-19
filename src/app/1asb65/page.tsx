'use client'

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResetPage() {
    useEffect(() => {
        localStorage.removeItem('filled')
    }, [])

    const router = useRouter()

    return (
        <>
            <div className="w-screen h-screen flex flex-col gap-4 items-center justify-center">
                <h1 className="text-xl font-semibold">✅ Session reset succesful</h1>
                <Button onClick={() => router.push('/attendee-form')}><RotateCcw />Go back to form</Button>
            </div>
        </>
    )
}