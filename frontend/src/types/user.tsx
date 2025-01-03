export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isVerified: {
    Bool: boolean;
    Valid: boolean;
  };
  aadharNumber: string;
  role: string;
  avatar: string;
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
