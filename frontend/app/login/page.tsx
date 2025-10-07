"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { sendOTP, verifyOTP } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient";

/**
 * Login Page Component
 * Two-step OTP authentication flow:
 * 1. Enter email and request OTP
 * 2. Enter OTP to verify and login
 */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  // Form state
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Handle sending OTP to email
   */
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await sendOTP({ email });
      if (response.success) {
        setSuccess("OTP sent to your email! Check your inbox.");
        setStep("otp");
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle verifying OTP and logging in
   */
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await verifyOTP({ email, otp });
      if (response.success && response.data) {
        setSuccess("Login successful! Redirecting...");
        login(response.data.user, response.data.token);
        
        // Redirect to projects page after successful login
        setTimeout(() => {
          router.push("/projects");
        }, 1000);
      } else {
        setError(response.message || "Invalid OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle going back to email step
   */
  const handleBackToEmail = () => {
    setStep("email");
    setOTP("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient animation */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(10, 10, 10)"
        gradientBackgroundEnd="rgb(30, 30, 60)"
        firstColor="59, 130, 246"
        secondColor="147, 51, 234"
        thirdColor="139, 92, 246"
        fourthColor="236, 72, 153"
        fifthColor="251, 146, 60"
        pointerColor="59, 130, 246"
        size="80%"
        blendingValue="hard-light"
        containerClassName="absolute inset-0"
        className="absolute inset-0"
      />

      {/* Login form */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="mb-8 text-center">
            <TextGenerateEffect
              words="Welcome to Ticket Dashboard"
              className="text-3xl font-bold"
            />
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {step === "email"
                ? "Enter your email to get started"
                : "Enter the OTP sent to your email"}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400">
                {success}
              </p>
            </div>
          )}

          {/* Email form */}
          {step === "email" && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading || !email}
              >
                Send OTP
              </Button>
            </form>
          )}

          {/* OTP form */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <Input
                type="text"
                label="OTP Code"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                maxLength={6}
                required
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading || otp.length !== 6}
              >
                Verify OTP
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBackToEmail}
                disabled={isLoading}
              >
                Back to Email
              </Button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

