const dataKomponen = [
    { nama: "Prosesor (CPU)", fungsi: "Otak dari komputer yang mengeksekusi instruksi dan memproses data." },
    { nama: "Motherboard", fungsi: "Papan sirkuit utama tempat semua komponen PC terhubung dan berkomunikasi." },
    { nama: "RAM (Memory)", fungsi: "Penyimpanan data sementara yang sangat cepat untuk akses langsung oleh CPU." },
    { nama: "Penyimpanan (SSD/HDD)", fungsi: "Tempat menyimpan sistem operasi, aplikasi, dan file pengguna secara permanen." },
    { nama: "Power Supply (PSU)", fungsi: "Mengubah arus listrik AC dari stopkontak menjadi arus DC yang dibutuhkan komponen." },
    { nama: "Kartu Grafis (VGA/GPU)", fungsi: "Memproses dan menghasilkan gambar yang akan ditampilkan pada monitor." }
];

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(pageId).classList.add('active');
 
    const navLinks = document.getElementById('navLinks');
    if (navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
    }
}

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
}

function renderKomponen(data) {
    const container = document.getElementById('komponenList');
    container.innerHTML = ''; 
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${item.nama}</h3>
            <p>${item.fungsi}</p>
        `;
        container.appendChild(card);
    });
}

function cariKomponen() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = dataKomponen.filter(item => 
        item.nama.toLowerCase().includes(keyword) || 
        item.fungsi.toLowerCase().includes(keyword)
    );
    renderKomponen(filteredData);
}

document.addEventListener('DOMContentLoaded', () => {
    renderKomponen(dataKomponen);
});