import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding comprehensive demo data...');

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: '2coms',
      slug: 'acme-corp',
      domain: '2coms.com',
      primaryColor: '#00c8ff',
      plan: 'ENTERPRISE',
      settings: {
        allowGuestAccess: false,
        enableAI: true,
        enableRecognition: true,
        enableEvents: true,
        maxStorageGB: 500,
        maxUsers: 10000,
        customBranding: true,
        ssoEnabled: false,
      },
    },
  });

  console.log(`✅ Tenant: ${tenant.name}`);

  // Create Departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: 'engineering' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Engineering', slug: 'engineering', color: '#00c8ff', description: 'Software development and technical innovation' },
    }),
    prisma.department.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: 'product' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Product', slug: 'product', color: '#8b5cf6', description: 'Product strategy and management' },
    }),
    prisma.department.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: 'design' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Design', slug: 'design', color: '#ec4899', description: 'UX/UI design and creative direction' },
    }),
    prisma.department.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: 'marketing' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Marketing', slug: 'marketing', color: '#f59e0b', description: 'Brand and growth marketing' },
    }),
    prisma.department.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: 'sales' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Sales', slug: 'sales', color: '#10b981', description: 'Revenue and customer acquisition' },
    }),
    prisma.department.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: 'hr' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Human Resources', slug: 'hr', color: '#6366f1', description: 'People operations and culture' },
    }),
  ]);

  console.log(`✅ Departments: ${departments.map((d) => d.name).join(', ')}`);

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // Create Admin
  const adminData = {
      tenantId: tenant.id,
      email: 'admin@acme.com',
      password: passwordHash,
      firstName: 'Alex',
      lastName: 'Morgan',
      displayName: 'Alex Morgan',
      role: 'TENANT_ADMIN' as const,
      status: 'ACTIVE' as const,
      jobTitle: 'Chief Technology Officer',
      departmentId: departments[0].id,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      bio: 'Leading technology innovation and digital transformation at 2coms. Passionate about building great products and teams.',
      skills: ['Leadership', 'Strategy', 'Cloud Architecture', 'Team Building'],
      recognitionPoints: 850,
  };
  const admin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@acme.com' } },
    update: { firstName: adminData.firstName, lastName: adminData.lastName, displayName: adminData.displayName, jobTitle: adminData.jobTitle, bio: adminData.bio, skills: adminData.skills },
    create: {
      ...adminData,
    },
  });

  // Create 20+ Realistic Employees
  const employees = await Promise.all([
    // Engineering Team
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'sarah@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'sarah@acme.com',
        password: passwordHash,
        firstName: 'Sarah',
        lastName: 'Chen',
        displayName: 'Sarah Chen',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'Senior Full-Stack Engineer',
        departmentId: departments[0].id,
        managerId: admin.id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
        bio: 'Full-stack engineer passionate about developer experience and clean code. Coffee enthusiast ☕',
        recognitionPoints: 520,
      },
    }),
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'james@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'james@acme.com',
        password: passwordHash,
        firstName: 'James',
        lastName: 'Rodriguez',
        displayName: 'James Rodriguez',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'DevOps Engineer',
        departmentId: departments[0].id,
        managerId: admin.id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        skills: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'Monitoring'],
        bio: 'Building reliable infrastructure and automating everything. Always learning new tools.',
        recognitionPoints: 380,
      },
    }),
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'emily@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'emily@acme.com',
        password: passwordHash,
        firstName: 'Emily',
        lastName: 'Watson',
        displayName: 'Emily Watson',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'Frontend Developer',
        departmentId: departments[0].id,
        managerId: admin.id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        skills: ['React', 'Vue.js', 'CSS', 'Animation', 'Accessibility'],
        bio: 'Creating beautiful and accessible user interfaces. Design systems advocate.',
        recognitionPoints: 290,
      },
    }),
    // Product Team
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'marcus@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'marcus@acme.com',
        password: passwordHash,
        firstName: 'Marcus',
        lastName: 'Johnson',
        displayName: 'Marcus Johnson',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'Senior Product Manager',
        departmentId: departments[1].id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        skills: ['Product Strategy', 'Roadmapping', 'Analytics', 'User Research'],
        bio: 'Building products that users love. Data-driven decision maker.',
        recognitionPoints: 450,
      },
    }),
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'lisa@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'lisa@acme.com',
        password: passwordHash,
        firstName: 'Lisa',
        lastName: 'Park',
        displayName: 'Lisa Park',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'Product Analyst',
        departmentId: departments[1].id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        skills: ['SQL', 'Python', 'Data Visualization', 'A/B Testing'],
        bio: 'Turning data into actionable insights. Numbers tell stories.',
        recognitionPoints: 310,
      },
    }),
    // Design Team
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'priya@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'priya@acme.com',
        password: passwordHash,
        firstName: 'Priya',
        lastName: 'Patel',
        displayName: 'Priya Patel',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'Lead UX Designer',
        departmentId: departments[2].id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping'],
        bio: 'Designing delightful experiences. User advocate and design systems enthusiast.',
        recognitionPoints: 480,
      },
    }),
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'david@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'david@acme.com',
        password: passwordHash,
        firstName: 'David',
        lastName: 'Kim',
        displayName: 'David Kim',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'UI Designer',
        departmentId: departments[2].id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        skills: ['UI Design', 'Illustration', 'Motion Design', 'Branding'],
        bio: 'Crafting pixel-perfect interfaces. Animation and micro-interactions lover.',
        recognitionPoints: 340,
      },
    }),
    // Marketing Team
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'rachel@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'rachel@acme.com',
        password: passwordHash,
        firstName: 'Rachel',
        lastName: 'Green',
        displayName: 'Rachel Green',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'Marketing Manager',
        departmentId: departments[3].id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
        skills: ['Content Marketing', 'SEO', 'Social Media', 'Campaign Management'],
        bio: 'Building brand awareness and driving growth. Content strategist.',
        recognitionPoints: 420,
      },
    }),
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'tom@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'tom@acme.com',
        password: passwordHash,
        firstName: 'Tom',
        lastName: 'Anderson',
        displayName: 'Tom Anderson',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'Content Writer',
        departmentId: departments[3].id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
        skills: ['Copywriting', 'Storytelling', 'Blog Writing', 'Email Marketing'],
        bio: 'Telling compelling stories through words. Always curious.',
        recognitionPoints: 260,
      },
    }),
    // Sales Team
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'michael@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'michael@acme.com',
        password: passwordHash,
        firstName: 'Michael',
        lastName: 'Scott',
        displayName: 'Michael Scott',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'Sales Director',
        departmentId: departments[4].id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        skills: ['Sales Strategy', 'Negotiation', 'CRM', 'Team Leadership'],
        bio: 'Closing deals and building relationships. Customer success advocate.',
        recognitionPoints: 590,
      },
    }),
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'jessica@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'jessica@acme.com',
        password: passwordHash,
        firstName: 'Jessica',
        lastName: 'Williams',
        displayName: 'Jessica Williams',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'Account Executive',
        departmentId: departments[4].id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
        skills: ['B2B Sales', 'Prospecting', 'Presentations', 'Salesforce'],
        bio: 'Helping businesses grow with our solutions. Relationship builder.',
        recognitionPoints: 370,
      },
    }),
    // HR Team
    prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: 'nina@acme.com' } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'nina@acme.com',
        password: passwordHash,
        firstName: 'Nina',
        lastName: 'Martinez',
        displayName: 'Nina Martinez',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        jobTitle: 'HR Manager',
        departmentId: departments[5].id,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina',
        skills: ['Recruitment', 'Employee Relations', 'Culture Building', 'Performance Management'],
        bio: 'Building a great workplace culture. People-first mindset.',
        recognitionPoints: 410,
      },
    }),
  ]);

  console.log(`✅ Users: ${[admin, ...employees].length} total`);

  // Create Badges
  const badges = await Promise.all([
    prisma.badge.upsert({
      where: { id: 'badge-star-performer' },
      update: {},
      create: {
        id: 'badge-star-performer',
        tenantId: tenant.id,
        name: 'Star Performer',
        description: 'Exceptional performance and outstanding results',
        iconUrl: '⭐',
        color: '#f59e0b',
        points: 50,
        category: 'PERFORMANCE',
      },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-team-player' },
      update: {},
      create: {
        id: 'badge-team-player',
        tenantId: tenant.id,
        name: 'Team Player',
        description: 'Outstanding collaboration and teamwork',
        iconUrl: '🤝',
        color: '#3b82f6',
        points: 30,
        category: 'COLLABORATION',
      },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-innovator' },
      update: {},
      create: {
        id: 'badge-innovator',
        tenantId: tenant.id,
        name: 'Innovator',
        description: 'Creative problem solving and innovation',
        iconUrl: '💡',
        color: '#8b5cf6',
        points: 40,
        category: 'INNOVATION',
      },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-mentor' },
      update: {},
      create: {
        id: 'badge-mentor',
        tenantId: tenant.id,
        name: 'Mentor',
        description: 'Helping others grow and succeed',
        iconUrl: '🎓',
        color: '#10b981',
        points: 35,
        category: 'LEADERSHIP',
      },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-culture-champion' },
      update: {},
      create: {
        id: 'badge-culture-champion',
        tenantId: tenant.id,
        name: 'Culture Champion',
        description: 'Embodying company values and culture',
        iconUrl: '🏆',
        color: '#ec4899',
        points: 45,
        category: 'CULTURE',
      },
    }),
  ]);

  console.log(`✅ Badges: ${badges.map((b) => b.name).join(', ')}`);

  // Create realistic posts
  const posts = [
    {
      authorId: admin.id,
      content: '🎉 Excited to announce that we\'ve just hit 10,000 active users! This is a huge milestone for our team. Thank you to everyone who made this possible. Let\'s keep building! #milestone #teamwork',
      hashtags: ['#milestone', '#teamwork'],
      isPinned: true,
    },
    {
      authorId: employees[0].id, // Sarah
      content: '🚀 Just shipped the new API performance improvements! Response times are now 40% faster. Big shoutout to @james for the infrastructure optimizations. #engineering #performance',
      hashtags: ['#engineering', '#performance'],
    },
    {
      authorId: employees[3].id, // Marcus
      content: '📊 Our latest user research shows that 92% of users love the new dashboard redesign! Great work @priya and the design team. User feedback has been overwhelmingly positive. #product #ux',
      hashtags: ['#product', '#ux'],
    },
    {
      authorId: employees[5].id, // Priya
      content: '🎨 Working on the new design system components. Can\'t wait to share what we\'ve been building! Consistency and accessibility are our top priorities. #design #designsystems',
      hashtags: ['#design', '#designsystems'],
    },
    {
      authorId: employees[7].id, // Rachel
      content: '📈 Our latest blog post just hit 50K views! Content marketing is really paying off. Check it out if you haven\'t already. #marketing #content',
      hashtags: ['#marketing', '#content'],
    },
    {
      authorId: employees[1].id, // James
      content: '⚙️ Deployed the new Kubernetes cluster today. Zero downtime migration completed successfully! Our infrastructure is now more scalable than ever. #devops #kubernetes',
      hashtags: ['#devops', '#kubernetes'],
    },
    {
      authorId: employees[9].id, // Michael
      content: '🎯 Closed 3 major deals this week! Q4 is looking strong. Grateful for the amazing support from the product and engineering teams. #sales #success',
      hashtags: ['#sales', '#success'],
    },
    {
      authorId: employees[2].id, // Emily
      content: '♿ Just finished implementing WCAG 2.1 AA compliance across our platform. Accessibility matters! Everyone should be able to use our product. #accessibility #frontend',
      hashtags: ['#accessibility', '#frontend'],
    },
    {
      authorId: employees[11].id, // Nina
      content: '🌟 Welcome to our 5 new team members joining this month! We\'re growing fast and building an amazing culture. Excited to see what we\'ll accomplish together. #hr #culture',
      hashtags: ['#hr', '#culture'],
    },
    {
      authorId: employees[4].id, // Lisa
      content: '📊 Analyzed last month\'s metrics - user engagement is up 25%! The new features are really resonating with our users. Data-driven decisions FTW! #analytics #data',
      hashtags: ['#analytics', '#data'],
    },
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: {
        ...post,
        tenantId: tenant.id,
        type: 'TEXT',
        visibility: 'PUBLIC',
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
      },
    });
  }

  console.log(`✅ Posts: ${posts.length} created`);

  // Create Announcements
  await prisma.announcement.create({
    data: {
      tenantId: tenant.id,
      authorId: admin.id,
      title: '🎉 Welcome to 2coms Workplace Hub',
      content: 'We are excited to launch our new modern workplace platform. This is your central hub for communication, collaboration, and staying connected with the team. Explore all the features and let us know what you think!',
      priority: 'HIGH',
      audience: 'ALL',
      isPinned: true,
      requiresAck: true,
      publishedAt: new Date(),
    },
  });

  await prisma.announcement.create({
    data: {
      tenantId: tenant.id,
      authorId: admin.id,
      title: '📅 Company All-Hands Meeting - Friday 4PM',
      content: 'Join us this Friday at 4PM for our quarterly all-hands meeting. We\'ll be sharing Q4 results, upcoming initiatives, and celebrating team wins. Virtual link will be shared via email.',
      priority: 'MEDIUM',
      audience: 'ALL',
      isPinned: false,
      requiresAck: false,
      publishedAt: new Date(),
    },
  });

  console.log('✅ Announcements created');

  // Create Knowledge Categories
  const knowledgeCategories = await Promise.all([
    prisma.knowledgeCategory.create({
      data: {
        tenantId: tenant.id,
        name: 'Employee Handbook',
        slug: 'employee-handbook',
        description: 'Company policies, benefits, and guidelines',
        iconName: 'book',
        color: '#3b82f6',
      },
    }),
    prisma.knowledgeCategory.create({
      data: {
        tenantId: tenant.id,
        name: 'Engineering Docs',
        slug: 'engineering-docs',
        description: 'Technical documentation and best practices',
        iconName: 'code',
        color: '#00c8ff',
      },
    }),
    prisma.knowledgeCategory.create({
      data: {
        tenantId: tenant.id,
        name: 'Product Guides',
        slug: 'product-guides',
        description: 'Product specifications and user guides',
        iconName: 'package',
        color: '#8b5cf6',
      },
    }),
  ]);

  console.log('✅ Knowledge categories created');

  // Create Knowledge Articles
  await prisma.knowledgeArticle.create({
    data: {
      tenantId: tenant.id,
      authorId: admin.id,
      categoryId: knowledgeCategories[0].id,
      title: 'Employee Handbook - Welcome Guide',
      slug: 'employee-handbook-welcome-guide',
      excerpt: 'Everything you need to know as a new employee at 2coms',
      content: '<h2>Welcome to 2coms!</h2><p>We are thrilled to have you join our team. This handbook will guide you through our company culture, policies, and benefits.</p><h3>Our Mission</h3><p>To build innovative solutions that empower teams to collaborate effectively.</p><h3>Core Values</h3><ul><li>Innovation</li><li>Collaboration</li><li>Integrity</li><li>Excellence</li></ul>',
      tags: ['onboarding', 'handbook', 'culture'],
      isPublished: true,
      publishedAt: new Date(),
      viewCount: 245,
    },
  });

  await prisma.knowledgeArticle.create({
    data: {
      tenantId: tenant.id,
      authorId: admin.id,
      categoryId: knowledgeCategories[0].id,
      title: 'Time Off and Vacation Policy',
      slug: 'time-off-vacation-policy',
      excerpt: 'Learn about our flexible time off policy and how to request vacation',
      content: '<h2>Time Off Policy</h2><p>We believe in work-life balance. All employees receive unlimited PTO.</p><h3>How to Request Time Off</h3><ol><li>Discuss with your manager</li><li>Submit request in HR system</li><li>Get approval</li><li>Enjoy your time off!</li></ol><h3>Holidays</h3><p>We observe all major holidays plus additional company holidays.</p>',
      tags: ['pto', 'vacation', 'benefits', 'hr'],
      isPublished: true,
      publishedAt: new Date(),
      viewCount: 189,
    },
  });

  await prisma.knowledgeArticle.create({
    data: {
      tenantId: tenant.id,
      authorId: employees[0].id,
      categoryId: knowledgeCategories[1].id,
      title: 'API Development Best Practices',
      slug: 'api-development-best-practices',
      excerpt: 'Guidelines for building robust and scalable APIs',
      content: '<h2>API Best Practices</h2><p>Follow these guidelines when building APIs at 2coms.</p><h3>RESTful Design</h3><ul><li>Use proper HTTP methods</li><li>Implement versioning</li><li>Return appropriate status codes</li></ul><h3>Security</h3><ul><li>Always use HTTPS</li><li>Implement rate limiting</li><li>Validate all inputs</li></ul><h3>Documentation</h3><p>Document all endpoints using OpenAPI/Swagger.</p>',
      tags: ['api', 'development', 'best-practices', 'engineering'],
      isPublished: true,
      publishedAt: new Date(),
      viewCount: 156,
    },
  });

  await prisma.knowledgeArticle.create({
    data: {
      tenantId: tenant.id,
      authorId: employees[5].id,
      categoryId: knowledgeCategories[2].id,
      title: 'Design System Guidelines',
      slug: 'design-system-guidelines',
      excerpt: 'How to use our design system components and maintain consistency',
      content: '<h2>Design System</h2><p>Our design system ensures consistency across all products.</p><h3>Components</h3><ul><li>Buttons</li><li>Forms</li><li>Cards</li><li>Navigation</li></ul><h3>Colors</h3><p>Use our predefined color palette for all designs.</p><h3>Typography</h3><p>We use Geist Sans for headings and body text.</p>',
      tags: ['design', 'ui', 'components', 'guidelines'],
      isPublished: true,
      publishedAt: new Date(),
      viewCount: 134,
    },
  });

  await prisma.knowledgeArticle.create({
    data: {
      tenantId: tenant.id,
      authorId: employees[3].id,
      categoryId: knowledgeCategories[2].id,
      title: 'Product Launch Checklist',
      slug: 'product-launch-checklist',
      excerpt: 'Complete checklist for launching new features and products',
      content: '<h2>Launch Checklist</h2><p>Use this checklist before launching any new feature.</p><h3>Pre-Launch</h3><ul><li>QA testing complete</li><li>Documentation updated</li><li>Marketing materials ready</li><li>Support team trained</li></ul><h3>Launch Day</h3><ul><li>Monitor metrics</li><li>Watch for errors</li><li>Gather user feedback</li></ul><h3>Post-Launch</h3><ul><li>Analyze data</li><li>Iterate based on feedback</li></ul>',
      tags: ['product', 'launch', 'checklist', 'process'],
      isPublished: true,
      publishedAt: new Date(),
      viewCount: 98,
    },
  });

  console.log('✅ Knowledge articles created');

  // Create Events
  await prisma.event.create({
    data: {
      tenantId: tenant.id,
      organizerId: admin.id,
      title: 'Team Building Workshop',
      description: 'Join us for a fun team building session with activities and games. Great opportunity to connect with colleagues!',
      startAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
      location: 'Main Office - Conference Room A',
      isVirtual: false,
      status: 'PUBLISHED',
      tags: ['team-building', 'culture', 'fun'],
    },
  });

  await prisma.event.create({
    data: {
      tenantId: tenant.id,
      organizerId: employees[0].id,
      title: 'Tech Talk: Modern React Patterns',
      description: 'Sarah will be sharing insights on modern React patterns and best practices. Open to all engineers!',
      startAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
      location: 'Virtual',
      isVirtual: true,
      meetingUrl: 'https://meet.2coms.com/tech-talk-react',
      departmentId: departments[0].id,
      status: 'PUBLISHED',
      tags: ['tech-talk', 'engineering', 'learning'],
    },
  });

  console.log('✅ Events created');

  // Create Recognition entries
  await prisma.recognition.create({
    data: {
      tenantId: tenant.id,
      giverId: admin.id,
      receiverId: employees[0].id, // Sarah
      badgeId: badges[0].id, // Star Performer
      message: 'Outstanding work on the API performance improvements! Your dedication to excellence is truly inspiring.',
      points: badges[0].points,
      isPublic: true,
    },
  });

  await prisma.recognition.create({
    data: {
      tenantId: tenant.id,
      giverId: employees[3].id, // Marcus
      receiverId: employees[5].id, // Priya
      badgeId: badges[2].id, // Innovator
      message: 'The new design system is incredible! Your innovative approach has made our products so much better.',
      points: badges[2].points,
      isPublic: true,
    },
  });

  await prisma.recognition.create({
    data: {
      tenantId: tenant.id,
      giverId: employees[0].id, // Sarah
      receiverId: employees[1].id, // James
      badgeId: badges[1].id, // Team Player
      message: 'Thank you for the amazing infrastructure support! Your collaboration made the deployment seamless.',
      points: badges[1].points,
      isPublic: true,
    },
  });

  await prisma.recognition.create({
    data: {
      tenantId: tenant.id,
      giverId: employees[11].id, // Nina
      receiverId: admin.id,
      badgeId: badges[3].id, // Mentor
      message: 'Your leadership and mentorship have helped our team grow tremendously. Thank you for always being there!',
      points: badges[3].points,
      isPublic: true,
    },
  });

  await prisma.recognition.create({
    data: {
      tenantId: tenant.id,
      giverId: employees[7].id, // Rachel
      receiverId: employees[8].id, // Tom
      badgeId: badges[4].id, // Culture Champion
      message: 'Your positive energy and storytelling skills make our company culture amazing!',
      points: badges[4].points,
      isPublic: true,
    },
  });

  console.log('✅ Recognition entries created');

  // Create Search History entries
  await prisma.searchHistory.createMany({
    data: [
      { userId: admin.id, query: 'employee handbook', resultCount: 5 },
      { userId: admin.id, query: 'vacation policy', resultCount: 3 },
      { userId: employees[0].id, query: 'react best practices', resultCount: 8 },
      { userId: employees[0].id, query: 'api documentation', resultCount: 12 },
      { userId: employees[3].id, query: 'product roadmap', resultCount: 4 },
      { userId: employees[5].id, query: 'design system', resultCount: 6 },
    ],
  });

  console.log('✅ Search history created');

  // Create Documents/Media for Gallery
  const mediaDocuments = [
    {
      tenantId: tenant.id,
      uploaderId: admin.id,
      name: 'Team Offsite 2024.jpg',
      type: 'FILE' as const,
      mimeType: 'image/jpeg',
      size: 2048576,
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
    },
    {
      tenantId: tenant.id,
      uploaderId: employees[0].id,
      name: 'Product Launch Event.jpg',
      type: 'FILE' as const,
      mimeType: 'image/jpeg',
      size: 1856432,
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200',
    },
    {
      tenantId: tenant.id,
      uploaderId: employees[5].id,
      name: 'Design Workshop.jpg',
      type: 'FILE' as const,
      mimeType: 'image/jpeg',
      size: 1654321,
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200',
    },
    {
      tenantId: tenant.id,
      uploaderId: employees[7].id,
      name: 'Company Anniversary Celebration.jpg',
      type: 'FILE' as const,
      mimeType: 'image/jpeg',
      size: 2234567,
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200',
    },
    {
      tenantId: tenant.id,
      uploaderId: employees[3].id,
      name: 'Hackathon Winners.jpg',
      type: 'FILE' as const,
      mimeType: 'image/jpeg',
      size: 1987654,
      url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200',
    },
    {
      tenantId: tenant.id,
      uploaderId: employees[11].id,
      name: 'New Office Tour.jpg',
      type: 'FILE' as const,
      mimeType: 'image/jpeg',
      size: 1765432,
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200',
    },
    {
      tenantId: tenant.id,
      uploaderId: employees[1].id,
      name: 'Tech Conference 2024.jpg',
      type: 'FILE' as const,
      mimeType: 'image/jpeg',
      size: 2123456,
      url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=200',
    },
    {
      tenantId: tenant.id,
      uploaderId: employees[9].id,
      name: 'Sales Kickoff Meeting.jpg',
      type: 'FILE' as const,
      mimeType: 'image/jpeg',
      size: 1898765,
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200',
    },
  ];

  for (const doc of mediaDocuments) {
    await prisma.document.create({ data: doc });
  }

  console.log(`✅ Gallery media: ${mediaDocuments.length} images created`);

  // Create more posts for moderation page
  const additionalPosts = [
    {
      tenantId: tenant.id,
      authorId: employees[6].id, // David
      content: '🎨 Just finished the new icon set for our mobile app! 200+ icons designed with consistency and clarity in mind. #design #icons',
      hashtags: ['#design', '#icons'],
      type: 'TEXT' as const,
      visibility: 'PUBLIC' as const,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      tenantId: tenant.id,
      authorId: employees[8].id, // Tom
      content: '✍️ Published a new blog post about our company culture and values. Check it out on our website! #content #culture',
      hashtags: ['#content', '#culture'],
      type: 'TEXT' as const,
      visibility: 'PUBLIC' as const,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      tenantId: tenant.id,
      authorId: employees[10].id, // Jessica
      content: '🎉 Just closed a deal with a Fortune 500 company! This is going to be huge for us. Thanks to everyone who supported this effort! #sales #win',
      hashtags: ['#sales', '#win'],
      type: 'TEXT' as const,
      visibility: 'PUBLIC' as const,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      tenantId: tenant.id,
      authorId: employees[4].id, // Lisa
      content: '📊 Created a new dashboard for tracking KPIs in real-time. Data visualization makes decision-making so much easier! #analytics #dashboard',
      hashtags: ['#analytics', '#dashboard'],
      type: 'TEXT' as const,
      visibility: 'PUBLIC' as const,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      tenantId: tenant.id,
      authorId: employees[6].id, // David
      content: '🌈 Experimenting with new color palettes for our brand refresh. Loving the vibrant yet professional look! #design #branding',
      hashtags: ['#design', '#branding'],
      type: 'TEXT' as const,
      visibility: 'PUBLIC' as const,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const post of additionalPosts) {
    await prisma.post.create({ data: post });
  }

  console.log(`✅ Additional posts: ${additionalPosts.length} created for moderation`);

  console.log('\n🎉 Comprehensive seed complete!');
  console.log('\n📋 Demo Accounts:');
  console.log(`   Admin: admin@acme.com / Password123!`);
  console.log(`   Employee: sarah@acme.com / Password123!`);
  console.log(`   Employee: marcus@acme.com / Password123!`);
  console.log(`   Employee: priya@acme.com / Password123!`);
  console.log(`\n✨ Database now has:`);
  console.log(`   - 13 employees across 6 departments`);
  console.log(`   - 15 realistic feed posts`);
  console.log(`   - 2 announcements`);
  console.log(`   - 5 badges`);
  console.log(`   - 5 recognition entries`);
  console.log(`   - 2 upcoming events`);
  console.log(`   - 3 knowledge categories`);
  console.log(`   - 5 knowledge articles`);
  console.log(`   - 8 gallery images`);
  console.log(`   - Search history data`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
