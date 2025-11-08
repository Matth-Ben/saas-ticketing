export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">SaaS Ticketing Platform</h1>
        <p className="text-lg mb-8">TODO: Implement landing page</p>
        <div className="flex gap-4">
          <a
            href="/auth/login"
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Se connecter
          </a>
          <a
            href="/auth/register"
            className="px-4 py-2 border border-primary-600 text-primary-600 rounded hover:bg-primary-50"
          >
            S'inscrire
          </a>
        </div>
      </div>
    </main>
  );
}

