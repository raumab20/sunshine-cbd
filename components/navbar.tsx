import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { auth } from "@/auth";
import { handleSignOut } from "@/app/actions/authAction";

export default async function Navbar() {
    const session = await auth();
    console.log(session);

    return (
        <nav className="flex justify-between items-center py-3 px-4 bg-white shadow-md">
            <Link href="/" className="text-xl font-bold text-black">
                SunshineCBD
            </Link>

            {!session ? (
                <Link href="/auth/signin">
                    <Button variant="default">Sign In</Button>
                </Link>
            ) : (
                <form action={handleSignOut}>
                    <Button variant="default" type="submit">
                        Sign Out
                    </Button>
                </form>
            )}
        </nav>
    )
}