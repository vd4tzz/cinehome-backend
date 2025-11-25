# 🧪 Testing Guide - CineHome API

## Prerequisites
- ✅ Server running on `http://localhost:3000`
- ✅ Thunder Client extension installed in VS Code
- ✅ PostgreSQL with `cinema` database
- ✅ psql command-line tool

---

## 📚 Table of Contents
1. [Setup Test Data](#1-setup-test-data-với-psql)
2. [Authentication Flow](#2-authentication-flow)
3. [Complete Booking Flow](#3-complete-booking-flow)
4. [Testing Edge Cases](#4-testing-edge-cases)
5. [Database Verification](#5-database-verification)

---

## 1. Setup Test Data với psql

Trước tiên, tạo dữ liệu test (theaters, movies, shows, seats):

```sql
-- Kết nối database
psql -U postgres -d cinema

-- 1. Tạo theater
INSERT INTO theater (id, name, city) VALUES 
('11111111-1111-1111-1111-111111111111', 'CGV Vincom', 'Ho Chi Minh');

-- 2. Tạo auditorium (phòng chiếu)
INSERT INTO auditorium (id, name, capacity, "theaterId") VALUES 
('22222222-2222-2222-2222-222222222222', 'Room 1', 50, '11111111-1111-1111-1111-111111111111');

-- 3. Tạo movie
INSERT INTO movie (id, title, "durationMin", rating) VALUES 
('33333333-3333-3333-3333-333333333333', 'Avatar 3', 180, 'PG-13');

-- 4. Tạo show (suất chiếu)
INSERT INTO show (id, "startAt", "endAt", "movieId", "auditoriumId") VALUES 
('44444444-4444-4444-4444-444444444444', 
  NOW() + INTERVAL '2 hours', 
  NOW() + INTERVAL '5 hours', 
  '33333333-3333-3333-3333-333333333333', 
  '22222222-2222-2222-2222-222222222222');

-- 5. Tạo seats (ghế vật lý)
INSERT INTO seat (id, "rowLabel", number, type, "auditoriumId") VALUES 
('55555555-5555-5555-5555-555555555551', 'A', 1, 'NORMAL', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555552', 'A', 2, 'NORMAL', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555553', 'A', 3, 'VIP', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555554', 'B', 1, 'NORMAL', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555555', 'B', 2, 'NORMAL', '22222222-2222-2222-2222-222222222222');

-- 6. Tạo show_seat (ghế cho suất chiếu này)
INSERT INTO show_seat (id, status, "holdId", "bookingId", version, "showId", "seatId") VALUES 
('66666666-6666-6666-6666-666666666661', 'AVAILABLE', NULL, NULL, 1, '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555551'),
('66666666-6666-6666-6666-666666666662', 'AVAILABLE', NULL, NULL, 1, '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555552'),
('66666666-6666-6666-6666-666666666663', 'AVAILABLE', NULL, NULL, 1, '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555553'),
('66666666-6666-6666-6666-666666666664', 'AVAILABLE', NULL, NULL, 1, '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555554'),
('66666666-6666-6666-6666-666666666665', 'AVAILABLE', NULL, NULL, 1, '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555');

-- Xác nhận data đã tạo
SELECT * FROM show_seat WHERE "showId" = '44444444-4444-4444-4444-444444444444';
```

**Lưu các ID quan trọng:**
- 🎬 Show ID: `44444444-4444-4444-4444-444444444444`
- 🪑 Seat IDs: `55555555-5555-5555-5555-555555555551`, `55555555-5555-5555-5555-555555555552`

---

## 2. Authentication Flow

### 2.1. Signup (Đăng ký tài khoản)

**Thunder Client Request:**
```
Method: POST
URL: http://localhost:3000/api/auth/signup
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-uuid-here",
    "email": "test@example.com",
    "isEmailVerified": false,
    "roles": ["USER"]
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Lưu ý:**
- Password phải có ít nhất 8 ký tự
- Phải có chữ hoa, chữ thường, số và ký tự đặc biệt
- Rate limit: 5 requests/phút

**💾 Lưu `accessToken` để dùng cho các request sau!**

---

### 2.2. Login (Đăng nhập)

**Thunder Client Request:**
```
Method: POST
URL: http://localhost:3000/api/auth/login
Body:
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

---

### 2.3. Verify Token (Kiểm tra đăng nhập)

**Thunder Client Request:**
```
Method: GET
URL: http://localhost:3000/api/me
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Response:**
```json
{
  "id": "user-uuid-here"
}
```

---

## 3. Complete Booking Flow

### Step 1: Giữ ghế (Create Hold)

**Thunder Client Request:**
```
Method: POST
URL: http://localhost:3000/api/holds
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
  Content-Type: application/json
Body:
{
  "showId": "44444444-4444-4444-4444-444444444444",
  "seatIds": [
    "55555555-5555-5555-5555-555555555551",
    "55555555-5555-5555-5555-555555555552"
  ],
  "idempotencyKey": "hold_test_12345678"
}
```

**Response:**
```json
{
  "holdId": "generated-hold-uuid",
  "showId": "44444444-4444-4444-4444-444444444444",
  "seatIds": ["55555555-5555-5555-5555-555555555551", "55555555-5555-5555-5555-555555555552"],
  "expiresIn": 300
}
```

**💾 Lưu `holdId` để dùng cho bước tiếp theo!**

**Verify với psql:**
```sql
SELECT id, status, "holdId" FROM show_seat 
WHERE "seatId" IN (
  '55555555-5555-5555-5555-555555555551',
  '55555555-5555-5555-5555-555555555552'
);
-- Status phải là 'HOLD'
```

---

### Step 2: Tạo Booking từ Hold

**Thunder Client Request:**
```
Method: POST
URL: http://localhost:3000/api/bookings
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
  Content-Type: application/json
Body:
{
  "holdId": "YOUR_HOLD_ID_FROM_STEP_1",
  "idempotencyKey": "booking_test_87654321"
}
```

**Response:**
```json
{
  "bookingId": "generated-booking-uuid",
  "status": "PENDING",
  "totalAmount": 200000,
  "seatCount": 2
}
```

**💾 Lưu `bookingId` để dùng cho payment!**

**Verify với psql:**
```sql
SELECT id, status, "totalAmount" FROM booking WHERE id = 'YOUR_BOOKING_ID';
-- Status phải là 'PENDING'
```

---

### Step 3: Khởi tạo Payment

**Thunder Client Request:**
```
Method: POST
URL: http://localhost:3000/api/payments/initiate
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
  Content-Type: application/json
Body:
{
  "bookingId": "YOUR_BOOKING_ID_FROM_STEP_2",
  "idempotencyKey": "payment_test_11223344",
  "provider": "mock",
  "returnUrl": "http://localhost:3000/booking/success"
}
```

**Response:**
```json
{
  "paymentId": "generated-payment-uuid",
  "paymentUrl": "http://mock-payment-gateway.local/pay?id=xxx",
  "amount": 200000,
  "status": "PENDING"
}
```

**💾 Lưu `paymentId`!**

---

### Step 4: Confirm Payment (Mock Webhook)

**Thunder Client Request:**
```
Method: POST
URL: http://localhost:3000/api/payments/webhook/mock
Headers:
  Content-Type: application/json
Body:
{
  "paymentId": "YOUR_PAYMENT_ID_FROM_STEP_3",
  "status": "SUCCESS"
}
```

**Response:**
```json
{
  "message": "Payment confirmed successfully",
  "booking": {
    "id": "...",
    "status": "CONFIRMED"
  }
}
```

**Final Verify với psql:**
```sql
-- Kiểm tra booking đã CONFIRMED
SELECT id, status FROM booking WHERE id = 'YOUR_BOOKING_ID';

-- Kiểm tra ghế đã SOLD
SELECT id, status, "bookingId" FROM show_seat 
WHERE "seatId" IN (
  '55555555-5555-5555-5555-555555555551',
  '55555555-5555-5555-5555-555555555552'
);
-- Status phải là 'SOLD', bookingId phải match

-- Kiểm tra payment
SELECT id, status, amount FROM payment WHERE "bookingId" = 'YOUR_BOOKING_ID';
```

---

## 4. Testing Edge Cases

### 4.1. Test Race Condition (Double Booking)

Mở 2 Thunder Client tabs và gửi ĐỒNG THỜI:

**Tab 1:**
```
POST /api/holds
{
  "showId": "44444444-4444-4444-4444-444444444444",
  "seatIds": ["55555555-5555-5555-5555-555555555553"],
  "idempotencyKey": "race_test_user1"
}
```

**Tab 2:**
```
POST /api/holds
{
  "showId": "44444444-4444-4444-4444-444444444444",
  "seatIds": ["55555555-5555-5555-5555-555555555553"],
  "idempotencyKey": "race_test_user2"
}
```

**Expected**: Một request thành công, một request nhận 409 Conflict.

---

### 4.2. Test Hold Expiration (5 phút)

1. Tạo hold như bước 3.1
2. **Đợi 6 phút** (hoặc restart server để cron job chạy)
3. Thử tạo booking từ hold đó:

```
POST /api/bookings
{
  "holdId": "EXPIRED_HOLD_ID",
  "idempotencyKey": "test_expired"
}
```

**Expected**: `400 Bad Request - Hold expired or not found`

**Verify cleanup job với psql:**
```sql
-- Seat phải về AVAILABLE
SELECT status FROM show_seat WHERE "holdId" = 'EXPIRED_HOLD_ID';
```

---

### 4.3. Test Idempotency

Gửi cùng 1 request **2 lần** với cùng `idempotencyKey`:

```
POST /api/holds
{
  "showId": "44444444-4444-4444-4444-444444444444",
  "seatIds": ["55555555-5555-5555-5555-555555555554"],
  "idempotencyKey": "same_key_12345"
}
```

**Expected**: Cả 2 requests đều trả về cùng 1 `holdId`, không tạo hold mới.

---

### 4.4. Test Rate Limiting

Gửi **6 requests liên tục** đến `/api/auth/login`:

**Expected**: Request thứ 6 nhận `429 Too Many Requests`.

---

### 4.5. Test Invalid Password

```
POST /api/auth/signup
{
  "email": "weak@test.com",
  "password": "123456"
}
```

**Expected**: `400 Bad Request` với message về password requirements.

---

## 5. Database Verification

### 5.1. Kiểm tra tất cả bookings

```sql
SELECT 
  b.id, 
  b.status, 
  b."totalAmount",
  b."createdAt",
  u.email as user_email,
  COUNT(bi.id) as seat_count
FROM booking b
JOIN "user" u ON b."userId" = u.id
LEFT JOIN booking_item bi ON bi."bookingId" = b.id
GROUP BY b.id, u.email
ORDER BY b."createdAt" DESC;
```

---

### 5.2. Kiểm tra seat availability cho show

```sql
SELECT 
  s."rowLabel",
  s.number,
  s.type,
  ss.status,
  ss."holdId",
  ss."bookingId"
FROM show_seat ss
JOIN seat s ON ss."seatId" = s.id
WHERE ss."showId" = '44444444-4444-4444-4444-444444444444'
ORDER BY s."rowLabel", s.number;
```

---

### 5.3. Kiểm tra payments

```sql
SELECT 
  p.id,
  p.status,
  p.amount,
  p.provider,
  b.id as booking_id,
  b.status as booking_status
FROM payment p
JOIN booking b ON p."bookingId" = b.id
ORDER BY p."createdAt" DESC;
```

---

### 5.4. Cleanup test data (sau khi test xong)

```sql
-- Xóa theo thứ tự (foreign key constraints)
DELETE FROM booking_item WHERE "bookingId" IN (
  SELECT id FROM booking WHERE "showId" = '44444444-4444-4444-4444-444444444444'
);

DELETE FROM payment WHERE "bookingId" IN (
  SELECT id FROM booking WHERE "showId" = '44444444-4444-4444-4444-444444444444'
);

DELETE FROM booking WHERE "showId" = '44444444-4444-4444-4444-444444444444';

DELETE FROM show_seat WHERE "showId" = '44444444-4444-4444-4444-444444444444';

DELETE FROM show WHERE id = '44444444-4444-4444-4444-444444444444';

DELETE FROM seat WHERE "auditoriumId" = '22222222-2222-2222-2222-222222222222';

DELETE FROM auditorium WHERE id = '22222222-2222-2222-2222-222222222222';

DELETE FROM theater WHERE id = '11111111-1111-1111-1111-111111111111';

DELETE FROM movie WHERE id = '33333333-3333-3333-3333-333333333333';

-- Reset status các ghế về AVAILABLE nếu cần
UPDATE show_seat SET status = 'AVAILABLE', "holdId" = NULL, "bookingId" = NULL;
```

---

## 6. Swagger UI Testing

Alternative to Thunder Client - use browser:

1. Mở: `http://localhost:3000/docs`
2. Click **"Authorize"** button (góc phải)
3. Nhập: `Bearer YOUR_ACCESS_TOKEN`
4. Click **"Authorize"**
5. Giờ có thể test tất cả endpoints trực tiếp!

---

## 🎯 Quick Test Checklist

- [ ] Signup với strong password
- [ ] Login và lấy token
- [ ] Verify token với `/api/me`
- [ ] Setup test data trong database
- [ ] Create hold (2 ghế)
- [ ] Verify ghế status = HOLD
- [ ] Create booking từ hold
- [ ] Verify booking status = PENDING
- [ ] Initiate payment
- [ ] Webhook confirm payment
- [ ] Verify booking status = CONFIRMED
- [ ] Verify ghế status = SOLD
- [ ] Test double booking (race condition)
- [ ] Test hold expiration
- [ ] Test idempotency
- [ ] Test rate limiting

---

## 📊 Expected Results Summary

| Test Case | Expected Result |
|-----------|----------------|
| Signup với weak password | 400 Bad Request |
| Signup với strong password | 201 Created + tokens |
| Login với wrong password | 401 Unauthorized |
| Create hold (available seats) | 201 Created + holdId |
| Create hold (same seats 2x) | 409 Conflict |
| Create booking from valid hold | 201 Created + bookingId |
| Create booking from expired hold | 400 Bad Request |
| Payment webhook SUCCESS | 200 OK + booking CONFIRMED |
| Same idempotencyKey 2x | Same response, no duplication |
| 6 auth requests in 1 minute | 429 Too Many Requests |

---

## 🐛 Common Issues & Solutions

### Issue: "Hold expired" ngay sau khi tạo
**Solution**: Cache TTL bị sai. Check là milliseconds (300000) chứ không phải seconds (300).

### Issue: Race condition vẫn xảy ra
**Solution**: Ensure database isolation level là READ COMMITTED or higher.

### Issue: Cron job không chạy
**Solution**: Check logs xem ScheduleModule đã được load chưa.

### Issue: JWT verification failed
**Solution**: Check JWT_ACCESS_SECRET trong .env, phải match với secret dùng khi sign.

---

**Happy Testing! 🚀**
