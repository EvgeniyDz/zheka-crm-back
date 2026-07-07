export interface RequestUser {
  id: string;
  email?: string;
  role?: {
    id: string;
    name: string;
    display_name?: string;
  };
  appUser?: Record<string, unknown>;
}
