import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center p-6 text-center"><div><p className="text-sm font-medium text-primary">404</p><h1 className="text-2xl font-semibold">ไม่พบหน้าที่ต้องการ</h1><p className="mt-2 text-sm text-muted-foreground">ลิงก์อาจไม่ถูกต้องหรือหน้านี้ถูกย้ายแล้ว</p><Link href="/" className={`${buttonVariants()} mt-5`}>กลับหน้าหลัก</Link></div></main>;
}
