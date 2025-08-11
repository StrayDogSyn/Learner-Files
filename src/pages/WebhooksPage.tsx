import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Activity,
  Settings,
  Key
} from 'lucide-react';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  createdAt: string;
  lastTriggered?: string;
  status: 'active' | 'inactive' | 'error';
  deliveryCount: number;
  failureCount: number;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  responseCode?: number;
  responseTime?: number;
  attempts: number;
}

const WebhooksPage: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      name: 'User Registration Webhook',
      url: 'https://api.example.com/webhooks/user-registration',
      events: ['user.created', 'user.updated'],
      active: true,
      secret: 'whsec_1234567890abcdef',
      createdAt: '2024-01-15T10:30:00Z',
      lastTriggered: '2024-01-20T14:22:00Z',
      status: 'active',
      deliveryCount: 156,
      failureCount: 2
    },
    {
      id: '2',
      name: 'Payment Processing',
      url: 'https://payments.myapp.com/webhook',
      events: ['payment.completed', 'payment.failed'],
      active: true,
      secret: 'whsec_abcdef1234567890',
      createdAt: '2024-01-10T09:15:00Z',
      lastTriggered: '2024-01-20T16:45:00Z',
      status: 'active',
      deliveryCount: 89,
      failureCount: 0
    },
    {
      id: '3',
      name: 'Analytics Events',
      url: 'https://analytics.example.com/events',
      events: ['game.started', 'game.completed', 'user.achievement'],
      active: false,
      secret: 'whsec_fedcba0987654321',
      createdAt: '2024-01-05T16:20:00Z',
      status: 'inactive',
      deliveryCount: 0,
      failureCount: 0
    }
  ]);

  const [recentDeliveries] = useState<WebhookDelivery[]>([
    {
      id: '1',
      webhookId: '1',
      event: 'user.created',
      status: 'success',
      timestamp: '2024-01-20T14:22:00Z',
      responseCode: 200,
      responseTime: 145,
      attempts: 1
    },
    {
      id: '2',
      webhookId: '2',
      event: 'payment.completed',
      status: 'success',
      timestamp: '2024-01-20T16:45:00Z',
      responseCode: 200,
      responseTime: 89,
      attempts: 1
    },
    {
      id: '3',
      webhookId: '1',
      event: 'user.updated',
      status: 'failed',
      timestamp: '2024-01-20T13:15:00Z',
      responseCode: 500,
      responseTime: 5000,
      attempts: 3
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const availableEvents = [
    'user.created',
    'user.updated',
    'user.deleted',
    'payment.completed',
    'payment.failed',
    'game.started',
    'game.completed',
    'user.achievement',
    'subscription.created',
    'subscription.cancelled'
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return variants[status as keyof typeof variants] || variants.inactive;
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === id 
        ? { ...webhook, active: !webhook.active, status: !webhook.active ? 'active' : 'inactive' }
        : webhook
    ));
  };

  const toggleSecret = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Webhook className="w-8 h-8 text-blue-500" />
              Webhooks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage webhook endpoints to receive real-time notifications about events in your application
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Webhook
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Webhooks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{webhooks.length}</p>
              </div>
              <Webhook className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {webhooks.filter(w => w.active).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {webhooks.reduce((sum, w) => sum + w.deliveryCount, 0)}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed Deliveries</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {webhooks.reduce((sum, w) => sum + w.failureCount, 0)}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Webhook Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Webhook Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(webhook.status)}
                        <h3 className="font-semibold text-gray-900 dark:text-white">{webhook.name}</h3>
                        <Badge className={getStatusBadge(webhook.status)}>
                          {webhook.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{webhook.url}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {webhook.events.map((event, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={webhook.active}
                        onCheckedChange={() => toggleWebhook(webhook.id)}
                      />
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Deliveries: {webhook.deliveryCount}</p>
                      <p className="text-gray-600 dark:text-gray-400">Failures: {webhook.failureCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Created: {formatTimestamp(webhook.createdAt)}</p>
                      {webhook.lastTriggered && (
                        <p className="text-gray-600 dark:text-gray-400">Last: {formatTimestamp(webhook.lastTriggered)}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Secret:</span>
                      <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {showSecrets[webhook.id] ? webhook.secret : '••••••••••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSecret(webhook.id)}
                      >
                        {showSecrets[webhook.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(webhook.secret)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeliveries.map((delivery) => {
                const webhook = webhooks.find(w => w.id === delivery.webhookId);
                return (
                  <div key={delivery.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getDeliveryStatusIcon(delivery.status)}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{delivery.event}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{webhook?.name}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        <p>{formatTimestamp(delivery.timestamp)}</p>
                        {delivery.attempts > 1 && (
                          <p>Attempts: {delivery.attempts}</p>
                        )}
                      </div>
                    </div>
                    
                    {delivery.responseCode && (
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Status: {delivery.responseCode}</span>
                        {delivery.responseTime && (
                          <span>Response: {delivery.responseTime}ms</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Webhook Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create New Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Webhook Name</label>
                <Input placeholder="Enter webhook name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Endpoint URL</label>
                <Input placeholder="https://your-app.com/webhook" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Events</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableEvents.map((event) => (
                    <label key={event} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreateForm(false)}>
                  Create Webhook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WebhooksPage;