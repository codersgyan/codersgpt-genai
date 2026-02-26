"use client";

import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

import { GithubIcon, GoogleIcon } from "../icons";
import { authClient } from "@/lib/auth-client";

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

type SocialProvider = "google" | "github";

export default function SignupForm() {
  const router = useRouter();
  const [pendingProvider, setPendingProvider] =
    useState<SocialProvider | null>(null);

  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          name: value.username,
          email: value.email,
          password: value.password,
          callbackURL: "/",
        },
        {
          onRequest: (ctx) => {
            setIsLoading(true);
          },
          onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
            // alert, popup
            setIsLoading(false);
            toast.success("Account created successfully!");
            router.push("/");
          },
          onError: (ctx) => {
            // display the error message
            setIsLoading(false);
            // todo: be careful -> server side errors should not exposed here.
            toast.error(
              ctx.error.message || "Registration failed.",
            );
          },
        },
      );
    },
  });

  const handleSocialLogin = async (
    provider: SocialProvider,
  ) => {
    setPendingProvider(provider);

    try {
      await authClient.signIn.social({
        provider: provider,
      });
    } catch (err) {
      setPendingProvider(null);
      console.error(err);
      toast.error("An unexpected error");
    }
  };

  return (
    <div className="flex items-center justify-center h-dvh">
      <Card className="w-full max-w-110 border-[#262626] bg-[#121212] text-white">
        <CardHeader className="space-y-4 pt-4 text-center">
          <Image
            src={"/logo.png"}
            className="h-10 w-10 mx-auto"
            height={40}
            width={40}
            alt="CodersGPT"
          />
          <CardTitle className="text-[32px] font-semibold tracking-tight text-[#ececec]">
            Create an account
          </CardTitle>
          <CardDescription className="mx-auto max-w-80 text-[15px] leading-relaxed text-[#b4b4b4]">
            Join CodersGPT to get smarter responses and
            start building today.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 px-10">
          {/* Social Buttons */}
          <div className="flex flex-col gap-3">
            {/* Google Button */}
            <Button
              variant="outline"
              disabled={false}
              className="h-13 w-full rounded-xl border-[#424242] bg-transparent text-[15px] font-normal transition-colors hover:bg-[#2f2f2f] hover:text-white disabled:opacity-70"
              onClick={() => {
                handleSocialLogin("google");
              }}>
              {pendingProvider == "google" ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : (
                <GoogleIcon className="mr-2 size-5" />
              )}
              Continue with Google
            </Button>

            {/* GitHub Button */}
            <Button
              variant="outline"
              disabled={false}
              className="h-13 w-full rounded-xl border-[#424242] bg-transparent text-[15px] font-normal transition-colors hover:bg-[#2f2f2f] hover:text-white disabled:opacity-70"
              onClick={() => {
                handleSocialLogin("github");
              }}>
              {pendingProvider === "github" ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : (
                <GithubIcon className="mr-2 size-5" />
              )}
              Continue with GitHub
            </Button>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute w-full border-t border-[#333]"></div>
            <span className="relative bg-[#121212] px-3 text-[11px] font-medium uppercase tracking-widest text-[#888]">
              OR
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}>
            <FieldGroup className="flex flex-col gap-1">
              {/* Username Field */}
              <form.Field
                name="username"
                children={(field) => {
                  const hasError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <div className="flex flex-col">
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value)
                        }
                        placeholder="Username"
                        className={cn(
                          "h-13 rounded-xl border-[#424242] bg-transparent px-4 text-base transition-colors focus:ring-0",
                          hasError
                            ? "border-red-500"
                            : "focus:border-[#676767]",
                        )}
                      />
                      <div className="min-h-5 px-1 py-0.5">
                        {hasError && (
                          <FieldError
                            className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-200"
                            errors={field.state.meta.errors}
                          />
                        )}
                      </div>
                    </div>
                  );
                }}
              />

              {/* Email Field */}
              <form.Field
                name="email"
                children={(field) => {
                  const hasError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <div className="flex flex-col">
                      <Input
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value)
                        }
                        placeholder="Email address"
                        className={cn(
                          "h-13 rounded-xl border-[#424242] bg-transparent px-4 text-base transition-colors focus:ring-0",
                          hasError
                            ? "border-red-500"
                            : "focus:border-[#676767]",
                        )}
                      />
                      <div className="min-h-5 px-1 py-0.5">
                        {hasError && (
                          <FieldError
                            className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-200"
                            errors={field.state.meta.errors}
                          />
                        )}
                      </div>
                    </div>
                  );
                }}
              />

              {/* Password Field */}
              <form.Field
                name="password"
                children={(field) => {
                  const hasError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <div className="flex flex-col">
                      <Input
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value)
                        }
                        placeholder="Password"
                        className={cn(
                          "h-13 rounded-xl border-[#424242] bg-transparent px-4 text-base transition-colors focus:ring-0",
                          hasError
                            ? "border-red-500"
                            : "focus:border-[#676767]",
                        )}
                      />
                      <div className="min-h-5 px-1 py-0.5">
                        {hasError && (
                          <FieldError
                            className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-200"
                            errors={field.state.meta.errors}
                          />
                        )}
                      </div>
                    </div>
                  );
                }}
              />

              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isDirty,
                ]}
                children={([
                  canSubmit,
                  isSubmitting,
                  isDirty,
                ]) => (
                  <Button
                    type="submit"
                    className="mt-2 h-13 w-full rounded-full bg-[#ececec] text-[16px] font-semibold text-black hover:bg-white disabled:opacity-50"
                    disabled={!canSubmit || !isDirty}>
                    {isSubmitting || isLoading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center pb-6">
          <div className="text-sm text-[#b4b4b4]">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-white hover:underline">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Icons (GoogleIcon, etc.) should remain as they were in the login file...
