function wrapLabel(text, maxLen = 16) {
  if (text.length <= maxLen) return text;
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  words.forEach((word) => {
    if ((currentLine + ' ' + word).trim().length <= maxLen) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
}

function calculateOptimalPack(neededGrams, availableSizes) {
  const sorted = [...availableSizes].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] >= neededGrams) {
      return {
        totalBought: sorted[i],
        label: `1 × ${sorted[i] >= 1000 ? (sorted[i] / 1000) + ' kg' : sorted[i] + ' gr'}`,
        surplus: sorted[i] - neededGrams
      };
    }
  }
  const largest = sorted[sorted.length - 1];
  const count = Math.ceil(neededGrams / largest);
  const totalBought = count * largest;
  return {
    totalBought,
    label: `${count} × ${largest >= 1000 ? (largest / 1000) + ' kg' : largest + ' gr'}`,
    surplus: totalBought - neededGrams
  };
}

function formatAquaCups(grams, gramsPerCup) {
  const cups = grams / gramsPerCup;
  const rounded = Math.round(cups * 100) / 100;
  const fillPercent = Math.min(100, Math.max(8, Math.round((cups % 1 === 0 && cups > 0 ? 1 : cups % 1) * 100)));

  if (Math.abs(rounded - 0.1) <= 0.03) {
    return {
      short: '± 1/10 gelas (± 1,5 sdm)',
      headline: '± 0,1 Gelas (Sekitar 1,5 Sendok Makan)',
      fill: 12
    };
  }
  if (Math.abs(rounded - 0.25) <= 0.05) {
    return {
      short: '± ¼ gelas (seperempat)',
      headline: '± 0,25 Gelas (Seperempat Gelas Aqua)',
      fill: 25
    };
  }
  if (Math.abs(rounded - 0.5) <= 0.06) {
    return {
      short: '± ½ gelas (setengah)',
      headline: '± 0,5 Gelas (Setengah Gelas Aqua)',
      fill: 50
    };
  }
  if (Math.abs(rounded - 0.94) <= 0.07 || Math.abs(rounded - 1.0) <= 0.05) {
    return {
      short: '± 1 gelas (peres / kurang 1 cm)',
      headline: rounded < 0.98 ? '± 0,94 Gelas (≈ 1 Gelas Kurang 1 cm)' : '± 1 Gelas Penuh Peres',
      fill: Math.min(100, Math.round(rounded * 100))
    };
  }
  if (Math.abs(rounded - 2.5) <= 0.08) {
    return {
      short: '2,5 gelas (2 penuh + ½)',
      headline: '2,5 Gelas Aqua (2 Gelas Penuh + ½ Gelas)',
      fill: 100
    };
  }

  const whole = Math.floor(rounded);
  const frac = Math.round((rounded - whole) * 10) / 10;
  const formattedNum = rounded.toString().replace('.', ',');
  let breakdown = '';
  if (whole >= 1 && frac > 0) {
    breakdown = ` (${whole} gelas penuh + ${frac.toString().replace('.', ',')} gelas)`;
  } else if (whole >= 1 && frac === 0) {
    breakdown = ` (${whole} gelas penuh peres)`;
  }

  return {
    short: `± ${formattedNum} gelas peres`,
    headline: `± ${formattedNum} Gelas Aqua${breakdown}`,
    fill: whole >= 1 ? 100 : fillPercent
  };
}

