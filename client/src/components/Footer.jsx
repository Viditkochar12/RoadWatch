import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h2 className="text-2xl font-bold">
              Road<span className="text-yellow-400">Watch</span>
            </h2>

            <p className="text-slate-400 mt-3 leading-7">
              Making roads safer through
              community-powered reporting and
              real-time issue tracking.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2">
              <Link to="/">Home</Link>
              <Link to="/reports">Reports</Link>
              <Link to="/create-report">
                Report Damage
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">
              Contact
            </h3>

            <p className="text-slate-400">
              support@roadwatch.com
            </p>
          </div>

        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-slate-500">
          © 2026 RoadWatch. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;