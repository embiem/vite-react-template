import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useSession } from "../lib/auth-client";
import reactLogo from "../assets/react.svg";

function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto">
      {session && (
        <div className="alert alert-info mb-6">
          <span>Logged in as: {session.user?.email}</span>
        </div>
      )}

      <article className="prose prose-invert max-w-none">
        <div className="flex items-center gap-4 mb-8">
          <img src={reactLogo} className="w-16 h-16" alt="React logo" />
          <h1 className="mb-0">Full-Stack React Template</h1>
        </div>

        <p className="lead">
          A modern, production-ready full-stack web application template built
          with React and Hono. This template provides everything you need to
          start building type-safe, scalable web applications.
        </p>

        <h2>Frontend Stack</h2>
        <ul>
          <li>
            <strong>React 19</strong> - The latest version with the new React
            Compiler for automatic performance optimization
          </li>
          <li>
            <strong>TypeScript</strong> - Full type safety across your entire
            application
          </li>
          <li>
            <strong>Vite</strong> - Lightning-fast development server with hot
            module replacement
          </li>
          <li>
            <strong>React Router</strong> - Client-side routing for building
            single-page applications
          </li>
          <li>
            <strong>TanStack Query</strong> - Powerful data fetching, caching,
            and state management with automatic background refetching
          </li>
          <li>
            <strong>Tailwind CSS v4</strong> - Utility-first CSS framework for
            rapid UI development
          </li>
          <li>
            <strong>DaisyUI</strong> - Beautiful component library built on
            Tailwind CSS
          </li>
        </ul>

        <h2>Backend Stack</h2>
        <ul>
          <li>
            <strong>Hono</strong> - Ultrafast web framework for building APIs
            with a simple, Express-like interface
          </li>
          <li>
            <strong>PostgreSQL</strong> - Robust, production-ready relational
            database
          </li>
          <li>
            <strong>Drizzle ORM</strong> - Type-safe ORM with excellent
            developer experience and zero-cost abstractions
          </li>
          <li>
            <strong>Better Auth</strong> - Modern authentication solution with
            session management out of the box
          </li>
        </ul>

        <h2>Developer Experience</h2>
        <ul>
          <li>
            <strong>Concurrent Dev Servers</strong> - Run both frontend and
            backend simultaneously with one command
          </li>
          <li>
            <strong>Hot Reload</strong> - Instant feedback for both client and
            server changes
          </li>
          <li>
            <strong>Testing Ready</strong> - Vitest for unit tests and
            Playwright for end-to-end testing
          </li>
          <li>
            <strong>Type Safety</strong> - End-to-end type safety from database
            to UI
          </li>
          <li>
            <strong>ESLint</strong> - Configured with sensible defaults to catch
            errors early
          </li>
        </ul>

        <h2>Getting Started</h2>
        <p>
          Check out the{" "}
          <Link to="/items" className="link link-primary">
            Items page
          </Link>{" "}
          to see a working example of TanStack Query fetching data from the Hono
          backend. The demo shows loading states, error handling, and automatic
          caching in action.
        </p>

        <div className="alert alert-warning mt-8">
          <ExclamationCircleIcon />
          <div>
            <h3 className="font-bold mt-0">Database Setup Required</h3>
            <div className="text-sm">
              Remember to configure your PostgreSQL connection in the{" "}
              <code>.env</code> file and run <code>npm run db:push</code> to
              initialize the database schema.
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default HomePage;
