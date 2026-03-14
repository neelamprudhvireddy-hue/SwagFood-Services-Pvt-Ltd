import { SupportMessage } from '@models/support.model';

export const supportFaq = [
  { question: 'Where is my food?', answer: 'Track live ETA in the order timeline or map.' },
  {
    question: 'I received wrong items',
    answer: 'Report an issue and refunds are processed within 24 hours.',
  },
  {
    question: 'How do I update my address?',
    answer: 'Open Profile -> Addresses to edit or add a delivery address.',
  },
  {
    question: 'Need tax invoice?',
    answer: 'Download invoices anytime from Orders -> View bill.',
  },
];

export const supportContactReasons = [
  { label: 'Order running late', value: 'late', sla: 'Avg. resolution 10 min' },
  { label: 'Payment or refund', value: 'payment', sla: 'Avg. resolution 2 hrs' },
  { label: 'Restaurant partner', value: 'restaurant', sla: 'Avg. resolution 4 hrs' },
  { label: 'Account & app help', value: 'account', sla: 'Avg. resolution 30 min' },
];

export const initialMessages: SupportMessage[] = [
  {
    id: 'welcome',
    from: 'agent',
    text: 'Hi! Need help with an order? I can assist right away.',
    timestamp: new Date().toISOString(),
  },
];
