/**
 * ============================================================================
 * PULAU-SCAN: Logika Pemetaan dan Prediksi Kemiskinan Kepulauan Riau
 * File: pulau-scan.js
 * Deskripsi: Skrip analitik data sains, visualisasi peta interaktif SVG,
 *            pengelompokan K-Means, dan pemodelan regresi linier kemiskinan.
 * ============================================================================
 */

/* ============================================================================
   1. DATASET UTAMA & HASIL PEMODELAN DATA SAINS
   ============================================================================ */

const APP_DATA = {
  // Nilai prediksi pengujian model pada tahun 2025 per wilayah
  testpred: {
    "Batam": 5.239,
    "Bintan": 4.227,
    "Karimun": 4.873,
    "Kepulauan Anambas": 6.248,
    "Lingga": 10.395,
    "Natuna": 4.676,
    "Tanjungpinang": 8.163
  },

  // Hasil klasterisasi K-Means untuk k = 2, 3, dan 4
  KS: {
    "2": {
      inertia: 17.56,
      db: 0.246,
      lab: {
        "Batam": 1,
        "Bintan": 1,
        "Karimun": 1,
        "Kepulauan Anambas": 1,
        "Lingga": 0,
        "Natuna": 1,
        "Tanjungpinang": 1
      },
      sil: 0.516,
      cent: [[12.03, 7.26], [6.16, 9.28]]
    },
    "3": {
      inertia: 10.47,
      db: 0.333,
      lab: {
        "Batam": 2,
        "Bintan": 2,
        "Karimun": 2,
        "Kepulauan Anambas": 2,
        "Lingga": 0,
        "Natuna": 2,
        "Tanjungpinang": 1
      },
      sil: 0.272,
      cent: [[12.03, 7.26], [8.26, 10.52], [5.75, 9.04]]
    },
    "4": {
      inertia: 3.35,
      db: 0.23,
      lab: {
        "Batam": 3,
        "Bintan": 2,
        "Karimun": 2,
        "Kepulauan Anambas": 2,
        "Lingga": 0,
        "Natuna": 2,
        "Tanjungpinang": 1
      },
      sil: 0.283,
      cent: [[12.03, 7.26], [8.26, 10.52], [5.99, 8.49], [4.78, 11.22]]
    }
  },

  // Path SVG dan titik koordinat pusat label per kabupaten/kota
  paths: {
    "Batam": {
      d: "M80,399L82,401L83,403L79,404L80,399ZM81,388L89,394L88,399L82,392L81,388ZM90,384L93,384L96,385L90,384ZM77,382L88,380L86,386L91,389L85,391L80,387L77,382ZM77,366L79,367L78,369L76,369L77,366ZM72,364L77,370L77,373L82,372L87,374L85,378L77,381L75,374L72,372L69,373L69,367L68,365L72,364ZM64,364L68,365L67,369L64,366L64,364ZM75,363L77,363L80,365L75,367L75,363ZM85,360L86,361L86,363L83,362L85,360ZM78,357L77,360L75,360L76,358L78,357ZM45,357L57,364L54,369L43,362L43,358L46,359L45,357ZM49,357L52,359L50,360L49,357ZM38,356L40,357L40,363L35,357L38,356ZM78,353L78,356L77,358L76,354L78,353ZM43,354L48,355L44,357L43,354ZM70,340L74,343L75,347L74,356L70,356L68,358L70,362L65,360L64,362L62,362L59,358L54,359L51,356L49,351L51,350L52,353L54,352L52,346L59,347L61,341L65,344L65,346L67,346L68,347L69,345L67,342L70,340Z",
      cx: 67,
      cy: 364
    },
    "Karimun": {
      d: "M18,404L22,409L22,411L20,411L18,404ZM27,399L29,397L31,398L27,399ZM12,391L9,398L6,398L9,392L12,391ZM35,386L34,391L29,389L29,387L35,386ZM25,386L28,386L29,388L27,389L25,386ZM14,381L15,382L14,385L13,382L14,381ZM26,377L33,384L31,385L26,377ZM1,371L9,375L13,380L13,383L8,378L2,376L1,371ZM35,371L43,379L43,385L32,375L32,372L35,371ZM-2,371L11,384L6,396L0,395L-5,386L-5,377L-2,371ZM41,370L50,374L54,381L53,384L43,375L41,370ZM5,368L8,369L9,375L1,371L1,369L5,368ZM13,373L10,374L9,367L12,370L13,373ZM2,365L4,367L2,369L1,368L2,365ZM3,364L8,365L8,368L4,366L3,364ZM-5,347L-1,348L-2,352L3,358L4,361L-5,359L-9,356L-9,351L-5,347ZM-1,343L1,346L1,347L-2,345L-1,343Z",
      cx: 13,
      cy: 377
    },
    "Tanjungpinang": {
      d: "M98,358L100,360L96,361L98,358ZM113,362L104,360L105,358L109,358L105,354L102,356L100,355L98,359L96,358L102,350L111,348L113,362Z",
      cx: 106,
      cy: 355
    },
    "Bintan": {
      d: "M126,385L122,390L120,390L122,386L126,385ZM130,384L136,385L136,387L133,388L130,386L130,384ZM131,381L135,381L135,384L129,383L131,381ZM119,381L123,381L124,382L118,385L119,381ZM115,380L119,382L114,383L111,386L111,383L115,380ZM125,373L127,378L122,380L123,376L125,373ZM102,372L109,373L106,374L102,372ZM128,370L130,375L128,375L126,374L128,370ZM123,370L126,372L123,375L122,373L123,370ZM139,357L145,359L144,364L141,364L143,362L139,357ZM101,362L113,362L111,348L102,350L96,358L92,356L92,357L94,358L93,361L83,358L82,351L84,348L93,346L91,342L97,342L101,340L110,343L114,342L116,337L118,337L118,344L123,350L126,356L124,362L126,368L122,370L119,379L108,375L109,372L104,370L104,367L108,367L101,364L101,362ZM413,358L419,359L420,361L415,365L417,359L414,363L413,358ZM403,362L407,363L407,368L404,367L403,362ZM380,447L385,446L382,450L380,447Z",
      cx: 126,
      cy: 361
    },
    "Lingga": {
      d: "M80,499L83,499L82,503L79,502L80,499ZM79,496L83,496L83,498L79,499L79,496ZM76,494L78,495L76,497L74,495L76,494ZM108,494L114,497L120,507L112,517L110,525L106,522L103,518L100,520L99,527L96,528L92,514L85,509L88,500L91,499L92,494L94,499L91,502L94,504L95,499L99,501L103,498L104,494L108,494ZM107,488L109,491L106,493L99,490L101,488L107,488ZM133,470L135,472L137,475L135,474L133,470ZM144,464L147,466L148,467L144,465L144,464ZM113,457L115,459L112,460L111,459L113,457ZM115,457L125,465L127,468L123,467L123,470L127,471L126,469L128,468L133,474L135,479L142,480L141,475L143,474L150,483L156,488L159,487L160,490L153,488L150,489L153,492L152,494L146,491L145,492L130,480L120,485L117,484L112,488L110,485L103,484L103,478L107,476L107,474L110,473L110,461L114,461L115,457ZM137,454L138,457L134,457L133,456L137,454ZM106,448L106,447L108,450L106,448ZM108,446L112,447L112,449L108,446ZM101,444L109,453L109,456L106,454L109,459L98,448L103,450L100,446L101,444ZM90,443L94,447L94,449L90,447L90,443ZM95,441L98,444L100,448L96,444L95,441ZM83,440L84,443L83,445L80,443L83,440ZM112,436L130,455L130,458L126,456L123,451L120,452L115,447L110,441L113,441L108,436L109,435L113,438L112,436ZM93,427L97,429L99,433L96,432L93,427ZM90,425L92,426L91,429L90,429L90,425ZM94,423L102,427L103,429L101,429L102,430L99,431L95,428L94,423ZM112,418L116,419L113,419L113,424L112,418Z",
      cx: 113,
      cy: 483
    },
    "Kepulauan Anambas": {
      d: "M294,118L294,125L292,128L293,120L294,118ZM280,131L277,127L283,121L283,129L281,130L280,127L280,131ZM283,134L287,122L290,122L289,135L287,130L286,131L288,138L283,134ZM280,137L283,136L289,142L288,152L285,148L284,150L281,148L280,137ZM309,139L310,140L310,142L308,141L309,139ZM292,144L291,146L293,144L294,148L291,152L288,148L292,144ZM269,144L270,146L269,148L267,145L269,144ZM225,148L227,151L224,151L225,148ZM258,151L259,153L258,158L256,156L258,151ZM244,161L245,164L242,163L243,169L240,169L242,171L238,169L237,173L232,173L237,176L233,178L229,175L231,164L231,162L228,159L230,157L229,154L232,157L234,155L234,163L244,161ZM285,188L280,184L282,183L280,179L283,180L285,188Z",
      cx: 265,
      cy: 151
    },
    "Natuna": {
      d: "M456,-7L453,-9L461,-18L456,-7ZM469,92L479,82L488,89L481,80L466,76L456,60L467,53L482,37L484,38L483,47L500,63L499,71L496,70L495,72L497,70L498,74L501,71L501,74L499,81L491,87L490,94L482,94L476,97L469,92ZM450,69L452,70L451,72L449,71L450,69ZM460,78L463,79L464,83L461,82L460,78ZM465,88L469,91L469,92L464,92L465,88ZM465,93L468,95L468,97L465,97L465,93ZM471,96L472,99L467,102L468,99L471,96ZM545,155L547,156L546,159L544,159L545,155ZM439,158L441,162L436,163L435,159L439,158ZM547,159L549,160L548,172L542,176L537,171L547,159ZM516,188L518,191L514,195L514,192L517,192L515,189L518,190L516,188ZM571,210L561,211L563,208L558,208L558,204L572,207L571,210ZM555,210L557,211L557,215L553,215L551,210L555,207L555,210Z",
      cx: 488,
      cy: 84
    }
  },

  mapWidth: 579,
  mapHeight: 580,

  // Daftar nama 7 kabupaten/kota di Kepulauan Riau
  regs: [
    "Batam",
    "Bintan",
    "Karimun",
    "Kepulauan Anambas",
    "Lingga",
    "Natuna",
    "Tanjungpinang"
  ],

  // Koefisien regresi linear multivariat
  coef: [
    45.59185036223441,    // Intercept
    0.13821862363308268,  // Slope tahun (t - 2020)
    -3.668910734332238,   // Koefisien RLS
    -7.389643201203009,   // Dummy Bintan
    -8.248717076865974,   // Dummy Karimun
    -11.657289182183666,  // Dummy Kepulauan Anambas
    -7.286116210403419,   // Dummy Lingga
    -7.907729687093118,   // Dummy Natuna
    0.9011994501863402    // Dummy Tanjungpinang
  ],

  // Evaluasi metrik performa model
  eval: {
    mae: 0.8531432125194155,
    rmse: 1.1290866784168132,
    r2: 0.49600626378415014,
    naive: 0.6642857142857146,
    n: 7
  },

  // Data historis resmi BPS 2020-2025: [Tahun, Wilayah, % Miskin, RLS, Garis Kemiskinan, Penduduk(ribu), Miskin(ribu)]
  rows: [
    [2020, "Batam", 4.75, 11.14, 707856.0, 1196.4, 67.06],
    [2020, "Bintan", 6.36, 8.44, 417654.0, 159.5, 10.21],
    [2020, "Karimun", 6.83, 8.17, 411052.0, 253.5, 15.99],
    [2020, "Kepulauan Anambas", 6.56, 7.17, 416877.0, 47.4, 2.8],
    [2020, "Lingga", 13.85, 6.67, 472384.0, 98.6, 12.45],
    [2020, "Natuna", 4.43, 8.73, 408164.0, 81.5, 3.47],
    [2020, "Tanjungpinang", 9.37, 10.25, 691738.0, 227.7, 19.98],

    [2021, "Batam", 5.05, 11.15, 740109.0, 1230.1, 77.17],
    [2021, "Bintan", 6.42, 8.67, 424426.0, 162.6, 10.54],
    [2021, "Karimun", 6.85, 8.18, 422961.0, 259.5, 16.28],
    [2021, "Kepulauan Anambas", 7.09, 7.34, 429475.0, 48.7, 3.08],
    [2021, "Lingga", 13.93, 6.88, 484088.0, 100.7, 12.58],
    [2021, "Natuna", 4.95, 8.92, 420503.0, 83.4, 3.98],
    [2021, "Tanjungpinang", 9.57, 10.26, 719776.0, 233.4, 20.85],

    [2022, "Batam", 5.19, 11.17, 783730.0, 1269.4, 82.59],
    [2022, "Bintan", 6.44, 8.7, 447933.0, 165.8, 10.67],
    [2022, "Karimun", 6.87, 8.48, 446856.0, 266.2, 16.44],
    [2022, "Kepulauan Anambas", 7.51, 7.38, 452220.0, 50.3, 3.29],
    [2022, "Lingga", 14.05, 7.12, 507223.0, 102.9, 12.7],
    [2022, "Natuna", 5.32, 8.96, 449302.0, 85.5, 4.32],
    [2022, "Tanjungpinang", 9.85, 10.49, 764410.0, 239.9, 21.67],

    [2023, "Batam", 5.02, 11.227, 854465.0, 1256.6, 83.09],
    [2023, "Bintan", 5.9, 8.95, 474674.0, 165.9, 9.86],
    [2023, "Karimun", 5.95, 8.673, 468332.0, 260.6, 14.33],
    [2023, "Kepulauan Anambas", 6.95, 7.517, 481718.0, 49.1, 3.08],
    [2023, "Lingga", 11.26, 7.37, 540936.0, 101.0, 10.18],
    [2023, "Natuna", 5.25, 9.057, 480103.0, 84.6, 4.3],
    [2023, "Tanjungpinang", 7.95, 10.593, 771584.0, 234.8, 17.67],

    [2024, "Batam", 4.85, 11.283, 903960.0, 1276.9, 83.57],
    [2024, "Bintan", 5.44, 9.2, 496764.0, 168.2, 9.17],
    [2024, "Karimun", 5.78, 8.867, 492654.0, 263.3, 13.99],
    [2024, "Kepulauan Anambas", 6.67, 7.653, 504332.0, 49.7, 2.98],
    [2024, "Lingga", 9.99, 7.62, 562906.0, 102.0, 9.02],
    [2024, "Natuna", 5.04, 9.153, 501927.0, 85.7, 4.17],
    [2024, "Tanjungpinang", 6.86, 10.697, 798218.0, 237.4, 15.39],

    [2025, "Batam", 3.81, 11.34, 954437.0, 1297.0, 68.04],
    [2025, "Bintan", 4.77, 9.45, 528549.0, 170.5, 8.11],
    [2025, "Karimun", 5.16, 9.06, 524326.0, 266.0, 12.56],
    [2025, "Kepulauan Anambas", 6.35, 7.79, 540795.0, 50.4, 2.86],
    [2025, "Lingga", 9.12, 7.87, 596564.0, 103.0, 8.24],
    [2025, "Natuna", 4.81, 9.25, 555293.0, 86.8, 4.01],
    [2025, "Tanjungpinang", 5.96, 10.8, 842147.0, 240.0, 13.47]
  ],

  // Laju pertumbuhan tahunan rata-rata lama sekolah (RLS)
  rlstrend: {
    "Batam": 0.041619047619055737,
    "Bintan": 0.1968571428571771,
    "Karimun": 0.19152380952384646,
    "Kepulauan Anambas": 0.11933333333335289,
    "Lingga": 0.24200000000004168,
    "Natuna": 0.0970476190476326,
    "Tanjungpinang": 0.11895238095240279
  }
};

