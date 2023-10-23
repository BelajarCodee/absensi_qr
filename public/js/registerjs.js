const jurusanSelect = document.getElementById("jurusan");
const kelasSelect = document.getElementById("kelas");

jurusanSelect.addEventListener("change", function() {
    const selectedJurusan = jurusanSelect.value;
    if (selectedJurusan === "TKJ") {
        kelasSelect.innerHTML = `
            <option value="XII-TKJ-1">XII-TKJ-1</option>
            <option value="XII-TKJ-2">XII-TKJ-2</option>
            <option value="XII-TKJ-3">XII-TKJ-3</option>
            <option value="XI-TJKT-1">XI-TJKT-1</option>
            <option value="XI-TJKT-2">XI-TJKT-2</option>
            <option value="XI-TJKT-3">XI-TJKT-3</option>
            <option value="X-TJKT-1">X-TJKT-1</option>
            <option value="X-TJKT-2">X-TJKT-2</option>
            <option value="X-TJKT-3">X-TJKT-3</option>
            <!-- Tambahkan pilihan kelas TKJ di sini -->
        `;
    } else if (selectedJurusan === "MM") {
        kelasSelect.innerHTML = `
            <option value="XII-MM-1">XII-MM-1</option>
            <option value="XII-MM-2">XII-MM-2</option>
            <option value="XII-MM-3">XII-MM-3</option>
            <!-- Tambahkan pilihan kelas MM di sini -->
        `;
    } else if (selectedJurusan === "ELIND") {
        kelasSelect.innerHTML = `
            <option value="XII-ELIND-1">XII-ELIND-1</option>
            <option value="XII-ELIND-2">XII-ELIND-2</option>
            <!-- Tambahkan pilihan kelas ELIND di sini -->
        `;
    } else if (selectedJurusan === "TKR") {
        kelasSelect.innerHTML = `
            <option value="XII-TKR-1">XII-TKR-1</option>
            <option value="XII-TKR-2">XII-TKR-2</option>
            <option value="XII-TKR-3">XII-TKR-3</option>
            <!-- Tambahkan pilihan kelas TKR di sini -->
        `;
    } else if (selectedJurusan === "TP") {
        kelasSelect.innerHTML = `
            <option value="XII-TP-1">XII-TP-1</option>
            <option value="XII-TP-2">XII-TP-2</option>
            <option value="XII-TP-3">XII-TP-3</option>
            <!-- Tambahkan pilihan kelas TP di sini -->
        `;
    }
});
