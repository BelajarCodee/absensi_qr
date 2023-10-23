document.addEventListener('DOMContentLoaded', function() {
    // Ambil elemen-elemen HTML
    const qrCodeInput = document.getElementById('qr-code-input');
    const absenButton = document.getElementById('absen-button');
    const absenData = document.getElementById('absen-data');

    // Tambahkan event listener saat tombol absen diklik
    absenButton.addEventListener('click', function() {
        const qrCodeValue = qrCodeInput.value;
        // Proses QR code dan tambahkan data absen ke dalam elemen absenData
        const absenRecord = processQRCode(qrCodeValue);
        if (absenRecord) {
            absenData.appendChild(absenRecord);
        }
    });

    // Fungsi untuk memproses QR code (sesuai dengan kebutuhan Anda)
    function processQRCode(qrCodeValue) {
        // Di sini Anda dapat mengekstrak data dari QR code, misalnya, nama, jam masuk, jam pulang, dan keterangan
        // Setelah itu, Anda dapat membuat elemen <tr> baru dan mengisi data tersebut
        // Contoh:
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>Nama Siswa</td>
            <td>Jam Masuk</td>
            <td>Jam Pulang</td>
            <td>Keterangan</td>
        `;
        return newRow;
    }
});
