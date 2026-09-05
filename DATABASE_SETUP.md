# 🗄️ Setup Database: Kota & Provinsi Indonesia

Dokumentasi lengkap untuk setup database kota/provinsi dengan 38 provinsi terbaru Indonesia termasuk wilayah Papua.

---

## 📋 Perubahan dari Hardcode ke Database

### Sebelum:
- Data 34 provinsi hardcode di `ModalCalculator.tsx` (array statis)
- Tidak ada grouping wilayah geografis
- Data Papua hanya 2 provinsi (Papua & Papua Barat)

### Sesudah:
- ✅ Data 38 provinsi tersimpan di database PostgreSQL
- ✅ Grouping 7 wilayah geografis (Sumatera, Jawa, Nusa Tenggara, Kalimantan, Sulawesi, Maluku, Papua)
- ✅ Data Papua lengkap 6 provinsi (termasuk pemekaran baru)
- ✅ Koordinat latitude & longitude untuk setiap provinsi
- ✅ API endpoint `/api/kota` untuk fetch data
- ✅ Filter wilayah di ModalCalculator

---

## 🗺️ Data Lengkap 38 Provinsi (2024-2025)

### Wilayah Sumatera (10 Provinsi)
1. Aceh
2. Sumatera Utara
3. Sumatera Barat
4. Riau
5. Kepulauan Riau
6. Jambi
7. Sumatera Selatan
8. Bangka Belitung
9. Bengkulu
10. Lampung

### Wilayah Jawa (6 Provinsi)
11. DKI Jakarta
12. Jawa Barat
13. Jawa Tengah
14. DI Yogyakarta
15. Jawa Timur
16. Banten

### Wilayah Nusa Tenggara (3 Provinsi)
17. Bali
18. Nusa Tenggara Barat
19. Nusa Tenggara Timur

### Wilayah Kalimantan (5 Provinsi)
20. Kalimantan Barat
21. Kalimantan Tengah
22. Kalimantan Selatan
23. Kalimantan Timur
24. Kalimantan Utara

### Wilayah Sulawesi (6 Provinsi)
25. Sulawesi Utara
26. Sulawesi Tengah
27. Sulawesi Selatan
28. Sulawesi Tenggara
29. Sulawesi Barat
30. Gorontalo

### Wilayah Maluku (2 Provinsi)
31. Maluku
32. Maluku Utara

### Wilayah Papua (6 Provinsi) ⭐ TERBARU
33. Papua
34. Papua Barat
35. **Papua Pegunungan** ← Provinsi Baru
36. **Papua Tengah** ← Provinsi Baru
37. **Papua Selatan** ← Provinsi Baru
38. **Papua Barat Daya** ← Provinsi Baru

---

## 🛠️ Perubahan Schema Database

### Model Kota (Before):
```prisma
model Kota {
  id         String   @id
  nama       String
  provinsi   String
  umr        Int
  sewaTempat Int
  utilitas   Int
  retribusi  Int

  analisis      Analisis[]
  rencanaBisnis RencanaBisnis[]
}
```

### Model Kota (After):
```prisma
model Kota {
  id         String   @id
  nama       String
  provinsi   String
  wilayah    String   // Sumatera, Jawa, Kalimantan, Sulawesi, Maluku, Papua, Nusa Tenggara
  umr        Int
  sewaTempat Int
  utilitas   Int
  retribusi  Int
  latitude   Float?   // Koordinat untuk map
  longitude  Float?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  analisis      Analisis[]
  rencanaBisnis RencanaBisnis[]

  @@index([wilayah])
  @@index([provinsi])
}
```

**Field Baru:**
- `wilayah`: String untuk grouping geografis
- `latitude`, `longitude`: Float untuk koordinat map
- `createdAt`, `updatedAt`: Timestamp
- Index pada `wilayah` dan `provinsi` untuk query optimization

---

## 📁 File-File yang Dimodifikasi/Dibuat

### 1. Database Schema & Migration
```
prisma/
├── schema.prisma          # ✏️ Modified: Added wilayah, lat/long, timestamps
└── seed-kota.ts           # ✨ New: Seeder untuk 38 provinsi
```

### 2. API Route
```
app/api/kota/
└── route.ts               # ✨ New: GET /api/kota dengan filter wilayah
```

### 3. Component Update
```
components/forms/
└── ModalCalculator.tsx    # ✏️ Modified: Fetch dari API, filter wilayah
```

### 4. Type Definition
```
types/
└── index.ts               # ✏️ Modified: KotaData interface + wilayah field
```

### 5. Documentation
```
DATABASE_SETUP.md          # ✨ New: Dokumentasi setup database
```

---

## 🚀 Cara Setup Database

### Step 1: Jalankan Migration

