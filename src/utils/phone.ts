import { CarrierType } from '../types';

/**
 * Converts Eastern Arabic numerals (٠-٩) and Persian numerals (۰-۹) to standard Western digits (0-9)
 */
export function convertArabicIndicDigits(str: string): string {
  const arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const easternArabic = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(arabicIndic[i], 'g'), i.toString());
    result = result.replace(new RegExp(easternArabic[i], 'g'), i.toString());
  }
  return result;
}

export interface PhoneValidationResult {
  isValid: boolean;
  rawPhone: string;
  normalizedPhone: string;
  carrier?: CarrierType;
  errorMessage?: string;
}

/**
 * Normalizes and validates Egyptian and international mobile numbers
 */
export function normalizeEgyptianPhone(input: string | number | null | undefined): PhoneValidationResult {
  if (input === null || input === undefined) {
    return {
      isValid: false,
      rawPhone: '',
      normalizedPhone: '',
      errorMessage: 'رقم الهاتف فارغ',
    };
  }

  let raw = String(input).trim();

  if (!raw) {
    return {
      isValid: false,
      rawPhone: '',
      normalizedPhone: '',
      errorMessage: 'رقم الهاتف فارغ',
    };
  }

  // Handle Excel numeric float format (e.g., 201012345678.0)
  if (raw.endsWith('.0')) {
    raw = raw.slice(0, -2);
  }

  // Convert Arabic numerals
  let cleaned = convertArabicIndicDigits(raw);

  // Check for letters or illegal characters before stripping
  const hasLetters = /[a-zA-Zء-ي]/.test(cleaned);
  if (hasLetters) {
    return {
      isValid: false,
      rawPhone: raw,
      normalizedPhone: '',
      errorMessage: 'يحتوي الحقل على نصوص أو أحرف بدلاً من أرقام',
    };
  }

  // Preserve leading '+' if present
  const hasPlus = cleaned.startsWith('+');

  // Remove spaces, dashes, parentheses, dots
  cleaned = cleaned.replace(/[\s\-_()[\]/\\.]/g, '');

  if (hasPlus && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  // If number starts with 0020 or 00, normalize 00 to +
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.substring(2);
  }

  // Check Egyptian format
  let digitsOnly = cleaned.replace(/\D/g, '');

  // Case 1: Egyptian number with international code: 201xxxxxxxxx (12 digits)
  if (digitsOnly.startsWith('20') && digitsOnly.length === 12) {
    const mobilePart = digitsOnly.substring(2); // 10 digits
    return validateEgyptianMobilePart(raw, mobilePart);
  }

  // Case 2: Egyptian local format with leading zero: 01xxxxxxxxx (11 digits)
  if (digitsOnly.startsWith('01') && digitsOnly.length === 11) {
    const mobilePart = digitsOnly.substring(1); // 10 digits starting with 1
    return validateEgyptianMobilePart(raw, mobilePart);
  }

  // Case 3: Excel stripped leading zero: 1xxxxxxxxx (10 digits starting with 10, 11, 12, 15)
  if (digitsOnly.length === 10 && /^(10|11|12|15)/.test(digitsOnly)) {
    return validateEgyptianMobilePart(raw, digitsOnly);
  }

  // Case 4: Starts with 01 but incomplete or too long
  if (digitsOnly.startsWith('01')) {
    if (digitsOnly.length < 11) {
      return {
        isValid: false,
        rawPhone: raw,
        normalizedPhone: '',
        errorMessage: `رقم هاتف مصري غير مكتمل (${digitsOnly.length} من أصل 11 رقماً)`,
      };
    }
    return {
      isValid: false,
      rawPhone: raw,
      normalizedPhone: '',
      errorMessage: `أرقام زائدة عن الحد المسموح (${digitsOnly.length} رقماً بدلاً من 11)`,
    };
  }

  // Case 5: Starts with 201 but invalid length
  if (digitsOnly.startsWith('201')) {
    return {
      isValid: false,
      rawPhone: raw,
      normalizedPhone: '',
      errorMessage: `طول الرقم غير صحيح بكود الدولة (+20)`,
    };
  }

  // Case 6: Landline numbers (e.g., 02 for Cairo, 03 for Alex)
  if (digitsOnly.startsWith('02') || digitsOnly.startsWith('03')) {
    return {
      isValid: false,
      rawPhone: raw,
      normalizedPhone: '',
      errorMessage: 'رقم خط أرضي ثابت (تطبيق الواتساب يتطلب رقم هاتف محمول)',
    };
  }

  // Case 7: General International Number
  if (cleaned.startsWith('+') && digitsOnly.length >= 8 && digitsOnly.length <= 15) {
    return {
      isValid: true,
      rawPhone: raw,
      normalizedPhone: '+' + digitsOnly,
      carrier: 'دولي / أخرى',
    };
  }

  // Fallback invalid
  return {
    isValid: false,
    rawPhone: raw,
    normalizedPhone: '',
    errorMessage: 'رقم هاتف غير معترف به أو صيغة غير صالحة',
  };
}

function validateEgyptianMobilePart(rawPhone: string, mobilePart: string): PhoneValidationResult {
  const prefix = mobilePart.substring(0, 2);
  let carrier: CarrierType;

  switch (prefix) {
    case '10':
      carrier = 'فودافون';
      break;
    case '11':
      carrier = 'إتصالات';
      break;
    case '12':
      carrier = 'أورنج';
      break;
    case '15':
      carrier = 'وي';
      break;
    default:
      return {
        isValid: false,
        rawPhone,
        normalizedPhone: '',
        errorMessage: `كود الشبكة (0${prefix}) غير معتمد لشركات المحمول المصرية`,
      };
  }

  return {
    isValid: true,
    rawPhone,
    normalizedPhone: `+20${mobilePart}`,
    carrier,
  };
}

/**
 * Formats a normalized phone number for pleasant display: e.g. +20 101 234 5678
 */
export function formatPhoneDisplay(phone: string): string {
  if (!phone) return '';
  if (phone.startsWith('+20') && phone.length === 13) {
    // +20 101 234 5678
    return `+20 ${phone.substring(3, 6)} ${phone.substring(6, 9)} ${phone.substring(9)}`;
  }
  return phone;
}

