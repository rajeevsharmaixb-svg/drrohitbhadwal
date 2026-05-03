import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfBase64 = formData.get('pdfBase64') as string;
    const filename = formData.get('filename') as string || 'report.pdf';

    if (!pdfBase64) {
      return NextResponse.json({ error: 'Missing PDF data' }, { status: 400 });
    }

    // Decode base64 to buffer
    const buffer = Buffer.from(pdfBase64, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Export PDF API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
