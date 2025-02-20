import { NextResponse } from 'next/server';
import { getFileInfo } from '@/app/file-requests/api';

export async function POST(request) {
    try {
        const { fileID, password } = await request.json();
        const file = await getFileInfo(fileID);

        if (file.password === password) {
            return NextResponse.json({ valid: true });
        } else {
            return NextResponse.json({ valid: false }, { status: 401 });
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}