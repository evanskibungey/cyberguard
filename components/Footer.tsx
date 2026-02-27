export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0f172a] border-t border-[#1e3a5f] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <span className="font-semibold text-slate-300">CyberGuard</span>
          <span>— Cybersecurity Awareness &amp; Threat Detection</span>
        </div>
        <p>© {year} Student Project. Educational use only.</p>
      </div>
    </footer>
  );
}
