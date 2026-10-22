export interface Order {
  id: number;
  customer: string;
  status: 'Open' | 'Shipped' | 'Cancelled';
  total: number;
  placedOn: string;
}