// Pemetaan nama wilayah singkat untuk label tampilan peta
const SHORT_NAMES = {
  "Kepulauan Anambas": "Anambas",
  "Tanjungpinang": "Tg. Pinang"
};

// Representasi objek data tabular BPS
const TABLE_ROWS = APP_DATA.rows.map(row => ({
  tahun: row[0],
  wilayah: row[1],
  persenMiskin: row[2],
  rls: row[3],
  garisKemiskinan: row[4],
  pendudukRibu: row[5],
  miskinRibu: row[6]
}));

/* ============================================================================
   2. VARIABEL STATE APLIKASI
   ============================================================================ */

// Menentukan k terbaik berdasarkan Silhouette Score tertinggi
const BEST_K = Number(
  Object.keys(APP_DATA.KS).sort((a, b) => APP_DATA.KS[b].sil - APP_DATA.KS[a].sil)[0]
);

let currentK = BEST_K;
let currentMode = "k"; // 'k' = mode klaster, 'y' = mode persentase kemiskinan
let currentYear = 2025;
let selectedRegion = null;
let isMapMoved = false;
let animationTimer = null;

// Konfigurasi viewBox SVG untuk kebutuhan pan dan zoom
let svgViewBox = {
  x: 0,
  y: 0,
  w: APP_DATA.mapWidth,
  h: APP_DATA.mapHeight
};

