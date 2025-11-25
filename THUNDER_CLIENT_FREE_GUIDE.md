# 🎯 Thunder Client Guide (Free Version)

## Tạo Requests Thủ Công - Siêu Dễ!

### 📁 Setup

1. Mở Thunder Client tab trong VS Code (icon ⚡)
2. Click "New Request"
3. Follow các bước dưới đây

---

## 🔐 1. SIGNUP

**Click "New Request" và điền:**

```
Name: Signup
Method: POST
URL: http://localhost:3000/api/auth/signup
```

**Tab "Headers":**
```
Content-Type: application/json
```

**Tab "Body" → chọn "JSON":**
```json
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

**Click "Send"** ⚡

**Response sẽ có:**
```json
{
  "user": { ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**💾 QUAN TRỌNG: Copy `accessToken` và lưu vào notepad!**

---

## 🔑 2. LOGIN (Optional - nếu đã có account)

```
Name: Login
Method: POST
URL: http://localhost:3000/api/auth/login
Headers: Content-Type: application/json
Body:
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

---

## 👤 3. GET ME (Test token)

```
Name: Get Me
Method: GET
URL: http://localhost:3000/api/me
Headers:
  Authorization: Bearer PASTE_YOUR_ACCESS_TOKEN_HERE
```

**Thay `PASTE_YOUR_ACCESS_TOKEN_HERE` bằng token bạn vừa copy!**

---

## 🎬 BOOKING FLOW

### Setup Data Trước (psql):

```bash
psql -U postgres -d cinema
```

Copy paste SQL này:

```sql
INSERT INTO theater VALUES ('11111111-1111-1111-1111-111111111111', 'CGV Vincom', 'Ho Chi Minh');
INSERT INTO auditorium VALUES ('22222222-2222-2222-2222-222222222222', 'Room 1', 50, '11111111-1111-1111-1111-111111111111');
INSERT INTO movie VALUES ('33333333-3333-3333-3333-333333333333', 'Avatar 3', 180, 'PG-13');
INSERT INTO show VALUES ('44444444-4444-4444-4444-444444444444', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '5 hours', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222');
INSERT INTO seat VALUES 
('55555555-5555-5555-5555-555555555551', 'A', 1, 'NORMAL', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555552', 'A', 2, 'NORMAL', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555553', 'A', 3, 'VIP', '22222222-2222-2222-2222-222222222222');
INSERT INTO show_seat VALUES 
('66666666-6666-6666-6666-666666666661', 'AVAILABLE', NULL, NULL, 1, '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555551'),
('66666666-6666-6666-6666-666666666662', 'AVAILABLE', NULL, NULL, 1, '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555552'),
('66666666-6666-6666-6666-666666666663', 'AVAILABLE', NULL, NULL, 1, '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555553');
```

---

### 🪑 4. CREATE HOLD

```
Name: Create Hold
Method: POST
URL: http://localhost:3000/api/holds
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
  Content-Type: application/json
Body (JSON):
{
  "showId": "44444444-4444-4444-4444-444444444444",
  "seatIds": [
    "55555555-5555-5555-5555-555555555551",
    "55555555-5555-5555-5555-555555555552"
  ],
  "idempotencyKey": "hold_test_12345"
}
```

**Response:**
```json
{
  "holdId": "some-uuid-here",
  "showId": "...",
  "seatIds": [...],
  "expiresIn": 300
}
```

**💾 Copy `holdId`!**

---

### 🎫 5. CREATE BOOKING

```
Name: Create Booking
Method: POST
URL: http://localhost:3000/api/bookings
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
  Content-Type: application/json
Body (JSON):
{
  "holdId": "PASTE_HOLD_ID_HERE",
  "idempotencyKey": "booking_test_67890"
}
```

**💾 Copy `bookingId` từ response!**

---

### 💳 6. INITIATE PAYMENT

```
Name: Initiate Payment
Method: POST
URL: http://localhost:3000/api/payments/initiate
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
  Content-Type: application/json
Body (JSON):
{
  "bookingId": "PASTE_BOOKING_ID_HERE",
  "idempotencyKey": "payment_test_11111",
  "provider": "mock"
}
```

**💾 Copy `paymentId` từ response!**

---

### ✅ 7. CONFIRM PAYMENT (Webhook)

```
Name: Confirm Payment
Method: POST
URL: http://localhost:3000/api/payments/webhook/mock
Headers:
  Content-Type: application/json
Body (JSON):
{
  "paymentId": "PASTE_PAYMENT_ID_HERE",
  "status": "SUCCESS"
}
```

**🎉 DONE! Booking đã CONFIRMED!**

---

## 🧪 TEST EDGE CASES

### Test 1: Weak Password (Should Fail)

```
Name: Weak Password Test
Method: POST
URL: http://localhost:3000/api/auth/signup
Headers: Content-Type: application/json
Body:
{
  "email": "weak@test.com",
  "password": "123456"
}
```

**Expected: 400 Bad Request với message về password requirements**

---

### Test 2: Double Booking (Race Condition)

**Tạo 2 requests giống hệt nhau:**

```
Name: Double Booking 1
Method: POST
URL: http://localhost:3000/api/holds
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
  Content-Type: application/json
Body:
{
  "showId": "44444444-4444-4444-4444-444444444444",
  "seatIds": ["55555555-5555-5555-5555-555555555553"],
  "idempotencyKey": "race_user1_12345"
}
```

**Duplicate request với idempotencyKey khác:**
```json
{
  "showId": "44444444-4444-4444-4444-444444444444",
  "seatIds": ["55555555-5555-5555-5555-555555555553"],
  "idempotencyKey": "race_user2_67890"
}
```

**Click Send ở cả 2 tabs ĐỒNG THỜI**

**Expected: 1 success (201), 1 conflict (409)**

---

### Test 3: Idempotency

**Gửi cùng 1 request 2 lần với CÙNG idempotencyKey:**

```json
{
  "showId": "44444444-4444-4444-4444-444444444444",
  "seatIds": ["55555555-5555-5555-5555-555555555551"],
  "idempotencyKey": "same_key_test_99999"
}
```

**Expected: Cả 2 lần đều return cùng `holdId`**

---

### Test 4: Rate Limiting

**Tạo request:**
```
Name: Login Spam
Method: POST
URL: http://localhost:3000/api/auth/login
Body: { "email": "test@test.com", "password": "any" }
```

**Click Send 6 lần liên tục (nhanh)**

**Expected: Lần thứ 6 nhận 429 Too Many Requests**

---

## 🗄️ Verify với psql

### Check Hold Status:
```sql
SELECT s."rowLabel", s.number, ss.status, ss."holdId"
FROM show_seat ss
JOIN seat s ON ss."seatId" = s.id
WHERE ss."showId" = '44444444-4444-4444-4444-444444444444';
```

### Check Booking:
```sql
SELECT id, status, "totalAmount" 
FROM booking 
ORDER BY "createdAt" DESC 
LIMIT 3;
```

### Check Payment:
```sql
SELECT p.id, p.status, p.amount, b.status as booking_status
FROM payment p
JOIN booking b ON p."bookingId" = b.id
ORDER BY p."createdAt" DESC 
LIMIT 3;
```

### Cleanup (sau khi test xong):
```sql
-- Reset ghế về AVAILABLE
UPDATE show_seat 
SET status = 'AVAILABLE', "holdId" = NULL, "bookingId" = NULL
WHERE "showId" = '44444444-4444-4444-4444-444444444444';

-- Xóa test data nếu muốn
DELETE FROM booking_item;
DELETE FROM payment;
DELETE FROM booking;
```

---

## 💡 Tips cho Thunder Client Free:

1. **Save Requests**: Click "Save" sau mỗi request để dùng lại
2. **Duplicate**: Right-click request → "Duplicate" để tạo similar requests
3. **Environment**: Tạo "Env" để lưu `accessToken` (tab Environment)
4. **History**: Tab "History" để xem lại requests cũ
5. **Organize**: Rename requests với số thứ tự: "1. Signup", "2. Login"...

---

## 🎨 Alternative: Swagger UI

Nếu không muốn tạo requests thủ công:

1. Mở `http://localhost:3000/docs`
2. Click **"Authorize"**
3. Nhập: `Bearer YOUR_ACCESS_TOKEN`
4. Test luôn trên browser!

---

## 🎯 Quick Checklist:

```
□ Setup test data trong database (psql)
□ Create "Signup" request → Get accessToken
□ Save accessToken vào notepad/Env
□ Create "Get Me" request → Test token
□ Create "Create Hold" → Copy holdId
□ Create "Create Booking" → Copy bookingId
□ Create "Initiate Payment" → Copy paymentId
□ Create "Confirm Payment" → Success!
□ Verify trong database với psql
```

---

## 🚨 Common Issues:

### "401 Unauthorized"
→ Check `Authorization` header có đúng format: `Bearer YOUR_TOKEN`

### "400 Hold expired"
→ Hold chỉ tồn tại 5 phút, tạo hold mới

### "409 Conflict"
→ Seat đã bị hold/sold rồi, dùng seat khác

### "429 Too Many Requests"
→ Đợi 1 phút rồi thử lại

---

**Bản free Thunder Client vẫn rất tốt! Chỉ cần tạo requests thủ công thôi 😊**

**Happy Testing! 🚀**
