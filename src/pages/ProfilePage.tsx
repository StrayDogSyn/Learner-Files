import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

/**
 * ProfilePage Component
 * User profile management
 */
const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your profile information and preferences.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Name: User</p>
                  <p>Email: user@example.com</p>
                  <p>Member since: 2024</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Statistics</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Games played: 0</p>
                  <p>Total playtime: 0 hours</p>
                  <p>Achievements: 0</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;