```bash
# Generate migration untuk perubahan schema
npx prisma migrate dev --name add_wilayah_to_kota

# Prisma akan create migration file & apply ke database
```

Output expected:
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "dbname"

Migrations:
  - 20240105120000_add_wilayah_to_kota/
    migration.sql

✔ Generated Prisma Client
```

### Step 2: Seed Data Kota

```bash
# Run seeder untuk populate 38 provinsi
npx ts-node prisma/seed-kota.ts
```

Output expected:
```
🌱 Seeding Kota data...
✅ Seeded 38 kota successfully!

📊 Statistics per wilayah:
  - Jawa: 6 provinsi
  - Kalimantan: 5 provinsi
  - Maluku: 2 provinsi
  - Nusa Tenggara: 3 provinsi
  - Papua: 6 provinsi
  - Sulawesi: 6 provinsi
  - Sumatera: 10 provinsi
```

### Step 3: Verify Data

```bash
# Open Prisma Studio untuk melihat data
npx prisma studio
```

Atau query via code:
```typescript
import { prisma } from "@/lib/prisma";

// Get all kota
const kota = await prisma.kota.findMany();
console.log(`Total: ${kota.length} provinsi`);

// Get by wilayah
const kotaPapua = await prisma.kota.findMany({
  where: { wilayah: "Papua" }
});
console.log(`Papua: ${kotaPapua.length} provinsi`);
```

---

## 🌐 API Endpoint Documentation

### GET /api/kota

**Description**: Fetch semua data kota/provinsi dari database

**Query Parameters**:
- `wilayah` (optional): Filter by wilayah
  - Values: `Sumatera`, `Jawa`, `Nusa Tenggara`, `Kalimantan`, `Sulawesi`, `Maluku`, `Papua`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "papua-pegunungan",
      "nama": "Papua Pegunungan",
      "provinsi": "Papua Pegunungan",
      "wilayah": "Papua",
      "umr": 3869778,
      "sewaTempat": 650000,
      "utilitas": 300000,
      "retribusi": 60000,
      "latitude": -3.9777,
      "longitude": 138.4633,
      "createdAt": "2024-01-05T10:00:00.000Z",
      "updatedAt": "2024-01-05T10:00:00.000Z"
    },
    // ... 37 more
  ],
  "count": 38
}
```

**Examples**:

```bash
# Get all kota
curl http://localhost:3000/api/kota

# Get only Papua region
curl http://localhost:3000/api/kota?wilayah=Papua

# Get only Sumatera region
curl http://localhost:3000/api/kota?wilayah=Sumatera
```

**Frontend Usage**:
```typescript
// Fetch all kota
const res = await fetch("/api/kota");
const { data } = await res.json();

// Fetch by wilayah
const res = await fetch("/api/kota?wilayah=Papua");
const { data } = await res.json();
```

---

## 🎨 UI Changes - ModalCalculator

### Perubahan UI:

**Before**:
```
1. Jenis Rencana Usaha [Dropdown]
2. Kota Domisili [Dropdown 34 provinsi]
3. Target Modal Awal [Input]
4. Biaya Operasional Bulanan [Input]
```

**After**:
```
1. Jenis Rencana Usaha [Dropdown]
2. Filter Wilayah [Dropdown 7 wilayah] ← NEW!
3. Kota Domisili [Dropdown filtered by wilayah]
4. Target Modal Awal [Input]
5. Biaya Operasional Bulanan [Input]
```

### Flow Interaksi Baru:

1. User pilih **Filter Wilayah** → "Papua"
2. Dropdown **Kota Domisili** otomatis filter hanya 6 provinsi Papua:
   - Papua
   - Papua Barat
   - Papua Pegunungan
   - Papua Tengah
   - Papua Selatan
   - Papua Barat Daya
3. User pilih salah satu kota
4. UMR & biaya otomatis terupdate sesuai kota terpilih

### Features:

✅ **Loading State**: Tampil "Memuat data kota..." saat fetch API
✅ **Empty State**: Disabled jika data kosong
✅ **Counter**: Tampil "X provinsi tersedia di wilayah Y"
✅ **Search**: Tetap bisa search di dropdown
✅ **Reset**: Tombol reset membersihkan semua pilihan

---

## 🗺️ Data Source & References

### UMR Data Source:
- **Kementerian Ketenagakerjaan RI** (Kemenaker)
- **Periode**: 2024-2025
- **Sumber resmi**: https://kemnaker.go.id/

### Koordinat (Latitude/Longitude):
- Koordinat ibukota provinsi dari Google Maps
- Digunakan untuk fitur peta interaktif

### Pemekaran Provinsi Papua:
- **UU No. 14/2022**: Papua Pegunungan
- **UU No. 15/2022**: Papua Tengah
- **UU No. 16/2022**: Papua Selatan
- **UU No. 17/2022**: Papua Barat Daya

