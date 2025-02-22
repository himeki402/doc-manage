'use client'
import { Button } from "@repo/ui/components/ui/button";
import React, { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ children }: PropsWithChildren) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" aria-disabled={pending} className="w-full mt-2">
            {pending ? "Submitting..." : children}
        </Button>
    );
}