const walesSteps = [
  {
    badge: 'Tahap 1 dari 4 • Persiapan & Kalibrasi pH Air',
    title: 'Isi Drum dengan Separuh Air Bersih & Ukur pH (Standar 5,5 – 6,5)',
    desc: 'Tempatkan drum kapasitas besar pada bidang datar. Isi dengan 50% dari total kebutuhan air (75 Liter untuk target 150 L), lalu ukur dengan pH meter atau kertas lakmus. Bila pH > 7,2, tambahkan pH adjuster agar masuk standar aman kentang (5,5–6,5). Siapkan juga 2 ember kecil masing-masing berisi 5 liter air bersih.',
    tip: 'Koreksi pH air baku wajib dilakukan SEBELUM memasukkan bubuk Cabrio Top atau Manteb 80 WP.',
    liquidHeight: '50%',
    liquidColor: 'bg-sky-500/80',
    liquidText: '50% Air (pH Cek)'
  },
  {
    badge: 'Tahap 2 dari 4 • W1 (Water Dispersible Granules)',
    title: 'Larutkan Cabrio Top 60 WG di Ember Pertama (Pre-Mix 1)',
    desc: 'Taburkan butiran Cabrio Top 60 WG (± 1 gelas Aqua kurang 1 cm / 150 gr) secara perlahan ke permukaan 5 liter air di ember pertama. Diamkan selama 30 detik agar air meresap ke pori-pori granul, lalu aduk merata hingga menjadi suspensi homogen bebas gumpalan.',
    tip: 'Formulasi WG sangat mudah pecah dalam air dan tidak menghasilkan debu berlebih.',
    liquidHeight: '62%',
    liquidColor: 'bg-botanical-600/85',
    liquidText: '+ Pre-Mix Cabrio WG'
  },
  {
    badge: 'Tahap 3 dari 4 • W2 (Wettable Powder)',
    title: 'Larutkan Manteb 80 WP di Ember Kedua (Pre-Mix 2)',
    desc: 'Taburkan tepung Manteb 80 WP (2,5 gelas Aqua peres / 300 gr) sedikit demi sedikit ke ember kedua (5 liter air) sambil diaduk terus-menerus. Tepung WP bersifat menolak air (hidrofobik) jika dituang sekaligus, sehingga pengadukan bertahap mencegah terbentuknya bola tepung kering.',
    tip: 'Setelah menjadi pasta cair homogen, baru siap digabungkan ke drum utama.',
    liquidHeight: '75%',
    liquidColor: 'bg-amberwarn-600/85',
    liquidText: '+ Pre-Mix Manteb WP'
  },
  {
    badge: 'Tahap 4 dari 4 • A (Agitate) & S (Surfactant / Top-Up)',
    title: 'Integrasikan ke Drum Utama & Penuhi Hingga Volume Target',
    desc: 'Tuang larutan Pre-Mix Cabrio WG ke drum utama lalu aduk rata. Selanjutnya tuang larutan Pre-Mix Manteb WP sambil terus diaduk (agitasi). Terakhir, tambahkan sisa air hingga mencapai garis volume absolut (150 Liter), cek ulang pH akhir (5,5–6,5), dan masukkan perekat di urutan paling akhir.',
    tip: 'Aduk larutan setiap kali mengambil cairan ke tangki punggung agar tepung WP tidak mengendap.',
    liquidHeight: '95%',
    liquidColor: 'bg-botanical-800/90',
    liquidText: '100% Campuran Siap Pakai'
  }
];

let currentVolume = 150;
let currentStep = 1;
let packagingChartInstance = null;
let activeIngredientChartInstance = null;