**Sumber**: https://peraturan.bpk.go.id/

---

## 🧪 Testing

### Test 1: Fetch All Kota
```typescript
const res = await fetch("http://localhost:3000/api/kota");
const json = await res.json();
console.log(`Total kota: ${json.count}`); // Should be 38
```

### Test 2: Filter by Wilayah
```typescript
const res = await fetch("http://localhost:3000/api/kota?wilayah=Papua");
const json = await res.json();
console.log(`Papua: ${json.count} provinsi`); // Should be 6
```

### Test 3: UI Filter Interaction
1. Open `/kalkulator` page
2. Klik dropdown "Filter Wilayah"
3. Pilih "Papua"
4. Verifikasi dropdown "Kota Domisili" hanya show 6 provinsi
5. Pilih "Papua Pegunungan"
6. Verifikasi UMR = Rp 3.869.778 ✅

### Test 4: Database Seeder Idempotency
```bash
# Run seeder multiple times - should not create duplicates
npx ts-node prisma/seed-kota.ts
npx ts-node prisma/seed-kota.ts

# Verify count still 38
```

---

## ⚠️ Troubleshooting

### Error: "P1001: Can't reach database server"

**Cause**: Database offline atau connection string salah

**Solution**:
```bash
# Cek .env file
cat .env | grep DATABASE_URL

# Test connection
npx prisma db pull

# Jika masih error, cek Neon Dashboard → Database online?
```

### Error: "Missing @prisma/client"

**Solution**:
```bash
npm install @prisma/client
npx prisma generate
```

### Error: "Column 'wilayah' does not exist"

**Cause**: Migration belum dijalankan

**Solution**:
```bash
npx prisma migrate dev --name add_wilayah_to_kota
npx prisma generate
```

### API Returns Empty Array

**Cause 1**: Database belum di-seed

**Solution**:
```bash
npx ts-node prisma/seed-kota.ts
```

**Cause 2**: Filter wilayah typo

```typescript
// ❌ Wrong
fetch("/api/kota?wilayah=papuaa")

// ✅ Correct (PascalCase)
fetch("/api/kota?wilayah=Papua")
```

---

## 🔄 Migration Guide (Development → Production)

### 1. Backup Existing Data (if any)
```sql
-- Export current kota data
COPY kota TO '/tmp/kota_backup.csv' CSV HEADER;
```

### 2. Run Migration on Production DB
```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://user:pass@production-host/dbname"

# Run migration
npx prisma migrate deploy

# Run seeder
npx ts-node prisma/seed-kota.ts
```

### 3. Verify Production Data
```bash
# Open Prisma Studio with production DB
npx prisma studio --browser none
```

### 4. Update Environment Variables
Pastikan production `.env` memiliki:
```env
DATABASE_URL="production-connection-string"
```

---

## 📊 Performance Considerations

### Database Indexes
Schema sudah include indexes untuk optimization:
```prisma
@@index([wilayah])  // Fast filter by wilayah
@@index([provinsi]) // Fast search by provinsi name
```

### API Caching (Future Enhancement)
```typescript
// Add cache header di API route
export async function GET(req: NextRequest) {
  const kota = await prisma.kota.findMany();
  
  return NextResponse.json(
    { success: true, data: kota },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
      }
    }
  );
}
```

### Client-side Caching
```typescript
// Use React Query atau SWR
import useSWR from "swr";

const { data, error } = useSWR("/api/kota", fetcher);
```

---

## ✅ Checklist Setelah Setup

- [ ] Migration berhasil dijalankan
- [ ] Seeder berhasil populate 38 provinsi
- [ ] API `/api/kota` return 38 data
- [ ] Filter wilayah di ModalCalculator berfungsi
- [ ] Dropdown kota terfilter sesuai wilayah
- [ ] 6 provinsi Papua baru muncul di dropdown
- [ ] Koordinat lat/long tersimpan di database
- [ ] UMR setiap provinsi sesuai data Kemenaker 2024-2025

---

## 📚 Next Steps

### Recommended Enhancements:

1. **Interactive Map dengan Wilayah Grouping**
   - Update `InteractiveUMRMap.tsx`
   - Group markers by wilayah
   - Color-code by wilayah

2. **Wilayah-based Analytics**
   - Average UMR per wilayah
   - Popular business types per wilayah
   - Regional insights dashboard

3. **Auto-detect User Location**
   - Use browser Geolocation API
   - Auto-select nearest provinsi based on lat/long

4. **Historical UMR Data**
   - Add `tahun` field to Kota model
   - Track UMR changes over years
   - Show trend charts

---

**🎉 Setup database kota/provinsi selesai! 38 provinsi Indonesia sudah siap digunakan.**
