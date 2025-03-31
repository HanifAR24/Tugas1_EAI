document.getElementById("search-button").addEventListener("click", async function () {
    let query = document.getElementById("search-input").value.trim();

    if (query === "") {
        alert("Masukkan nama produk terlebih dahulu!");
        return;
    }

    // Gunakan endpoint pencarian produk
    let searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&json=1`;

    try {
        let response = await fetch(searchUrl);
        let data = await response.json();

        console.log("Data Pencarian:", data); // Debugging API response

        if (data.products && data.products.length > 0) {
            displayProducts(data.products);
        } else {
            alert("Produk tidak ditemukan, coba kata kunci lain!");
        }
    } catch (error) {
        console.error("Error saat mengambil data:", error);
        alert("Terjadi kesalahan, coba lagi nanti.");
    }
});

async function displayProducts(products) {
    let resultContainer = document.getElementById("result");
    resultContainer.innerHTML = ""; // Kosongkan hasil sebelumnya

    for (let product of products.slice(0, 5)) { // Tampilkan max 5 produk
        let productCard = document.createElement("div");
        productCard.classList.add("p-4", "bg-white", "rounded-lg", "shadow-md", "mb-4");

        let imageUrl = product.image_front_url || "https://via.placeholder.com/100"; // Gambar default jika tidak ada

        let barcode = product.code || "Tidak tersedia";
        let category = product.categories_tags && product.categories_tags.length > 0 ? product.categories_tags[0] : null;

        productCard.innerHTML = `
            <div class="flex">
                <img src="${imageUrl}" alt="${product.product_name || "Gambar tidak tersedia"}"
                    class="w-24 h-24 object-cover rounded-lg mr-4">
                <div>
                    <h2 class="text-lg font-bold">${product.product_name || "Nama tidak tersedia"}</h2>
                    <p><strong>Merek:</strong> ${product.brands || "Tidak tersedia"}</p>
                    <p><strong>Kategori:</strong> ${category || "Tidak tersedia"}</p>
                    <p><strong>Barcode:</strong> ${barcode}</p>
                    <button class="bg-green-500 text-white px-3 py-1 rounded mt-2"
                        onclick="fetchProductDetails('${barcode}')">Lihat Detail</button>
                </div>
            </div>
        `;

        resultContainer.appendChild(productCard);

        // Jika ada kategori, tampilkan produk dalam kategori yang sama menggunakan proxy AllOrigins
        if (category) {
            fetchCategoryProducts(category);
        }
    }
}

// Fetch Detail Produk berdasarkan Barcode (tanpa proxy, karena endpoint ini tidak bermasalah CORS)
async function fetchProductDetails(barcode) {
    if (barcode === "Tidak tersedia") {
        alert("Produk ini tidak memiliki barcode.");
        return;
    }

    let detailUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;

    try {
        let response = await fetch(detailUrl);
        let productDetail = await response.json();

        console.log("Detail Produk (Debug):", productDetail); // Debugging

        if (productDetail.status === 1) {
            let product = productDetail.product;
            let message = `
Nama: ${product.product_name || "Tidak tersedia"}
Energi: ${product.nutriments?.energy_kcal || "Tidak tersedia"} kcal
Lemak: ${product.nutriments?.fat || "Tidak tersedia"} g
Protein: ${product.nutriments?.proteins || "Tidak tersedia"} g
Karbohidrat: ${product.nutriments?.carbohydrates || "Tidak tersedia"} g
            `;
            alert(message);
        } else {
            alert("Detail produk tidak ditemukan.");
        }
    } catch (error) {
        console.error("Error mendapatkan detail produk:", error);
        alert("Terjadi kesalahan, coba lagi nanti.");
    }
}

// Fetch Produk dari Kategori yang Sama menggunakan proxy AllOrigins
// Fetch Produk dari Kategori yang Sama menggunakan proxy ThingProxy
async function fetchCategoryProducts(category) {
    // Gunakan proxy dari corsproxy.io
    const proxyUrl = "https://corsproxy.io/?";
    let targetUrl = `https://world.openfoodfacts.org/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${category}&json=1`;
    let finalUrl = proxyUrl + encodeURIComponent(targetUrl);

    try {
        let response = await fetch(finalUrl);
        let text = await response.text();

        // Cek apakah response berupa HTML (dimulai dengan '<')
        if (text.trim().startsWith("<")) {
            throw new Error("Response is HTML, not JSON. " + text.slice(0, 100));
        }
        
        let categoryData = JSON.parse(text);
        console.log("Produk dalam Kategori (Debug):", categoryData);

        if (categoryData.products && categoryData.products.length > 0) {
            let categoryContainer = document.createElement("div");
            categoryContainer.classList.add("mt-6", "p-4", "bg-gray-200", "rounded-lg");

            categoryContainer.innerHTML = `<h3 class="text-lg font-bold">Produk lain dalam kategori ini:</h3>`;

            categoryData.products.slice(0, 3).forEach(product => {
                let productName = product.product_name || "Nama tidak tersedia";
                let productItem = document.createElement("p");
                productItem.textContent = `- ${productName}`;
                categoryContainer.appendChild(productItem);
            });

            document.getElementById("result").appendChild(categoryContainer);
        }
    } catch (error) {
        console.error("Error mendapatkan produk dalam kategori:", error);
    }
}
