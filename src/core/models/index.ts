export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  creationDate: string;
  endDate: string;
  userId: string;
  userName: string;
  userName_Display: string;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  url: string;
  image: string;
  userId: string;
  userName: string;
}

export interface User {
  id: string;
  tenantId: string;
  username: string;
  email: string;
  displayName?: string;
}
