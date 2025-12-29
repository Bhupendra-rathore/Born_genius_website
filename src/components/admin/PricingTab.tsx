import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CourseFormData } from '../../services/coursesService';

interface Props {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const PricingTab: React.FC<Props> = ({ formData, setFormData }) => {
  const pricing = formData.pricing || {
    originalPrice: 0,
    discountedPrice: 0,
    currency: 'INR',
    perSessionPrice: 0,
    paymentPlans: [],
    moneyBackGuarantee: false,
    freeTrial: false,
  };

  const updatePricing = (field: string, value: any) => {
    setFormData({
      ...formData,
      pricing: { ...pricing, [field]: value },
    });
  };

  const addPaymentPlan = () => {
    updatePricing('paymentPlans', [...pricing.paymentPlans, '']);
  };

  const updatePaymentPlan = (index: number, value: string) => {
    const updated = [...pricing.paymentPlans];
    updated[index] = value;
    updatePricing('paymentPlans', updated);
  };

  const removePaymentPlan = (index: number) => {
    const updated = pricing.paymentPlans.filter((_, i) => i !== index);
    updatePricing('paymentPlans', updated);
  };

  const discountPercentage =
    pricing.originalPrice > 0
      ? Math.round(
          ((pricing.originalPrice - pricing.discountedPrice) / pricing.originalPrice) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Pricing Details</h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original Price
          </label>
          <input
            type="number"
            min="0"
            value={pricing.originalPrice}
            onChange={(e) => updatePricing('originalPrice', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="12999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discounted Price
          </label>
          <input
            type="number"
            min="0"
            value={pricing.discountedPrice}
            onChange={(e) => updatePricing('discountedPrice', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="9999"
          />
        </div>
      </div>

      {discountPercentage > 0 && (
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            Discount: <span className="font-semibold">{discountPercentage}% OFF</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={pricing.currency}
            onChange={(e) => updatePricing('currency', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Per Session Price
          </label>
          <input
            type="number"
            min="0"
            value={pricing.perSessionPrice}
            onChange={(e) => updatePricing('perSessionPrice', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="625"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Payment Plans
          </label>
          <button
            type="button"
            onClick={addPaymentPlan}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        </div>

        <div className="space-y-2">
          {pricing.paymentPlans.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No payment plans added yet
            </div>
          ) : (
            pricing.paymentPlans.map((plan, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={plan}
                  onChange={(e) => updatePaymentPlan(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Full payment, 2 installments"
                />
                <button
                  type="button"
                  onClick={() => removePaymentPlan(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={pricing.moneyBackGuarantee}
            onChange={(e) => updatePricing('moneyBackGuarantee', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Money Back Guarantee
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={pricing.freeTrial}
            onChange={(e) => updatePricing('freeTrial', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Free Trial Available</span>
        </label>
      </div>
    </div>
  );
};
