import type { FormWizardOptions } from "../components/AutoForm";
import type { FormValues } from "./schema";

export const wizard: FormWizardOptions<FormValues> = {
  steps: [
    {
      id: "identity",
      title: "Identitas",
      description: "Data dasar pengguna.",
      fields: ["name", "email", "website", "password", "bio"],
    },
    {
      id: "profile",
      title: "Profil",
      description: "Data profil dan status pengguna.",
      fields: ["age", "role", "status", "companyName", "active", "profile"],
    },
    {
      id: "details",
      title: "Detail tambahan",
      description: "Tanggal, file, kontak, dan tag.",
      fields: [
        "birthDate",
        "meetingAt",
        "resume",
        "contacts",
        "tags",
        "metadata",
        "tuple",
        "contact",
        "preferences",
      ],
    },
  ],
  previousLabel: "Sebelumnya",
  nextLabel: "Berikutnya",
};
