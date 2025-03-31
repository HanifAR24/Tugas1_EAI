# Tugas1_EAI

Deskripsi Aplikasi:

Fitur Utama:

Search Produk: User dapat mencari produk makanan kemasan berdasarkan nama produk.
Detail Produk: Menampilkan kandungan nutrisi dari produk berdasarkan barcode
Produk dalam Kategori yang sama: Menampilkan rekomendasi produk lain dalam kategori yang sama.

Teknologi yang digunakan:

HTML
TailwindCSS
JavaScript
OpenFoodFacts API 
https://id.openfoodfacts.org/ 
https://openfoodfacts.github.io/openfoodfacts-server/api/
Endpoint yang digunakan:

Search Produk:
GET https://world.openfoodfacts.org/cgi/search.pl?search_terms=oreo&search_simple=1&json=1 
Detail Produk berdasarkan Barcode:
GET https://world.openfoodfacts.org/cgi/search.pl?search_terms=oreo&search_simple=1&json=1 
Produk dengan kategori yang sama:
GET https://world.openfoodfacts.org/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=biscuits&json=1 
