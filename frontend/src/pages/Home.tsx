import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="font-bold text-xl">Swing Notes</h1>
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">Logga in</Link>
          <Link to="/register" className="hover:underline">Registrera</Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-semibold mb-4">Välkommen till Swing Notes!</h2>
        <p className="text-center max-w-xl">
          Din plats för att spara och hantera dina anteckningar enkelt och säkert.
        </p>
        <div className="mt-8 space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Logga in
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
          >
            Registrera
          </Link>
        </div>
      </main>
    </div>
  );
}
