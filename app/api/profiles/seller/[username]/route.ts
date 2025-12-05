import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import path from 'path';
import fs from 'fs';
import { writeFile, unlink } from 'fs/promises';

// Helper to delete file
const deleteFile = async (filePath: string) => {
    if (!filePath) return;
    if (filePath.startsWith('/uploads')) {
        const absolutePath = path.join(process.cwd(), 'public', filePath);
        if (fs.existsSync(absolutePath)) {
            try {
                await unlink(absolutePath);
            } catch (e) {
                console.error('Error deleting file:', e);
            }
        }
    }
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT sp.*, u.username, u.email 
             FROM seller_profiles sp 
             JOIN users u ON sp.user_id = u.id 
             WHERE u.username = ?`,
            [username]
        );

        if (rows.length > 0) {
            const profile = rows[0];
            const [tags] = await pool.query<RowDataPacket[]>(
                `SELECT t.name FROM tags t 
                 JOIN seller_tags st ON t.id = st.tag_id 
                 WHERE st.seller_id = ?`,
                [profile.user_id]
            );
            profile.tags = tags.map((t: any) => t.name);
            return NextResponse.json(profile);
        } else {
            return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching seller profile', error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    // In this case, "username" param actually holds the userId because the route is /seller/:id
    const { username: userId } = await params;

    try {
        const formData = await req.formData();
        const bio = formData.get('bio') as string;
        const location = formData.get('location') as string;

        // Get existing profile
        const [rows] = await pool.query<RowDataPacket[]>('SELECT avatar, banner_image FROM seller_profiles WHERE user_id = ?', [userId]);
        const currentProfile = rows[0] || {};

        let avatarPath = (formData.get('avatar') as string) || currentProfile.avatar;
        let bannerPath = (formData.get('bannerImage') as string) || currentProfile.banner_image;

        const avatarFile = formData.get('avatar') instanceof File ? formData.get('avatar') as File : null;
        const bannerFile = formData.get('bannerImage') instanceof File ? formData.get('bannerImage') as File : null;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'sellers');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Handle Avatar
        if (avatarFile && typeof avatarFile === 'object' && avatarFile.name) {
            const buffer = Buffer.from(await avatarFile.arrayBuffer());
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = 'seller-avatar-' + uniqueSuffix + path.extname(avatarFile.name);

            await writeFile(path.join(uploadDir, filename), buffer);
            avatarPath = `/uploads/sellers/${filename}`;

            if (currentProfile.avatar && currentProfile.avatar.startsWith('/uploads/sellers/')) {
                await deleteFile(currentProfile.avatar);
            }
        }

        // Handle Banner
        if (bannerFile && typeof bannerFile === 'object' && bannerFile.name) {
            const buffer = Buffer.from(await bannerFile.arrayBuffer());
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = 'seller-banner-' + uniqueSuffix + path.extname(bannerFile.name);

            await writeFile(path.join(uploadDir, filename), buffer);
            bannerPath = `/uploads/sellers/${filename}`;

            if (currentProfile.banner_image && currentProfile.banner_image.startsWith('/uploads/sellers/')) {
                await deleteFile(currentProfile.banner_image);
            }
        }

        await pool.query(
            'UPDATE seller_profiles SET bio = ?, avatar = ?, banner_image = ?, location = ? WHERE user_id = ?',
            [bio, avatarPath, bannerPath, location, userId]
        );

        return NextResponse.json({
            message: 'Profile updated successfully',
            avatar: avatarPath,
            bannerImage: bannerPath
        });
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: 'Error updating profile', error: error.message }, { status: 500 });
    }
}
