<button
  onClick={async () => {
    const res = await fetch("/api/app-builder/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const t = await res.text();
      alert(t || "Export failed");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "iblacker-app.zip";
    a.click();
    window.URL.revokeObjectURL(url);
  }}
  className="mt-4 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
>
  Download Project ZIP
</button>