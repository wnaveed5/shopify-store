'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function EarlyAccessPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
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
          // Set cookie for access
          document.cookie = 'storeAccess=granted; path=/; max-age=86400'; // 24 hours
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
            phone: phone ? `${countryCode}${phone}` : undefined, 
            country: undefined 
          }),
        });

        if (response.ok) {
          setStatus('success');
          // Set cookie for access
          document.cookie = 'storeAccess=granted; path=/; max-age=86400'; // 24 hours
          // Redirect to home page after a short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
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
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="country-code-select"
                      disabled={isLoading}
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+1">🇨🇦 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+39">🇮🇹 +39</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+31">🇳🇱 +31</option>
                      <option value="+46">🇸🇪 +46</option>
                      <option value="+47">🇳🇴 +47</option>
                      <option value="+45">🇩🇰 +45</option>
                      <option value="+358">🇫🇮 +358</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+82">🇰🇷 +82</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+55">🇧🇷 +55</option>
                      <option value="+52">🇲🇽 +52</option>
                      <option value="+54">🇦🇷 +54</option>
                      <option value="+56">🇨🇱 +56</option>
                      <option value="+57">🇨🇴 +57</option>
                      <option value="+51">🇵🇪 +51</option>
                      <option value="+27">🇿🇦 +27</option>
                      <option value="+20">🇪🇬 +20</option>
                      <option value="+234">🇳🇬 +234</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+212">🇲🇦 +212</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+972">🇮🇱 +972</option>
                      <option value="+90">🇹🇷 +90</option>
                      <option value="+7">🇷🇺 +7</option>
                      <option value="+48">🇵🇱 +48</option>
                      <option value="+420">🇨🇿 +420</option>
                      <option value="+36">🇭🇺 +36</option>
                      <option value="+40">🇷🇴 +40</option>
                      <option value="+359">🇧🇬 +359</option>
                      <option value="+30">🇬🇷 +30</option>
                      <option value="+351">🇵🇹 +351</option>
                      <option value="+353">🇮🇪 +353</option>
                      <option value="+32">🇧🇪 +32</option>
                      <option value="+41">🇨🇭 +41</option>
                      <option value="+43">🇦🇹 +43</option>
                      <option value="+352">🇱🇺 +352</option>
                      <option value="+64">🇳🇿 +64</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+852">🇭🇰 +852</option>
                      <option value="+886">🇹🇼 +886</option>
                      <option value="+66">🇹🇭 +66</option>
                      <option value="+60">🇲🇾 +60</option>
                      <option value="+62">🇮🇩 +62</option>
                      <option value="+63">🇵🇭 +63</option>
                      <option value="+84">🇻🇳 +84</option>
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
                  Thank you! You'll receive early access updates soon. Redirecting...
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
