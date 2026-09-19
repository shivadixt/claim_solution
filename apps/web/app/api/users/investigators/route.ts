import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

    const backendRes = await fetch(`${apiBaseUrl}/users?role=INVESTIGATOR`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to fetch investigators' },
        { status: backendRes.status },
      );
    }

    return NextResponse.json({
      success: true,
      investigators: data,
    });
  } catch (err) {
    console.error('Fetch investigators route handler error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected network error occurred' },
      { status: 500 },
    );
  }
}
