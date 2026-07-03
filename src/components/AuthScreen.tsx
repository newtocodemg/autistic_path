import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Lock, 
  User, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck, 
  Info,
  Loader2,
  LockOpen
} from "lucide-react";
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "../lib/firebase";
import { 
  getFriendlyAuthErrorMessage, 
  isAuthProviderEnabled, 
  logAuthErrorInDev 
} from "../lib/authErrorHelper";

interface AuthScreenProps {
  theme: "light" | "dark";
  onAuthSuccess: (user: any) => void;
  onSkip?: () => void;
  logEvent: (type: "info" | "success" | "warning", message: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ 
  theme, 
  onAuthSuccess, 
  onSkip, 
  logEvent 
}) => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#161D30]/90 backdrop-blur-xl border-gray-800/40" : "bg-white/95 backdrop-blur-xl border-gray-100";
  const textPrimary = isDark ? "text-slate-100" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-500";
  const inputBg = isDark ? "bg-gray-900/60 border-gray-800" : "bg-gray-50/50 border-gray-200";

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Pre-flight check: is password provider enabled?
    if (!isAuthProviderEnabled("password")) {
      const errMsg = "Authentication is currently unavailable. Please enable the required sign-in method in Firebase Authentication.";
      setError(errMsg);
      logEvent("warning", errMsg);
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        logEvent("success", `Successfully signed in as ${userCredential.user.email}`);
        onAuthSuccess(userCredential.user);
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        logEvent("success", `Registered new account: ${userCredential.user.email}`);
        
        // Save optional initial display name logic
        onAuthSuccess(userCredential.user);
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg("Reset password email sent! Please check your inbox.");
        logEvent("success", `Password reset link sent to ${email}`);
        setTimeout(() => setMode("login"), 4000);
      }
    } catch (err: any) {
      logAuthErrorInDev(err);
      const errMsg = getFriendlyAuthErrorMessage(err, "password");
      setError(errMsg);
      logEvent("warning", `Auth failed: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);

    // Pre-flight check: is google provider enabled?
    if (!isAuthProviderEnabled("google")) {
      const errMsg = "Authentication is currently unavailable. Please enable the required sign-in method in Firebase Authentication.";
      setError(errMsg);
      logEvent("warning", errMsg);
      return;
    }

    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const userCredential = await signInWithPopup(auth, provider);
      logEvent("success", `Signed in with Google as ${userCredential.user.displayName}`);
      onAuthSuccess(userCredential.user);
    } catch (err: any) {
      logAuthErrorInDev(err);
      if (err.code !== "auth/popup-closed-by-user") {
        const errMsg = getFriendlyAuthErrorMessage(err, "google");
        setError(errMsg);
        logEvent("warning", `Google sign in failed: ${errMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-sans select-none transition-colors duration-500 ${isDark ? "bg-[#0B0F19]" : "bg-[#FAF9F6]"}`}>
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#00828A] to-emerald-400 text-white items-center justify-center shadow-premium-md relative">
            <Heart className="h-6 w-6 fill-current text-white" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight leading-tight ${textPrimary}`}>
            AutisticPath
          </h1>
          <p className={`text-xs sm:text-sm ${textSecondary} font-semibold`}>
            Continue therapeutic milestones at home
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`rounded-[28px] border ${cardBg} p-6 sm:p-8 shadow-premium-lg space-y-6`}
          >
            {/* Mode Title */}
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${textPrimary}`}>
                {mode === "login" && "Sign In to Your Workspace"}
                {mode === "signup" && "Create Your Account"}
                {mode === "forgot" && "Reset Password"}
              </h2>
              <p className={`text-xs ${textSecondary} mt-1 font-medium`}>
                {mode === "login" && "Access clinical parameters and child progress trackers."}
                {mode === "signup" && "Sync profiles, milestones and logs securely across devices."}
                {mode === "forgot" && "We'll email you instructions to securely reset your credentials."}
              </p>
            </div>

            {/* Notifications & Warnings */}
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 flex gap-2.5 items-start text-xs text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex gap-2.5 items-start text-xs text-emerald-500">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Sarah Miller"
                      className={`w-full py-2.5 pl-10 pr-4 rounded-xl border font-semibold text-xs transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className={`w-full py-2.5 pl-10 pr-4 rounded-xl border font-semibold text-xs transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Password</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-[10px] font-bold text-[#00828A] dark:text-teal-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full py-2.5 pl-10 pr-4 rounded-xl border font-semibold text-xs transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                    />
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Confirm Password</label>
                  <div className="relative">
                    <LockOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full py-2.5 pl-10 pr-4 rounded-xl border font-semibold text-xs transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                    />
                  </div>
                </div>
              )}

              {mode === "login" && (
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#00828A] focus:ring-[#00828A]"
                  />
                  <label htmlFor="remember" className={`text-xs ${textSecondary} font-semibold cursor-pointer`}>
                    Remember Me
                  </label>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#00828A] hover:bg-[#00666C] disabled:opacity-50 text-white font-extrabold tracking-wide transition-all shadow-premium-sm flex items-center justify-center gap-2 cursor-pointer mt-2 text-xs"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === "login" && "Sign In"}
                      {mode === "signup" && "Create Account"}
                      {mode === "forgot" && "Send Reset Link"}
                    </span>
                    <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            {mode !== "forgot" && (
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200/50 dark:border-gray-800/50"></div>
                <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-gray-200/50 dark:border-gray-800/50"></div>
              </div>
            )}

            {/* Google Sign In */}
            {mode !== "forgot" && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-full py-3 rounded-full border ${isDark ? "border-gray-800 hover:bg-gray-800/40" : "border-gray-200 hover:bg-gray-50"} text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer`}
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.24-3.12C18.435 1.21 15.62 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.83 11.57-11.76 0-.79-.08-1.4-.24-1.955H12.24z"/>
                </svg>
                <span className={textPrimary}>Continue with Google</span>
              </button>
            )}

            {/* Mode Switcher */}
            <div className="text-center text-xs font-semibold">
              <span className={textSecondary}>
                {mode === "login" && "Don't have an account? "}
                {mode === "signup" && "Already have an account? "}
                {mode === "forgot" && "Remember your credentials? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMsg(null);
                  if (mode === "login") setMode("signup");
                  else setMode("login");
                }}
                className="text-[#00828A] dark:text-teal-400 hover:underline font-extrabold cursor-pointer ml-1"
              >
                {mode === "login" && "Sign Up"}
                {mode === "signup" && "Sign In"}
                {mode === "forgot" && "Back to Sign In"}
              </button>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>HIPAA Privacy Compliant</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Guest Skip Access */}
        {onSkip && (
          <div className="text-center mt-4">
            <button
              onClick={onSkip}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline cursor-pointer transition-colors"
            >
              Continue as Guest (Offline Mode)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
