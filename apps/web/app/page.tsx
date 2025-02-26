'use client'
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner"

export default function Home() {
    return <Button variant="destructive"onClick={() => toast('Toast')}>Render Toast</Button>;
}
