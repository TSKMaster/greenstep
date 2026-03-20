export type RequestStatus =
  | "new"
  | "accepted"
  | "in_progress"
  | "resolved"
  | "rejected";

export type ReportCategory =
  | "Переполненные контейнеры"
  | "Стихийная свалка"
  | "Нет контейнеров"
  | "Загрязнение территории"
  | "Повреждение инфраструктуры";

export type ReportInsert = {
  address: string | null;
  category: ReportCategory;
  description: string;
  is_anonymous: boolean;
  latitude: number;
  longitude: number;
  user_id: string | null;
};

export type ReportListItem = {
  id: string;
  address: string | null;
  category: ReportCategory;
  created_at: string;
  description: string;
  is_anonymous: boolean;
  latitude: number;
  longitude: number;
  admin_comment?: string | null;
  status: RequestStatus;
  support_count: number;
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  rating: number;
};
