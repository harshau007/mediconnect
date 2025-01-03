export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  aadharNumber: string;
  password: string;
  createdAt: {
    Time: string;
    Valid: boolean;
  };
  updatedAt: {
    Time: string;
    Valid: boolean;
  };
}
