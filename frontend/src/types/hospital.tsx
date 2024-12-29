export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  visitingHours: string;
  isOpen: {
    Bool: boolean;
    Valid: boolean;
  };
  lastInspected: {
    Time: string;
    Valid: boolean;
  };
  facilities: string;
  queueLength: number;
  averageWaitingTime: number;
  currentWaitingTime: number;
  isCrowded: {
    Bool: boolean;
    Valid: boolean;
  };
  createdAt: {
    Time: string;
    Valid: boolean;
  };
  updatedAt: {
    Time: string;
    Valid: boolean;
  };
}