/* ============================================================================
   3. FUNGSI PEMBANTU (HELPER FUNCTIONS)
   ============================================================================ */

/**
 * Mengambil elemen HTML berdasarkan atribut ID.
 * @param {string} id - ID dari elemen HTML
 * @returns {HTMLElement|null} Elemen DOM yang dicari
 */
function getEl(id) {
  return document.getElementById(id);
}

/**
 * Memformat angka menjadi format desimal Indonesia dengan tanda koma.
 * @param {number} value - Angka yang akan diformat
 * @param {number} [decimals=2] - Jumlah digit desimal di belakang koma
 * @returns {string} String angka yang telah diformat
 */
function formatNumber(value, decimals = 2) {
  if (value === undefined || value === null || isNaN(value)) return "-";
  return Number(value).toFixed(decimals).replace(".", ",");
}

/**
 * Mengambil nilai variabel CSS dari root dokumen.
 * @param {string} varName - Nama variabel CSS (misal: '--blue-primary')
 * @returns {string} Nilai warna atau properti CSS yang bersangkutan
 */
function getCssVariable(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/**
 * Mencari satu baris data historis berdasarkan wilayah dan tahun tertentu.
 * @param {string} region - Nama wilayah
 * @param {number} year - Tahun data
 * @returns {object|undefined} Objek data tahun dan wilayah yang cocok
 */
function findDataRow(region, year) {
  return TABLE_ROWS.find(row => row.wilayah === region && row.tahun === year);
}

/**
 * Mengambil baris data historis resmi terakhir (tahun 2025).
 * @param {string} region - Nama wilayah
 * @returns {object} Objek data wilayah pada tahun 2025
 */
function getLatestData(region) {
  return findDataRow(region, 2025);
}

/**
 * Memperkirakan nilai Rata-rata Lama Sekolah (RLS) berdasarkan tren historis.
 * @param {string} region - Nama wilayah
 * @param {number} year - Tahun proyeksi
 * @returns {number} Nilai RLS estimasi
 */
function calculateProjectedRls(region, year) {
  const baseRls = getLatestData(region).rls;
  const yearlyTrend = APP_DATA.rlstrend[region] || 0;
  return baseRls + yearlyTrend * (year - 2025);
}

/**
 * Menghitung prediksi persentase kemiskinan dengan model regresi linear multivariat.
 * @param {string} region - Nama wilayah
 * @param {number} year - Tahun yang diprediksi
 * @param {number} rlsValue - Nilai RLS yang dijadikan fitur input
 * @returns {number} Hasil persentase kemiskinan (dibatasi minimum 0%)
 */
function calculatePovertyPrediction(region, year, rlsValue) {
  const coefficients = APP_DATA.coef;
  const regionIndex = APP_DATA.regs.indexOf(region);

  const intercept = coefficients[0];
  const timeSlope = coefficients[1] * (year - 2020);
  const rlsSlope = coefficients[2] * rlsValue;
  const regionDummy = regionIndex > 0 ? coefficients[2 + regionIndex] : 0;

  const result = intercept + timeSlope + rlsSlope + regionDummy;
  return Math.max(0, result);
}

/**
 * Mengambil nilai kemiskinan: data riil jika <= 2025, atau proyeksi jika > 2025.
 * @param {string} region - Nama wilayah
 * @param {number} year - Tahun data
 * @returns {number} Persentase kemiskinan
 */
function getPovertyValue(region, year) {
  if (year <= 2025) {
    const row = findDataRow(region, year);
    return row ? row.persenMiskin : 0;
  }
  const projectedRls = calculateProjectedRls(region, year);
  return calculatePovertyPrediction(region, year, projectedRls);
}

/**
 * Mendapatkan indeks klaster K-Means (0-based) untuk wilayah yang dipilih.
 * @param {string} region - Nama wilayah
 * @returns {number} Indeks klaster
 */
function getClusterIndex(region) {
  return APP_DATA.KS[currentK].lab[region];
}

/**
 * Melakukan interpolasi linier antara dua warna RGB.
 * @param {number[]} color1 - Array warna awal [R, G, B]
 * @param {number[]} color2 - Array warna akhir [R, G, B]
 * @param {number} factor - Faktor interpolasi (0.0 sampai 1.0)
 * @returns {string} String warna format 'rgb(r,g,b)'
 */
function interpolateRgb(color1, color2, factor) {
  const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
  const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
  const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
  return `rgb(${r},${g},${b})`;
}

/**
 * Mengonversi nilai persentase kemiskinan ke gradasi palet warna biru cobalt.
 * @param {number} povertyValue - Persentase kemiskinan (rentang 3% - 12%)
 * @returns {string} Kode warna RGB untuk visualisasi peta
 */
function getPovertyColorRamp(povertyValue) {
  const lightCobalt = [219, 234, 254]; // #dbeafe
  const deepCobalt = [29, 78, 216];    // #1d4ed8
  const normalized = Math.min(1, Math.max(0, (povertyValue - 3) / 9));
  return interpolateRgb(lightCobalt, deepCobalt, normalized);
}

/**
 * Menentukan warna isi (fill) wilayah pada peta sesuai mode yang aktif.
 * @param {string} region - Nama wilayah
 * @returns {string} Warna pengisian elemen SVG wilayah
 */
function getRegionColor(region) {
  if (currentMode === "k") {
    const clusterIdx = getClusterIndex(region);
    const clusterColorVars = ["--cluster-1", "--cluster-2", "--cluster-3", "--cluster-4"];
    return getCssVariable(clusterColorVars[clusterIdx] || "--cluster-1");
  }
  return getPovertyColorRamp(getPovertyValue(region, currentYear));
}

/* ============================================================================
   4. MODUL RENDERING GRAFIK KANVAS (CANVAS CHARTS)
   ============================================================================ */

/**
 * Menggambar grafik garis dan titik pada elemen HTML5 Canvas secara native.
 * @param {HTMLCanvasElement} canvasEl - Elemen canvas target
 * @param {Array<object>} seriesData - Data seri grafik [{ n: nama, c: warna, p: [[x,y]...], d: garisPutus, dot: titikTunggal }]
 * @param {number} [height=240] - Tinggi canvas dalam piksel
 */
function renderCanvasChart(canvasEl, seriesData, height = 240) {
  if (!canvasEl) return;

  const canvasWidth = canvasEl.clientWidth * 2;
  const canvasHeight = height * 2;
  canvasEl.width = canvasWidth;
  canvasEl.height = canvasHeight;

  const ctx = canvasEl.getContext("2d");
  const padLeft = 70;
  const padBottom = 50;
  const padTop = 56;
  const padRight = 24;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Kumpulkan seluruh titik data untuk menentukan skala sumbu X dan Y
  const allPoints = seriesData.flatMap(s => s.p);
  if (!allPoints.length) return;

  const xValues = allPoints.map(p => p[0]);
  const yValues = allPoints.map(p => p[1]);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.floor(Math.min(...yValues) - 0.5);
  const maxY = Math.ceil(Math.max(...yValues) + 0.5);

  // Fungsi pemetaan koordinat data ke koordinat piksel kanvas
  const mapX = val => padLeft + ((val - minX) / ((maxX - minX) || 1)) * (canvasWidth - padLeft - padRight);
  const mapY = val => canvasHeight - padBottom - ((val - minY) / ((maxY - minY) || 1)) * (canvasHeight - padBottom - padTop);

  const textColor = getCssVariable("--text-main") || "#0b192c";
  ctx.font = "bold 18px 'Space Grotesk', sans-serif";
  ctx.lineWidth = 1;

  // Gambar garis kisi horizontal dan label sumbu Y
  for (let i = 0; i <= 4; i++) {
    const yVal = minY + ((maxY - minY) * i) / 4;
    const yPixel = mapY(yVal);

    ctx.strokeStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.moveTo(padLeft, yPixel);
    ctx.lineTo(canvasWidth - padRight, yPixel);
    ctx.stroke();

    ctx.fillStyle = getCssVariable("--text-muted") || "#577093";
    ctx.fillText(formatNumber(yVal, 1), 6, yPixel + 6);
  }

  // Gambar label sumbu X
  const stepX = Math.max(1, Math.round((maxX - minX) / 6));
  for (let xVal = Math.ceil(minX); xVal <= maxX; xVal += stepX) {
    ctx.fillStyle = textColor;
    ctx.fillText(xVal, mapX(xVal) - 20, canvasHeight - 16);
  }

  // Gambar legenda seri di bagian atas kanvas
  let legendOffsetLeft = padLeft;
  seriesData.forEach(series => {
    ctx.fillStyle = series.c;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(legendOffsetLeft, 12, 16, 16, 3) : ctx.rect(legendOffsetLeft, 12, 16, 16);
    ctx.fill();
    ctx.strokeStyle = "#0b192c";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.fillText(series.n, legendOffsetLeft + 24, 26);
    legendOffsetLeft += ctx.measureText(series.n).width + 50;
  });

  // Gambar garis grafik
  seriesData.forEach(series => {
    ctx.strokeStyle = series.c;
    ctx.lineWidth = 4;
    ctx.setLineDash(series.d ? [10, 8] : []);

    if (!series.dot) {
      ctx.beginPath();
      series.p.forEach((pt, index) => {
        const px = mapX(pt[0]);
        const py = mapY(pt[1]);
        if (index === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Gambar titik lingkaran data neobrutalist
    series.p.forEach(pt => {
      if (series.d && !series.dot) return;
      const px = mapX(pt[0]);
      const py = mapY(pt[1]);
      ctx.beginPath();
      ctx.arc(px, py, series.dot ? 9 : 5, 0, Math.PI * 2);
      ctx.fillStyle = series.c;
      ctx.fill();
      ctx.strokeStyle = "#0b192c";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  });
}

/**
 * Membuat paket data seri grafik untuk historis dan proyeksi suatu wilayah.
 * @param {string} region - Nama wilayah
 * @param {string} mainColor - Warna garis historis
 * @param {string} [projColor] - Warna garis proyeksi
 * @returns {Array<object>} Array seri data siap pakai untuk renderCanvasChart
 */
function createRegionSeries(region, mainColor, projColor) {
  const shortName = SHORT_NAMES[region] || region;
  const historyYears = [2020, 2021, 2022, 2023, 2024, 2025];
  const projectionYears = [2025, 2026, 2027, 2028, 2029, 2030];

  return [
    {
      n: shortName,
      c: mainColor,
      p: historyYears.map(year => [year, findDataRow(region, year).persenMiskin])
    },
    {
      n: `${shortName} (Proyeksi)`,
      c: projColor || mainColor,
      d: 1,
      p: projectionYears.map(year => [year, getPovertyValue(region, year)])
    }
  ];
}

/* ============================================================================
   5. MODUL PETA GOOGLE MAPS ASLI (LEAFLET & GOOGLE TILES)
   ============================================================================ */

let leafletMap = null;
let googleTileLayers = {};
let currentGoogleLayer = "road";
const regionPolygons = {};
const regionMarkers = {};

/**
 * Mengonversi koordinat path SVG ke poligon geografis riil [latitude, longitude].
 * Formula transformasi: Latitude = 4.6 - y/100, Longitude = 103.4 + x/100.
 * @param {string} region - Nama kabupaten / kota
 * @returns {Array<Array<[number, number]>>} Koordinat poligon multi-ring
 */
function getRegionGeoCoordinates(region) {
  const svgPath = APP_DATA.paths[region].d;
  return svgPath.split("M").filter(Boolean).map(subPath => {
    return subPath.replace("Z", "").split("L").map(pt => {
      const coords = pt.split(",");
      const x = parseFloat(coords[0]);
      const y = parseFloat(coords[1]);
      return [4.6 - y / 100, 103.4 + x / 100];
    });
  });
}

/**
 * Menghitung titik koordinat pusat (centroid) geografis wilayah.
 * @param {string} region - Nama kabupaten / kota
 * @returns {[number, number]} Koordinat [latitude, longitude]
 */
function getRegionCenterCoordinates(region) {
  const p = APP_DATA.paths[region];
  return [4.6 - p.cy / 100, 103.4 + p.cx / 100];
}

/**
 * Menginisialisasi Peta Google Maps asli menggunakan engine Leaflet & Tile Layer Google.
 */
function initializeGoogleMap() {
  const mapContainer = getEl("google-map");
  if (!mapContainer || typeof L === "undefined") return;

  // Buat instance peta Leaflet terpusat di Kepulauan Riau
  leafletMap = L.map("google-map", {
    center: [2.3, 106.0],
    zoom: 7,
    zoomControl: true,
    minZoom: 5,
    maxZoom: 18
  });

  // Siapkan Tile Layers Google Maps Resmi (Roadmap, Satellite, Terrain)
  googleTileLayers.road = L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["0", "1", "2", "3"],
    attribution: "&copy; Google Maps"
  });

  googleTileLayers.sat = L.tileLayer("https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["0", "1", "2", "3"],
    attribution: "&copy; Google Maps"
  });

  googleTileLayers.ter = L.tileLayer("https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["0", "1", "2", "3"],
    attribution: "&copy; Google Maps"
  });

  // Tampilkan layer Roadmap Google secara default
  googleTileLayers.road.addTo(leafletMap);

  // Buat poligon interaktif untuk seluruh 7 kabupaten/kota di Kepulauan Riau
  const allPolygonBounds = [];

  APP_DATA.regs.forEach(region => {
    const geoRings = getRegionGeoCoordinates(region);
    const centerPoint = getRegionCenterCoordinates(region);
    const shortName = SHORT_NAMES[region] || region;

    // Poligon spasial wilayah
    const polygon = L.polygon(geoRings, {
      color: "#0b192c",
      weight: 2,
      fillColor: getRegionColor(region),
      fillOpacity: 0.72
    }).addTo(leafletMap);

    // Event Hover pada poligon Google Maps
    polygon.on("mouseover", () => {
      polygon.setStyle({
        weight: 3.5,
        color: "#0b192c",
        fillOpacity: 0.92
      });
      polygon.bindTooltip(
        `<strong>${region}</strong>: ${formatNumber(getPovertyValue(region, currentYear))}%${currentYear > 2025 ? " (prediksi)" : ""}`,
        { sticky: true }
      ).openTooltip();
    });

    polygon.on("mouseout", () => {
      const isSelected = region === selectedRegion;
      polygon.setStyle({
        weight: isSelected ? 4 : 2,
        color: "#0b192c",
        fillOpacity: isSelected ? 0.92 : 0.72
      });
    });

    // Event Klik untuk membuka panel detail statistik wilayah
    polygon.on("click", () => {
      selectedRegion = region;
      updateMapVisuals();
      updateRegionDetail();
    });

    regionPolygons[region] = polygon;
    allPolygonBounds.push(polygon.getBounds());

    // Pasang label nama wilayah di atas Google Maps
    const labelIcon = L.divIcon({
      className: "map-marker-container",
      html: `<div class="map-marker-label">${shortName}</div>`,
      iconSize: [84, 26],
      iconAnchor: [42, 13]
    });

    const marker = L.marker(centerPoint, { icon: labelIcon }).addTo(leafletMap);
    marker.on("click", () => {
      selectedRegion = region;
      updateMapVisuals();
      updateRegionDetail();
    });

    regionMarkers[region] = marker;
  });

  // Fit bounds peta agar seluruh Kepulauan Riau terlihat sempurna
  if (allPolygonBounds.length) {
    const combinedBounds = allPolygonBounds.reduce((acc, curr) => acc.extend(curr), L.latLngBounds(allPolygonBounds[0]));
    leafletMap.fitBounds(combinedBounds, { padding: [25, 25] });
  }

  // Pengatur pergantian tipe layer Google Maps (Roadmap, Satellite, Terrain)
  document.querySelectorAll("#map-type-group button").forEach(btn => {
    btn.onclick = () => {
      const selectedType = btn.dataset.layer;
      if (selectedType === currentGoogleLayer) return;

      leafletMap.removeLayer(googleTileLayers[currentGoogleLayer]);
      googleTileLayers[selectedType].addTo(leafletMap);
      currentGoogleLayer = selectedType;

      document.querySelectorAll("#map-type-group button").forEach(b => b.classList.toggle("on", b === btn));
    };
  });
}

/**
 * Memperbarui tampilan warna wilayah pada peta Google Maps, legenda, dan bar chart peringkat.
 */
function updateMapVisuals() {
  // Update warna seluruh poligon di Google Maps
  APP_DATA.regs.forEach(region => {
    const polygon = regionPolygons[region];
    if (polygon) {
      const isSelected = region === selectedRegion;
      polygon.setStyle({
        fillColor: getRegionColor(region),
        color: "#0b192c",
        weight: isSelected ? 4 : 2,
        fillOpacity: isSelected ? 0.92 : 0.72
      });
    }
  });

  // Perbarui label tahun saat ini
  const yearLabel = getEl("year-label");
  if (yearLabel) {
    yearLabel.textContent = `${currentYear}${currentYear > 2025 ? " (Prediksi)" : ""}`;
  }

  // Perbarui isi legenda
  const legendEl = getEl("map-legend");
  if (legendEl) {
    if (currentMode === "k") {
      const clusterColors = [
        getCssVariable("--cluster-1"),
        getCssVariable("--cluster-2"),
        getCssVariable("--cluster-3"),
        getCssVariable("--cluster-4")
      ];
      legendEl.innerHTML = Array.from({ length: currentK }, (_, i) => {
        return `<span><i class="legend-color-box" style="background:${clusterColors[i]}"></i>Klaster ${i + 1}</span>`;
      }).join("");
    } else {
      legendEl.innerHTML = `
        <span>Rendah (3%)</span>
        <span class="legend-gradient-bar"></span>
        <span>Tinggi (12%+)</span>
      `;
    }
  }

  // Perbarui daftar peringkat persentase kemiskinan
  const rankingEl = getEl("ranking-container");
  if (rankingEl) {
    const sortedRegions = APP_DATA.regs
      .slice()
      .sort((a, b) => getPovertyValue(b, currentYear) - getPovertyValue(a, currentYear));

    rankingEl.innerHTML = sortedRegions.map(region => {
      const rate = getPovertyValue(region, currentYear);
      const barWidth = Math.min(100, (rate / 15) * 100);
      return `
        <div class="rank-item">
          <span class="rank-name">${region}</span>
          <div class="rank-bar-bg">
            <div class="rank-bar-fill" style="width:${barWidth}%; background:${getPovertyColorRamp(rate)}"></div>
          </div>
          <span class="rank-value">${formatNumber(rate)}%</span>
        </div>
      `;
    }).join("");
  }
}

/**
 * Menampilkan panel detail statistik dan grafik wilayah yang diklik oleh pengguna.
 */
function updateRegionDetail() {
  if (!selectedRegion) return;

  const latest = getLatestData(selectedRegion);
  const baseline = findDataRow(selectedRegion, 2020);

  const titleEl = getEl("detail-region-name");
  const containerEl = getEl("detail-stats-container");

  if (titleEl) titleEl.textContent = `Detail Wilayah: ${selectedRegion}`;

  if (containerEl) {
    const delta = latest.persenMiskin - baseline.persenMiskin;
    containerEl.innerHTML = `
      <div class="stat-grid">
        <div class="stat-box">
          <span class="stat-label">% Miskin 2025</span>
          <span class="stat-value">${formatNumber(latest.persenMiskin)}%</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">RLS 2025</span>
          <span class="stat-value">${formatNumber(latest.rls)} th</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Klaster K-Means</span>
          <span class="stat-value">Klaster ${getClusterIndex(selectedRegion) + 1}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Penduduk</span>
          <span class="stat-value">${formatNumber(latest.pendudukRibu, 1)} rb</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Jumlah Miskin</span>
          <span class="stat-value">${formatNumber(latest.miskinRibu, 1)} rb</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Perubahan (2020→2025)</span>
          <span class="stat-value">${delta > 0 ? "+" : ""}${formatNumber(delta)} poin</span>
        </div>
      </div>
    `;
  }

  // Render grafik Canvas untuk wilayah yang dipilih
  const canvasEl = getEl("detail-chart-canvas");
  if (canvasEl) {
    const bluePrimary = getCssVariable("--blue-primary") || "#1565c0";
    const navyDeep = getCssVariable("--cluster-1") || "#0d3268";
    renderCanvasChart(canvasEl, createRegionSeries(selectedRegion, bluePrimary, navyDeep), 300);
  }
}

/**
 * Menghasilkan kesimpulan dan temuan data sains penting secara otomatis.
 */
function updateKeyInsights() {
  const insightsListEl = getEl("insights-list");
  if (!insightsListEl) return;

  const regionSummaries = APP_DATA.regs.map(region => ({
    wilayah: region,
    rate2025: getLatestData(region).persenMiskin,
    delta: getLatestData(region).persenMiskin - findDataRow(region, 2020).persenMiskin
  }));

  const highest = regionSummaries.reduce((prev, curr) => curr.rate2025 > prev.rate2025 ? curr : prev);
  const lowest = regionSummaries.reduce((prev, curr) => curr.rate2025 < prev.rate2025 ? curr : prev);
  const biggestDrop = regionSummaries.reduce((prev, curr) => curr.delta < prev.delta ? curr : prev);
  const smallestDrop = regionSummaries.reduce((prev, curr) => curr.delta > prev.delta ? curr : prev);
  const averageDelta = regionSummaries.reduce((acc, curr) => acc + curr.delta, 0) / 7;

  insightsListEl.innerHTML = `
    <li>Tingkat kemiskinan tertinggi tahun 2025 berada di <b>${highest.wilayah}</b> (${formatNumber(highest.rate2025)}%), sekitar <b>${formatNumber(highest.rate2025 / lowest.rate2025, 1)}×</b> lebih tinggi dibanding wilayah terendah <b>${lowest.wilayah}</b> (${formatNumber(lowest.rate2025)}%).</li>
    <li>Penurunan kemiskinan paling signifikan sejak 2020 dicapai oleh <b>${biggestDrop.wilayah}</b> (${formatNumber(biggestDrop.delta)} poin). Sementara itu pergerakan paling landai terjadi di <b>${smallestDrop.wilayah}</b> (${formatNumber(smallestDrop.delta)} poin).</li>
    <li>Rata-rata perubahan kemiskinan se-Kepri 2020–2025 adalah <b>${formatNumber(averageDelta)} poin</b>, dengan koefisien tren waktu model regresi <b>${formatNumber(APP_DATA.coef[1])}</b> poin per tahun.</li>
    <li>Rata-rata Lama Sekolah (RLS) konsisten meningkat di seluruh daerah, berkontribusi menurunkan estimasi angka kemiskinan secara korelasional.</li>
  `;
}

/* ============================================================================
   6. MODUL TAB KLASTER (K-MEANS)
   ============================================================================ */

/**
 * Mengisi tombol pemilihan jumlah klaster k pada interface.
 */
function renderClusterSelector() {
  document.querySelectorAll(".cluster-button-group").forEach(groupEl => {
    groupEl.innerHTML = Object.keys(APP_DATA.KS).map(kVal => {
      const isSelected = Number(kVal) === currentK;
      const isBest = Number(kVal) === BEST_K;
      return `<button class="btn-seg ${isSelected ? "on" : ""}" data-k="${kVal}">k=${kVal}${isBest ? " ★" : ""}</button>`;
    }).join("");

    groupEl.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        currentK = Number(btn.dataset.k);
        renderClusterSelector();
        updateMapVisuals();
        updateRegionDetail();
        updateClusterTab();
      };
    });
  });
}

