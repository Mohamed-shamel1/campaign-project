import * as XLSX from 'xlsx';
import { NormalizedContact, ImportSummary } from '../types';
import { normalizeEgyptianPhone } from './phone';

export interface ParseResult {
  summary: ImportSummary;
  records: NormalizedContact[];
  rawRows: Record<string, any>[];
  headers: string[];
}

/**
 * Heuristics to detect the phone number column
 */
export function detectPhoneColumn(headers: string[]): string {
  const phoneKeywords = [
    'phone', 'mobile', 'tel', 'telephone', 'whatsapp', 'cell', 'number',
    'هاتف', 'موبايل', 'جوال', 'تليفون', 'واتساب', 'رقم', 'رقم الهاتف', 'رقم الموبايل', 'الرقم'
  ];

  // Check exact or partial matches
  for (const header of headers) {
    const lower = header.toLowerCase().trim();
    if (phoneKeywords.some(keyword => lower === keyword || lower.includes(keyword))) {
      return header;
    }
  }

  // Fallback to first column
  return headers[0] || '';
}

/**
 * Heuristics to detect the name column
 */
export function detectNameColumn(headers: string[]): string {
  const nameKeywords = [
    'name', 'customer', 'client', 'contact', 'display_name', 'full_name',
    'اسم', 'الاسم', 'العميل', 'اسم العميل', 'اسم الزبون', 'المستلم'
  ];

  for (const header of headers) {
    const lower = header.toLowerCase().trim();
    if (nameKeywords.some(keyword => lower === keyword || lower.includes(keyword))) {
      return header;
    }
  }

  // If there are multiple columns and second isn't the phone column, select second
  return headers.length > 1 ? headers[1] : '';
}

/**
 * Parses a File (CSV, XLSX, XLS, TXT) into headers and row objects.
 * Handles files with or without explicit headers.
 */
export async function parseFileToRows(file: File): Promise<{ headers: string[]; rows: Record<string, any>[] }> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('الملف لا يحتوي على أي صفحات بيانات (Sheets).');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  
  // First, read as raw 2D array of rows
  const rawSheetData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });

  if (!rawSheetData || rawSheetData.length === 0) {
    throw new Error('الملف فارغ أو لا يحتوي على صفوف بيانات مقروءة.');
  }

  // Filter out completely empty rows
  const validRows = rawSheetData.filter(row => row && row.some((cell: any) => String(cell).trim().length > 0));

  if (validRows.length === 0) {
    throw new Error('الملف لا يحتوي على أي بيانات صالحة.');
  }

  const firstRow = validRows[0];
  const firstCell = String(firstRow[0] || '').trim();

  // Check if first row is actually data (a phone number) rather than a header
  const isFirstRowData = normalizeEgyptianPhone(firstCell).isValid;

  let headers: string[] = [];
  let jsonRows: Record<string, any>[] = [];

  if (isFirstRowData) {
    // File without header row! Assign automatic header names
    if (firstRow.length === 1) {
      headers = ['رقم الهاتف'];
    } else {
      headers = firstRow.map((_, i) => (i === 0 ? 'رقم الهاتف' : i === 1 ? 'اسم العميل' : `عمود ${i + 1}`));
    }

    jsonRows = validRows.map(row => {
      const obj: Record<string, any> = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] !== undefined ? String(row[i]).trim() : '';
      });
      return obj;
    });
  } else {
    // Normal file with header row
    headers = firstRow.map((cell: any, i: number) => {
      const val = String(cell).trim();
      return val || `عمود ${i + 1}`;
    });

    const dataRows = validRows.slice(1);
    jsonRows = dataRows.map(row => {
      const obj: Record<string, any> = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] !== undefined ? String(row[i]).trim() : '';
      });
      return obj;
    });
  }

  return { headers, rows: jsonRows };
}

/**
 * Parses directly pasted raw text containing phone numbers (one per line, or comma-separated)
 */
