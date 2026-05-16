import { Link } from "react-router-dom";

function AuthCard({ title, subtitle, children, footerText, footerLink, footerLinkText }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>

        {children}

        <p className="mt-6 text-center text-sm text-slate-400">
          {footerText}{" "}
          <Link to={footerLink} className="font-medium text-indigo-400 hover:text-indigo-300">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthCard;