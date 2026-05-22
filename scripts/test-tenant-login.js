const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testTenantLogin() {
  console.log('🔍 Testing tenant and login functionality...\n');

  try {
    // 1. Check if tenant exists
    console.log('1. Checking tenant...');
    const tenant = await prisma.tenant.findFirst({
      where: { slug: 'acme-corp' }
    });
    
    if (!tenant) {
      console.log('❌ Tenant not found! Run: npm run db:seed');
      return;
    }
    
    console.log(`✅ Tenant found: ${tenant.name} (${tenant.slug})`);
    console.log(`   ID: ${tenant.id}`);
    console.log(`   Active: ${tenant.isActive}\n`);

    // 2. Check users in tenant
    console.log('2. Checking users in tenant...');
    const users = await prisma.user.findMany({
      where: { tenantId: tenant.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true
      }
    });

    if (users.length === 0) {
      console.log('❌ No users found! Run: npm run db:seed');
      return;
    }

    console.log(`✅ Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.firstName} ${user.lastName}) - ${user.role} - ${user.status}`);
    });

    // 3. Test login scenarios
    console.log('\n3. Testing login scenarios...');
    
    const testCases = [
      { email: 'admin@acme.com', tenantId: 'acme-corp', description: 'Admin with tenant slug' },
      { email: 'admin@acme.com', tenantId: tenant.id, description: 'Admin with tenant ID' },
      { email: 'sarah@acme.com', tenantId: 'acme-corp', description: 'Employee with tenant slug' },
      { email: 'admin@acme.com', tenantId: null, description: 'Admin without tenant' },
    ];

    for (const testCase of testCases) {
      console.log(`\n   Testing: ${testCase.description}`);
      
      let user;
      if (testCase.tenantId) {
        // Find tenant by ID or slug
        const foundTenant = await prisma.tenant.findFirst({
          where: {
            OR: [{ id: testCase.tenantId }, { slug: testCase.tenantId }],
            isActive: true,
          },
        });
        
        if (!foundTenant) {
          console.log(`   ❌ Tenant not found: ${testCase.tenantId}`);
          continue;
        }
        
        user = await prisma.user.findFirst({
          where: { 
            email: testCase.email, 
            tenantId: foundTenant.id, 
            status: 'ACTIVE' 
          },
        });
      } else {
        user = await prisma.user.findFirst({
          where: { 
            email: testCase.email, 
            status: 'ACTIVE' 
          },
        });
      }
      
      if (user) {
        console.log(`   ✅ User found: ${user.email} in tenant ${user.tenantId}`);
      } else {
        console.log(`   ❌ User not found`);
      }
    }

    console.log('\n🎉 Test completed!');
    console.log('\n📋 Login credentials:');
    console.log('   Email: admin@acme.com');
    console.log('   Password: Password123!');
    console.log('   Tenant: acme-corp (or leave empty)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testTenantLogin();