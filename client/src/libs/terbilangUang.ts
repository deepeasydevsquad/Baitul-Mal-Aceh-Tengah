interface TerbilangOptions {
  /** Format huruf: 'lower' | 'upper' | 'capitalize' | 'title' */
  case?: 'lower' | 'upper' | 'capitalize' | 'title';
  /** Tampilkan sen/desimal */
  withSen?: boolean;
  /** Nama mata uang (default: 'Rupiah') */
  currency?: string;
  /** Gunakan prefix untuk mata uang (default: false) */
  useCurrencyPrefix?: boolean;
  /** Separator antar kata (default: ' ') */
  separator?: string;
  /** Gunakan format formal dengan "dan" untuk sen (default: false) */
  formal?: boolean;
}

/**
 * Konversi angka ke terbilang dalam Bahasa Indonesia
 * @param amount - Jumlah uang yang akan dikonversi
 * @param options - Opsi kustomisasi output
 * @returns String terbilang
 *
 * @contoh
 * terbilangUang(1250.75) // "Seribu dua ratus lima puluh Rupiah tujuh puluh lima Sen"
 * terbilangUang(1250.75, { case: 'upper' }) // "SERIBU DUA RATUS LIMA PULUH RUPIAH TUJUH PULUH LIMA SEN"
 * terbilangUang(1250000, { case: 'title', currency: 'Dollar' }) // "Satu Juta Dua Ratus Lima Puluh Ribu Dollar"
 */
const terbilangUang = (amount: number, options: TerbilangOptions = {}): string => {
  // Validasi input
  if (typeof amount !== 'number' || isNaN(amount)) {
    return formatCase('nol', options);
  }

  // Default options
  const {
    case: caseType = 'capitalize',
    withSen = false,
    currency = 'Rupiah',
    useCurrencyPrefix = false,
    separator = ' ',
    formal = false,
  } = options;

  // Daftar satuan angka
  const satuan = [
    '',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
    'sepuluh',
    'sebelas',
  ];

  /**
   * Konversi angka ke kata-kata
   */
  const toWords = (n: number): string => {
    if (n < 0) return `minus ${toWords(Math.abs(n))}`;
    if (n < 12) return satuan[n];
    if (n < 20) return `${toWords(n - 10)} belas`;
    if (n < 100) {
      const puluhan = toWords(Math.floor(n / 10));
      const sisa = n % 10;
      return `${puluhan} puluh${sisa ? ' ' + toWords(sisa) : ''}`;
    }
    if (n < 200) {
      const sisa = n - 100;
      return `seratus${sisa > 0 ? ' ' + toWords(sisa) : ''}`;
    }
    if (n < 1000) {
      const ratusan = toWords(Math.floor(n / 100));
      const sisa = n % 100;
      return `${ratusan} ratus${sisa ? ' ' + toWords(sisa) : ''}`;
    }
    if (n < 2000) {
      const sisa = n - 1000;
      return `seribu${sisa > 0 ? ' ' + toWords(sisa) : ''}`;
    }
    if (n < 1_000_000) {
      const ribuan = toWords(Math.floor(n / 1000));
      const sisa = n % 1000;
      return `${ribuan} ribu${sisa ? ' ' + toWords(sisa) : ''}`;
    }
    if (n < 1_000_000_000) {
      const jutaan = toWords(Math.floor(n / 1_000_000));
      const sisa = n % 1_000_000;
      return `${jutaan} juta${sisa ? ' ' + toWords(sisa) : ''}`;
    }
    if (n < 1_000_000_000_000) {
      const miliaran = toWords(Math.floor(n / 1_000_000_000));
      const sisa = n % 1_000_000_000;
      return `${miliaran} miliar${sisa ? ' ' + toWords(sisa) : ''}`;
    }
    if (n < 1_000_000_000_000_000) {
      const triliunan = toWords(Math.floor(n / 1_000_000_000_000));
      const sisa = n % 1_000_000_000_000;
      return `${triliunan} triliun${sisa ? ' ' + toWords(sisa) : ''}`;
    }
    if (n < 1_000_000_000_000_000_000) {
      const kuadriliunan = toWords(Math.floor(n / 1_000_000_000_000_000));
      const sisa = n % 1_000_000_000_000_000;
      return `${kuadriliunan} kuadriliun${sisa ? ' ' + toWords(sisa) : ''}`;
    }
    return 'angka terlalu besar';
  };

  // Pisahkan angka bulat dan desimal
  const angkaBulat = Math.floor(Math.abs(amount));
  const desimal = Math.round((Math.abs(amount) - angkaBulat) * 100);
  const isNegative = amount < 0;

  // Buat terbilang angka bulat
  let hasil = toWords(angkaBulat).trim().replace(/\s+/g, ' ');

  // Tambahkan "minus" jika negatif
  if (isNegative) {
    hasil = `minus ${hasil}`;
  }

  // Tambahkan mata uang
  if (useCurrencyPrefix) {
    hasil = `${currency} ${hasil}`;
  } else {
    hasil = `${hasil} ${currency}`;
  }

  // Tambahkan sen jika diminta dan ada desimal
  if (withSen && desimal > 0) {
    const senText = toWords(desimal).trim();
    if (formal) {
      hasil += ` dan ${senText} Sen`;
    } else {
      hasil += ` ${senText} Sen`;
    }
  }

  // Format case sesuai opsi
  hasil = formatCase(hasil, options);

  // Ganti separator jika bukan spasi
  if (separator !== ' ') {
    hasil = hasil.replace(/\s+/g, separator);
  }

  return hasil;
};

/**
 * Format string sesuai case yang dipilih
 */
const formatCase = (text: string, options: TerbilangOptions): string => {
  const { case: caseType = 'capitalize' } = options;

  switch (caseType) {
    case 'lower':
      return text.toLowerCase();

    case 'upper':
      return text.toUpperCase();

    case 'capitalize':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    case 'title':
      return text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    default:
      return text;
  }
};

export { terbilangUang, type TerbilangOptions };
