'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function EarlyAccessPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1|US');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isPasswordMode, setIsPasswordMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      if (isPasswordMode) {
        // Password mode
        if (password === 'homura2024') {
          // Set session-only cookie - expires when browser is closed
          document.cookie = 'storeAccess=granted; path=/'; // No max-age = session cookie
          // Redirect to home page
          window.location.href = '/';
        } else {
          setStatus('error');
        }
      } else {
        // Early access mode
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            phone: phone || undefined, 
            country: selectedCountry || undefined 
          }),
        });

        if (response.ok) {
          setStatus('success');
          // Don't set cookie or redirect for early access signup
          // Users will stay on the password page
        } else {
          setStatus('error');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <div className="password-page-container">
      <div className="password-page-content">
        <div className="password-header">
          <h1 className="password-title">
            homura
          </h1>
          <p className="password-subtitle">
            {isPasswordMode ? 'Enter password to access store' : 'Sign up for early access'}
          </p>
        </div>

        <div className="password-content">
          <div className="password-form-section">
            <form onSubmit={handleSubmit} className="password-form">
              {isPasswordMode ? (
                <div className="password-input-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="password-input"
                    disabled={isLoading}
                  />
                </div>
              ) : (
                <>
                  <div className="password-input-group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="password-input"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="phone-input-group">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number (optional)"
                      className="phone-input"
                      disabled={isLoading}
                    />
                    <select
                      value={countryCode}
                      onChange={(e) => {
                        const selected = e.target.value;
                        const [code, country] = selected.split('|');
                        setCountryCode(code);
                        setSelectedCountry(country);
                      }}
                      className="country-code-select"
                      disabled={isLoading}
                    >
                      <option value="+1|US">🇺🇸 +1</option>
                      <option value="+1|CA">🇨🇦 +1</option>
                      <option value="+44|GB">🇬🇧 +44</option>
                      <option value="+61|AU">🇦🇺 +61</option>
                      <option value="+49|DE">🇩🇪 +49</option>
                      <option value="+33|FR">🇫🇷 +33</option>
                      <option value="+39|IT">🇮🇹 +39</option>
                      <option value="+34|ES">🇪🇸 +34</option>
                      <option value="+31|NL">🇳🇱 +31</option>
                      <option value="+46|SE">🇸🇪 +46</option>
                      <option value="+47|NO">🇳🇴 +47</option>
                      <option value="+45|DK">🇩🇰 +45</option>
                      <option value="+358|FI">🇫🇮 +358</option>
                      <option value="+81|JP">🇯🇵 +81</option>
                      <option value="+82|KR">🇰🇷 +82</option>
                      <option value="+86|CN">🇨🇳 +86</option>
                      <option value="+91|IN">🇮🇳 +91</option>
                      <option value="+55|BR">🇧🇷 +55</option>
                      <option value="+52|MX">🇲🇽 +52</option>
                      <option value="+54|AR">🇦🇷 +54</option>
                      <option value="+56|CL">🇨🇱 +56</option>
                      <option value="+57|CO">🇨🇴 +57</option>
                      <option value="+51|PE">🇵🇪 +51</option>
                      <option value="+27|ZA">🇿🇦 +27</option>
                      <option value="+20|EG">🇪🇬 +20</option>
                      <option value="+234|NG">🇳🇬 +234</option>
                      <option value="+254|KE">🇰🇪 +254</option>
                      <option value="+212|MA">🇲🇦 +212</option>
                      <option value="+971|AE">🇦🇪 +971</option>
                      <option value="+966|SA">🇸🇦 +966</option>
                      <option value="+972|IL">🇮🇱 +972</option>
                      <option value="+90|TR">🇹🇷 +90</option>
                      <option value="+7|RU">🇷🇺 +7</option>
                      <option value="+48|PL">🇵🇱 +48</option>
                      <option value="+420|CZ">🇨🇿 +420</option>
                      <option value="+36|HU">🇭🇺 +36</option>
                      <option value="+40|RO">🇷🇴 +40</option>
                      <option value="+359|BG">🇧🇬 +359</option>
                      <option value="+30|GR">🇬🇷 +30</option>
                      <option value="+351|PT">🇵🇹 +351</option>
                      <option value="+353|IE">🇮🇪 +353</option>
                      <option value="+32|BE">🇧🇪 +32</option>
                      <option value="+41|CH">🇨🇭 +41</option>
                      <option value="+43|AT">🇦🇹 +43</option>
                      <option value="+352|LU">🇱🇺 +352</option>
                      <option value="+64|NZ">🇳🇿 +64</option>
                      <option value="+65|SG">🇸🇬 +65</option>
                      <option value="+852|HK">🇭🇰 +852</option>
                      <option value="+886|TW">🇹🇼 +886</option>
                      <option value="+66|TH">🇹🇭 +66</option>
                      <option value="+60|MY">🇲🇾 +60</option>
                      <option value="+62|ID">🇮🇩 +62</option>
                      <option value="+63|PH">🇵🇭 +63</option>
                      <option value="+84|VN">🇻🇳 +84</option>
                    </select>
                  </div>
                </>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="password-button"
              >
                {isLoading ? (isPasswordMode ? 'Checking...' : 'Signing up...') : (isPasswordMode ? 'Enter Store' : 'Get Early Access')}
              </button>
              
              {status === 'success' && !isPasswordMode && (
                <div className="password-success">
                  Thank you! You&apos;ll receive early access updates soon.
                </div>
              )}
              
              {status === 'error' && (
                <div className="password-error">
                  {isPasswordMode ? 'Incorrect password. Please try again.' : 'Something went wrong. Please try again.'}
                </div>
              )}
            </form>
            
            <div className="mode-toggle">
              <button
                type="button"
                onClick={() => {
                  setIsPasswordMode(!isPasswordMode);
                  setStatus('idle');
                  setEmail('');
                  setPhone('');
                  setCountryCode('+1');
                  setPassword('');
                }}
                className="toggle-button"
              >
                {isPasswordMode ? 'Sign up for early access instead' : 'Enter password instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
