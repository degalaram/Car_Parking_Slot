import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const BookingTermsSection = ({ onTermsAcceptance, termsAccepted }) => {
  const handleTermsChange = (checked) => {
    onTermsAcceptance(checked);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="FileText" size={20} className="text-primary" />
        Terms & Conditions
      </h3>

      <div className="space-y-4">
        {/* Terms List */}
        <div className="bg-muted/20 rounded-lg p-4 space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Icon name="Clock" size={16} className="text-muted-foreground mt-0.5" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Cancellation Policy:</span>
              Free cancellation up to 2 hours before your booking time.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Icon name="Car" size={16} className="text-muted-foreground mt-0.5" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Vehicle Policy:</span>
              Only the registered vehicle type is allowed in the reserved slot.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Icon name="CreditCard" size={16} className="text-muted-foreground mt-0.5" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Payment:</span>
              Full payment is required to confirm your booking.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Icon name="Shield" size={16} className="text-muted-foreground mt-0.5" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Liability:</span>
              You are responsible for any damage to the facility or other vehicles.
            </p>
          </div>
        </div>

        {/* Terms Acceptance Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <Checkbox
            id="terms-acceptance"
            checked={termsAccepted}
            onChange={(e) => handleTermsChange(e.target.checked)}
            className="mt-0.5"
          />
          <label htmlFor="terms-acceptance" className="text-sm text-foreground leading-relaxed cursor-pointer">
            I agree to the{' '}
            <button className="text-primary hover:underline font-medium">
              Terms & Conditions
            </button>
            {' '}and{' '}
            <button className="text-primary hover:underline font-medium">
              Privacy Policy
            </button>
            . I understand the cancellation policy and my responsibilities.
          </label>
        </div>

        {/* Additional Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Info" size={14} />
          <p>
            By proceeding, you'll receive booking confirmation via email and SMS.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingTermsSection;
