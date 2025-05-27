type DateType = {
  title: string;
  id: number;
  idea: string;
  imageUrl: string | null;
  date: Date | null;
  notes: string;
};

type DataRoot = {
  Dates: DateType[];
  person1: string;
  person2: string;
  lastseccion: string;
  targetDate?: DateType;
};

export type { DataRoot, DateType };
