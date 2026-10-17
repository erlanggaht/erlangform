import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { ErlForm } from "../components";
import { defaultValues, exampleValues } from "./default-values";
import "./demo.css";
import { DemoTextField } from "./DemoTextField";
import { fieldConfig } from "./field-config";
import { schema, type FormValues } from "./schema";
import { sectionConfig } from "./section-config";
import { SubmitResult } from "./SubmitResult";
import { wizard } from "./wizard";

const fieldComponent = { string: DemoTextField };

export function DemoPage() {
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const form = useForm({
    defaultValues,
    validators: { onChange: schema },
    onSubmit: ({ value }) => setSubmittedData(value),
  });

  function resetForm(values = defaultValues) {
    // Restart the wizard while keeping the original reset baseline.
    form.reset(structuredClone(values), { keepDefaultValues: true });
    setSubmittedData(null);
    setFormVersion((version) => version + 1);
  }

  return (
    <main className="demo-page">
      <header className="demo-header">
        <a className="demo-brand" href="#" aria-label="ErlForm Demo">
          ErlForm <span className="demo-badge">Demo</span>
        </a>
        <a className="demo-source-link" href="https://github.com/erlanggaht/erlangform">
          GitHub ↗
        </a>
      </header>
      <div className="demo-intro">
        <h1>Playground</h1>
      </div>
      <div className="demo-layout">
        <section className="demo-form-panel" aria-labelledby="form-title">
          <div className="demo-form-toolbar">
            <div>
              <h2 id="form-title">Formulir pengguna</h2>
              <p className="demo-muted">Isi manual atau mulai dengan data contoh.</p>
            </div>
            <button className="demo-button" type="button" onClick={() => resetForm(exampleValues)}>
              Isi contoh
            </button>
          </div>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <ErlForm<FormValues>
              key={formVersion}
              form={form}
              schema={schema}
              fieldConfig={fieldConfig}
              fieldComponent={fieldComponent}
              sectionConfig={sectionConfig}
              wizard={wizard}
            />
            <form.Subscribe
              selector={(state) => ({
                attempts: state.submissionAttempts,
                valid: state.isValid,
                submitting: state.isSubmitting,
              })}
            >
              {({ attempts, valid, submitting }) => (
                <footer className="demo-form-footer">
                  {attempts > 0 && !valid && (
                    <p className="demo-submit-error" role="alert">
                      Periksa field yang belum valid pada setiap langkah, lalu kirim kembali.
                    </p>
                  )}
                  <button className="demo-button" type="button" onClick={() => resetForm()}>
                    Reset
                  </button>
                  <button
                    className="demo-button demo-button-primary"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "Mengirim…" : "Kirim formulir"}
                  </button>
                </footer>
              )}
            </form.Subscribe>
          </form>
        </section>
        <SubmitResult value={submittedData} />
      </div>
      <footer className="demo-page-footer">Dibuat dengan React, Zod, dan TanStack Form.</footer>
    </main>
  );
}