function updatePhSimulator(phVal) {
  const ph = Math.max(4.0, Math.min(9.0, Number(phVal) || 6.2));
  document.getElementById('phValueDisplay').textContent = ph.toFixed(1);

  const valDisplay = document.getElementById('phValueDisplay');
  const box = document.getElementById('phStatusBox');
  const badge = document.getElementById('phStatusBadge');
  const actionTag = document.getElementById('phActionTag');
  const title = document.getElementById('phStatusTitle');
  const desc = document.getElementById('phStatusDesc');

  if (ph < 5.0) {
    valDisplay.className = 'font-mono text-2xl font-extrabold text-rose-700';
    box.className = 'p-4 sm:p-5 rounded-xl bg-rose-50 border border-rose-500/40 space-y-2 transition-all';
    badge.className = 'px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-rose-700 text-white';
    badge.textContent = 'BAHAYA TERLALU ASAM (< pH 5,0) • RISIKO DAUN KENTANG GOSONG';
    actionTag.className = 'text-xs font-mono font-bold text-rose-900';
    actionTag.textContent = 'Tindakan: Naikkan pH ke 5,5–6,5 sebelum aplikasi';
    title.className = 'text-base font-bold text-rose-900 pt-1';
    title.textContent = 'Pelepasan Ion Logam Bebas (Mn²⁺ & Zn²⁺) dan Gas CS₂';
    desc.textContent = 'Air terlalu asam memecah ikatan kimia mankozeb dan metiram secara cepat, melepaskan ion Mangan & Seng berlebih yang meracuni (membakar) jaringan daun kentang yang sensitif.';
  } else if (ph >= 5.0 && ph < 5.5) {
    valDisplay.className = 'font-mono text-2xl font-extrabold text-amberwarn-800';
    box.className = 'p-4 sm:p-5 rounded-xl bg-amberwarn-50 border border-amberwarn-600/40 space-y-2 transition-all';
    badge.className = 'px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-amberwarn-700 text-white';
    badge.textContent = 'WASPADA AGAK ASAM (pH 5,0 – 5,4)';
    actionTag.className = 'text-xs font-mono font-bold text-amberwarn-900';
    actionTag.textContent = 'Tindakan: Segera semprotkan (jangan disimpan lama)';
    title.className = 'text-base font-bold text-amberwarn-900 pt-1';
    title.textContent = 'Masih Dapat Digunakan dengan Syarat Langsung Habis';
    desc.textContent = 'Larutan sedikit di bawah rentang ideal kentang (5,5–6,5). Masih aman disemprotkan asalkan langsung dihabiskan saat itu juga dan cuaca tidak terik menyengat.';
  } else if (ph >= 5.5 && ph <= 6.5) {
    valDisplay.className = 'font-mono text-2xl font-extrabold text-botanical-800';
    box.className = 'p-4 sm:p-5 rounded-xl bg-botanical-50 border border-botanical-600/40 space-y-2 transition-all';
    badge.className = 'px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-botanical-800 text-white';
    badge.textContent = 'ZONA AMAN & OPTIMAL UNTUK KENTANG (pH 5,5 – 6,5)';
    actionTag.className = 'text-xs font-mono font-bold text-botanical-900';
    actionTag.textContent = 'Tindakan: Langsung Gunakan Tanpa Penyangga pH';
    title.className = 'text-base font-bold text-botanical-900 pt-1';
    title.textContent = 'Stabilitas Molekul Maksimal & Aman Bagi Kutikula Daun Kentang';
    desc.textContent = 'Pada rentang pH 5,5 hingga 6,5, piraklostrobin terserap optimal menembus kutikula daun kentang (Solanum tuberosum), sementara mankozeb dan metiram tetap stabil melapisi permukaan daun tanpa terurai menjadi senyawa beracun.';
  } else if (ph > 6.5 && ph <= 7.2) {
    valDisplay.className = 'font-mono text-2xl font-extrabold text-lime-800';
    box.className = 'p-4 sm:p-5 rounded-xl bg-lime-50 border border-lime-600/40 space-y-2 transition-all';
    badge.className = 'px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-lime-700 text-white';
    badge.textContent = 'BATAS TOLERANSI ATAS (pH 6,6 – 7,2)';
    actionTag.className = 'text-xs font-mono font-bold text-lime-900';
    actionTag.textContent = 'Tindakan: Aman dipakai langsung; disarankan tambah pH adjuster ringan';
    title.className = 'text-base font-bold text-lime-900 pt-1';
    title.textContent = 'Masih Aman Bagi Daun Kentang Namun Penyerapan Mulai Melambat';
    desc.textContent = 'Air netral masih aman bagi jaringan daun kentang, tetapi penyerapan piraklostrobin lebih cepat apabila pH diturunkan sedikit ke kisaran 6,0. Jangan biarkan larutan menginap di dalam tangki.';
  } else {
    valDisplay.className = 'font-mono text-2xl font-extrabold text-indigo-800';
    box.className = 'p-4 sm:p-5 rounded-xl bg-indigo-50 border border-indigo-600/40 space-y-2 transition-all';
    badge.className = 'px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-indigo-800 text-white';
    badge.textContent = 'MELEBIHI STANDAR BASA (> pH 7,2) • HIDROLISIS & RISIKO FITOTOKSISITAS';
    actionTag.className = 'text-xs font-mono font-bold text-indigo-900';
    actionTag.textContent = 'Tindakan: Wajib turunkan pH air dengan pH Adjuster / Asam Sitrat';
    title.className = 'text-base font-bold text-indigo-900 pt-1';
    title.textContent = 'Bahan Aktif Terurai (Hidrolisis Basa) & Mengganggu Kutikula Kentang';
    desc.textContent = 'Air baku yang terlalu basa (> pH 7,2–7,5) merusak stabilitas mankozeb, metiram, maupun piraklostrobin (efikasi turun drastis) dan berisiko mengiritasi lapisan lilin daun kentang. Tambahkan pH adjuster ke air baku hingga pH turun ke 5,5–6,5 sebelum obat dituang.';
  }

  document.querySelectorAll('.ph-preset').forEach((btn) => {
    const presetVal = Number(btn.getAttribute('data-ph'));
    if (Math.abs(presetVal - ph) < 0.05) {
      btn.classList.add('ring-2', 'ring-offset-1', 'ring-botanical-800');
    } else {
      btn.classList.remove('ring-2', 'ring-offset-1', 'ring-botanical-800');
    }
  });
}

