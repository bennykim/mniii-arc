type UIItem = {
  id: string;
  title: string;
  createdAt: string;
};

type UIItems = {
  list: UIItem[];
};

type UIGroup = {
  id: string;
  title: string;
  list: UIItem[];
  createdAt: string;
};

type UIGroups = UIGroup[];

type UIHistory = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
};

type UIHistories = UIHistory[];

declare module '*.webp' {
  const src: string;
  export default src;
}