/**
 * Memperbarui tabel evaluasi klaster, grafik elbow, dan tabel profil klaster.
 */
function updateClusterTab() {
  const recEl = getEl("cluster-recommendation");
  if (recEl) {
    const bestSil = formatNumber(APP_DATA.KS[BEST_K].sil, 3);
    recEl.textContent = `k = ${BEST_K} ★ (Silhouette Score: ${bestSil})`;
  }

  // Isi tabel evaluasi jumlah klaster
  const evalTableEl = getEl("cluster-eval-table");
  if (evalTableEl) {
    evalTableEl.innerHTML = `
      <tr>
        <th>Jumlah Klaster (k)</th>
        <th>Inertia</th>
        <th>Silhouette Score</th>
        <th>Davies-Bouldin</th>
        <th>Status Rekomendasi</th>
      </tr>
      ${Object.keys(APP_DATA.KS).map(kVal => {
        const item = APP_DATA.KS[kVal];
        const isBest = Number(kVal) === BEST_K;
        const isActive = Number(kVal) === currentK;
        return `
          <tr>
            <td>k = ${kVal}</td>
            <td>${formatNumber(item.inertia)}</td>
            <td>${formatNumber(item.sil, 3)}</td>
            <td>${formatNumber(item.db, 3)}</td>
            <td>
              ${isBest ? '<span class="badge">Rekomendasi Terbaik</span> ' : ""}
              ${isActive ? '<span class="badge badge-active">Sedang Dipilih</span>' : ""}
            </td>
          </tr>
        `;
      }).join("")}
    `;
  }

  // Isi tabel profil rata-rata tiap klaster
  const profileTableEl = getEl("cluster-profile-table");
  if (profileTableEl) {
    const centroids = APP_DATA.KS[currentK].cent;
    const clusterColorVars = ["--cluster-1", "--cluster-2", "--cluster-3", "--cluster-4"];

    profileTableEl.innerHTML = `
      <tr>
        <th>Klaster</th>
        <th>Daftar Kabupaten / Kota</th>
        <th>Rata-rata % Miskin</th>
        <th>Rata-rata RLS (Tahun)</th>
      </tr>
      ${centroids.map((center, index) => {
        const regionsInCluster = APP_DATA.regs.filter(r => getClusterIndex(r) === index);
        const color = getCssVariable(clusterColorVars[index]);
        return `
          <tr>
            <td>
              <span class="legend-color-box" style="background:${color}"></span>
              <strong>Klaster ${index + 1}</strong>
            </td>
            <td>${regionsInCluster.join(", ")}</td>
            <td>${formatNumber(center[0])}%</td>
            <td>${formatNumber(center[1])} tahun</td>
          </tr>
        `;
      }).join("")}
    `;
  }

  // Gambar grafik elbow jika tab klaster sedang terlihat
  const clusterTabEl = getEl("klaster-section");
  const elbowCanvas = getEl("elbow-chart-canvas");
  if (clusterTabEl && clusterTabEl.classList.contains("on") && elbowCanvas) {
    const bluePrimary = getCssVariable("--blue-primary") || "#1565c0";
    renderCanvasChart(
      elbowCanvas,
      [{
        n: "Inertia",
        c: bluePrimary,
        p: Object.keys(APP_DATA.KS).map(kVal => [Number(kVal), APP_DATA.KS[kVal].inertia])
      }],
      220
    );
  }
}

