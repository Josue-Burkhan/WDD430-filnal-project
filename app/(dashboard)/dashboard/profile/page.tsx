'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../lib/auth';
import { SellerProfile } from '../../../../server/types';
import { useToast } from '../../../../components/ui/Toast';
import { ProfileSettings } from '../../../../components/dashboard/ProfileSettings';

export default function ProfilePage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [profile, setProfile] = useState<SellerProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const res = await fetch(`http://localhost:5000/api/profiles/seller/id/${user.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setProfile(data);
                    }
                } catch (error) {
                    console.error('Failed to fetch profile', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProfile();
    }, [user]);

    const handleSaveProfile = async (updatedProfile: SellerProfile, avatarFile: File | null, bannerFile: File | null) => {
        if (!user) return;
        try {
            const formData = new FormData();
            formData.append('bio', updatedProfile.bio || '');
            formData.append('location', updatedProfile.location || '');

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            } else {
                formData.append('avatar', updatedProfile.avatar || '');
            }

            if (bannerFile) {
                formData.append('bannerImage', bannerFile);
            } else {
                formData.append('bannerImage', updatedProfile.bannerImage || '');
            }

            const res = await fetch(`http://localhost:5000/api/profiles/seller/${user.id}`, {
                method: 'PUT',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                if (data.avatar) updatedProfile.avatar = data.avatar;
                if (data.bannerImage) updatedProfile.bannerImage = data.bannerImage;

                setProfile(updatedProfile);
                showToast('Profile updated successfully', 'success');

                // Dispatch event to update Sidebar
                window.dispatchEvent(new Event('profileUpdated'));
            } else {
                showToast('Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile', error);
            showToast('Error updating profile', 'error');
        }
    };

    if (!user) return null;
    if (loading) return <div>Loading profile...</div>;

    // If no profile exists yet, we might want to show a "Create Profile" form or empty state
    // For now, we'll pass a default or null and let the component handle it, or just return null
    if (!profile) return <div>No profile found. Please contact support.</div>;

    return (
        <ProfileSettings
            sellerProfile={profile}
            onUpdateProfile={handleSaveProfile}
        />
    );
}
