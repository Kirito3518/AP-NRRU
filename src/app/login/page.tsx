import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");
  return <main className="grid min-h-screen place-items-center bg-muted/30 p-4">
    <Card className="w-full max-w-md p-6">
      <h1 className="text-2xl font-semibold">เข้าสู่ระบบผู้ดูแล</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">ระบบสำรวจครุภัณฑ์และอุปกรณ์เครือข่าย NRRU</p>
      <LoginForm />
    </Card>
  </main>;
}
