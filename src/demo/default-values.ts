import type { FormValues } from "./schema";

export const defaultValues: FormValues = {
  name: "",
  email: "",
  website: "https://example.com",
  password: "",
  bio: "",
  age: 18,
  birthDate: undefined,
  meetingAt: undefined,
  resume: undefined,
  role: "",
  status: "draft",
  companyName: "",
  active: false,
  profile: {
    firstName: "",
    lastName: "",
  },
  contacts: [
    {
      type: "personal",
      phone: "",
      active: true,
    },
  ],
  tags: ["contoh"],
  metadata: {
    source: "demo",
    version: "1",
  },
  tuple: ["fixed", 1],
  contact: {
    kind: "person",
    name: "",
  },
  preferences: ["email"],
};

export const exampleValues: FormValues = {
  ...defaultValues,
  name: "Erlangga",
  email: "erlangga@example.com",
  password: "demo12345",
  bio: "Sedang mencoba ErlForm.",
  role: "admin",
  companyName: "Studio Nusantara",
  profile: { firstName: "Erlangga", lastName: "Pratama" },
};
