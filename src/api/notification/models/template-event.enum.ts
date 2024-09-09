/**
 * Event names used to find the template for a notification
 */
export type TemplateEvent =
  | 'launch_scheduled'
  | 'launch_confirmed'
  | 'launch_launched'
  | 'launch_delayed'
  | 'launch_aborted'
  | 'booking_confirmed'
  | 'booking_canceled'
  | 'invoice_issued';
