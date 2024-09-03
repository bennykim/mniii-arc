type UIItem = {
  id: string;
  title: string;
};

type UIItems = {
  list: UIItem[];
};

type UIGroup = {
  id: string;
  title: string;
  list: UIItem[];
};

type UIGroups = UIGroup[];
