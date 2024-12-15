import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import { sortPolynomial } from './polynomialUtil'; // Fungsi pengurutan polynomial

export const calculateIntegral = (func, isDefinite, lowerLimit, upperLimit) => {
  try {
    const steps = [];

    // validasi input fungsi
    if (typeof func !== 'string' || func.trim() === '') {
      throw new Error('Fungsi tidak valid');
    }

    // validasi karakter di fungsi (tambahkan dukungan untuk pi, e, sqrt, dsb.)
    if (!/^[0-9a-zA-Z^*+\-\/().π√ ]+$/.test(func) && !func.includes('sqrt')) {
      throw new Error('Fungsi mengandung karakter tidak valid');
    }

    // Replace simbol akar (√) dengan sqrt() agar kompatibel dengan nerdamer
    const processedFunc = func.replace(/√/g, 'sqrt');

    steps.push(`Menulis ekspresi integral: ∫(${processedFunc}) dx`);

    if (!isDefinite) {
      // Integral tak tentu
      steps.push('Menyelesaikan integral tak tentu.');

      // Hitung integral tak tentu
      const result = nerdamer(`integrate(${processedFunc}, x)`);

      // Urutkan hasil integral menggunakan sortPolynomial (jika tersedia)
      const sortedResult = sortPolynomial(result.text());

      // Validasi hasil
      if (!sortedResult || sortedResult.trim() === '') {
        throw new Error('Integral tak tentu gagal dihitung');
      }

      steps.push(`Hasil integral tak tentu (setelah diurutkan): ${sortedResult}`);
    } else {
      // Validasi batas integral tertentu
      if (!lowerLimit || !upperLimit) {
        throw new Error('Batas bawah dan atas harus diisi');
      }

      const lower = parseFloat(lowerLimit);
      const upper = parseFloat(upperLimit);

      if (isNaN(lower) || isNaN(upper)) {
        throw new Error('Batas harus berupa angka valid');
      }

      if (lower >= upper) {
        throw new Error('Batas bawah harus lebih kecil dari batas atas');
      }

      steps.push(
        `Menghitung integral tentu dengan batas bawah ${lower} dan batas atas ${upper}`
      );

      // Hitung integral tak tentu terlebih dahulu
      const indefiniteIntegral = nerdamer(`integrate(${processedFunc}, x)`);

      // Evaluasi batas atas dan bawah
      const upperResult = nerdamer(indefiniteIntegral).evaluate({ x: upper }).text();
      const lowerResult = nerdamer(indefiniteIntegral).evaluate({ x: lower }).text();

      // Konversi hasil evaluasi ke tipe angka untuk menghindari kesalahan tipe data
      const upperResultNumeric = parseFloat(upperResult);
      const lowerResultNumeric = parseFloat(lowerResult);

      // Validasi hasil evaluasi agar dapat dikurangi
      if (isNaN(upperResultNumeric) || isNaN(lowerResultNumeric)) {
        throw new Error('Hasil evaluasi batas atas atau bawah tidak valid');
      }

      // Hitung hasil integral tentu
      const definiteResult = upperResultNumeric - lowerResultNumeric;

      steps.push(`Hasil integral tentu: ${definiteResult}`);
    }

    return steps;
  } catch (error) {
    throw new Error('Terjadi kesalahan dalam menghitung integral: ' + error.message);
  }
};
