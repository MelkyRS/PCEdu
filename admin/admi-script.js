const supabaseUrl = 'https://kyocmqkgnuskqawrtcew.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5b2NtcWtnbnVza3Fhd3J0Y2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjUyMTAsImV4cCI6MjA5Njc0MTIxMH0.3D4hHyvhCZDd61AmmFtNLhj-QwD-5wXtP2m0DP4MeVU'; 

const clientDB = supabase.createClient(supabaseUrl, supabaseKey);

function bukaTab(tabId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

async function muatMateri() {
    const { data, error } = await clientDB.from('komponen').select('*').order('id', { ascending: false });
    const container = document.getElementById('list-materi');
    container.innerHTML = '';
    
    if (data) {
        data.forEach(item => {
            container.innerHTML += `
                <div class="step-card" style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="flex-grow:1; padding-right:1rem;">
                        <strong>${item.nama}</strong>
                        <p style="font-size:0.9rem; color:#666;">${item.fungsi}</p>
                    </div>
                    <button onclick="hapusMateri(${item.id})" style="background:#e74c3c; color:white; border:none; padding:0.5rem 1rem; border-radius:4px; cursor:pointer;">Hapus</button>
                </div>`;
        });
    }
}

async function tambahMateri() {
    const nama = document.getElementById('mat-nama').value;
    const fungsi = document.getElementById('mat-fungsi').value;
    if(!nama || !fungsi) return alert('Semua field harus diisi!');

    await clientDB.from('komponen').insert([{ nama, fungsi }]);
    document.getElementById('mat-nama').value = '';
    document.getElementById('mat-fungsi').value = '';
    muatMateri();
}

async function hapusMateri(id) {
    if(confirm('Hapus materi ini?')) {
        await clientDB.from('komponen').delete().eq('id', id);
        muatMateri();
    }
}

async function muatSimulator() {
    const { data, error } = await clientDB.from('simulator_komponen').select('*').order('kategori', { ascending: true });
    const container = document.getElementById('list-simulator');
    container.innerHTML = '';

    if (data) {
        data.forEach(item => {
            container.innerHTML += `
                <div class="step-card" style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="flex-grow:1; padding-right:1rem;">
                        <strong>[${item.kategori.toUpperCase()}] ${item.nama}</strong> - ${formatRupiah(item.harga)}
                        <p style="font-size:0.85rem; color:#7f8c8d;">Socket: ${item.socket || '-'} | Tipe RAM: ${item.ram_type || '-'}</p>
                    </div>
                    <button onclick="hapusSimulator(${item.id})" style="background:#e74c3c; color:white; border:none; padding:0.5rem 1rem; border-radius:4px; cursor:pointer;">Hapus</button>
                </div>`;
        });
    }
}

async function tambahSimulator() {
    const kategori = document.getElementById('sim-kategori').value;
    const nama = document.getElementById('sim-nama').value;
    const harga = Number(document.getElementById('sim-harga').value);
    const socket = document.getElementById('sim-socket').value || null;
    const ram_type = document.getElementById('sim-ramtype').value || null;

    if(!nama || !harga) return alert('Nama dan Harga wajib diisi!');

    await clientDB.from('simulator_komponen').insert([{ kategori, nama, harga, socket, ram_type }]);
    document.getElementById('sim-nama').value = '';
    document.getElementById('sim-harga').value = '';
    document.getElementById('sim-socket').value = '';
    document.getElementById('sim-ramtype').value = '';
    muatSimulator();
}

async function hapusSimulator(id) {
    if(confirm('Hapus komponen simulator ini?')) {
        await clientDB.from('simulator_komponen').delete().eq('id', id);
        muatSimulator();
    }
}

async function muatKuis() {
    const { data, error } = await clientDB.from('kuis').select('*').order('id', { ascending: true });
    const container = document.getElementById('list-kuis');
    container.innerHTML = '';

    if (data) {
        data.forEach(item => {
            container.innerHTML += `
                <div class="step-card" style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="flex-grow:1; padding-right:1rem;">
                        <strong>Soal: ${item.tanya}</strong>
                        <p style="font-size:0.85rem; color:#555;">Opsi: A. ${item.opsi[0]} | B. ${item.opsi[1]} | C. ${item.opsi[2]} | D. ${item.opsi[3]}</p>
                        <p style="font-size:0.85rem; color:green; font-weight:bold;">Jawaban Benar Indeks Ke: ${item.jawaban_benar} (Kunci: ${item.opsi[item.jawaban_benar]})</p>
                    </div>
                    <button onclick="hapusKuis(${item.id})" style="background:#e74c3c; color:white; border:none; padding:0.5rem 1rem; border-radius:4px; cursor:pointer;">Hapus</button>
                </div>`;
        });
    }
}

async function tambahKuis() {
    const tanya = document.getElementById('kuis-tanya').value;
    const o0 = document.getElementById('kuis-o0').value;
    const o1 = document.getElementById('kuis-o1').value;
    const o2 = document.getElementById('kuis-o2').value;
    const o3 = document.getElementById('kuis-o3').value;
    const jawaban_benar = parseInt(document.getElementById('kuis-benar').value);

    if(!tanya || !o0 || !o1 || !o2 || !o3) return alert('Semua teks pertanyaan dan opsi pilihan harus diisi!');

    await clientDB.from('kuis').insert([{ tanya, opsi: [o0, o1, o2, o3], jawaban_benar }]);
    
    document.getElementById('kuis-tanya').value = '';
    document.getElementById('kuis-o0').value = '';
    document.getElementById('kuis-o1').value = '';
    document.getElementById('kuis-o2').value = '';
    document.getElementById('kuis-o3').value = '';
    muatKuis();
}

async function hapusKuis(id) {
    if(confirm('Hapus soal kuis ini?')) {
        await clientDB.from('kuis').delete().eq('id', id);
        muatKuis();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    muatMateri();
    muatSimulator();
    muatKuis();
});
