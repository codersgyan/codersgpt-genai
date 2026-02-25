"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";


function SuccessContent() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");
  
  return (
    <Card className="w-full max-w-110 border-[#262626] bg-[#121212] text-white shadow-2xl">
      <CardHeader className="space-y-5 pt-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-[32px] font-semibold tracking-tight text-[#ececec]">
            Payment Successful
          </CardTitle>
          <CardDescription className="mx-auto max-w-80 text-[15px] leading-relaxed text-[#b4b4b4]">
            Thank you for upgrading. Your transaction is complete, and your account now has access to premium features.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-10 pb-2">
        {/* Render the Checkout ID if it exists in the URL */}
        {checkoutId && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#262626] bg-[#1a1a1a] p-4 text-center">
            <span className="text-[11px] font-medium uppercase tracking-widest text-[#888]">
              Order Reference
            </span>
            <span className="mt-1 font-mono text-sm text-[#ececec] truncate w-full max-w-62.5">
              {checkoutId}
            </span>
          </div>
        )}

        <Link href="/" className="w-full block">
          <Button
            className="h-13 w-full rounded-full bg-[#ececec] text-[16px] font-semibold text-black hover:bg-white active:scale-[0.98] transition-all"
          >
            Return to Chat
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </Link>
      </CardContent>

      <CardFooter className="flex flex-col items-center pb-8 pt-4">
        <div className="text-sm text-[#676767]">
          A receipt has been sent to your email.
        </div>
      </CardFooter>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <Suspense
        fallback={
          <Card className="w-full max-w-110 border-[#262626] bg-[#121212] flex h-112.5 items-center justify-center shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="size-8 animate-spin text-[#888]" />
              <p className="text-[#888] text-sm">Verifying payment...</p>
            </div>
          </Card>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}