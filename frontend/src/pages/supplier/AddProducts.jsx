import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBars,
  FaBox,
  FaClipboardCheck,
  FaLeaf,
  FaSpinner,
  FaUpload,
} from "react-icons/fa";
import SupplierSidebar from "../../components/Sidebar/SupplierSidebar";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category: "",
  image: null,
};

const categoryOptions = [
  { label: "Fertilizers", value: "Fertilizers" },
  { label: "Pesticides", value: "Pesticides" },
  { label: "Seeds", value: "Seeds" },
  { label: "Farm Equipment", value: "Farm Equipment" },
  { label: "Fresh Produce", value: "Fresh Produce" },
  { label: "Coffee", value: "Coffee" },
  { label: "Other", value: "Other" },
];

const AddProducts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Auto clear messages
  useEffect(() => {
    let timer;
    if (success || error) {
      timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);

  // Handle text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.image) {
      setError("Please upload a product image.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("quantity", formData.quantity);
      payload.append("category", formData.category);
      payload.append("image", formData.image);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Product added successfully!");
      setFormData(initialFormState);
      setPreviewUrl(null);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to add product. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-[40px] h-[calc(100vh-40px)] z-40 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <SupplierSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 w-full md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Product
            </h1>
            <p className="text-gray-600 mt-1">
              Fill in the details below to add a product to your catalog.
            </p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 md:hidden rounded-lg bg-gray-600 text-white"
          >
            <FaBars />
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Form */}
          <div className="xl:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 resize-none"
                  required
                />
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Quantity"
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              {/* Category */}
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="" disabled>
                  Select category
                </option>
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              {/* Image */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="product-image"
                />
                <label
                  htmlFor="product-image"
                  className="cursor-pointer flex flex-col items-center border-2 border-dashed rounded-xl p-6"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  ) : (
                    <FaUpload className="text-emerald-500 text-3xl" />
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Upload product image
                  </p>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaClipboardCheck /> Save Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tips */}
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-semibold flex items-center gap-2">
              <FaBox className="text-emerald-500" /> Product Tips
            </h2>
            <ul className="mt-3 text-sm text-gray-600 space-y-2">
              <li>• Use clear, high-quality images</li>
              <li>• Provide accurate pricing</li>
              <li>• Choose the correct category</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
