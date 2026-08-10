import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { AutoForm } from "./components";

const schema = z.object({
  // Account
  locked: z.boolean(),
  username: z.string(),
  password: z.string(),

  // Profile
  bio: z.string(),

  // Access
  isAdmin: z.boolean(),
  email: z.string().email(),

  // Company
  isCompany: z.boolean(),
  companyName: z.string(),

  // Country
  country: z.string(),
  city: z.string(),

  // Contacts
  contacts: z.array(
    z.object({
      phone: z.string(),
      active: z.boolean(),
    }),
  ),
});

export default function App() {
  const form = useForm({
    defaultValues: {
      locked: true,
      username: "Erlangga",
      password: "12345678",

      bio: "",

      isAdmin: false,
      email: "",

      isCompany: false,
      companyName: "",

      country: "Indonesia",
      city: "",

      contacts: [
        {
          phone: "",
          active: true,
        },
      ],
    },

    validators: {
      onChange: schema,
    },

    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className=" space-y-8 px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">ErlForm Playground</h1>

          <p className="text-sm text-slate-600">
            Build forms automatically from Zod schema with TanStack Form.
          </p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <AutoForm
            form={form}
            schema={schema}
            sectionConfig={{
              Account: {
                title: "Account Information",
                description: "Manage your account settings.",
                collapsible: true,
                defaultOpen: true,
              },
            }}
            fieldConfig={{
              locked: {
                label: "Locked",
                section: "Account",
              },

              username: {
                label: "Username",
                section: "Account",
                layout: {
                  colSpan: 6,
                },
              },

              password: {
                label: "Password",
                type: "password",
                section: "Account",
                layout: {
                  colSpan: 6,
                },
              },

              bio: {
                label: "Bio",
                type: "textarea",
                section: "Profile",
                layout: {
                  colSpan: 12,
                },
                className: "border",
                wrapperClassName: "flex flex-col gap-2",
              },

              isAdmin: {
                label: "Is Admin",
                section: "Access",
              },

              email: {
                label: "Email",
                section: "Access",
                layout: {
                  colSpan: 6,
                },
              },

              isCompany: {
                label: "Is Company",
                section: "Company",
              },

              companyName: {
                label: "Company Name",
                section: "Company",
                placeholder: "Enter your company name",
                showIf: (values) => values.isCompany,
                requiredIf: (values) => values.isCompany,
              },

              country: {
                label: "Country",
                section: "Country",
                options: [
                  { label: "Indonesia", value: "id" },
                  { label: "Japan", value: "jp" },
                ],
                layout: {
                  colSpan: 6,
                },
              },

              city: {
                label: "City",
                section: "Country",
                options: (values) =>
                  values.country === "id"
                    ? [
                        { label: "Jakarta", value: "jakarta" },
                        { label: "Bandung", value: "bandung" },
                      ]
                    : [
                        { label: "Tokyo", value: "tokyo" },
                        { label: "Osaka", value: "osaka" },
                      ],
                layout: {
                  colSpan: 6,
                },
              },

              contacts: {
                label: "Contacts",
                section: "Contacts",
              },
            }}
          />
        </section>

        <div className="flex justify-end">
          <button
            onClick={() => form.handleSubmit()}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}

// function MySelectCustom({ field }: any) {
//   return (
//     <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
//       <option>Indonesia</option>
//       <option>Japan</option>
//     </select>
//   );
// }
