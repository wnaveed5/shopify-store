import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, country } = body;

    // Format phone number to E.164 format if provided
    let formattedPhone = null;
    if (phone && phone.length > 0) {
      // Remove all non-digit characters except leading +
      const cleanPhone = phone.trim();
      const hasPlus = cleanPhone.startsWith('+');
      const digitsOnly = cleanPhone.replace(/\D/g, '');
      
      // Get country code based on country
      const countryCodes = {
        'US': '1', 'CA': '1', 'GB': '44', 'AU': '61', 'DE': '49', 'FR': '33',
        'IT': '39', 'ES': '34', 'NL': '31', 'SE': '46', 'NO': '47', 'DK': '45',
        'FI': '358', 'JP': '81', 'KR': '82', 'CN': '86', 'IN': '91', 'BR': '55',
        'MX': '52', 'AR': '54', 'CL': '56', 'CO': '57', 'PE': '51', 'ZA': '27',
        'EG': '20', 'NG': '234', 'KE': '254', 'MA': '212', 'AE': '971', 'SA': '966',
        'IL': '972', 'TR': '90', 'RU': '7', 'PL': '48', 'CZ': '420', 'HU': '36',
        'RO': '40', 'BG': '359', 'GR': '30', 'PT': '351', 'IE': '353', 'BE': '32',
        'CH': '41', 'AT': '43', 'LU': '352', 'NZ': '64', 'SG': '65', 'HK': '852',
        'TW': '886', 'TH': '66', 'MY': '60', 'ID': '62', 'PH': '63', 'VN': '84'
      };
      
      const countryCode = countryCodes[country as keyof typeof countryCodes] || '1'; // Default to US
      
      // Handle different phone number formats - be more strict for Klaviyo
      if (hasPlus && digitsOnly.length >= 10 && digitsOnly.length <= 15) {
        // Already has +, validate it's a reasonable format
        formattedPhone = '+' + digitsOnly;
      } else if (digitsOnly.length === 10) {
        // Standard 10-digit number, add country code
        formattedPhone = '+' + countryCode + digitsOnly;
      } else if (digitsOnly.length === 11 && digitsOnly.startsWith(countryCode)) {
        // 11-digit number starting with country code
        formattedPhone = '+' + digitsOnly;
      } else if (digitsOnly.length > 10 && digitsOnly.length <= 15) {
        // Might already include country code, just add +
        formattedPhone = '+' + digitsOnly;
      }
      
      // Additional validation for common formats
      if (formattedPhone) {
        // Ensure it's not too short or too long
        const phoneDigits = formattedPhone.substring(1); // Remove the +
        if (phoneDigits.length < 10 || phoneDigits.length > 15) {
          console.log('Phone number invalid length:', phoneDigits.length);
          formattedPhone = null;
        }
      }
      
      console.log('Phone formatting:', { original: phone, formatted: formattedPhone, country, countryCode });
    }

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Klaviyo API configuration
    const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
    const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

    if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) {
      console.error('Missing Klaviyo configuration');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // First, create or get the profile
    const profileResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'accept': 'application/vnd.api+json',
        'content-type': 'application/vnd.api+json',
        'revision': '2025-01-15'
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email: email,
            ...(formattedPhone && { phone_number: formattedPhone }),
            properties: {
              first_name: '',
              last_name: '',
              ...(country && { country: country }),
            }
          }
        }
      }),
    });

    let profileId;
    
    if (profileResponse.ok) {
      // Profile created successfully
      const profileData = await profileResponse.json();
      profileId = profileData.data.id;
    } else {
      // Check if it's a duplicate profile error (409)
      const profileError = await profileResponse.text();
      const errorData = JSON.parse(profileError);
      
      if (profileResponse.status === 409 && errorData.errors?.[0]?.code === 'duplicate_profile') {
        // Profile already exists, use the existing profile ID
        profileId = errorData.errors[0].meta?.duplicate_profile_id;
        console.log('Profile already exists, using existing profile ID:', profileId);
      } else {
        // Actual error
        console.error('Profile creation failed:', profileError);
        return NextResponse.json(
          { 
            error: 'Failed to subscribe to newsletter',
            details: profileError
          },
          { status: 500 }
        );
      }
    }

    // Add profile to Klaviyo list
    const klaviyoResponse = await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/relationships/profiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'accept': 'application/vnd.api+json',
        'content-type': 'application/vnd.api+json',
        'revision': '2025-01-15'
      },
      body: JSON.stringify({
        data: [
          {
            type: 'profile',
            id: profileId
          }
        ]
      }),
    });

    if (!klaviyoResponse.ok) {
      const errorData = await klaviyoResponse.text();
      console.error('Klaviyo API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 }
      );
    }

    console.log('Successfully subscribed email to Klaviyo list:', email);

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
