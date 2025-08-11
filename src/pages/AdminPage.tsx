import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Shield, 
  Users, 
  Activity, 
  Database, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Server
} from 'lucide-react';

interface SystemStatus {
  service: string;
  status: 'online' | 'offline' | 'warning';
  uptime: string;
  lastCheck: string;
}

interface UserStats {
  total: number;
  active: number;
  newToday: number;
  premium: number;
}

const AdminPage: React.FC = () => {
  const [systemStatus] = useState<SystemStatus[]>([
    { service: 'API Gateway', status: 'online', uptime: '99.9%', lastCheck: '2 min ago' },
    { service: 'Database', status: 'online', uptime: '99.8%', lastCheck: '1 min ago' },
    { service: 'Authentication', status: 'online', uptime: '100%', lastCheck: '30 sec ago' },
    { service: 'Email Service', status: 'warning', uptime: '98.5%', lastCheck: '5 min ago' },
    { service: 'Analytics', status: 'online', uptime: '99.7%', lastCheck: '1 min ago' },
    { service: 'File Storage', status: 'online', uptime: '99.9%', lastCheck: '2 min ago' }
  ]);

  const [userStats] = useState<UserStats>({
    total: 1247,
    active: 892,
    newToday: 23,
    premium: 156
  });

  const [recentActivity] = useState([
    { action: 'User registration', user: 'john.doe@example.com', time: '2 min ago', type: 'success' },
    { action: 'Failed login attempt', user: 'suspicious@email.com', time: '5 min ago', type: 'warning' },
    { action: 'Database backup completed', user: 'System', time: '1 hour ago', type: 'info' },
    { action: 'API rate limit exceeded', user: 'api-user-123', time: '2 hours ago', type: 'warning' },
    { action: 'Premium subscription activated', user: 'jane.smith@example.com', time: '3 hours ago', type: 'success' }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      offline: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return variants[status as keyof typeof variants] || variants.offline;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-500" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor system health, user activity, and manage application settings
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.total.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.active.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.newToday}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Premium Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.premium}</p>
              </div>
              <Shield className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{service.service}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last check: {service.lastCheck}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusBadge(service.status)}>
                      {service.status.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.user}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Admin Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="flex items-center gap-2 h-auto p-4 flex-col">
              <Database className="w-6 h-6" />
              <span>Backup Database</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4 flex-col">
              <Users className="w-6 h-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4 flex-col">
              <Activity className="w-6 h-6" />
              <span>View Logs</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4 flex-col">
              <Settings className="w-6 h-6" />
              <span>System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="mt-8 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Security Notice</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              This admin panel contains sensitive system information. Ensure you're on a secure connection 
              and log out when finished. All actions are logged for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;