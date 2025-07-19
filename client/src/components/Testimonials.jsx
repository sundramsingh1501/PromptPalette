import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Testimonials = () => {
  const { user } = useContext(AppContext);
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ text: "", stars: 5 });
  const [editing, setEditing] = useState(false); // track if user is editing

  useEffect(() => {
  localStorage.removeItem("testimonials");
  setTestimonials([]);
}, []);

  // Load testimonials and prefill if editing
  useEffect(() => {
    const stored = localStorage.getItem("testimonials");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTestimonials(parsed);

      if (user) {
        const existing = parsed.find((t) => t.name === user.name);
        if (existing) {
          setForm({ text: existing.text, stars: existing.stars });
        }
      }
    }
  }, [user]);

  // Save to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("testimonials", JSON.stringify(testimonials));
  }, [testimonials]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;

    const updated = {
      name: user.name,
      role: user.role || "Verified User",
      image: user.image || assets.profile_icon,
      stars: parseInt(form.stars),
      text: form.text,
    };

    const existingIndex = testimonials.findIndex((t) => t.name === user.name);

    if (existingIndex !== -1) {
      const updatedList = [...testimonials];
      updatedList[existingIndex] = updated;
      setTestimonials(updatedList);
    } else {
      setTestimonials((prev) => [...prev, updated]);
    }

    setEditing(false); // hide form after submission
  };

  const handleEditClick = () => {
    const current = testimonials.find((t) => t.name === user.name);
    if (current) {
      setForm({ text: current.text, stars: current.stars });
      setEditing(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-20 py-12"
    >
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Customer Testimonials</h1>
      <p className="text-gray-500 mb-12">What Our Users Are Saying</p>

      {/* Show form only if editing or first-time submit */}
      {user && (editing || !testimonials.some((t) => t.name === user.name)) && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white p-6 rounded-lg shadow mb-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={user.name}
              disabled
              className="border p-2 rounded bg-gray-100"
            />
            <input
              name="role"
              value={user.role || "Verified User"}
              disabled
              className="border p-2 rounded bg-gray-100"
            />
            <input
              type="number"
              name="stars"
              min="1"
              max="5"
              value={form.stars}
              onChange={handleChange}
              className="border p-2 rounded col-span-2"
            />
          </div>
          <textarea
            name="text"
            placeholder="Your testimonial"
            value={form.text}
            onChange={handleChange}
            className="border p-2 rounded mt-4 w-full"
            rows={3}
            required
          />
          <button
            type="submit"
            className="mt-4 bg-gray-800 text-white py-2 px-6 rounded"
          >
            {editing ? "Update Testimonial" : "Submit Testimonial"}
          </button>
        </form>
      )}

      {!user && (
        <p className="text-gray-500 italic mb-10">
          Please log in to submit your testimonial.
        </p>
      )}

      {/* Testimonials display */}
      <div className="flex flex-wrap gap-6 justify-center">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white/20 p-8 rounded-lg shadow-md w-80 m-auto text-center hover:scale-[1.02] transition-all"
          >
            <div className="flex flex-col items-center">
              <img
                src={testimonial.image || assets.profile_icon}
                alt="user"
                className="rounded-full w-14 h-14 object-cover"
              />
              <h2 className="text-lg font-semibold mt-3">{testimonial.name}</h2>
              <p className="text-gray-500 text-sm">{testimonial.role}</p>
              <div className="flex mt-2 mb-4">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <img
                    key={i}
                    src={assets.rating_star}
                    alt="★"
                    className="w-4 h-4"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{testimonial.text}</p>

              {/* Show edit button if it's the current user's testimonial */}
              {user && testimonial.name === user.name && !editing && (
                <button
                  onClick={handleEditClick}
                  className="mt-4 text-sm text-blue-600 underline"
                >
                  Edit Testimonial
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonials;
