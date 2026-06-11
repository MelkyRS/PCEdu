const supabaseUrl = 'https://kyocmqkgnuskqawrtcew.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5b2NtcWtnbnVza3Fhd3J0Y2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjUyMTAsImV4cCI6MjA5Njc0MTIxMH0.3D4hHyvhCZDd61AmmFtNLhj-QwD-5wXtP2m0DP4MeVU';

const clientDB = supabase.createClient(supabaseUrl, supabaseKey);

window.dataMekanikSimulator = []; 
let dataMateriAwal = []; 
let dataKuis = []; 
let indeksKuisSekarang = 0;
let skorKuis = 0;

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

async function fetchKomponen() {
    const { data, error } = await clientDB.from('komponen').select('*').order('id', { ascending: true });
    if (error) return console.error("Gagal memuat materi:", error.message);
    if (!data) return;
    
    dataMateriAwal = data; 
    renderKomponen(data);
}

async function isiDropdownSimulator() {
    const { data: dbKomponen, error } = await clientDB.from('simulator_komponen').select('*');
    if (error || !dbKomponen) return console.error("Gagal memuat item simulator:", error?.message);

    window.dataMekanikSimulator = dbKomponen; 
    
    const categories = ['cpu', 'mobo', 'ram', 'vga', 'storage', 'psu'];
    categories.forEach(cat => {
        const selectElement = document.getElementById(`sim-${cat}`);
        if (selectElement) {
            selectElement.innerHTML = `<option value="">-- Pilih ${cat.toUpperCase()} --</option>`;
            const filtered = dbKomponen.filter(item => item.kategori === cat);
            filtered.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.nama} - ${formatRupiah(item.harga)}`;
                selectElement.appendChild(option);
            });
        }
    });
}

async function muatSoalKuisDinamis() {
    const { data, error } = await clientDB.from('kuis').select('*').order('id', { ascending: true });
    if (error) return console.error("Gagal memuat bank soal kuis:", error.message);
    
    if (data && data.length > 0) {
        dataKuis = data; 
        indeksKuisSekarang = 0;
        skorKuis = 0;
        muatSoalKuis(); 
    }
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    const navLinks = document.getElementById('navLinks');
    if (navLinks.classList.contains('show')) navLinks.classList.remove('show');
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('show');
}

function renderKomponen(data) {
    const container = document.getElementById('komponenList');
    if (!container) return;
    container.innerHTML = ''; 
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${item.nama}</h3><p>${item.fungsi}</p>`;
        container.appendChild(card);
    });
}

function cariKomponen() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = dataMateriAwal.filter(item => 
        item.nama.toLowerCase().includes(keyword) || 
        item.fungsi.toLowerCase().includes(keyword)
    );
    renderKomponen(filteredData);
}

function hitungSimulator() {
    let total = 0;
    let warnings = [];
    
    const getKomponen = (cat) => {
        const idSelected = document.getElementById(`sim-${cat}`).value;
        return window.dataMekanikSimulator.find(i => i.id == idSelected);
    };

    const cpu = getKomponen('cpu');
    const mobo = getKomponen('mobo');
    const ram = getKomponen('ram');
    const vga = getKomponen('vga');
    const storage = getKomponen('storage');
    const psu = getKomponen('psu');

    if(cpu) total += Number(cpu.harga);
    if(mobo) total += Number(mobo.harga);
    if(ram) total += Number(ram.harga);
    if(vga) total += Number(vga.harga);
    if(storage) total += Number(storage.harga);
    if(psu) total += Number(psu.harga);

    if (cpu && mobo) {
        if (cpu.socket !== mobo.socket) {
            warnings.push(`TIDAK COCOK: Socket Prosesor (${cpu.socket}) tidak pas dengan Motherboard (${mobo.socket}).`);
        }
    }

    if (ram && mobo) {
        if (ram.ram_type !== mobo.ram_type) {
            warnings.push(`TIDAK COCOK: Tipe RAM (${ram.ram_type}) tidak didukung oleh Motherboard (Hanya mendukung ${mobo.ram_type}).`);
        }
    }

    document.getElementById('totalHarga').textContent = formatRupiah(total);
    
    const warningBox = document.getElementById('warningBox');
    if (warnings.length > 0) {
        warningBox.style.display = 'block';
        warningBox.innerHTML = `<strong>Peringatan Kecocokan:</strong><ul>` + warnings.map(w => `<li>${w}</li>`).join('') + `</ul>`;
    } else {
        warningBox.style.display = 'none';
        warningBox.innerHTML = '';
    }
}

function resetSimulator() {
    ['cpu', 'mobo', 'ram', 'vga', 'storage', 'psu'].forEach(cat => {
        document.getElementById(`sim-${cat}`).value = "";
    });
    hitungSimulator();
}

function muatSoalKuis() {
    if (dataKuis.length === 0) return; 
    
    const soal = dataKuis[indeksKuisSekarang];
    document.getElementById('pertanyaanKuis').textContent = `${indeksKuisSekarang + 1}. ${soal.tanya}`;
    
    const containerOpsi = document.getElementById('opsiJawaban');
    containerOpsi.innerHTML = ''; 
    
    soal.opsi.forEach((teks, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-opsi';
        btn.textContent = teks;
        btn.onclick = () => periksaJawaban(idx, btn);
        containerOpsi.appendChild(btn);
    });
    
    document.getElementById('btnSelanjutnya').style.display = 'none';
    document.getElementById('skorAkhir').textContent = '';
}

function periksaJawaban(indexDipilih, elemenTombol) {
    const benar = dataKuis[indeksKuisSekarang].jawaban_benar; 
    const semuaTombol = document.querySelectorAll('.btn-opsi');
    
    semuaTombol.forEach(btn => btn.disabled = true);
    
    if (indexDipilih === benar) {
        elemenTombol.classList.add('benar');
        skorKuis += Math.round(100 / dataKuis.length); 
    } else {
        elemenTombol.classList.add('salah');
        semuaTombol[benar].classList.add('benar');
    }
    
    document.getElementById('btnSelanjutnya').style.display = 'inline-block';
}

function soalSelanjutnya() {
    indeksKuisSekarang++;
    if (indeksKuisSekarang < dataKuis.length) {
        muatSoalKuis();
    } else {
        tampilkanHasil();
    }
}

function tampilkanHasil() {
    document.getElementById('pertanyaanKuis').textContent = "Kuis Selesai!";
    document.getElementById('opsiJawaban').innerHTML = '';
    document.getElementById('btnSelanjutnya').style.display = 'none';
    document.getElementById('skorAkhir').textContent = `Skor Anda: ${skorKuis} dari 100`;
    
    const btnUlang = document.createElement('button');
    btnUlang.className = 'btn-primary';
    btnUlang.textContent = 'Ulangi Kuis';
    btnUlang.onclick = () => {
        indeksKuisSekarang = 0;
        skorKuis = 0;
        muatSoalKuis();
    };
    document.getElementById('opsiJawaban').appendChild(btnUlang);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchKomponen();
    isiDropdownSimulator();
    muatSoalKuisDinamis();
});
