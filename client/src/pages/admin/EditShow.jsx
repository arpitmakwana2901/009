import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Title from "../../components/admin/Title";
import { useAuth } from "../../components/context/AuthContext";
import { API_URL } from "../../App";

const EditShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    overview: "",
    backdrop_path: "",
    release_date: "",
    genres: "",
    runtime: "",
    language: "",
    price: "",
    status: "active",
    showDatesJson: "{}",
  });

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axios.get(`${API_URL}/shows/getShows/${id}`);
        const show = res.data?.data;
        if (!show) {
          toast.error("Show not found");
          navigate("/admin/list-shows");
          return;
        }

        const showDatesObj = show.showDates || {};
        const showDatesJson = JSON.stringify(showDatesObj, null, 2);

        setForm({
          title: show.title || "",
          overview: show.overview || "",
          backdrop_path: show.backdrop_path || "",
          release_date: show.release_date ? String(show.release_date).slice(0, 10) : "",
          genres: Array.isArray(show.genres) ? show.genres.join(", ") : "",
          runtime: show.runtime ?? "",
          language: show.language || "",
          price: show.price ?? "",
          status: show.status || "active",
          showDatesJson,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load show");
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Admin login required");
      return;
    }

    setSaving(true);
    try {
      let showDates;
      try {
        showDates = JSON.parse(form.showDatesJson || "{}");
      } catch {
        toast.error("ShowDates JSON is invalid");
        setSaving(false);
        return;
      }

      const payload = {
        title: form.title,
        overview: form.overview,
        backdrop_path: form.backdrop_path,
        release_date: form.release_date ? new Date(form.release_date) : undefined,
        genres: form.genres
          ? form.genres
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean)
          : [],
        runtime: form.runtime === "" ? undefined : Number(form.runtime),
        language: form.language,
        price: form.price === "" ? undefined : Number(form.price),
        status: form.status,
        showDates,
      };

      const res = await axios.put(`${API_URL}/shows/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        toast.success("Show updated");
        navigate("/admin/list-shows");
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <>
      <Title text1="Edit" text2="Show" />

      <form onSubmit={handleSave} className="max-w-3xl mt-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Movie Name</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Poster Image URL</label>
          <input
            name="backdrop_path"
            value={form.backdrop_path}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Description</label>
          <textarea
            name="overview"
            value={form.overview}
            onChange={handleChange}
            rows={4}
            className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Genre (comma separated)</label>
            <input
              name="genres"
              value={form.genres}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Language</label>
            <input
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Duration (minutes)</label>
            <input
              type="number"
              name="runtime"
              value={form.runtime}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Release Date</label>
            <input
              type="date"
              name="release_date"
              value={form.release_date}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Ticket Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Show Dates & Times (JSON)
          </label>
          <textarea
            name="showDatesJson"
            value={form.showDatesJson}
            onChange={handleChange}
            rows={8}
            className="w-full font-mono text-sm bg-transparent border border-gray-600 rounded-md px-3 py-2 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: {`{ "2025-12-19": ["10:00", "14:00"], "2025-12-20": ["18:00"] }`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/list-shows")}
            className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default EditShow;
