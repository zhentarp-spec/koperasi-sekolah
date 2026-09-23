//===============================
// DATA KERANJANG
// ===============================

let keranjang = [];


// ===============================
// FORMAT RUPIAH
// ===============================

function formatRupiah(angka) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);

}


// ===============================
// TAMBAH PRODUK
// ===============================

function tambahKeranjang(nama, harga, gambar) {

    let produk = keranjang.find(
        item => item.nama === nama
    );

    if (produk) {

        produk.jumlah++;

    } else {

        keranjang.push({
            nama: nama,
            harga: harga,
            gambar: gambar,
            jumlah: 1
        });

    }

    updateKeranjang();

    tampilkanNotifikasi(
        nama + " ditambahkan ke keranjang"
    );

}


// ===============================
// UPDATE KERANJANG
// ===============================

function updateKeranjang() {

    let jumlah = 0;

    keranjang.forEach(item => {
        jumlah += item.jumlah;
    });

    document.getElementById(
        "jumlahKeranjang"
    ).textContent = jumlah;

    tampilkanIsiKeranjang();

}


// ===============================
// TAMPILKAN ISI KERANJANG
// ===============================

function tampilkanIsiKeranjang() {

    const container =
        document.getElementById("isiKeranjang");

    const totalElement =
        document.getElementById("totalHarga");


    if (keranjang.length === 0) {

        container.innerHTML = `
            <div style="
                text-align:center;
                padding:30px;
                color:#777;
            ">
                🛒<br>
                Keranjang masih kosong.
            </div>
        `;

        totalElement.textContent = "Rp0";

        return;
    }


    let html = "";
    let total = 0;


    keranjang.forEach((item, index) => {

        let subtotal =
            item.harga * item.jumlah;

        total += subtotal;


        html += `

            <div class="item-keranjang">

                <img
                    src="${item.gambar}"
                    alt="${item.nama}"
                >

                <div class="item-detail">

                    <h4>
                        ${item.nama}
                    </h4>

                    <p>
                        ${formatRupiah(item.harga)}
                    </p>

                    <div class="qty">

                        <button
                            onclick="kurangiProduk(${index})"
                        >
                            −
                        </button>

                        <strong>
                            ${item.jumlah}
                        </strong>

                        <button
                            onclick="tambahJumlah(${index})"
                        >
                            +
                        </button>

                    </div>

                </div>

                <strong>
                    ${formatRupiah(subtotal)}
                </strong>

            </div>

        `;

    });


    container.innerHTML = html;

    totalElement.textContent =
        formatRupiah(total);

}


// ===============================
// TAMBAH JUMLAH
// ===============================

function tambahJumlah(index) {

    keranjang[index].jumlah++;

    updateKeranjang();

}


// ===============================
// KURANGI JUMLAH
// ===============================

function kurangiProduk(index) {

    keranjang[index].jumlah--;


    if (keranjang[index].jumlah <= 0) {

        keranjang.splice(index, 1);

    }


    updateKeranjang();

}


// ===============================
// BUKA KERANJANG
// ===============================

function bukaKeranjang() {

    document.getElementById(
        "modalKeranjang"
    ).style.display = "flex";

}


// ===============================
// TUTUP KERANJANG
// ===============================

function tutupKeranjang() {

    document.getElementById(
        "modalKeranjang"
    ).style.display = "none";

}


// ===============================
// KE FORM PESANAN
// ===============================

function kePesanan() {

    if (keranjang.length === 0) {

        alert(
            "Keranjang masih kosong. Silakan pilih produk terlebih dahulu."
        );

        return;
    }


    tutupKeranjang();


    document.getElementById(
        "pesanan"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


// ===============================
// FILTER PRODUK
// ===============================

function filterProduk(kategori) {

    const produk =
        document.querySelectorAll(
            ".produk-card"
        );

    const tombol =
        document.querySelectorAll(
            ".kategori button"
        );


    tombol.forEach(btn => {

        btn.classList.remove("active");

    });


    event.target.classList.add("active");


    produk.forEach(item => {

        if (
            kategori === "semua" ||
            item.dataset.kategori === kategori
        ) {

            item.style.display = "block";

            setTimeout(() => {

                item.style.opacity = "1";
                item.style.transform =
                    "translateY(0)";

            }, 50);

        } else {

            item.style.display = "none";

        }

    });

}


// ===============================
// KIRIM PESANAN
// ===============================

function kirimPesanan() {

    const nama =
        document.getElementById("nama").value.trim();

    const kelas =
        document.getElementById("kelas").value.trim();

    const catatan =
        document.getElementById("catatan").value.trim();


    if (nama === "" || kelas === "") {

        alert(
            "Silakan isi nama dan kelas terlebih dahulu."
        );

        return;
    }


    if (keranjang.length === 0) {

        alert(
            "Silakan pilih barang terlebih dahulu."
        );

        return;
    }


    let pesan =
        "HALO KOPERASI SEKOLAH\n\n";

    pesan +=
        "Nama: " + nama + "\n";

    pesan +=
        "Kelas: " + kelas + "\n\n";

    pesan +=
        "PESANAN:\n";


    let total = 0;


    keranjang.forEach(item => {

        let subtotal =
            item.harga * item.jumlah;

        total += subtotal;


        pesan +=
            "- " +
            item.nama +
            " x" +
            item.jumlah +
            " = " +
            formatRupiah(subtotal) +
            "\n";

    });


    pesan +=
        "\nTOTAL: " +
        formatRupiah(total);


    if (catatan !== "") {

        pesan +=
            "\n\nCatatan: " +
            catatan;

    }


    /*
       GANTI NOMOR INI DENGAN
       NOMOR WHATSAPP KOPERASI
    */

    const nomorKoperasi =
        "6281234567890";


    const url =
        "https://wa.me/" +
        nomorKoperasi +
        "?text=" +
        encodeURIComponent(pesan);


    window.open(
        url,
        "_blank"
    );

}


// ===============================
// NOTIFIKASI
// ===============================

function tampilkanNotifikasi(teks) {

    const notif =
        document.createElement("div");


    notif.textContent =
        "✓ " + teks;


    notif.style.position = "fixed";
    notif.style.bottom = "25px";
    notif.style.right = "25px";
    notif.style.background = "#1261c9";
    notif.style.color = "white";
    notif.style.padding = "15px 20px";
    notif.style.borderRadius = "12px";
    notif.style.zIndex = "9999";
    notif.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.2)";


    document.body.appendChild(notif);


    setTimeout(() => {

        notif.remove();

    }, 2000);

}


// ===============================
// KLIK DI LUAR MODAL
// ===============================

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "modalKeranjang"
            );

        if (event.target === modal) {

            tutupKeranjang();

        }

    }
);
