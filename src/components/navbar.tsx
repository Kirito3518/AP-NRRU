import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export async function Navbar() {
  const user = await getCurrentUser();
  return <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
    <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="มหาวิทยาลัยราชภัฏนครราชสีมา" width={38} height={38} />
        <div><h1 className="text-sm font-semibold sm:text-base">มหาวิทยาลัยราชภัฏนครราชสีมา</h1><p className="hidden text-xs text-muted-foreground sm:block">ระบบสำรวจครุภัณฑ์และอุปกรณ์เครือข่าย</p></div>
      </Link>
      <nav className="flex items-center gap-1">
        <Link href="/equipment" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>รายการ</Link>
        {user ? <form action={logoutAction}><Button type="submit" variant="outline" size="sm">ออกจากระบบ</Button></form> : <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>เข้าสู่ระบบ</Link>}
      </nav>
    </div>
  </header>;
}