/* ============================================================================
   7. MODUL TAB PERBANDINGAN (BANDINGKAN DUA WILAYAH)
   ============================================================================ */

/**
 * Mengisi dropdown pilihan wilayah untuk fitur komparasi dua wilayah.
 */
function initializeComparisonDropdowns() {
  const optionsHtml = APP_DATA.regs.map(r => `<option value="${r}">${r}</option>`).join("");
  const selectA = getEl("compare-region-a");
  const selectB = getEl("compare-region-b");
  const selectPred = getEl("predict-region");

  if (selectA) selectA.innerHTML = optionsHtml;
  if (selectB) {
    selectB.innerHTML = optionsHtml;
    selectB.selectedIndex = 3; // Default ke Anambas
  }
  if (selectPred) selectPred.innerHTML = optionsHtml;
}

/**
 * Memperbarui grafik perbandingan dan tabel indikator komparatif dua wilayah.
 */
function updateComparisonTab() {
  const selectA = getEl("compare-region-a");
  const selectB = getEl("compare-region-b");
  const canvasEl = getEl("compare-chart-canvas");
  const tableEl = getEl("compare-table");

  if (!selectA || !selectB || !tableEl) return;

  const regionA = selectA.value;
  const regionB = selectB.value;

  const bluePrimary = getCssVariable("--blue-primary") || "#1565c0";
  const navyDeep = getCssVariable("--cluster-1") || "#0d3268";

  // Gambar grafik garis dua wilayah
  if (canvasEl) {
    renderCanvasChart(canvasEl, [
      ...createRegionSeries(regionA, bluePrimary, bluePrimary).map(s => ({
        ...s,
        n: s.d ? `${regionA} (Proyeksi)` : regionA
      })),
      ...createRegionSeries(regionB, navyDeep, navyDeep).map(s => ({
        ...s,
        n: s.d ? `${regionB} (Proyeksi)` : regionB
      }))
    ], 260);
  }

  // Baris indikator perbandingan
  const indicatorRows = [
    ["% Penduduk Miskin (2020)", reg => formatNumber(findDataRow(reg, 2020).persenMiskin) + "%"],
    ["% Penduduk Miskin (2025)", reg => formatNumber(getLatestData(reg).persenMiskin) + "%"],
    ["Perubahan 2020–2025", reg => {
      const d = getLatestData(reg).persenMiskin - findDataRow(reg, 2020).persenMiskin;
      return (d > 0 ? "+" : "") + formatNumber(d) + " poin";
    }],
    ["Rata-rata Lama Sekolah 2025", reg => formatNumber(getLatestData(reg).rls) + " tahun"],
    ["Garis Kemiskinan 2025", reg => "Rp " + getLatestData(reg).garisKemiskinan.toLocaleString("id-ID")],
    ["Jumlah Penduduk 2025", reg => formatNumber(getLatestData(reg).pendudukRibu, 1) + " ribu jiwa"],
    ["Klaster K-Means", reg => "Klaster " + (getClusterIndex(reg) + 1)],
    ["Prediksi Kemiskinan 2027", reg => formatNumber(getPovertyValue(reg, 2027)) + "%"]
  ];

  tableEl.innerHTML = `
    <tr>
      <th>Indikator Pembangunan</th>
      <th>${regionA}</th>
      <th>${regionB}</th>
    </tr>
    ${indicatorRows.map(row => `
      <tr>
        <td>${row[0]}</td>
        <td>${row[1](regionA)}</td>
        <td>${row[1](regionB)}</td>
      </tr>
    `).join("")}
  `;
}

