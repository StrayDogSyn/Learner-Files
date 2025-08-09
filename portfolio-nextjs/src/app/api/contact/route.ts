import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please provide a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
  company: z.string().optional(),
  phone: z.string().optional(),
  projectType: z.enum(['justice-reform', 'web-development', 'ai-integration', 'consulting', 'other']).optional(),
  budget: z.enum(['under-5k', '5k-15k', '15k-50k', '50k-plus', 'discuss']).optional(),
  timeline: z.enum(['asap', '1-month', '3-months', '6-months', 'flexible']).optional(),
  honeypot: z.string().max(0, 'Bot detected'), // Honeypot field for spam protection
});

// Rate limiting function
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // Max 5 requests per 15 minutes

  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, resetTime: record.resetTime };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(ip, record);
  return { allowed: true };
}

// Email service integration
async function sendEmail(data: z.infer<typeof contactSchema>) {
  const emailServiceKey = process.env.EMAIL_SERVICE_API_KEY;
  const emailServiceUrl = process.env.EMAIL_SERVICE_URL;
  const recipientEmail = process.env.CONTACT_EMAIL || 'contact@straydogsyn.com';

  if (!emailServiceKey || !emailServiceUrl) {
    console.log('Email service not configured, logging contact form submission:');
    console.log({
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      company: data.company,
      phone: data.phone,
      projectType: data.projectType,
      budget: data.budget,
      timeline: data.timeline,
    });
    return { success: true, method: 'logged' };
  }

  try {
    // Example integration with SendGrid, Resend, or similar service
    const emailPayload = {
      to: recipientEmail,
      from: process.env.FROM_EMAIL || 'noreply@straydogsyn.com',
      subject: `Portfolio Contact: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          </div>

          ${data.projectType || data.budget || data.timeline ? `
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0369a1;">Project Details</h3>
            ${data.projectType ? `<p><strong>Project Type:</strong> ${data.projectType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>` : ''}
            ${data.budget ? `<p><strong>Budget:</strong> ${data.budget.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>` : ''}
            ${data.timeline ? `<p><strong>Timeline:</strong> ${data.timeline.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>` : ''}
          </div>
          ` : ''}

          <div style="background: #fefefe; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #065f46;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Submitted: ${new Date().toLocaleString()}</p>
            <p>Source: Portfolio Contact Form</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}\n` : ''}${data.phone ? `Phone: ${data.phone}\n` : ''}
Subject: ${data.subject}

${data.projectType ? `Project Type: ${data.projectType}\n` : ''}${data.budget ? `Budget: ${data.budget}\n` : ''}${data.timeline ? `Timeline: ${data.timeline}\n` : ''}
Message:
${data.message}

Submitted: ${new Date().toLocaleString()}
      `,
    };

    const response = await fetch(emailServiceUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      throw new Error(`Email service responded with status: ${response.status}`);
    }

    return { success: true, method: 'email' };
  } catch (error) {
    console.error('Failed to send email:', error);
    // Fallback to logging
    console.log('Contact form submission (email failed):');
    console.log(data);
    return { success: true, method: 'logged_fallback' };
  }
}

// Auto-reply email function
async function sendAutoReply(email: string, name: string) {
  const emailServiceKey = process.env.EMAIL_SERVICE_API_KEY;
  const emailServiceUrl = process.env.EMAIL_SERVICE_URL;

  if (!emailServiceKey || !emailServiceUrl) {
    return { success: false, reason: 'Email service not configured' };
  }

  try {
    const autoReplyPayload = {
      to: email,
      from: process.env.FROM_EMAIL || 'noreply@straydogsyn.com',
      subject: 'Thank you for contacting StrayDog Syndications',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Thank You, ${name}!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your message has been received</p>
          </div>
          
          <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Thank you for reaching out! I've received your message and will get back to you within 24-48 hours.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="margin-top: 0; color: #1e40af;">What happens next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li>I'll review your message and project details</li>
                <li>If it's a good fit, I'll schedule a brief call to discuss your needs</li>
                <li>We'll explore how AI and modern technology can help achieve your goals</li>
              </ul>
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">In the meantime:</h3>
              <p style="margin: 10px 0;">Feel free to explore my portfolio and case studies:</p>
              <p style="margin: 10px 0;">
                <a href="https://straydogsyn.github.io/Learner-Files/" style="color: #3b82f6; text-decoration: none;">🌐 Portfolio</a> |
                <a href="https://straydogsyn.github.io/Learner-Files/projects" style="color: #3b82f6; text-decoration: none;">💼 Projects</a> |
                <a href="https://straydogsyn.github.io/Learner-Files/case-studies" style="color: #3b82f6; text-decoration: none;">📊 Case Studies</a>
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; margin: 0;">Best regards,<br><strong>StrayDog Syndications</strong></p>
              <p style="color: #9ca3af; font-size: 14px; margin: 10px 0 0 0;">AI-Enhanced Full Stack Development | Justice Reform Technology</p>
            </div>
          </div>
        </div>
      `,
      text: `
Thank you for contacting StrayDog Syndications!

Hi ${name},

Thank you for reaching out! I've received your message and will get back to you within 24-48 hours.

What happens next?
- I'll review your message and project details
- If it's a good fit, I'll schedule a brief call to discuss your needs
- We'll explore how AI and modern technology can help achieve your goals

In the meantime, feel free to explore my portfolio:
https://straydogsyn.github.io/Learner-Files/

Best regards,
StrayDog Syndications
AI-Enhanced Full Stack Development | Justice Reform Technology
      `,
    };

    const response = await fetch(emailServiceUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(autoReplyPayload),
    });

    return { success: response.ok };
  } catch (error) {
    console.error('Failed to send auto-reply:', error);
    return { success: false, reason: 'Send failed' };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const resetTime = rateLimit.resetTime ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000 / 60) : 15;
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          message: `Too many requests. Please try again in ${resetTime} minutes.`,
          retryAfter: resetTime 
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Send notification email
    const emailResult = await sendEmail(validatedData);
    
    // Send auto-reply (don't fail if this fails)
    const autoReplyResult = await sendAutoReply(validatedData.email, validatedData.name);

    // Log successful submission
    console.log(`Contact form submission processed: ${validatedData.email} (${emailResult.method})`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.',
      details: {
        emailSent: emailResult.success,
        autoReplySent: autoReplyResult.success,
        method: emailResult.method
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          message: 'Please check your input and try again.',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: 'Invalid request', 
          message: 'Please check your request format and try again.' 
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: 'Something went wrong. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}