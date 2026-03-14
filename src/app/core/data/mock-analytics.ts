import { AnalyticsStat, Campaign, ChartPoint, StaffMember } from '@models/analytics.model';

export const consumerKeyStats: AnalyticsStat[] = [
  { id: 'restaurants', label: 'Live Restaurants', value: '1.8k+', trend: 8.2 },
  { id: 'orders', label: 'Orders Today', value: '24k', trend: 5.4 },
  { id: 'eta', label: 'Average ETA', value: '26 mins', trend: -3.1 },
];

export const adminMetrics: AnalyticsStat[] = [
  { id: 'ordersToday', label: 'Total Orders Today', value: '24,508', trend: 6.3 },
  { id: 'activeRestaurants', label: 'Active Restaurants', value: '1,842', trend: 2.1 },
  { id: 'supportTickets', label: 'Support Tickets', value: '128', trend: -12.4 },
];

export const managerInsights: AnalyticsStat[] = [
  {
    id: 'inventoryAlerts',
    label: 'Inventory alerts',
    value: '4',
    trend: -6,
    hint: 'Low stock items',
  },
  {
    id: 'openOrders',
    label: 'Open orders',
    value: '32',
    trend: 3.4,
    hint: 'Need confirmation',
  },
  {
    id: 'prepTime',
    label: 'Avg. prep time',
    value: '26m',
    trend: -1.2,
    hint: 'Across kitchens',
  },
];

export const adminQuickLinks = [
  { label: 'Manage Restaurants', hint: 'Add or edit partner listings', path: '/admin/restaurants' },
  { label: 'Payout Center', hint: 'Review settlements and invoices', path: '/admin/payouts' },
  { label: 'Marketing Campaigns', hint: 'Boost promoted banners', path: '/admin/campaigns' },
  { label: 'Analytics Dashboard', hint: 'Visualize performance metrics', path: '/admin/analytics' },
];

export const campaigns: Campaign[] = [
  {
    id: 'cmp-01',
    name: 'Weekend Biryani Blast',
    audience: 'Hyderabad',
    budget: 50000,
    status: 'Live',
  },
  {
    id: 'cmp-02',
    name: 'New User 50% OFF',
    audience: 'Pan India',
    budget: 120000,
    status: 'Scheduled',
  },
  {
    id: 'cmp-03',
    name: 'Breakfast Combos',
    audience: 'Bengaluru',
    budget: 30000,
    status: 'Draft',
  },
];

export const staffRoster: StaffMember[] = [
  { id: 'staff-1', name: 'Rohit Menon', role: 'Kitchen Lead', shift: '6 AM - 2 PM', status: 'Active' },
  { id: 'staff-2', name: 'Ishita Paul', role: 'Packing', shift: '2 PM - 10 PM', status: 'Active' },
  { id: 'staff-3', name: 'Nikhil Rao', role: 'Delivery Dispatcher', shift: '10 AM - 6 PM', status: 'Off' },
];

export const ordersPerDay: ChartPoint[] = [
  { label: 'Mon', value: 3200 },
  { label: 'Tue', value: 4100 },
  { label: 'Wed', value: 3800 },
  { label: 'Thu', value: 4600 },
  { label: 'Fri', value: 5200 },
  { label: 'Sat', value: 5800 },
  { label: 'Sun', value: 4900 },
];

export const revenuePerMonth: ChartPoint[] = [
  { label: 'Jan', value: 12.4 },
  { label: 'Feb', value: 13.1 },
  { label: 'Mar', value: 15.8 },
  { label: 'Apr', value: 14.2 },
];