/* ============================================================================
   8. MODUL TAB PREDIKSI & PROYEKSI
   ============================================================================ */

/**
 * Menghitung dan menampilkan hasil kalkulator simulasi prediksi "what-if".
 */
function updatePredictionCalculation() {
  const regSelect = getEl("predict-region");
  const yearInput = getEl("predict-year");
  const rlsInput = getEl("predict-rls");

  if (!regSelect || !yearInput || !rlsInput) return;

  const region = regSelect.value;
  const year = Number(yearInput.value);
  const rlsVal = Number(rlsInput.value);

  const predictedRate = calculatePovertyPrediction(region, year, rlsVal);
  const latestRow = getLatestData(region);
  const difference = predictedRate - latestRow.persenMiskin;

  const outputValEl = getEl("predict-output-value");
  const outputDescEl = getEl("predict-output-desc");
  const chartTitleEl = getEl("predict-chart-title");

  if (outputValEl) outputValEl.textContent = `${formatNumber(predictedRate)}%`;
  if (outputDescEl) {
    const diffSign = difference >= 0 ? "+" : "";
    outputDescEl.textContent = `Aktual 2025: ${formatNumber(latestRow.persenMiskin)}% (Selisih: ${diffSign}${formatNumber(difference)} poin)`;
  }
  if (chartTitleEl) chartTitleEl.textContent = `Proyeksi Wilayah: ${region}`;

  // Gambar grafik proyeksi interaktif
  const predSection = getEl("prediksi-section");
  const canvasEl = getEl("predict-chart-canvas");
  if (predSection && predSection.classList.contains("on") && canvasEl) {
    const bluePrimary = getCssVariable("--blue-primary") || "#1565c0";
    const navyDeep = getCssVariable("--cluster-1") || "#0d3268";

    renderCanvasChart(canvasEl, [
      ...createRegionSeries(region, bluePrimary, navyDeep),
      {
        n: "Simulasi Prediksimu",
        c: "#ff9800",
        dot: 1,
        p: [[year, predictedRate]]
      }
    ], 260);
  }
}