function initCharts() {
  const ctxPack = document.getElementById('packagingChart').getContext('2d');
  packagingChartInstance = new Chart(ctxPack, {
    type: 'bar',
    data: {
      labels: [
        wrapLabel('Cabrio Top 60 WG (Kemasan 250 gr)'),
        wrapLabel('Manteb 80 WP (Kemasan 500 gr)')
      ],
      datasets: [
        {
          label: 'Takaran Terpakai (gram)',
          data: [150, 300],
          backgroundColor: '#1B4332',
          borderRadius: 6
        },
        {
          label: 'Sisa Stok Simpan (gram)',
          data: [100, 200],
          backgroundColor: '#D6D3D1',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Berat Bersih (Gram)' } }
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function (ctx) { return `${ctx.dataset.label}: ${ctx.parsed.y} gram`; }
          }
        }
      }
    }
  });

  const ctxActive = document.getElementById('activeIngredientChart').getContext('2d');
  activeIngredientChartInstance = new Chart(ctxActive, {
    type: 'bar',
    data: {
      labels: [
        wrapLabel('Piraklostrobin 5% (FRAC 11 Sistemik)'),
        wrapLabel('Metiram 55% (FRAC M03 Kontak)'),
        wrapLabel('Mankozeb 80% (FRAC M03 Kontak)')
      ],
      datasets: [
        {
          label: 'Berat Bahan Aktif Murni dalam 150 L (gram)',
          data: [7.5, 82.5, 240],
          backgroundColor: ['#40916C', '#D97706', '#B45309'],
          borderRadius: 8
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { beginAtZero: true, title: { display: true, text: 'Massa Bahan Aktif Murni (Gram)' } },
        y: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) { return `Bahan Aktif Murni: ${ctx.parsed.x} gram`; }
          }
        }
      }
    }
  });
}

