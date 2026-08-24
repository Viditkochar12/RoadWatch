import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { createReport } from "../services/reportService";
import { analyzeReportWithAI } from "../services/aiService";
import { getPromisifiedLocation } from "../utils/asyncHelpers";
import { toast } from "react-toastify";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";

function CreateReport() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // State Management with useState: Multi-field form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    severity: "Medium",
    image: null,
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Side effects with useEffect: Manage Object URL lifecycle to prevent memory leaks
  useEffect(() => {
    if (!formData.image) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.image);
    setImagePreviewUrl(objectUrl);

    // Cleanup function revokes blob URL when image changes or component unmounts
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Functional state update
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5 MB.");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  // Promisified Geolocation (Promises vs Callbacks + async/await)
  const handleGetCurrentLocation = async () => {
    try {
      setLocating(true);
      const coords = await getPromisifiedLocation({ timeout: 8000, enableHighAccuracy: true });

      setFormData((prev) => ({
        ...prev,
        latitude: coords.latitude.toFixed(6),
        longitude: coords.longitude.toFixed(6),
      }));

      toast.success("GPS Coordinates retrieved successfully!");
    } catch (error) {
      console.error("Promisified location failed:", error.message);
      toast.error(error.message || "Failed to retrieve location.");
    } finally {
      setLocating(false);
    }
  };

  // AI Application Engineering: Structured Output Triage Trigger
  const handleAITriage = async () => {
    if (!formData.title && !formData.description) {
      toast.warn("Please enter a title or description first for AI analysis.");
      return;
    }

    try {
      setAiAnalyzing(true);
      const response = await analyzeReportWithAI(
        {
          title: formData.title,
          description: formData.description,
          location: formData.address,
          reportedSeverity: formData.severity,
        },
        token
      );

      const analysis = response.data;
      setAiResult(analysis);

      // Auto-populate / adjust severity if suggested by AI
      if (analysis.aiSeverity && ["Low", "Medium", "High"].includes(analysis.aiSeverity)) {
        setFormData((prev) => ({ ...prev, severity: analysis.aiSeverity }));
      }

      toast.success(`AI Triage complete! Classified as: ${analysis.category.replace(/_/g, " ")}`);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      toast.error(error.response?.data?.message || "AI Analysis unavailable.");
    } finally {
      setAiAnalyzing(false);
    }
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

    if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
      toast.error("Latitude must be between -90 and 90.");
      return;
    }

    if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
      toast.error("Longitude must be between -180 and 180.");
      return;
    }

    try {
      setSubmitting(true);

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

      toast.success("Report submitted successfully with AI problem modeling metadata!");

      setFormData({
        title: "",
        description: "",
        address: "",
        latitude: "",
        longitude: "",
        severity: "Medium",
        image: null,
      });
      setAiResult(null);
    } catch (error) {
      console.error("Report submission failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-sky-50 to-blue-50 overflow-hidden">
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative px-4 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              🚧 Report Road Damage · AI Assisted
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
              Help Improve Your City&apos;s Roads
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto sm:mx-0">
              Submit photo evidence, exact GPS coordinates, and leverage AI structured triage
              to fast-track municipal repair dispatch.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-6 sm:p-10 space-y-7"
          >
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Issue Title
                </label>
                <span className="text-xs text-slate-400">e.g. Deep pothole on main avenue</span>
              </div>

              <input
                type="text"
                name="title"
                placeholder="e.g. Deep crater near metro pillar 142"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full h-14 border border-slate-200 rounded-xl px-4 bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>

            {/* Description + AI Trigger */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleAITriage}
                  disabled={aiAnalyzing}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full transition cursor-pointer"
                >
                  <span>✨</span>
                  {aiAnalyzing ? "Analyzing with AI..." : "AI Auto-Triage & Classify"}
                </button>
              </div>

              <textarea
                name="description"
                placeholder="Describe the severity, damage size, and how it impacts vehicular or pedestrian traffic..."
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none leading-relaxed"
              />
            </div>

            {/* AI Structured Output Inspection Banner */}
            {aiResult && (
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-slate-800 space-y-3 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                      AI Structured Output Assessment
                    </h2>
                  </div>
                  <Badge variant={aiResult.safetyHazard ? "danger" : "warning"}>
                    {aiResult.safetyHazard ? "⚠️ Hazard Detected" : "Standard Risk"}
                  </Badge>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {aiResult.summary}
                </p>

                <div className="grid sm:grid-cols-3 gap-2 pt-2 border-t border-amber-200/60 text-xs">
                  <div>
                    <span className="text-slate-500 block">Standard Category:</span>
                    <span className="font-bold text-slate-900 capitalize">
                      {aiResult.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Urgency Score:</span>
                    <span className="font-bold text-slate-900">
                      {aiResult.urgencyScore} / 10
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Est. Repair Time:</span>
                    <span className="font-bold text-slate-900">
                      ~{aiResult.estimatedRepairDays} Days
                    </span>
                  </div>
                </div>

                <div className="text-xs text-amber-900 bg-white/70 p-2.5 rounded-lg">
                  <strong>Municipal Recommendation:</strong> {aiResult.actionableRecommendation}
                </div>
              </div>
            )}

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Street Address / Landmark
              </label>

              <input
                type="text"
                name="address"
                placeholder="e.g. MI Road, near Ajmeri Gate, Jaipur"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full h-14 border border-slate-200 rounded-xl px-4 bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>

            {/* Geolocation with Promisified API */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              loading={locating}
              onClick={handleGetCurrentLocation}
              className="w-full"
              icon="📍"
            >
              {locating ? "Acquiring GPS via Promisified API..." : "Use My Current GPS Location (Promisified)"}
            </Button>

            {/* Coordinates */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  placeholder="26.912400"
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
                  placeholder="75.787300"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  className="w-full h-12 border border-slate-200 rounded-lg px-3 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Photo Upload with Object URL Cleanup */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Road Damage Photo Evidence
              </label>

              <label
                htmlFor="road-damage-photo"
                className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-2xl px-6 py-8 bg-slate-50 hover:bg-amber-50/60 hover:border-amber-400 transition-all duration-200 cursor-pointer text-center"
              >
                <span className="text-3xl">📤</span>
                <span className="font-semibold text-slate-700">
                  {formData.image ? formData.image.name : "Click to select or drag a photo"}
                </span>
                <span className="text-sm text-slate-500">
                  JPG, PNG or WEBP (Max 5 MB)
                </span>

                <input
                  id="road-damage-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>

              {imagePreviewUrl && (
                <div className="mt-4 relative group">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-56 object-cover rounded-2xl border border-slate-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                    className="absolute top-3 right-3 bg-slate-900/80 text-white rounded-full p-2 hover:bg-red-600 transition"
                    title="Remove Image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Severity Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Severity Level
              </label>

              <div className="grid grid-cols-3 gap-3">
                {["Low", "Medium", "High"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, severity: level }))}
                    className={`py-3.5 rounded-xl font-bold transition-all duration-200 border-2 hover:-translate-y-0.5 cursor-pointer ${
                      formData.severity === level
                        ? level === "High"
                          ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/30"
                          : level === "Medium"
                          ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30"
                          : "bg-green-500 text-white border-green-500 shadow-md shadow-green-500/30"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-white"
                    }`}
                  >
                    {level === "Low" ? "🟢 Low" : level === "Medium" ? "🟡 Medium" : "🔴 High"}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="pill"
              loading={submitting}
              className="w-full"
              icon="→"
              iconPosition="right"
            >
              {submitting ? "Submitting Report..." : "Submit Incident Report"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateReport;