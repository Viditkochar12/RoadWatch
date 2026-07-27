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
    <div className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Report Road Damage
          </h1>

          <p className="text-slate-600 mt-2">
            Provide details about the road issue so it can be tracked and
            resolved.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Issue Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="e.g. Large pothole near main road"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe the road damage..."
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Address
            </label>

            <input
              type="text"
              name="address"
              placeholder="e.g. Jaipur, Rajasthan"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          
          <button
            type="button"
            onClick={getCurrentLocation}
            className="w-full border-2 border-slate-900 text-slate-900 font-semibold py-3 rounded-xl hover:bg-slate-900 hover:text-white transition"
          >
            📍 Use My Current Location
          </button>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
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
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
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
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Road Damage Photo
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white
                        file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                        file:bg-yellow-400 file:text-slate-900 file:font-semibold
                        hover:file:bg-yellow-300"
            />

            <p className="text-sm text-slate-500 mt-2">
              JPG, PNG or WEBP. Maximum size: 5 MB.
            </p>

            {formData.image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="w-full h-56 object-cover rounded-xl border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, severity: "Low" })
              }
              className={`py-3 rounded-xl font-semibold transition ${
                formData.severity === "Low"
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-700"
              }`}
            >
              🟢 Low
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, severity: "Medium" })
              }
              className={`py-3 rounded-xl font-semibold transition ${
                formData.severity === "Medium"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              🟡 Medium
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, severity: "High" })
              }
              className={`py-3 rounded-xl font-semibold transition ${
                formData.severity === "High"
                  ? "bg-red-500 text-white"
                  : "bg-red-100 text-red-700"
              }`}
            >
              🔴 High
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full font-bold py-4 rounded-xl shadow-md transition ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-300 text-slate-900"
            }`}
          >
            {submitting ? "Submitting..." : "🚧 Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateReport;