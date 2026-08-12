# NRRU Equipment Inventory

ระบบสำรวจครุภัณฑ์และอุปกรณ์เครือข่าย มหาวิทยาลัยราชภัฏนครราชสีมา พัฒนาด้วย Next.js 16, Prisma และ PostgreSQL

## พัฒนาในเครื่อง

ใช้ PostgreSQL ที่เข้าถึงได้ผ่านค่า `DATABASE_URL` ใน `.env` แล้วรัน:

```bash
pnpm install
pnpm exec prisma migrate deploy
pnpm db:seed
pnpm dev
```

เปิด `http://localhost:3000`

## Deploy บน Coolify Home Server

Production stack ประกอบด้วย Next.js และ PostgreSQL 17 ใน Docker Compose เดียวกัน แอปเปิดเฉพาะ `127.0.0.1:3002` ส่วน PostgreSQL ใช้งานผ่าน Docker network เท่านั้นและไม่มี host port

### 1. ตั้งค่า Environment Variables

สร้าง application ใหม่ใน Coolify จาก repository นี้ เลือก build pack แบบ Docker Compose แล้วเพิ่มตัวแปรต่อไปนี้:

```dotenv
POSTGRES_DB=ap_nrru
POSTGRES_USER=ap_nrru
POSTGRES_PASSWORD=<รหัสสุ่มที่แข็งแรง>
DATABASE_URL=postgresql://ap_nrru:<รหัสเดียวกัน>@postgres:5432/ap_nrru
```

สร้างรหัสผ่านที่ใช้กับ URL ได้โดยไม่ต้อง escape ด้วยคำสั่ง:

```bash
openssl rand -hex 32
```

ห้าม commit รหัสจริงลง repository และค่าของ `POSTGRES_PASSWORD` ในฐานข้อมูลที่สร้างแล้วไม่ควรเปลี่ยนโดยแก้ environment variable เพียงอย่างเดียว

### 2. Deploy และสร้างข้อมูลเริ่มต้น

กด Deploy ใน Coolify แอปจะรอ PostgreSQL พร้อม จากนั้นรัน `prisma migrate deploy` ก่อนเปิด Next.js โดยอัตโนมัติ

หลัง deploy สำเร็จ ให้เปิด Terminal ของ server/application แล้ว seed เพียงครั้งแรก:

```bash
docker compose --profile tools run --rm seed
```

บัญชีเริ่มต้น:

- Username: `admin`
- Password: `admin1234`

ระบบบังคับเปลี่ยนรหัสผ่านหลัง login ครั้งแรก ห้ามใช้รหัสเริ่มต้นต่อใน production

### 3. ตั้ง Cloudflare Tunnel

เพิ่ม Published application route:

- Public hostname: `ap.0jay-shop.com`
- Path: `*`
- Service type: `HTTP`
- Service URL: `127.0.0.1:3002`

ผลลัพธ์คือ `ap.0jay-shop.com` → `http://127.0.0.1:3002` โดย HTTPS สิ้นสุดที่ Cloudflare หาก `cloudflared` ทำงานใน container แยก ไม่ใช่บน host โดยตรง ต้องใช้ address ที่ container เข้าถึง host ได้แทน `127.0.0.1`

### 4. ตรวจหลัง Deploy

```bash
docker compose ps
docker compose logs app --tail 100
curl -I http://127.0.0.1:3002/login
```

ตรวจว่า service `app` และ `postgres` healthy, log แสดง migration ก่อนข้อความเริ่ม Next.js และเปิด `https://ap.0jay-shop.com/login` ได้

### Backup PostgreSQL

```bash
docker compose exec -T postgres pg_dump -U ap_nrru -d ap_nrru -Fc > ap_nrru.dump
```

คัดลอกไฟล์ `ap_nrru.dump` ไปเก็บนอก home server ด้วย

### Restore PostgreSQL

หยุดการเขียนข้อมูลจากแอปก่อน restore แล้วรัน:

```bash
docker compose exec -T postgres pg_restore -U ap_nrru -d ap_nrru --clean --if-exists < ap_nrru.dump
```

คำสั่ง `docker compose down` จะเก็บ named volume ไว้ตามปกติ ห้ามใช้ `docker compose down --volumes` เว้นแต่ตั้งใจลบฐานข้อมูลทั้งหมด

## ตรวจสอบคุณภาพ

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```