function updateCalculator(volume) {
  const vol = Math.max(1, Math.min(2000, Number(volume) || 150));
  currentVolume = vol;

  const cabrioNeeded = Math.round(vol * 1 * 10) / 10;
  const mantebNeeded = Math.round(vol * 2 * 10) / 10;
  const totalSolids = Math.round((cabrioNeeded + mantebNeeded) * 10) / 10;

  const cabrioPack = calculateOptimalPack(cabrioNeeded, [250, 500]);
  const mantebPack = calculateOptimalPack(mantebNeeded, [250, 500, 800, 1000]);

  const cabrioCupInfo = formatAquaCups(cabrioNeeded, 160);
  const mantebCupInfo = formatAquaCups(mantebNeeded, 120);

  document.getElementById('kpiCabrioPack').textContent = `Beli ${cabrioPack.label}`;
  document.getElementById('kpiCabrioSub').textContent = `Total ${cabrioPack.totalBought} gr • Sisa simpan ${cabrioPack.surplus} gr`;
  document.getElementById('kpiCabrioUse').textContent = `${cabrioNeeded} gram`;
  document.getElementById('kpiCabrioCup').textContent = cabrioCupInfo.short;

  document.getElementById('kpiMantebPack').textContent = `Beli ${mantebPack.label}`;
  document.getElementById('kpiMantebSub').textContent = `Total ${mantebPack.totalBought} gr • Sisa simpan ${mantebPack.surplus} gr`;
  document.getElementById('kpiMantebUse').textContent = `${mantebNeeded} gram`;
  document.getElementById('kpiMantebCup').textContent = mantebCupInfo.short;

  document.getElementById('cardCabrioCupValue').textContent = cabrioCupInfo.headline;
  document.getElementById('cardCabrioCupDetail').innerHTML = `Untuk <strong>${cabrioNeeded} gram</strong> (${vol} L air): Karena bentuknya butiran granul WG yang lebih padat (1 gelas Aqua penuh rata bibir = ± 160 gram), tuang gembur tanpa ditekan.`;
  document.getElementById('cabrioCupFill').style.height = `${cabrioCupInfo.fill}%`;

  document.getElementById('cardMantebCupValue').textContent = mantebCupInfo.headline;
  document.getElementById('cardMantebCupDetail').innerHTML = `Untuk <strong>${mantebNeeded} gram</strong> (${vol} L air): Karena bentuknya serbuk tepung halus WP yang lebih ringan/mengembang (1 gelas Aqua peres = ± 120 gram), takar peres rata bibir gelas.`;
  document.getElementById('mantebCupFill').style.height = `${mantebCupInfo.fill}%`;

  const tanksCount = (vol / 15).toFixed(1).replace('.0', '');
  document.getElementById('kpiWaterTotal').textContent = `${vol} Liter`;
  document.getElementById('kpiWaterTanks').textContent = `Setara ± ${tanksCount} tangki semprot (15 L)`;
  document.getElementById('kpiTotalSolids').textContent = `${totalSolids} gram`;

  document.getElementById('tblCabrioUse').textContent = `${cabrioNeeded} gram`;
  document.getElementById('tblMantebUse').textContent = `${mantebNeeded} gram`;
  document.getElementById('tblCabrioCup').textContent = cabrioCupInfo.headline;
  document.getElementById('tblMantebCup').textContent = mantebCupInfo.headline;
  document.getElementById('tblCabrioWater').textContent = `${vol} Liter`;
  document.getElementById('tblMantebWater').textContent = `${vol} Liter`;

  document.getElementById('tblCabrioBuy').innerHTML = `<span class="inline-flex items-center px-3 py-1 rounded-lg text-sm font-mono font-extrabold bg-botanical-800 text-white">Kemasan ${cabrioPack.label}</span>`;
  document.getElementById('tblMantebBuy').innerHTML = `<span class="inline-flex items-center px-3 py-1 rounded-lg text-sm font-mono font-extrabold bg-amberwarn-700 text-white">Kemasan ${mantebPack.label}</span>`;

  document.getElementById('tblCabrioRem').textContent = `${cabrioPack.surplus} gram`;
  document.getElementById('tblMantebRem').textContent = `${mantebPack.surplus} gram`;

  if (packagingChartInstance) {
    packagingChartInstance.data.labels = [
      wrapLabel(`Cabrio Top 60 WG (${cabrioPack.label})`),
      wrapLabel(`Manteb 80 WP (${mantebPack.label})`)
    ];
    packagingChartInstance.data.datasets[0].data = [cabrioNeeded, mantebNeeded];
    packagingChartInstance.data.datasets[1].data = [cabrioPack.surplus, mantebPack.surplus];
    packagingChartInstance.update();
  }

  if (activeIngredientChartInstance) {
    activeIngredientChartInstance.data.datasets[0].label = `Berat Bahan Aktif Murni dalam ${vol} L (gram)`;
    activeIngredientChartInstance.data.datasets[0].data = [
      Math.round(cabrioNeeded * 0.05 * 100) / 100,
      Math.round(cabrioNeeded * 0.55 * 100) / 100,
      Math.round(mantebNeeded * 0.80 * 100) / 100
    ];
    activeIngredientChartInstance.update();
  }

  document.querySelectorAll('.vol-preset').forEach((btn) => {
    const btnVol = Number(btn.getAttribute('data-vol'));
    if (btnVol === vol) {
      btn.className = 'vol-preset px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-botanical-700 bg-botanical-800 text-white shadow-sm transition';
    } else {
      btn.className = 'vol-preset px-3 py-1.5 rounded-lg text-xs font-bold border border-earth-300 bg-canvas hover:bg-botanical-50 text-earth-800 transition';
    }
  });

  updateWalesUI(currentStep);
}

