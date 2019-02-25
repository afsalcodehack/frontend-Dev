export enum Days {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

export interface Pickup {
  id: number;
  name: string | null;
  business: string;
  address_line_1: string;
  address_line_2: string;
  recurring: boolean;
  weight: number;
  user_id: number;
  termination_date: Date;
  lat: number;
  long: number;
  status: Status;
  suburb: string;
  city: string;
  postal_code: string;
  day_of_week?: Days;
}