export function parseRawPastedNumbers(
  rawText: string,
  defaultNamePrefix: string = 'عميل الصيدلية'
): ParseResult {
  const lines = rawText
    .split(/[\r\n,;]+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error('يرجى لصق أو كتابة رقم هاتف واحد على الأقل.');
  }

  const rows: Record<string, any>[] = lines.map((phoneLine, idx) => {
    // Check if line has "Name - Phone" or "Phone, Name"
    const parts = phoneLine.split(/[\t\-|:]+/).map(p => p.trim());
    if (parts.length >= 2) {
      // One part is name, other is phone
      const phoneIdx = normalizeEgyptianPhone(parts[0]).isValid ? 0 : 1;
      const nameIdx = phoneIdx === 0 ? 1 : 0;
      return {
        'رقم الهاتف': parts[phoneIdx],
        'اسم العميل': parts[nameIdx] || `${defaultNamePrefix} #${idx + 1}`,
      };
    }

    return {
      'رقم الهاتف': phoneLine,
      'اسم العميل': `${defaultNamePrefix} #${idx + 1}`,
    };
  });

  const headers = ['رقم الهاتف', 'اسم العميل'];
  return processContactRows(
    rows,
    'رقم الهاتف',
    'اسم العميل',
    'إدخال يدوي مباشر للأرقام',
    rawText.length,
    headers,
    defaultNamePrefix
  );
}

/**
 * Processes rows into NormalizedContact list using the chosen phone and name columns
 */
export function processContactRows(
  rows: Record<string, any>[],
  phoneCol: string,
  nameCol: string,
  fileName: string,
  fileSize: number,
  allColumns: string[],
  defaultNamePrefix: string = 'عميل'
): ParseResult {
  const records: NormalizedContact[] = [];
  const seenValidPhones = new Set<string>();
  const seenRawPhones = new Set<string>();

  let validCount = 0;
  let invalidCount = 0;
  let duplicateCount = 0;

  rows.forEach((row, index) => {
    const rawPhoneVal = row[phoneCol];
    const hasNameInCol = nameCol && row[nameCol] && String(row[nameCol]).trim().length > 0;
    const rawNameVal = hasNameInCol ? String(row[nameCol]).trim() : `${defaultNamePrefix} #${index + 1}`;
    
    // Store remaining fields as extraFields
    const extraFields: Record<string, string> = {};
    Object.entries(row).forEach(([k, v]) => {
      if (k !== phoneCol && k !== nameCol) {
        extraFields[k] = String(v ?? '');
      }
    });

    const validation = normalizeEgyptianPhone(rawPhoneVal);

    let isDuplicate = false;
    let status: 'valid' | 'invalid' | 'duplicate' = 'valid';
    let errorMessage = validation.errorMessage;

    if (!validation.isValid) {
      status = 'invalid';
      invalidCount++;
    } else {
      // Check duplicate among normalized valid numbers
      if (seenValidPhones.has(validation.normalizedPhone)) {
        isDuplicate = true;
        status = 'duplicate';
        errorMessage = 'رقم هاتف مكرر في الملف';
        duplicateCount++;
      } else {
        seenValidPhones.add(validation.normalizedPhone);
        status = 'valid';
        validCount++;
      }
    }

    // Also track raw phone to catch invalid exact duplicates
    if (!validation.isValid && validation.rawPhone) {
      if (seenRawPhones.has(validation.rawPhone)) {
        isDuplicate = true;
      }
      seenRawPhones.add(validation.rawPhone);
    }

    records.push({
      id: `contact-${index + 1}-${Date.now()}`,
      name: rawNameVal || 'بدون اسم',
      rawPhone: validation.rawPhone,
      normalizedPhone: validation.normalizedPhone,
      isValid: validation.isValid,
      isDuplicate,
      status,
      errorMessage,
      carrier: validation.carrier,
      extraFields,
    });
  });

  const summary: ImportSummary = {
    fileName,
    fileSize,
    totalRows: rows.length,
    validCount,
    invalidCount,
    duplicateCount,
    columns: allColumns,
    selectedPhoneColumn: phoneCol,
    selectedNameColumn: nameCol,
  };

  return {
    summary,
    records,
    rawRows: rows,
    headers: allColumns,
  };
}
