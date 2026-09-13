import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, message } = body;

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedCompany = typeof company === 'string' ? company.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 },
      );
    }

    if (!trimmedCompany) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 },
      );
    }

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required' },
        { status: 400 },
      );
    }

    if (!trimmedMessage) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 },
      );
    }

    // Log the enquiry server-side
    console.log('\n=============================================');
    console.log('[NEW B2B CONTACT ENQUIRY]');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Name:      ${trimmedName}`);
    console.log(`Company:   ${trimmedCompany}`);
    console.log(`Email:     ${trimmedEmail}`);
    console.log(`Phone:     ${trimmedPhone || 'Not provided'}`);
    console.log(`Message:   ${trimmedMessage}`);
    console.log('=============================================\n');

    return NextResponse.json({
      success: true,
      message: "Thanks — we'll be in touch shortly.",
    });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process enquiry. Please try again.' },
      { status: 500 },
    );
  }
}
