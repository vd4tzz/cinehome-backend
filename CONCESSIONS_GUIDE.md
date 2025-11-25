# 🍿 Concessions Feature - Đặt Bắp Nước

## ✅ Đã implement xong!

Giờ khi đặt vé, bạn có thể đặt kèm bắp nước và **tổng tiền sẽ tự động cộng vào booking**!

---

## 📋 Những gì đã thêm:

### 1. **Entity mới:**
- `Concession` - Bắp nước, combo (name, price, status, category, imageUrl)
- `ConcessionItem` - Line item trong booking (concessionId, quantity, price snapshot)

### 2. **DTO mới:**
- `CreateConcessionItemDto` - Validate khi đặt bắp nước (concessionId, quantity ≥ 1)

### 3. **Business Logic:**
- `CreateBookingDto.concessions` - Optional array bắp nước muốn đặt
- `BookingsService.createFromHold()` - Tự động:
  - Validate concession có tồn tại không
  - Check status === 'AVAILABLE' (không out of stock)
  - Tính tổng tiền = (100k × số ghế) + (giá bắp nước × quantity)
  - Tạo ConcessionItem trong cùng transaction với BookingItem

### 4. **API Response:**
- Trả về `concessionCount` để biết đã đặt bao nhiêu loại bắp nước

---

## 🧪 Test Guide

### Step 1: Setup test data (psql)
```sql
-- 1) Tạo concessions mẫu
INSERT INTO concession (id, name, description, price, status, category, "createdAt", "updatedAt")
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Combo Bắp Nước', 'Bắp rang bơ + Coca 32oz', 85000, 'AVAILABLE', 'COMBO', NOW(), NOW()),
  ('a2222222-2222-2222-2222-222222222222', 'Coca Cola 32oz', 'Nước ngọt size lớn', 45000, 'AVAILABLE', 'DRINK', NOW(), NOW()),
  ('a3333333-3333-3333-3333-333333333333', 'Popcorn Caramel', 'Bắp rang vị caramel', 60000, 'AVAILABLE', 'SNACK', NOW(), NOW()),
  ('a4444444-4444-4444-4444-444444444444', 'Combo Couple', 'Bắp lớn + 2 Coca', 120000, 'AVAILABLE', 'COMBO', NOW(), NOW()),
  ('a5555555-5555-5555-5555-555555555555', 'Pepsi 32oz', 'Sold out example', 45000, 'OUT_OF_STOCK', 'DRINK', NOW(), NOW());
```

### Step 2: Tạo booking + bắp nước (Thunder Client / Swagger)

**Endpoint:** `POST /api/bookings`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "holdId": "YOUR_HOLD_ID",
  "idempotencyKey": "booking_with_concessions_123456",
  "concessions": [
    {
      "concessionId": "a1111111-1111-1111-1111-111111111111",
      "quantity": 2
    },
    {
      "concessionId": "a3333333-3333-3333-3333-333333333333",
      "quantity": 1
    }
  ]
}
```

**Expected Response (201):**
```json
{
  "bookingId": "uuid-here",
  "status": "PENDING",
  "totalAmount": 430000,
  "seatCount": 2,
  "concessionCount": 2
}
```

**Cách tính:**
- 2 ghế × 100,000 = 200,000 VND
- 2 × Combo Bắp Nước (85k) = 170,000 VND
- 1 × Popcorn Caramel (60k) = 60,000 VND
- **Tổng = 430,000 VND**

---

## 🔍 Verify trong database (psql)

```sql
-- 1) Check booking có đúng totalAmount không
SELECT id, "userId", "totalAmount", status, meta
FROM booking
WHERE "idempotencyKey" = 'booking_with_concessions_123456';

-- 2) Check booking items (ghế)
SELECT bi.id, bi.price, s.row, s.number
FROM booking_item bi
JOIN seat s ON bi."seatId" = s.id
WHERE bi."bookingId" = 'YOUR_BOOKING_ID';

-- 3) Check concession items (bắp nước)
SELECT ci.id, ci.quantity, ci.price, c.name
FROM concession_item ci
JOIN concession c ON ci."concessionId" = c.id
WHERE ci."bookingId" = 'YOUR_BOOKING_ID';
```

---

## 🎯 Edge Cases đã xử lý:

### ✅ 1. Concession không tồn tại
**Request:**
```json
{
  "concessions": [
    { "concessionId": "fake-uuid-123", "quantity": 1 }
  ]
}
```
**Response:** `404 - Some concessions not found`

### ✅ 2. Concession OUT_OF_STOCK
**Request:**
```json
{
  "concessions": [
    { "concessionId": "a5555555-5555-5555-5555-555555555555", "quantity": 1 }
  ]
}
```
**Response:** `400 - Concession out of stock: Pepsi 32oz`

### ✅ 3. Quantity validation
**Request:**
```json
{
  "concessions": [
    { "concessionId": "a1111111-1111-1111-1111-111111111111", "quantity": 0 }
  ]
}
```
**Response:** `400 - quantity must not be less than 1`

### ✅ 4. Transaction safety
Nếu:
- Ghế không còn HOLD → rollback cả booking + concession items
- Concession validation fail → không tạo booking

---

## 📊 Complete Flow Example

### Scenario: User đặt 2 ghế + 1 combo + 2 bắp caramel

```bash
# 1. Signup + Login (get token)
POST /api/auth/signup
POST /api/auth/login

# 2. Hold 2 ghế (A1, A2)
POST /api/holds
{
  "showId": "show-uuid",
  "seatIds": ["seat-A1-uuid", "seat-A2-uuid"],
  "idempotencyKey": "hold_123"
}

# 3. Create booking với bắp nước
POST /api/bookings
{
  "holdId": "hold-uuid",
  "idempotencyKey": "booking_123",
  "concessions": [
    { "concessionId": "a1111111-1111-1111-1111-111111111111", "quantity": 1 },
    { "concessionId": "a3333333-3333-3333-3333-333333333333", "quantity": 2 }
  ]
}

# Response:
{
  "bookingId": "booking-uuid",
  "status": "PENDING",
  "totalAmount": 405000,  // 200k (seats) + 85k (combo) + 120k (2×popcorn)
  "seatCount": 2,
  "concessionCount": 2
}

# 4. Payment flow (unchanged)
POST /api/payments/initiate
POST /api/payments/webhook/mock
```

---

## 🚀 Optional field

**Concessions là OPTIONAL!** Nếu không đặt bắp nước:
```json
{
  "holdId": "hold-uuid",
  "idempotencyKey": "booking_no_food_123"
}
```
→ Vẫn hoạt động bình thường, totalAmount = chỉ tiền vé!

---

## 📝 API Documentation (Swagger)

Đã update Swagger docs:
- `CreateBookingDto.concessions` - Array of concession items (optional)
- `CreateConcessionItemDto` - concessionId + quantity with examples
- Response example shows `concessionCount`

Access: http://localhost:3000/docs

---

## 🎉 Summary

**DONE!** Feature đặt bắp nước đã hoàn thành với:
✅ Database schema (Concession + ConcessionItem)  
✅ Validation (tồn tại, available, quantity ≥ 1)  
✅ Auto-calculate totalAmount (vé + bắp nước)  
✅ Transaction safety (rollback if anything fails)  
✅ Edge case handling (not found, out of stock, invalid quantity)  
✅ Swagger documentation updated  

**Test ngay đi!** 🍿🎬
