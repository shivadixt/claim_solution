import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const body = await request.json();

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

    const backendRes = await fetch(`${apiBaseUrl}/cases/${id}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      const errorMessage =
        Array.isArray(data.message)
          ? data.message.join(', ')
          : data.error || data.message || 'Failed to assign case';

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: backendRes.status },
      );
    }

    return NextResponse.json({
      success: true,
      case: data,
    });
  } catch (err) {
    console.error('Assign case route handler error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected network error occurred' },
      { status: 500 },
    );
  }
}