/**
 * Mengisi nilai RLS default berdasarkan tren linear historis saat wilayah/tahun diubah.
 */
function setDefaultPredictionRls() {
  const regSelect = getEl("predict-region");
  const yearInput = getEl("predict-year");
  const rlsInput = getEl("predict-rls");

  if (!regSelect || !yearInput || !rlsInput) return;

  const region = regSelect.value;
  const year = Number(yearInput.value);
  rlsInput.value = calculateProjectedRls(region, year).toFixed(2);
  updatePredictionCalculation();
}

/**
 * Menampilkan metrik evaluasi model (MAE, RMSE, R²) serta tabel proyeksi 2026-2030.
 */
function renderModelEvaluationAndProjections() {
  // Kotak metrik evaluasi
  const evalContainer = getEl("eval-metrics-container");
  if (evalContainer) {
    const evalData = APP_DATA.eval;
    evalContainer.innerHTML = `
      <div class="stat-box">
        <span class="stat-label">MAE (Mean Absolute Error)</span>
        <span class="stat-value">${formatNumber(evalData.mae, 3)}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">RMSE</span>
        <span class="stat-value">${formatNumber(evalData.rmse, 3)}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">R² (Koefisien Determinasi)</span>
        <span class="stat-value">${formatNumber(evalData.r2, 3)}</span>
      </div>
    `;
  }

  // Tabel uji performa 2025
  const testTableEl = getEl("eval-test-table");
  if (testTableEl) {
    testTableEl.innerHTML = `
      <tr>
        <th>Wilayah Uji</th>
        <th>Nilai Aktual 2025</th>
        <th>Hasil Prediksi Model</th>
        <th>Residu (Selisih)</th>
      </tr>
      ${APP_DATA.regs.map(reg => {
        const actual = getLatestData(reg).persenMiskin;
        const predicted = APP_DATA.testpred[reg];
        const residual = actual - predicted;
        return `
          <tr>
            <td>${reg}</td>
            <td>${formatNumber(actual)}%</td>
            <td>${formatNumber(predicted)}%</td>
            <td>${(residual > 0 ? "+" : "") + formatNumber(residual)}</td>
          </tr>
        `;
      }).join("")}
      <tr>
        <td colspan="4" class="helper-text">
          Benchmark MAE Naif (memakai nilai tahun 2024 sebagai prediktor 2025): ${formatNumber(APP_DATA.eval.naive, 3)}
        </td>
      </tr>
    `;
  }

  // Tabel proyeksi seluruh wilayah 2025-2030
  const projTableEl = getEl("projection-table");
  const years = [2026, 2027, 2028, 2029, 2030];
  if (projTableEl) {
    projTableEl.innerHTML = `
      <tr>
        <th>Wilayah</th>
        <th>2025 (Aktual)</th>
        ${years.map(y => `<th>${y}</th>`).join("")}
      </tr>
      ${APP_DATA.regs.map(reg => {
        const actual2025 = getLatestData(reg).persenMiskin;
        return `
          <tr>
            <td><strong>${reg}</strong></td>
            <td>${formatNumber(actual2025)}%</td>
            ${years.map(y => `<td>${formatNumber(getPovertyValue(reg, y))}%</td>`).join("")}
          </tr>
        `;
      }).join("")}
    `;
  }

  // Tombol salin CSV tabel proyeksi
  const copyBtn = getEl("btn-copy-csv");
  const copyMsg = getEl("copy-csv-message");
  if (copyBtn) {
    copyBtn.onclick = () => {
      const csvHeader = `Wilayah;2025;${years.join(";")}\n`;
      const csvBody = APP_DATA.regs.map(reg => {
        const actual2025 = formatNumber(getLatestData(reg).persenMiskin);
        const projectedValues = years.map(y => formatNumber(getPovertyValue(reg, y)));
        return [reg, actual2025, ...projectedValues].join(";");
      }).join("\n");

      const fullCsv = csvHeader + csvBody;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullCsv)
          .then(() => {
            if (copyMsg) copyMsg.textContent = "Data proyeksi berhasil disalin ke clipboard.";
            setTimeout(() => { if (copyMsg) copyMsg.textContent = ""; }, 3000);
          })
          .catch(() => {
            if (copyMsg) copyMsg.textContent = "Gagal menyalin otomatis. Silakan blok tabel.";
          });
      } else {
        if (copyMsg) copyMsg.textContent = "Fitur clipboard tidak didukung di browser ini.";
      }
    };
  }
}

