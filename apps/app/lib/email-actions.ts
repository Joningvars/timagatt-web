'use server';

import { auth } from '@clerk/nextjs/server';
import { Resend } from 'resend';
import { type ExportData } from './export-actions';

// Initialize Resend lazily or safely to avoid build-time errors if env var is missing
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

type SendInvoiceParams = {
  email: string;
  subject: string;
  message?: string;
  data: ExportData;
  invoiceDetails: {
    clientName: string;
    clientAddress: string;
    clientCity: string;
    invoiceNumber: string;
    vatRate: number;
    dueDate: Date;
    issueDate: Date;
    notes: string;
    vatNumber: string;
  };
};

export async function sendInvoiceEmail(params: SendInvoiceParams) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  if (!resend) {
    console.log('Mocking email send because RESEND_API_KEY is not set.');
    console.log('To:', params.email);
    console.log('Subject:', params.subject);
    return { success: true, mocked: true };
  }

  try {
    // Construct a simple HTML email for now
    // In a real app, you'd use @react-email/components for better styling
    const htmlContent = `
      <h1>Invoice #${params.invoiceDetails.invoiceNumber}</h1>
      <p>Dear ${params.invoiceDetails.clientName},</p>
      <p>${params.message || 'Please find your invoice details below.'}</p>
      
      <h2>Summary</h2>
      <p><strong>Total Hours:</strong> ${(params.data.summary.totalDuration / 3600).toFixed(2)}</p>
      <p><strong>Total Expenses:</strong> ${params.data.summary.totalAmount}</p>
      
      <p><strong>Due Date:</strong> ${params.invoiceDetails.dueDate.toDateString()}</p>
      
      <hr />
      <p>Thank you for your business!</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Timagatt <onboarding@resend.dev>', // Default Resend testing domain
      to: [params.email],
      subject: params.subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { error: 'Failed to send email' };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    return { error: 'Failed to send invoice email' };
  }
}
