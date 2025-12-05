import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { SellerProfile } from '../../server/types';

interface ProfileSettingsProps {
  sellerProfile: SellerProfile;
  onUpdateProfile: (profile: SellerProfile, avatarFile: File | null, bannerFile: File | null) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ sellerProfile, onUpdateProfile }) => {
  const [profileData, setProfileData] = useState<SellerProfile>(sellerProfile);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileData(prev => ({ ...prev, avatar: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileData(prev => ({ ...prev, bannerImage: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileData, selectedAvatar, selectedBanner);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Seller Profile</h2>
          <p className="text-slate-500 text-sm">Manage your public storefront information.</p>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
        {/* Banner Image */}
        <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 group">
          <img
            src={profileData.bannerImage || 'https://via.placeholder.com/1200x300'}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <label className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg cursor-pointer font-medium shadow-lg hover:bg-white transition-colors flex items-center gap-2">
              <Upload size={18} />
              Change Banner
              <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
            </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 -mt-12 relative z-10 px-4">
          <div className="relative group flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
              <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <label className="absolute bottom-0 right-0 bg-brand-600 text-white p-2 rounded-full cursor-pointer hover:bg-brand-700 transition-colors shadow-sm z-10">
              <Upload size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
              <input
                type="text"
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium"
                value={profileData.username}
              />
              <p className="text-xs text-slate-400 mt-1">Username cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Short Bio</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none h-24"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100">
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-500">Rating</p>
            <p className="text-xl font-bold text-slate-900">{profileData.rating} / 5.0</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-500">Sales</p>
            <p className="text-xl font-bold text-slate-900">{profileData.totalSalesCount}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-500">Member Since</p>
            <p className="text-xl font-bold text-slate-900">{profileData.joinDate}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-brand-500/20"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
