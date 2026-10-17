import { z } from "zod";

export const schema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.email("Email tidak valid"),
  website: z.url("URL tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  bio: z.string(),
  age: z.number().min(1, "Umur harus diisi"),
  birthDate: z.date().optional(),
  meetingAt: z.iso.datetime().optional(),
  resume: z.file().optional(),
  role: z.string().min(1, "Role harus dipilih"),
  status: z.union([z.literal("draft"), z.literal("published")]),
  companyName: z.string(),
  active: z.boolean(),
  profile: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  contacts: z.array(
    z.object({
      type: z.string(),
      phone: z.string(),
      active: z.boolean(),
    }),
  ),
  tags: z.array(z.string().min(1, "Tag tidak boleh kosong")),
  metadata: z.record(z.string(), z.string()),
  tuple: z.tuple([z.string(), z.number()]),
  contact: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("person"), name: z.string() }),
    z.object({ kind: z.literal("company"), company: z.string() }),
  ]),
  preferences: z.array(z.string()),
});

export type FormValues = z.infer<typeof schema>;
