'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, X, Loader2 } from 'lucide-react';
import { getUser, getAccessToken } from '@/lib/auth-store';
import { useUpdateProfileMutation } from '@/packages/Mutations';
import { ApiService } from '@/services/ApiService';
import { handleApiResponse } from '@/packages/HandleResponse';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function GeneralTab() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfileMutation = useUpdateProfileMutation();
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (user) {
      if (user.email) setUserEmail(user.email);
      const anyUser = user as any;
      if (anyUser.full_name) setUserName(anyUser.full_name);
      else if (anyUser.name) setUserName(anyUser.name);
      if (anyUser.phone) setUserPhone(anyUser.phone);
      if (anyUser.profile_pic) setProfilePicUrl(anyUser.profile_pic);
    }
  }, []);

  // Revoke old preview URL when a new file is picked
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB.');
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProfilePicUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    const token = getAccessToken();
    if (!token) {
      toast.error('You must be logged in to update your profile.');
      return;
    }

    try {
      setIsUploading(true);
      let finalPicUrl = profilePicUrl ?? '';

      // 1. If a new image was selected, upload it to R2 first
      if (selectedFile) {
        const uploadRes = await ApiService.getInstance().uploadImage(selectedFile);
        const uploadResult = handleApiResponse(uploadRes.data);
        finalPicUrl = uploadResult.data.url as string;
        setProfilePicUrl(finalPicUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
      }

      // 2. Call profile update API
      await updateProfileMutation.mutateAsync({
        payload: {
          full_name: userName,
          phone: userPhone,
          profile_pic: finalPicUrl,
        },
        token,
      });

      toast.success('Profile updated successfully!');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? err?.message ?? 'Failed to update profile.';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const isBusy = isUploading || updateProfileMutation.isPending;
  const displayPic = previewUrl ?? profilePicUrl;

  return (
    <div className="space-y-8 md:max-w-xl">
      {/* Profile Picture Upload Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#112238] border border-[#333333] flex items-center justify-center overflow-hidden">
              {displayPic ? (
                <img
                  src={displayPic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
            {displayPic && (
              <button
                onClick={handleRemovePicture}
                className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-6 h-6 rounded-full bg-[#112238] border border-[#333333] flex items-center justify-center hover:bg-[#1a3355] transition-colors"
              >
                <X className="w-3 h-3 text-red-500" />
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            className="text-white font-medium h-10 px-6 rounded-xl shadow-glow-red hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)' }}
          >
            Upload Picture
          </Button>
        </div>
        <p className="text-sm text-gray-400">Upload Profile Picture (Max size 5 MB)</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Full Name</label>
          <Input
            name="name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your Name"
            className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Email</label>
          <Input
            name="email"
            type="email"
            value={userEmail}
            disabled
            placeholder="Enter your Email"
            className="bg-[#112238] border-transparent h-12 rounded-xl text-gray-400 placeholder:text-gray-500 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Phone</label>
          <Input
            name="phone"
            type="text"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="Enter your Phone"
            className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="pt-6 space-y-4">
        <Button
          onClick={handleSave}
          disabled={isBusy}
          className="w-full text-white font-bold h-12 rounded-xl font-neon tracking-widest shadow-glow-red hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)' }}
        >
          {isBusy ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isUploading ? 'UPLOADING...' : 'SAVING...'}
            </span>
          ) : (
            'SAVE PROFILE'
          )}
        </Button>

        <Button
          onClick={() => router.push('/orders')}
          className="w-full text-white font-bold h-12 rounded-xl font-neon tracking-widest shadow-glow-red hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)' }}
        >
          ORDER HISTORY
        </Button>
      </div>
    </div>
  );
}
