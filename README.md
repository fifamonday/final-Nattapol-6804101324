# Playwright Software Testing Exam

โปรเจกต์นี้เป็นชุดทดสอบเว็บไซต์ [SauceDemo](https://www.saucedemo.com/) สำหรับรายวิชา Software Testing เขียนด้วย TypeScript และ Playwright Test ครอบคลุมการตรวจสอบฟอร์ม การทำงานของสินค้าและตะกร้า การทดสอบแบบ Integration ด้วย Stub/Driver และกระบวนการ Checkout ตั้งแต่ต้นจนจบ

## ข้อมูลผู้ส่ง

- ชื่อ: ณัฐพล วันจันทร์
- รหัสนักศึกษา: 6804101324
- Repository: `final-Nattapol-6804101324`

## วัตถุประสงค์

- ตรวจสอบพฤติกรรมของส่วนติดต่อผู้ใช้ด้วย Browser และ assertions
- แยกกรณีทดสอบ Login และ Checkout Validation เพื่อให้ตรวจผลของแต่ละเงื่อนไขได้
- สาธิต Top-Down Integration Testing ด้วย Inventory Stub และ Bottom-Up Integration Testing ด้วย Driver
- ทดสอบเส้นทางการซื้อสินค้าบน SauceDemo ตั้งแต่ Login จนถึงหน้าสั่งซื้อสำเร็จ
- สร้าง HTML Report และ JSON Report จากผลการทดสอบที่รันจริง

## ขอบเขตการทดสอบ

### Unit / UI Component Testing

ชื่อบทในโจทย์คือ Unit Testing แต่ UT-01 และ UT-02 ทดสอบผ่านหน้าเว็บ SauceDemo แบบ Black-box และไม่สามารถเข้าถึง Source Code ภายในของระบบได้ ดังนั้นในเชิงวิชาการจึงเป็น UI Component/Functional Testing ไม่ใช่ Unit Test ของฟังก์ชันภายใน

| รหัส | กรณีทดสอบ | สิ่งที่ตรวจสอบ |
| --- | --- | --- |
| UT-01.1 | `empty username and password` | ส่งฟอร์มว่าง ตรวจ `Username is required` และยืนยันว่าไม่เข้าสู่ Inventory |
| UT-01.2 | `missing password` | กรอก `standard_user` โดยไม่กรอกรหัสผ่าน ตรวจ `Password is required` และไม่เข้าสู่ Inventory |
| UT-01.3 | `invalid login details` | ใช้ข้อมูลเข้าสู่ระบบไม่ถูกต้อง ตรวจข้อความแจ้งเตือนและยืนยันว่าไม่เข้าสู่ Inventory |
| UT-02 | `product button state Add to cart -> Remove -> Add to cart` | Login ตรวจปุ่ม Backpack ก่อนเพิ่มสินค้า หลังเพิ่มตรวจปุ่ม Remove กับ Cart Badge เป็น 1 และหลังนำสินค้าออกตรวจปุ่ม Add to cart กับการหายไปของ Badge |

### Integration Testing

| รหัส | แนวทาง | สิ่งที่ทดสอบ |
| --- | --- | --- |
| IT-01 | Top-Down ด้วย Stub | Login บน SauceDemo จริงและตรวจ URL `inventory.html` จากนั้นใช้ `page.setContent()` สร้าง Inventory Stub ตรวจ `Mock Inventory Ready` และรายการจำลอง 2 รายการ |
| IT-02 | Bottom-Up ด้วย Driver | `driverOpenInventory()` เพิ่ม Cookie `session-username` ด้วย `BrowserContext.addCookies()` แล้วเปิด `inventory.html` โดยตรงโดยไม่กรอก Login Form จากนั้นตรวจ Inventory 6 รายการ เพิ่มสินค้า 2 รายการ และตรวจ Shopping Cart |

**ขอบเขตของ IT-01:** ส่วน Real คือการเปิดเว็บไซต์และ Login จนถึง Inventory ก่อนสร้าง Stub ส่วนรายการสินค้าที่แสดงหลัง `page.setContent()` เป็น DOM Stub ระดับ Browser ไม่ได้แทน Internal Module ของ SauceDemo

**ขอบเขตของ IT-02:** Driver มีหน้าที่เตรียม Login state ด้วย Cookie เท่านั้น หน้า Inventory การเพิ่มสินค้า และ Shopping Cart เป็นการทำงานบน SauceDemo จริง

### System Testing

| รหัส | กรณีทดสอบ | สิ่งที่ตรวจสอบ |
| --- | --- | --- |
| ST-01 | `complete purchase of two products` | Login เพิ่ม Sauce Labs Backpack และ Sauce Labs Bike Light ตรวจ Cart และ Checkout Overview กรอกข้อมูลลูกค้า จากนั้นตรวจ `Thank you for your order!` |
| ST-02 | `checkout validation and recovery` | ตรวจข้อความเมื่อไม่กรอก First Name, Last Name และ Postal Code ตามลำดับ จากนั้นกรอกข้อมูลให้ครบ ตรวจ Checkout Overview และข้อความสั่งซื้อสำเร็จ |

การทดสอบใช้บัญชีสาธิต `standard_user` / `secret_sauce` ตามโจทย์ ST-01 ใช้ข้อมูล Checkout ชื่อ ณัฐพล วันจันทร์ และ Postal Code `50000`; ST-02 ใช้ `John Doe` และ Postal Code `50000`

## เทคโนโลยีและการตั้งค่า

- Node.js และ npm
- TypeScript และ `@playwright/test`
- Browser project: Chromium (Desktop Chrome)
- Base URL: `https://www.saucedemo.com`
- Test timeout: 30 วินาที, retries: 0, workers: 1
- เมื่อ Test ล้มเหลว Playwright เก็บ screenshot, trace และ video ตามการตั้งค่าใน `playwright.config.ts`

## ติดตั้งและรันทดสอบ

ติดตั้ง Node.js ก่อน จากนั้นเปิด Terminal ที่โฟลเดอร์โปรเจกต์และรัน:

```bash
npm ci
npx playwright install chromium
npx playwright test
```

สามารถรันเฉพาะไฟล์หรือกลุ่มทดสอบได้ เช่น:

```bash
npx playwright test tests/unit/UT-01.spec.ts
npx playwright test tests/integration/IT-02.spec.ts
npx playwright test tests/system/ST-01.spec.ts
```

## รายงานผล

คำสั่ง `npx playwright test` สร้างรายงานจากผลรันจริงตามการตั้งค่าใน `playwright.config.ts`:

- HTML Report: `playwright-report/` เปิดด้วย `npx playwright show-report`
- JSON Report: `reports/results.json`
- สรุปผลและรายละเอียดข้อผิดพลาด: `reports/test-summary.md`

ผล Full Suite ล่าสุดที่บันทึกใน `reports/test-summary.md` วันที่ 2026-10-16 คือ **ผ่าน 8 tests, ไม่ผ่าน 0, ข้าม 0** ครบทั้ง 6 ไฟล์ทดสอบ UT-01 มี 3 Test Cases จึงมี Test รวม 8 รายการ ตัวเลขนี้เป็นผลของการรันครั้งดังกล่าวเท่านั้น

## โครงสร้างโปรเจกต์

```text
final-exam/
├── README.md
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tests/
│   ├── unit/
│   │   ├── UT-01.spec.ts
│   │   └── UT-02.spec.ts
│   ├── integration/
│   │   ├── IT-01.spec.ts
│   │   └── IT-02.spec.ts
│   └── system/
│       ├── ST-01.spec.ts
│       └── ST-02.spec.ts
├── playwright-report/
│   └── index.html และไฟล์ประกอบที่ Playwright สร้าง
└── reports/
	├── results.json
	└── test-summary.md
```

รายงานต้องเป็นไฟล์ที่ Playwright สร้างจากการรันทดสอบจริง ไม่แก้สถานะ Passed/Failed หรือรายละเอียดผลทดสอบด้วยตนเอง