'use client';

import { useState } from 'react';

export interface AddressFormData {
  name: string;
  phone: string;
  country: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  postalCode: string;
}

interface AddressFormProps {
  onSubmit?: (data: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
}

interface FormErrors {
  name?: string;
  phone?: string;
  country?: string;
  province?: string;
  city?: string;
  district?: string;
  detail?: string;
  postalCode?: string;
}

const COUNTRIES = [
  { code: 'CN', name: 'China' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
];

export function AddressForm({ onSubmit, initialData }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    country: initialData?.country || 'CN',
    province: initialData?.province || '',
    city: initialData?.city || '',
    district: initialData?.district || '',
    detail: initialData?.detail || '',
    postalCode: initialData?.postalCode || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter recipient name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter phone number';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.country) {
      newErrors.country = 'Please select country';
    }

    if (!formData.province.trim()) {
      newErrors.province = 'Please enter province';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter city';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'Please enter district';
    }

    if (!formData.detail.trim()) {
      newErrors.detail = 'Please enter detailed address';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Please enter postal code';
    } else if (!/^\d{6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Please enter a valid postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipient Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter recipient name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter phone number"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.country}
          onChange={(e) => handleChange('country', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.country ? 'border-red-500' : 'border-gray-300'
          } bg-white`}
        >
          <option value="">Select country</option>
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
      </div>

      {/* Province and City */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.province}
            onChange={(e) => handleChange('province', e.target.value)}
            className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.province ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Province"
          />
          {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="City"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          District <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.district}
          onChange={(e) => handleChange('district', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.district ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter district"
        />
        {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.detail}
          onChange={(e) => handleChange('detail', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.detail ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Street, building, unit, etc."
        />
        {errors.detail && <p className="text-red-500 text-sm mt-1">{errors.detail}</p>}
      </div>

      {/* Postal Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Postal Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.postalCode}
          onChange={(e) => handleChange('postalCode', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.postalCode ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter postal code"
          maxLength={6}
        />
        {errors.postalCode && (
          <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
        )}
      </div>
    </form>
  );
}
