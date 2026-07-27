import { useState } from "react";
import { Navigate } from "react-router-dom";
import { createReport } from "../services/reportService";
import { toast } from "react-toastify";

function CreateReport() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    severity: "Low",
    image: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
      },
      (error) => {
        console.error("Location error:", error);
        toast.error("Unable to get your location. Please allow location permission.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const latitude = Number(formData.latitude);
    const longitude = Number(formData.longitude);

    if (formData.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters.");
      return;
    }

    if (formData.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters.");
      return;
    }

    if (formData.address.trim().length < 3) {
      toast.error("Please enter a valid address.");
      return;
    }

    if (
      Number.isNaN(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      toast.error("Latitude must be between -90 and 90.");
      return;
    }

    if (
      Number.isNaN(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      toast.error("Longitude must be between -180 and 180.");
      return;
    }

    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      await createReport(
        {
          title: formData.title,
          description: formData.description,
          image: formData.image,
          address: formData.address,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          severity: formData.severity,
        },
        token
      );

      toast.success("Report submitted successfully!");

      setFormData({
        title: "",
        description: "",
        address: "",
        latitude: "",
        longitude: "",
        severity: "Low",
        image: null,
      });
    } catch (error) {
      console.error("Report submission failed:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to submit report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-sky-50 to-blue-50 overflow-hidden">

      {/* Faint blueprint grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Decorative blurred accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-0 w-[28rem] h-[28rem] bg-blue-300/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative px-4 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">

          {/* Hero Header */}
          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              🚧 Report Road Damage
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
              Help Improve Your City&apos;s Roads
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto sm:mx-0">
              Submit accurate information so authorities can quickly locate
              and resolve road issues.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-6 sm:p-10 space-y-7"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Issue Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Large pothole near main road"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full h-14 border border-slate-200 rounded-xl px-4 bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Describe the road damage..."
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Address
              </label>

              <input
                type="text"
                name="address"
                placeholder="e.g. Jaipur, Rajasthan"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full h-14 border border-slate-200 rounded-xl px-4 bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full h-14 flex items-center justify-center gap-2 border-2 border-slate-900 text-slate-900 font-semibold rounded-xl hover:bg-slate-900 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
            >
              📍 Use My Current Location
            </button>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  placeholder="26.9124"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  className="w-full h-12 border border-slate-200 rounded-lg px-3 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  placeholder="75.7873"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  className="w-full h-12 border border-slate-200 rounded-lg px-3 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Road Damage Photo
              </label>

              <label
                htmlFor="road-damage-photo"
                className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-2xl px-6 py-10 bg-slate-50 hover:bg-amber-50/60 hover:border-amber-400 transition-all duration-200 cursor-pointer text-center"
              >
                <span className="text-3xl">📤</span>

                <span className="font-semibold text-slate-700">
                  {formData.image ? formData.image.name : "Click to upload a photo"}
                </span>

                <span className="text-sm text-slate-500">
                  JPG, PNG or WEBP. Maximum size: 5 MB.
                </span>

                <input
                  id="road-damage-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>

              {formData.image && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-56 object-cover rounded-2xl border border-slate-200 shadow-sm"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Severity
              </label>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, severity: "Low" })
                  }
                  className={`py-3.5 rounded-xl font-semibold transition-all duration-200 border-2 hover:-translate-y-0.5 ${
                    formData.severity === "Low"
                      ? "bg-green-500 text-white border-green-500 shadow-md shadow-green-500/30"
                      : "bg-green-50 text-green-700 border-green-100"
                  }`}
                >
                  🟢 Low
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, severity: "Medium" })
                  }
                  className={`py-3.5 rounded-xl font-semibold transition-all duration-200 border-2 hover:-translate-y-0.5 ${
                    formData.severity === "Medium"
                      ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
                >
                  🟡 Medium
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, severity: "High" })
                  }
                  className={`py-3.5 rounded-xl font-semibold transition-all duration-200 border-2 hover:-translate-y-0.5 ${
                    formData.severity === "High"
                      ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/30"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  🔴 High
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`group w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full shadow-lg transition-all duration-200 ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-900 shadow-amber-400/30 hover:shadow-xl hover:shadow-amber-400/40 hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  🚧 Submit Report
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateReport;