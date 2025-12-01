import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { SellerProfile } from '../../server/types';

interface ProfileSettingsProps {
  sellerProfile: SellerProfile;
  onUpdateProfile: (profile: SellerProfile) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ sellerProfile, onUpdateProfile }) => {
  const [profileData, setProfileData] = useState<SellerProfile>(sellerProfile);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileData(prev => ({ ...prev, avatar: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileData);
    alert('Profile updated successfully!');
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
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="relative group flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
              <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <label className="absolute bottom-0 right-0 bg-brand-600 text-white p-2 rounded-full cursor-pointer hover:bg-brand-700 transition-colors shadow-sm z-10">
              <Upload size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageUpload} />
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
