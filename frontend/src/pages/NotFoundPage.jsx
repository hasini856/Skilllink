import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="text-center">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <p className="mt-4 text-lg text-slate-600">Page not found</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
      >
        Go home
      </Link>
    </section>
  );
}

export default NotFoundPage;
