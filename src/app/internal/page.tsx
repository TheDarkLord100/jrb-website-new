"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";
import { useStudentSession } from "@/lib/hooks/useStudentSession";
import { supabase } from "@/lib/supabase/client";

export default function InternalPage() {
  const { session, isLoggedIn, loading } = useStudentSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/events");
    }
  }, [loading, isLoggedIn, router]);

  const handleLogout = async () => {
    if (!supabase) return;
    // scope: 'local' signs this browser out only. Pass { scope: 'global' }
    // instead if "Logout" should end every device's session at once.
    await supabase.auth.signOut({ scope: "local" });
    router.push("/events");
  };

  if (loading || !isLoggedIn) {
    return null;
  }

  return (
    <div>
      <PageHeading eyebrow="JRB Students" title="Internal" />
      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <Card className="max-w-md">
          <p className="text-sm text-gray-600">
            Signed in as{" "}
            <span className="font-medium text-[#001A23]">{session?.user.email}</span>
          </p>
          <button
            onClick={handleLogout}
            className="mt-5 flex items-center gap-2 border border-gray-300 px-5 py-2.5 text-sm font-medium text-[#001A23] transition-colors hover:border-amber-400 hover:text-amber-700"
          >
            <LogOut size={14} />
            Logout
          </button>
        </Card>
      </div>
    </div>
  );
}