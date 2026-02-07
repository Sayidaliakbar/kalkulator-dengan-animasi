// Fungsi matematika sederhana untuk demo unit testing
// Sesuai dengan contoh di Sesi 9

/**
 * Fungsi untuk menambahkan dua bilangan
 * @param {number} a - bilangan pertama
 * @param {number} b - bilangan kedua
 * @returns {number} hasil penjumlahan
 */
const tambah = (a, b) => {
  return a + b;
};

/**
 * Fungsi untuk mengurangkan dua bilangan
 * @param {number} a - bilangan pertama
 * @param {number} b - bilangan kedua
 * @returns {number} hasil pengurangan
 */
const kurang = (a, b) => {
  return a - b;
};

/**
 * Fungsi untuk mengalikan dua bilangan
 * @param {number} a - bilangan pertama
 * @param {number} b - bilangan kedua
 * @returns {number} hasil perkalian
 */
const kali = (a, b) => {
  return a * b;
};

/**
 * Fungsi untuk membagi dua bilangan
 * @param {number} a - bilangan pertama
 * @param {number} b - bilangan kedua
 * @returns {number} hasil pembagian
 * @throws {Error} jika pembagi adalah 0
 */
const bagi = (a, b) => {
  if (b === 0) {
    throw new Error('Tidak bisa membagi dengan nol');
  }
  return a / b;
};

module.exports = { tambah, kurang, kali, bagi };
