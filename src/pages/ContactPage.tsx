import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

/**
 * ContactPage Component
 * Contact information and form
 */
const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Get in touch with our team for support, feedback, or inquiries.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">support@learnerfiles.com</p>
            </div>
            <div>
              <h3 className="font-semibold">Support</h3>
              <p className="text-gray-600 dark:text-gray-400">Available 24/7 for assistance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;