function updateWalesUI(step) {
  currentStep = step;
  const data = walesSteps[step - 1];
  const bufferVol = Math.round(currentVolume * 0.5 * 10) / 10;

  document.getElementById('walesBadge').textContent = data.badge;
  document.getElementById('walesTitle').textContent = data.title;
  document.getElementById('walesDesc').textContent = data.desc;
  document.getElementById('walesTip').textContent = data.tip;

  const liquidEl = document.getElementById('drumLiquid');
  liquidEl.style.height = data.liquidHeight;
  liquidEl.className = `w-full ${data.liquidColor} transition-all duration-500 flex flex-col items-center justify-center text-white font-mono text-xs font-bold text-center px-1`;

  if (step === 1) {
    document.getElementById('drumLabel').textContent = `${bufferVol} L Air (pH Cek)`;
  } else if (step === 4) {
    document.getElementById('drumLabel').textContent = `${currentVolume} L Siap`;
  } else {
    document.getElementById('drumLabel').textContent = data.liquidText;
  }

  document.querySelectorAll('.wales-step-btn').forEach((btn) => {
    const s = Number(btn.getAttribute('data-step'));
    if (s === step) {
      btn.className = 'wales-step-btn text-left p-3.5 rounded-xl border-2 border-botanical-700 bg-botanical-800 text-white transition';
      btn.querySelector('div:first-child').className = 'text-[11px] font-mono uppercase opacity-80';
    } else {
      btn.className = 'wales-step-btn text-left p-3.5 rounded-xl border border-earth-200 bg-canvas hover:bg-botanical-50 text-earth-800 transition';
      btn.querySelector('div:first-child').className = 'text-[11px] font-mono uppercase text-earth-600';
    }
  });

  document.getElementById('prevStepBtn').disabled = step === 1;
  document.getElementById('nextStepBtn').disabled = step === 4;
}

document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  updateCalculator(150);
  updatePhSimulator(6.2);

  const slider = document.getElementById('waterVolumeSlider');
  const input = document.getElementById('waterVolumeInput');

  slider.addEventListener('input', (e) => {
    input.value = e.target.value;
    updateCalculator(e.target.value);
  });

  input.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    if (val >= 1 && val <= 2000) {
      if (val <= 500) slider.value = val;
      updateCalculator(val);
    }
  });

  document.querySelectorAll('.vol-preset').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = Number(btn.getAttribute('data-vol'));
      input.value = val;
      if (val <= 500) slider.value = val;
      updateCalculator(val);
    });
  });

  const phSlider = document.getElementById('phSlider');
  phSlider.addEventListener('input', (e) => {
    updatePhSimulator(e.target.value);
  });

  document.querySelectorAll('.ph-preset').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = Number(btn.getAttribute('data-ph'));
      phSlider.value = val;
      updatePhSimulator(val);
    });
  });

  document.querySelectorAll('.risk-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      document.querySelectorAll('.risk-tab').forEach((t) => {
        t.className = 'risk-tab px-3.5 py-2 rounded-xl text-xs font-bold bg-earth-100 text-earth-800 hover:bg-earth-200 transition';
      });
      tab.className = 'risk-tab px-3.5 py-2 rounded-xl text-xs font-bold bg-amberwarn-700 text-white shadow-sm transition';

      document.querySelectorAll('.risk-panel').forEach((panel) => {
        panel.classList.add('hidden');
      });
      document.getElementById(`tab-${target}`).classList.remove('hidden');
    });
  });

  document.querySelectorAll('.wales-step-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateWalesUI(Number(btn.getAttribute('data-step')));
    });
  });

  document.getElementById('prevStepBtn').addEventListener('click', () => {
    if (currentStep > 1) updateWalesUI(currentStep - 1);
  });

  document.getElementById('nextStepBtn').addEventListener('click', () => {
    if (currentStep < 4) updateWalesUI(currentStep + 1);
  });
});