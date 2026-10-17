import type { FormValues } from "./schema";

export function SubmitResult({ value }: { value: FormValues | null }) {
  return (
    <aside className="demo-result" aria-labelledby="result-title">
      <div className="demo-panel-heading">
        <h2 id="result-title">Hasil submit</h2>
        <span className="demo-status">{value ? "Berhasil" : "Belum ada data"}</span>
      </div>
      <p className="demo-muted">Data yang lolos validasi akan muncul di sini.</p>
      <div aria-live="polite">
        {value ? (
          <pre className="demo-json">
            {JSON.stringify(
              value,
              (_key, item) =>
                item instanceof File ? { name: item.name, size: item.size, type: item.type } : item,
              2,
            )}
          </pre>
        ) : (
          <div className="demo-empty">
            <span className="demo-empty-symbol" aria-hidden="true">
              {"{ }"}
            </span>
            <p>Mulai dari formulir di sebelah.</p>
            <p className="demo-muted">Gunakan “Isi contoh” untuk mencoba lebih cepat.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
