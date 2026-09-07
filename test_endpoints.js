const http = require('http');

async function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({ status: res.statusCode, headers: res.headers, body: data, json });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Comprehensive SM WatchStore Test Suite...\n');
  const baseUrl = 'http://localhost:3005';
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      failed++;
    }
  }

  // Test 1: Store Settings
  console.log('--- 1. Testing Store Settings & Courier Thresholds ---');
  const settingsRes = await request(`${baseUrl}/api/settings`);
  assert(settingsRes.status === 200, 'GET /api/settings returned 200 OK');
  assert(settingsRes.json.settings.officialEmail === 'samiullahnawaz942@gmail.com', 'Official email is samiullahnawaz942@gmail.com');
  assert(settingsRes.json.settings.courierDiscountTier1Min === 25000, 'Tier 1 Courier threshold is Rs. 25,000 (50% Off)');
  assert(settingsRes.json.settings.courierDiscountTier2Min === 50000, 'Tier 2 Courier threshold is Rs. 50,000 (100% Free)');
  assert(settingsRes.json.settings.strictReturnPolicy.includes('No material refundable'), 'Return policy: No material refundable');

  // Test 2: Catalog & Stock
  console.log('\n--- 2. Testing Watches Catalog ---');
  const watchesRes = await request(`${baseUrl}/api/watches`);
  assert(watchesRes.status === 200, 'GET /api/watches returned 200 OK');
  assert(watchesRes.json.watches.length > 0, `Watches found: ${watchesRes.json.watches.length}`);
  const firstWatch = watchesRes.json.watches[0];
  assert(firstWatch.images.length > 0, 'Watch has structured images array');

  // Test 3: Login Page HTML (Forgot password check)
  console.log('\n--- 3. Testing Login Page & Password Notice Requirement ---');
  const loginHtmlRes = await request(`${baseUrl}/login`);
  assert(loginHtmlRes.status === 200, 'GET /login returned 200 OK');
  assert(
    loginHtmlRes.body.includes('samiullahnawaz942@gmail.com'),
    'Login page contains exact email samiullahnawaz942@gmail.com notice'
  );
  assert(
    !loginHtmlRes.body.includes('href="/forgot-password"'),
    'Login page strictly does NOT have forgot password route link'
  );

  // Test 4: Auth Login (Admin)
  console.log('\n--- 4. Testing Admin Authentication ---');
  const adminLoginRes = await request(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { username: 'admin', password: 'admin123' },
  });
  assert(adminLoginRes.status === 200, 'Admin login successful (200 OK)');
  assert(adminLoginRes.json.user.role === 'ADMIN', 'Admin role verified');
  const adminToken = adminLoginRes.json.token;

  // Test 5: Customer Registration
  console.log('\n--- 5. Testing Customer Registration & Profile ---');
  const testUsername = `user_${Date.now().toString().slice(-4)}`;
  const registerRes = await request(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      username: testUsername,
      fullName: 'Muhammad Ali',
      phone: '03001239876',
      city: 'Lahore',
      address: 'House 12, Gulberg 2',
      password: 'mypassword123',
    },
  });
  assert(registerRes.status === 201, `Customer ${testUsername} registered (201 Created)`);
  const customerToken = registerRes.json.token;

  // Test 6: In-Account Password Change
  console.log('\n--- 6. Testing In-Account Password Change ---');
  const changePassRes = await request(`${baseUrl}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: {
      currentPassword: 'mypassword123',
      newPassword: 'newsecurepassword456',
    },
  });
  assert(changePassRes.status === 200, 'In-account password changed successfully');

  // Test 7: Image Upload & Google URL Processing
  console.log('\n--- 7. Testing Image Upload Endpoint ---');
  const googleImgRes = await request(`${baseUrl}/api/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      source: 'google',
      alt: 'Luxury Watch Image',
    },
  });
  assert(googleImgRes.status === 200, 'Image URL verified and cleaned');
  assert(googleImgRes.json.image.url.startsWith('https://'), 'Valid image URL returned');

  // Test 8: Order Placement with Dynamic Courier Discount (> 25,000 PKR = 50% Off)
  console.log('\n--- 8. Testing Order Placement (50% Advance & Dynamic Courier Discount) ---');
  const targetWatch = watchesRes.json.watches.find((w) => w.price > 25000 && w.price < 50000) || firstWatch;
  const orderRes = await request(`${baseUrl}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: {
      customerName: 'Muhammad Ali',
      customerPhone: '03001239876',
      shippingAddress: 'House 12, Gulberg 2, Lahore',
      city: 'Lahore',
      paymentType: 'HALF', // 50% Advance
      paymentNotes: 'Sent screenshot via WhatsApp',
      items: [{ watchId: targetWatch.id, quantity: 1 }],
    },
  });
  assert(orderRes.status === 200, 'Order created successfully (200 OK)');
  const createdOrder = orderRes.json.order;
  assert(createdOrder.orderNumber.startsWith('SMW-'), `Order ID generated: ${createdOrder.orderNumber}`);
  assert(createdOrder.paymentType === 'HALF', 'Payment type is HALF (50% Advance)');
  assert(createdOrder.advancePaid > 0, `50% Advance calculated: Rs. ${createdOrder.advancePaid.toLocaleString()}`);

  if (targetWatch.price > 25000 && targetWatch.price < 50000) {
    assert(createdOrder.courierDiscount > 0, `50% Courier Discount applied: Rs. ${createdOrder.courierDiscount}`);
  } else if (targetWatch.price >= 50000) {
    assert(createdOrder.courierFee === 0, '100% Free Courier applied for order >= Rs. 50,000');
  }

  // Test 9: Admin Order Dispatch (Courier on the Way)
  console.log('\n--- 9. Testing Admin Dispatch & Courier Tracking Assignment ---');
  const dispatchRes = await request(`${baseUrl}/api/orders/${createdOrder.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: {
      orderStatus: 'COURIER_ON_THE_WAY',
      paymentStatus: 'VERIFIED',
      courierServiceName: 'TCS Express',
      courierTrackingNumber: 'TCS-984102948',
      adminNotes: 'Payment verified on Meezan Bank. Parcel handed over to TCS rider.',
    },
  });
  assert(dispatchRes.status === 200, 'Order status updated by Admin');
  assert(dispatchRes.json.order.orderStatus === 'COURIER_ON_THE_WAY', 'Order status is COURIER_ON_THE_WAY');
  assert(dispatchRes.json.order.courierTrackingNumber === 'TCS-984102948', 'Courier tracking number attached');

  console.log(`\n================================`);
  console.log(`🏁 Test Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log(`================================\n`);
}

runTests().catch(console.error);
