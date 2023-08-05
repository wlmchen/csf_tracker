
interface Hour {
  id: string;
  date: Date;
  hours: number;
  name: string;
  description: string;
  supervisor_name: string;
  supervisor_contact: string;
  approved: boolean;
  userId: string;
}

interface User {
  id: string;
  name: string;
  hours: Hour[];
}

