type DateType = {
  title: string;
  id: number;
  imageUrl: string | null;
  date: Date | null;
  notes: string;
};
type PartialDateType = Pick<DateType, "title" | "imageUrl" | "date" | "notes"> &
  Partial<Pick<DateType, "id">>;

type DataRoot = {
  Dates: DateType[];
  person1: string;
  person2: string;
  lastseccion: string;
  targetDate?: DateType;
};

export type { DataRoot, DateType, PartialDateType };
