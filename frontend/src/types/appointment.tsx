export interface Appointment {
  id: number;
  userId: number;
  hospitalId: number;
  hospitalName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  createdAt: {
    Time: string;
    Valid: boolean;
  };
  updatedAt: {
    Time: string;
    Valid: boolean;
  };
}
