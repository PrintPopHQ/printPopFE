"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useGoogleLoginMutation } from "@/packages/Mutations";
import { saveUser, saveAccessToken } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { ApiService } from "@/services/ApiService";

export function OAuthButtons() {
  const router = useRouter();
  const googleLoginMutation = useGoogleLoginMutation();

  const handleGoogleSuccess = async (tokenResponse: any) => {
    const googleToken = tokenResponse.access_token;
    
    // Note: useGoogleLogin returns an access_token. 
    // To get the id_token which contains user info, we might need to fetch it or use the backend to exchange it.
    // However, @react-oauth/google's useGoogleLogin by default gives an implicit flow access token.
    // Let's use the 'google-login' custom hook if possible or just use the backend to handle the code.
    
    // Alternatively, we can use the library's GoogleLogin component for ID tokens.
    // But useGoogleLogin is more flexible for custom buttons.
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      // If we use 'auth-code' flow, we send the code to backend.
      // If we use 'implicit' flow, we send the access_token.
      // backend is expecting a 'token'. 
      
      googleLoginMutation.mutate(
        { token: codeResponse.access_token },
        {
          onSuccess: async (data) => {
            if (data.data?.user) saveUser(data.data.user);
            if (data.data?.access_token) {
              const token = data.data.access_token;
              saveAccessToken(token);

              // Sync cart
              (async () => {
                try {
                  const cartRes = await ApiService.getInstance().getCart(token);
                  if (cartRes.data && cartRes.data.responseCode === 2000) {
                    const backendCart = cartRes.data.data?.items || [];
                    const cartRaw = localStorage.getItem("printpop_cart");
                    let localCart: any[] = [];
                    if (cartRaw) {
                      try { localCart = JSON.parse(cartRaw); } catch (e) {}
                    }
                    const mergedMap = new Map();
                    backendCart.forEach((item: any) => { if (item.id) mergedMap.set(item.id, item); });
                    localCart.forEach((item: any) => { if (item.id) mergedMap.set(item.id, item); });
                    const finalCart = Array.from(mergedMap.values());
                    localStorage.setItem("printpop_cart", JSON.stringify(finalCart));
                    window.dispatchEvent(new Event("cart_updated"));
                  }
                } catch (e) {
                  console.error("Failed to sync cart after login", e);
                }
              })();
            }

            toast.success("Welcome!", {
              description: data.message || "You have signed in successfully.",
            });
            router.push("/profile");
          },
          onError: (error: any) => {
            toast.error("Google Sign In Failed", {
              description: error?.response?.data?.message || error.message || "Something went wrong.",
            });
          },
        }
      );
    },
    onError: () => {
      toast.error("Google Login Failed");
    },
  });

  return (
    <div className="flex flex-col gap-4 mb-8">
      <Button
        type="button"
        variant="outline"
        onClick={() => login()}
        className="w-full bg-[#112238] border-transparent hover:bg-[#1a2e4a] text-white h-12 rounded-xl flex items-center justify-center gap-3 transition-all duration-300"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span className="font-medium tracking-wide">Continue with Google</span>
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-gray-500 uppercase tracking-widest">or</span>
        </div>
      </div>
    </div>
  );
}
