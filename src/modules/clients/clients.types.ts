export interface ClientDto {
  id?: string | number;
  email?: string;
  phone?: string;
  password?: string | null;
  firstName?: string;
  lastName?: string;
  surname?: string;
  birthday?: string | null;
  gender?: string | null;
  newPassword?: string | null;
  history?: string | null;
  created?: string | null;
  delivery?: string | null;
  notes?: string | null;
  discount?: number | null;
  instagram?: string | null;
  lastContacted?: string | null;
}

