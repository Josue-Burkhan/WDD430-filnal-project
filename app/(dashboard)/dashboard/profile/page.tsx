'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../lib/auth';
import { SellerProfile } from '../../../../server/types';
import { ProfileSettings } from '../../../../components/dashboard/ProfileSettings';
import { MOCK_SELLER_PROFILE } from '../../../../marketplace/services/mockData';

export default function ProfilePage() {
    const { user } = useAuth();
    const [sellerProfile, setSellerProfile] = useState<SellerProfile>(MOCK_SELLER_PROFILE);

    const handleUpdateProfile = (profile: SellerProfile) => {
        setSellerProfile(profile);
        // TODO: Save to backend
        alert('Profile updated (mock)');
    };

    if (!user) return null;

    return (
        <ProfileSettings
            sellerProfile={sellerProfile}
            onUpdateProfile={handleUpdateProfile}
        />
    );
}
