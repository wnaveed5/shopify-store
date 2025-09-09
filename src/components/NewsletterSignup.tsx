'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setShowAdditionalFields(true);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          phone: phone || undefined, 
          country: country || undefined 
        }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setPhone('');
        setCountry('');
        setShowAdditionalFields(false);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newsletter-signup">
      {!showAdditionalFields ? (
        <form onSubmit={handleEmailSubmit} className="newsletter-form">
          <div className="newsletter-input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="newsletter-input"
            />
            <button
              type="submit"
              className="newsletter-button"
            >
              Continue
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleFinalSubmit} className="newsletter-form">
          <div className="newsletter-step-indicator">
            <span className="step-text">Step 2 of 2</span>
          </div>
          
          <div className="newsletter-input-group">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number (optional)"
              className="newsletter-input"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="newsletter-input-group">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="newsletter-select"
              disabled={isSubmitting}
            >
              <option value="">Select country (optional)</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
              <option value="NL">Netherlands</option>
              <option value="SE">Sweden</option>
              <option value="NO">Norway</option>
              <option value="DK">Denmark</option>
              <option value="FI">Finland</option>
              <option value="JP">Japan</option>
              <option value="KR">South Korea</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
              <option value="BR">Brazil</option>
              <option value="MX">Mexico</option>
              <option value="AR">Argentina</option>
              <option value="CL">Chile</option>
              <option value="CO">Colombia</option>
              <option value="PE">Peru</option>
              <option value="ZA">South Africa</option>
              <option value="EG">Egypt</option>
              <option value="NG">Nigeria</option>
              <option value="KE">Kenya</option>
              <option value="MA">Morocco</option>
              <option value="AE">United Arab Emirates</option>
              <option value="SA">Saudi Arabia</option>
              <option value="IL">Israel</option>
              <option value="TR">Turkey</option>
              <option value="RU">Russia</option>
              <option value="PL">Poland</option>
              <option value="CZ">Czech Republic</option>
              <option value="HU">Hungary</option>
              <option value="RO">Romania</option>
              <option value="BG">Bulgaria</option>
              <option value="GR">Greece</option>
              <option value="PT">Portugal</option>
              <option value="IE">Ireland</option>
              <option value="BE">Belgium</option>
              <option value="CH">Switzerland</option>
              <option value="AT">Austria</option>
              <option value="LU">Luxembourg</option>
              <option value="NZ">New Zealand</option>
              <option value="SG">Singapore</option>
              <option value="HK">Hong Kong</option>
              <option value="TW">Taiwan</option>
              <option value="TH">Thailand</option>
              <option value="MY">Malaysia</option>
              <option value="ID">Indonesia</option>
              <option value="PH">Philippines</option>
              <option value="VN">Vietnam</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div className="newsletter-button-group">
            <button
              type="button"
              onClick={() => setShowAdditionalFields(false)}
              className="newsletter-button-secondary"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="newsletter-button"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Early Access'}
            </button>
          </div>
        </form>
      )}
      
      {status === 'success' && (
        <div className="newsletter-success">
          Thank you for subscribing! You&apos;ll receive our latest updates soon.
        </div>
      )}
      
      {status === 'error' && (
        <div className="newsletter-error">
          Something went wrong. Please try again.
        </div>
      )}
    </div>
  );
}
