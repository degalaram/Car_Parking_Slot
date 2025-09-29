import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentMethodSection = ({ onPaymentMethodChange, selectedMethod }) => {
  const paymentMethods = [
    {
      id: 'card_1',
      type: 'card',
      name: 'Credit/Debit Card',
      details: '**** **** **** 1234',
      icon: 'CreditCard',
      preferred: true
    },
    {
      id: 'paypal',
      type: 'paypal',
      name: 'PayPal',
      details: 'user@example.com',
      icon: 'Wallet'
    },
    {
      id: 'apple_pay',
      type: 'apple_pay',
      name: 'Apple Pay',
      details: 'Touch ID or Face ID',
      icon: 'Smartphone'
    },
    {
      id: 'google_pay',
      type: 'google_pay',
      name: 'Google Pay',
      details: 'Quick & Secure',
      icon: 'Smartphone'
    }
  ];

  const handleMethodSelect = (methodId) => {
    onPaymentMethodChange(methodId);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="CreditCard" size={20} className="text-primary" />
        Payment Method
      </h3>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            className={`relative flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedMethod === method.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/20 hover:border-muted-foreground/30'
            }`}
          >
            {/* Method Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <Icon name={method.icon} size={20} />
            </div>

            {/* Method Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">{method.name}</h4>
                {method.preferred && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    Preferred
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{method.details}</p>
            </div>

            {/* Selection Indicator */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === method.id
                ? 'border-primary bg-primary'
                : 'border-muted-foreground/30'
            }`}>
              {selectedMethod === method.id && (
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              )}
            </div>
          </div>
        ))}

        {/* Add New Payment Method */}
        <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <Icon name="Plus" size={20} />
          <span className="font-medium">Add New Payment Method</span>
        </button>
      </div>

      {/* Security Note */}
      <div className="mt-4 flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <Icon name="Shield" size={16} className="text-green-600 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-green-800">Secure Payment</p>
          <p className="text-green-700">Your payment information is encrypted and secure.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSection;
