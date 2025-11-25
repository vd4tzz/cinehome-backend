# 🚀 Quick Start - Testing CineHome API

## ✅ Prerequisites Check
- [x] Server running on `http://localhost:3000`
- [x] Thunder Client installed
- [x] PostgreSQL running
- [x] psql available

---

## 📝 Quick Test Flow (5 phút)

### 1. Setup Data (Copy-paste vào psql)
```bash
# Mở terminal và chạy:
psql -U postgres -d cinema
```

```sql
-- Copy toàn bộ SQL này vào psql:
INSERT INTO theater VALUES ('11111111-1111-1111-1111-111111111111', 'CGV Vincom', 'Ho Chi Minh');
INSERT INTO auditorium VALUES ('22222222-2222-2222-2222-222222222222', 'Room 1', 50, '11111111-1111-1111-1111-111111111111');
INSERT INTO movie VALUES ('33333333-3333-3333-3333-333333333333', 'Avatar 3', 180, 'PG-13');
INSERT INTO show VALUES ('44444444-4444-4444-4444-444444444444', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '5 hours', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222');
INSERT INTO seat VALUES 
('55555555-5555-5555-5555-555555555551', 'A', 1, 'NORMAL', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555552', 'A', 2, 'NORMAL', '22222222-2222-2222-2222-222222222222');
INSERT INTO show_seat VALUES 
('66666666-6666-6666-6666-666666666661', 'AVAILABLE', NULL, NULL, 1, '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555551'),
('66666666-6666-6666-6666-666666666662', 'AVAILABLE', NULL, NULL, 1, '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555552');
```

---

### 2. Thunder Client - Signup

```
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

**→ Copy `accessToken` từ response!**

---

### 3. Thunder Client - Create Hold

```
POST http://localhost:3000/api/holds
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "showId": "44444444-4444-4444-4444-444444444444",
  "seatIds": [
    "55555555-5555-5555-5555-555555555551",
    "55555555-5555-5555-5555-555555555552"
  ],
  "idempotencyKey": "hold_quick_test_123"
}
```

**→ Copy `holdId` từ response!**

---

### 4. Thunder Client - Create Booking

```
POST http://localhost:3000/api/bookings
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "holdId": "YOUR_HOLD_ID_HERE",
  "idempotencyKey": "booking_quick_test_456"
}
```

**→ Copy `bookingId` từ response!**

---

### 5. Thunder Client - Initiate Payment

```
POST http://localhost:3000/api/payments/initiate
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "bookingId": "YOUR_BOOKING_ID_HERE",
  "idempotencyKey": "payment_quick_test_789"
}
```

**→ Copy `paymentId` từ response!**

---

### 6. Thunder Client - Confirm Payment (Mock Webhook)

```
POST http://localhost:3000/api/payments/webhook/mock
Content-Type: application/json

{
  "paymentId": "YOUR_PAYMENT_ID_HERE",
  "status": "SUCCESS"
}
```

**→ Success! Booking confirmed! 🎉**

---

### 7. Verify với psql

```sql
-- Kiểm tra booking
SELECT id, status, "totalAmount" FROM booking ORDER BY "createdAt" DESC LIMIT 1;

-- Kiểm tra ghế đã SOLD
SELECT status, "bookingId" FROM show_seat WHERE "showId" = '44444444-4444-4444-4444-444444444444';
```

---

## 🎨 Alternative: Use Swagger UI

1. Mở browser: `http://localhost:3000/docs`
2. Click **"Authorize"**, nhập: `Bearer YOUR_ACCESS_TOKEN`
3. Test trực tiếp trên giao diện!

---

## 🧪 Test Cases Quan Trọng

### Test 1: Race Condition (Double Booking)
Mở 2 Thunder Client tabs, gửi ĐỒNG THỜI cùng request hold same seat:
- **Expected**: 1 success, 1 conflict (409)

### Test 2: Hold Expiration
1. Create hold
2. Đợi 6 phút (hoặc check cron job logs)
3. Try create booking
- **Expected**: 400 Bad Request - Hold expired

### Test 3: Idempotency
Gửi 2 lần cùng request với same `idempotencyKey`:
- **Expected**: Same response, no duplication

### Test 4: Rate Limiting
Gửi 6 requests liên tục đến `/api/auth/login`:
- **Expected**: Request thứ 6 nhận 429

### Test 5: Weak Password
```json
{ "email": "weak@test.com", "password": "123456" }
```
- **Expected**: 400 với message về password requirements

---

## 📚 Full Documentation

- **Complete Guide**: `TESTING_GUIDE.md`
- **Security Fixes**: `SECURITY_FIXES.md`
- **Swagger UI**: `http://localhost:3000/docs`

---

## 🆘 Troubleshooting

### Server không chạy?
```bash
npm run start:dev
```

### Cache errors?
- Restart server (in-memory cache resets)

### JWT verification failed?
- Check JWT_ACCESS_SECRET trong `.env`
- Generate new token with signup/login

### Database errors?
```bash
npm run sync-db
```

---

**Happy Testing! 🎉**
