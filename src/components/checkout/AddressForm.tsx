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
  { code: 'CN', name: '中国' },
  { code: 'US', name: '美国' },
  { code: 'GB', name: '英国' },
  { code: 'JP', name: '日本' },
  { code: 'KR', name: '韩国' },
  { code: 'AU', name: '澳大利亚' },
  { code: 'DE', name: '德国' },
  { code: 'FR', name: '法国' },
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
      newErrors.name = '请输入收货人姓名';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号码';
    }

    if (!formData.country) {
      newErrors.country = '请选择国家';
    }

    if (!formData.province.trim()) {
      newErrors.province = '请输入省份';
    }

    if (!formData.city.trim()) {
      newErrors.city = '请输入城市';
    }

    if (!formData.district.trim()) {
      newErrors.district = '请输入区县';
    }

    if (!formData.detail.trim()) {
      newErrors.detail = '请输入详细地址';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = '请输入邮政编码';
    } else if (!/^\d{6}$/.test(formData.postalCode)) {
      newErrors.postalCode = '请输入正确的邮政编码';
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
        <h2 className="text-lg font-semibold mb-4">收货地址</h2>
      </div>

      {/* 姓名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          收货人姓名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="请输入收货人姓名"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* 电话 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          联系电话 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="请输入联系电话"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* 国家 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          国家 <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.country}
          onChange={(e) => handleChange('country', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.country ? 'border-red-500' : 'border-gray-300'
          } bg-white`}
        >
          <option value="">请选择国家</option>
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
      </div>

      {/* 省份和城市 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            省份 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.province}
            onChange={(e) => handleChange('province', e.target.value)}
            className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.province ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="省份"
          />
          {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            城市 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="城市"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
      </div>

      {/* 区县 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          区县 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.district}
          onChange={(e) => handleChange('district', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.district ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="请输入区县"
        />
        {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
      </div>

      {/* 详细地址 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          详细地址 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.detail}
          onChange={(e) => handleChange('detail', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.detail ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="街道、楼栋、门牌号等"
        />
        {errors.detail && <p className="text-red-500 text-sm mt-1">{errors.detail}</p>}
      </div>

      {/* 邮政编码 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          邮政编码 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.postalCode}
          onChange={(e) => handleChange('postalCode', e.target.value)}
          className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.postalCode ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="请输入邮政编码"
          maxLength={6}
        />
        {errors.postalCode && (
          <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
        )}
      </div>
    </form>
  );
}
