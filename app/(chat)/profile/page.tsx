"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export default function ChatbotUserProfile() {
  // ── Static user data (replace with auth session later) ──
  const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    image: "/logo.png",
  };

  // ── Static subscription state (replace with API call later) ──
  const isProSubscription = true;

  // ── Static usage/meter data (replace with API call later) ──
  const usageData = {
    creditedUnits: 100000,
    consumedUnits: 42500,
    balance: 57500,
    createdAt: "2025-11-15T00:00:00.000Z",
  };

  const usagePercent =
    (usageData.consumedUnits / usageData.creditedUnits) *
    100;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
      {/* Profile Header */}
      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-24 w-24 rounded-2xl">
              <AvatarImage
                src={user.image}
                alt={user.name}
              />
              <AvatarFallback className="rounded-2xl text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                {user.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {user.email}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <Badge
                  variant="secondary"
                  className="rounded-xl">
                  {"user"}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-xl flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />{" "}
                  {isProSubscription
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {isProSubscription ? (
              <Button className="bg-[#373669] border-[#3e3e4a] text-white hover:bg-[#373669]/90 text-[12px] font-medium">
                <Sparkles />
                Pro Member
              </Button>
            ) : (
              <Button>
                <Sparkles />
                Upgrade to Pro
              </Button>
            )}

            <Button
              variant="outline"
              className="rounded-xl">
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Details */}
        <Card className="rounded-2xl border shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              Subscription
            </CardTitle>
            <CardDescription>
              Current plan and renewal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Plan
              </span>
              <Badge className="rounded-xl">
                {isProSubscription
                  ? "CodersGPT Pro"
                  : "Inactive"}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />{" "}
                  Purchased
                </div>
                <span>
                  {new Date(
                    usageData.createdAt,
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <Card className="rounded-2xl border shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              Token Usage
            </CardTitle>
            <CardDescription>
              Monthly AI consumption overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-muted/40 border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Zap className="h-4 w-4" /> Monthly Limit
                </div>
                <p className="text-xl font-semibold pt-2">
                  {usageData.creditedUnits}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border">
                <div className="text-muted-foreground text-sm">
                  Current Usage
                </div>
                <p className="text-xl font-semibold pt-2">
                  {usageData.consumedUnits}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border">
                <div className="text-muted-foreground text-sm">
                  Remaining
                </div>
                <p className="text-xl font-semibold pt-2">
                  {usageData.balance}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Progress
                value={usagePercent}
                className="h-3 rounded-xl"
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {usagePercent.toFixed(1)}% of monthly
                  quota used
                </span>
                <span className="font-medium">
                  Resets on Month End
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
