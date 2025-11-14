import { Routes, Route, Link } from "react-router-dom";

import ItemsPage from "./pages/Items";
import HomePage from "./pages/Home";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white min-h-screen">
      <nav className="navbar bg-base-300">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            Full-Stack Template
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/items">Items (Query Demo)</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mx-auto p-8">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<ItemsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
