"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductSpec {
  name: string;
  values: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  status: string;
  specs: ProductSpec[];
  stock: number;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "0",
    images: [] as string[],
  });
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecValues, setNewSpecValues] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${params.id}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const product: Product = await res.json();

        setFormData({
          name: product.name,
          description: product.description || "",
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || "",
          category: product.category || "",
          stock: product.stock.toString(),
          images: product.images || [],
        });
        setSpecs(product.specs || []);
      } catch {
        setError("Failed to load product");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddSpec = () => {
    if (newSpecName.trim() && newSpecValues.trim()) {
      const values = newSpecValues.split(",").map((v) => v.trim());
      setSpecs((prev) => [...prev, { name: newSpecName.trim(), values }]);
      setNewSpecName("");
      setNewSpecValues("");
    }
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
          images: formData.images,
          category: formData.category || undefined,
          specs,
          stock: parseInt(formData.stock) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        {error && (
          <div className="bg-red-50 text-error text-sm p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border border-border p-6 space-y-6">
          <h2 className="text-lg font-medium text-text-primary">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Product Name *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Price *
              </label>
              <Input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Original Price
              </label>
              <Input
                type="number"
                step="0.01"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full h-10 px-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select category</option>
                <option value="Eye Mask">Eye Mask</option>
                <option value="Accessories">Accessories</option>
                <option value="Sleep Aid">Sleep Aid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Stock
              </label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-border p-6 space-y-6 mt-6">
          <h2 className="text-lg font-medium text-text-primary">Product Images</h2>

          <div className="flex gap-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImage())}
            />
            <Button type="button" variant="secondary" onClick={handleAddImage}>
              Add
            </Button>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-bg-secondary rounded-md overflow-hidden">
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-error text-white rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="bg-white rounded-lg border border-border p-6 space-y-6 mt-6">
          <h2 className="text-lg font-medium text-text-primary">Product Specifications</h2>

          <div className="flex gap-2">
            <Input
              value={newSpecName}
              onChange={(e) => setNewSpecName(e.target.value)}
              placeholder="Spec name (e.g., Color)"
              className="flex-1"
            />
            <Input
              value={newSpecValues}
              onChange={(e) => setNewSpecValues(e.target.value)}
              placeholder="Values (comma separated, e.g., Black, White)"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSpec())}
            />
            <Button type="button" variant="secondary" onClick={handleAddSpec}>
              Add
            </Button>
          </div>

          {specs.length > 0 && (
            <div className="space-y-2">
              {specs.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-bg-secondary rounded-md"
                >
                  <div>
                    <span className="font-medium text-text-primary">{spec.name}:</span>
                    <span className="text-text-secondary ml-2">{spec.values.join(", ")}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="text-error text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