/* ============================================================================
   9. MODUL TAB DATASET BERSIH
   ============================================================================ */

/**
 * Mengisi dropdown filter wilayah pada tab data tabular BPS.
 */
function initializeDataFilter() {
  const filterSelect = getEl("data-filter-region");
  if (!filterSelect) return;

  filterSelect.innerHTML = '<option value="">Semua Wilayah (Kepri)</option>' +
    APP_DATA.regs.map(r => `<option value="${r}">${r}</option>`).join("");

  filterSelect.onchange = updateDataTable;
}

/**
 * Menampilkan data tabel tabular BPS dengan filter wilayah yang dipilih.
 */
function updateDataTable() {
  const filterSelect = getEl("data-filter-region");
  const tableEl = getEl("data-clean-table");
  if (!tableEl) return;

  const selectedFilter = filterSelect ? filterSelect.value : "";
  const filteredData = TABLE_ROWS.filter(r => !selectedFilter || r.wilayah === selectedFilter);

  tableEl.innerHTML = `
    <tr>
      <th>Tahun</th>
      <th>Kabupaten / Kota</th>
      <th>% Penduduk Miskin</th>
      <th>Rata-rata Lama Sekolah (Th)</th>
      <th>Garis Kemiskinan</th>
      <th>Jumlah Penduduk</th>
      <th>Jumlah Penduduk Miskin</th>
    </tr>
    ${filteredData.map(r => `
      <tr>
        <td><strong>${r.tahun}</strong></td>
        <td>${r.wilayah}</td>
        <td>${formatNumber(r.persenMiskin)}%</td>
        <td>${formatNumber(r.rls)}</td>
        <td>Rp ${r.garisKemiskinan.toLocaleString("id-ID")}</td>
        <td>${formatNumber(r.pendudukRibu, 1)} ribu</td>
        <td>${formatNumber(r.miskinRibu, 1)} ribu</td>
      </tr>
    `).join("")}
  `;
}

/* ============================================================================
   10. PENGATUR KONTROL WAKTU, NAVIGASI & EVENT LISTENERS
   ============================================================================ */

/**
 * Mengatur tombol animasi pemutaran waktu (play/pause timeline tahun).
 */
function setupTimelineControls() {
  const yearSlider = getEl("year-slider");
  const playButton = getEl("btn-play-timeline");

  if (yearSlider) {
    yearSlider.oninput = e => {
      currentYear = Number(e.target.value);
      updateMapVisuals();
    };
  }

  if (playButton) {
    playButton.onclick = () => {
      if (animationTimer) {
        clearInterval(animationTimer);
        animationTimer = null;
        playButton.textContent = "▶ Putar Animasi";
        return;
      }

      // Alihkan otomatis ke mode persentase kemiskinan saat animasi berjalan
      currentMode = "y";
      document.querySelectorAll("#mode-button-group button").forEach(btn => {
        btn.classList.toggle("on", btn.dataset.m === "y");
      });

      playButton.textContent = "⏹ Berhenti";
      currentYear = 2019;

      animationTimer = setInterval(() => {
        currentYear++;
        if (currentYear > 2030) {
          clearInterval(animationTimer);
          animationTimer = null;
          playButton.textContent = "▶ Putar Animasi";
          currentYear = 2030;
        }
        if (yearSlider) yearSlider.value = currentYear;
        updateMapVisuals();
      }, 850);
    };
  }

  // Switcher mode peta (Klaster vs % Miskin)
  document.querySelectorAll("#mode-button-group button").forEach(btn => {
    btn.onclick = () => {
      currentMode = btn.dataset.m;
      document.querySelectorAll("#mode-button-group button").forEach(b => b.classList.toggle("on", b === btn));
      updateMapVisuals();
    };
  });
}

/**
 * Mengatur navigasi perpindahan tab aplikasi.
 */
function setupNavigation() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.onclick = () => {
      const targetTab = btn.dataset.tab;

      document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("on", b === btn));
      document.querySelectorAll(".tab-section").forEach(sec => sec.classList.toggle("on", sec.id === `${targetTab}-section`));

      // Redraw kanvas grafik & pastikan Google Maps ter-render pas saat tab aktif berpindah
      refreshActiveViews();
    };
  });
}

/**
 * Memperbarui tampilan seluruh komponen saat tab aktif berpindah atau jendela di-resize.
 */
function refreshActiveViews() {
  if (leafletMap) {
    setTimeout(() => {
      leafletMap.invalidateSize();
    }, 150);
  }
  updateClusterTab();
  updateRegionDetail();
  updateComparisonTab();
  updatePredictionCalculation();
}

/**
 * Inisialisasi utama aplikasi saat dokumen selesai dimuat.
 */
function initializeApp() {
  initializeGoogleMap();
  setupTimelineControls();
  setupNavigation();

  renderClusterSelector();
  updateMapVisuals();
  updateKeyInsights();

  initializeComparisonDropdowns();
  updateComparisonTab();

  // Atur event listener untuk tab perbandingan
  const selectA = getEl("compare-region-a");
  const selectB = getEl("compare-region-b");
  if (selectA) selectA.onchange = updateComparisonTab;
  if (selectB) selectB.onchange = updateComparisonTab;

  // Atur event listener untuk kalkulator prediksi
  const selectPred = getEl("predict-region");
  const inputYear = getEl("predict-year");
  const inputRls = getEl("predict-rls");
  if (selectPred) selectPred.onchange = setDefaultPredictionRls;
  if (inputYear) inputYear.oninput = setDefaultPredictionRls;
  if (inputRls) inputRls.oninput = updatePredictionCalculation;

  renderModelEvaluationAndProjections();
  setDefaultPredictionRls();

  initializeDataFilter();
  updateDataTable();

  // Pilih Batam sebagai wilayah default untuk panel detail
  selectedRegion = "Batam";
  updateMapVisuals();
  updateRegionDetail();

  // Tambahkan listener resize jendela
  window.addEventListener("resize", refreshActiveViews);
}

// Jalankan aplikasi setelah DOM siap
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

