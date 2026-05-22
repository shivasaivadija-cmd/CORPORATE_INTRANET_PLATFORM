/**
 * Comprehensive Application Knowledge Base
 * This provides structured information about every feature for AI Customer Support
 */

export const APPLICATION_KNOWLEDGE = {
  platform: {
    name: '2coms Corporate Intranet Platform',
    description: 'Enterprise-grade internal communication and engagement platform',
    version: '1.0.0',
  },

  features: {
    dashboard: {
      name: 'Dashboard',
      description: 'Central hub showing AI digest summaries, recent announcements, and quick statistics',
      howTo: [
        'Access from the home icon in the sidebar',
        'View AI-generated daily digest at the top',
        'See recent announcements and activity feed',
        'Check quick stats for posts, events, and recognition',
        'Click on any widget to navigate to that section',
      ],
      commonIssues: [
        { issue: 'Dashboard not loading', solution: 'Refresh the page or clear browser cache' },
        { issue: 'Stats not updating', solution: 'Stats update every 5 minutes automatically' },
      ],
    },

    feed: {
      name: 'Social Feed',
      description: 'LinkedIn-style feed for sharing posts, collaborating, and engaging with team content',
      howTo: [
        'Click "Create Post" button at the top of the feed',
        'Write your content (supports markdown formatting)',
        'Add hashtags using # symbol for better discoverability',
        'Attach images or files if needed',
        'Choose visibility: Public or Department-only',
        'Click "Post" to publish',
        'React to posts with 👍 Like, ❤️ Love, 🎉 Celebrate, 💡 Insightful',
        'Comment on posts to start discussions',
        'Share posts to amplify content',
      ],
      features: [
        'Rich text editor with markdown support',
        'Image and file attachments',
        'Hashtag support for categorization',
        'Reactions (Like, Love, Celebrate, Insightful)',
        'Nested comments and replies',
        'Post sharing and bookmarking',
        'Real-time updates via WebSocket',
      ],
      commonIssues: [
        { issue: 'Cannot create post', solution: 'Check if you have posting permissions for your role' },
        { issue: 'Images not uploading', solution: 'Ensure image is under 5MB and in JPG/PNG format' },
        { issue: 'Post not appearing', solution: 'Check visibility settings - may be department-only' },
      ],
    },

    announcements: {
      name: 'Announcements',
      description: 'Official company updates and organizational notifications with priority levels',
      howTo: [
        'Navigate to Announcements from sidebar',
        'View all company announcements sorted by priority',
        'Click on announcement to read full content',
        'Acknowledge important announcements by clicking "Mark as Read"',
        'Filter by priority: Critical, High, Normal, Low',
        'Search announcements using the search bar',
      ],
      features: [
        'Priority levels (Critical, High, Normal, Low)',
        'Read receipts and acknowledgements',
        'Rich content with images and formatting',
        'Scheduled publishing',
        'Target audience selection',
        'Email notifications for critical announcements',
      ],
      permissions: {
        admin: 'Create, edit, delete all announcements',
        manager: 'Create announcements for their department',
        employee: 'View and acknowledge announcements',
      },
    },

    knowledgeHub: {
      name: 'Knowledge Hub',
      description: 'Searchable article library and documentation database with versioning',
      howTo: [
        'Access Knowledge Hub from sidebar',
        'Browse articles by category or use search',
        'Click article to read full content',
        'Use table of contents for long articles',
        'Bookmark important articles for quick access',
        'Rate articles to help others find quality content',
        'Suggest edits if you find outdated information',
      ],
      features: [
        'Rich text editor with markdown',
        'Article versioning and history',
        'Category and tag organization',
        'Full-text search with fuzzy matching',
        'AI-powered auto-tagging',
        'Article ratings and feedback',
        'Related articles suggestions',
        'Export to PDF',
      ],
      forAuthors: [
        'Click "Create Article" button',
        'Choose category and add tags',
        'Write content using the rich editor',
        'Preview before publishing',
        'Set article as Draft or Published',
        'Update articles - versions are saved automatically',
      ],
    },

    documents: {
      name: 'Documents',
      description: 'Enterprise file management with S3 storage and AI-powered summaries',
      howTo: [
        'Navigate to Documents section',
        'Click "Upload" to add new files',
        'Drag and drop files for bulk upload',
        'Organize files into folders',
        'Use search to find documents quickly',
        'Click document to preview or download',
        'Share documents with specific users or departments',
        'Set permissions: View, Edit, or Admin',
      ],
      features: [
        'Cloud storage (AWS S3 / Cloudflare R2)',
        'File preview for common formats',
        'Version control for documents',
        'AI-generated summaries for PDFs',
        'Folder organization',
        'Advanced search and filters',
        'Permission management',
        'Audit trail for file access',
      ],
      supportedFormats: ['PDF', 'DOCX', 'XLSX', 'PPTX', 'TXT', 'CSV', 'Images (JPG, PNG, GIF)', 'ZIP'],
    },

    gallery: {
      name: 'Gallery',
      description: 'Photo and media sharing with organization tools and albums',
      howTo: [
        'Go to Gallery from sidebar',
        'Click "Upload Photos" to add images',
        'Create albums to organize photos',
        'Add descriptions and tags to photos',
        'Like and comment on photos',
        'Download photos individually or entire albums',
        'Share albums with team members',
      ],
      features: [
        'Photo albums and collections',
        'Automatic thumbnail generation',
        'Image optimization and compression',
        'Tagging and categorization',
        'Slideshow mode',
        'Bulk upload and download',
        'Social features (likes, comments)',
      ],
    },

    people: {
      name: 'People Directory',
      description: 'Team directory with profiles, org chart, and direct messaging',
      howTo: [
        'Access People directory from sidebar',
        'Search for colleagues by name, department, or skills',
        'Click on profile to view full details',
        'See org chart to understand reporting structure',
        'Send direct messages to colleagues',
        'View skills and expertise',
        'Filter by department, location, or role',
      ],
      features: [
        'Employee profiles with photos',
        'Organizational chart visualization',
        'Skills directory and expertise matching',
        'Direct messaging integration',
        'Department and team views',
        'Contact information',
        'Birthday and anniversary tracking',
      ],
      profileFields: [
        'Name and photo',
        'Job title and department',
        'Contact information (email, phone)',
        'Manager and direct reports',
        'Skills and expertise',
        'Bio and interests',
        'Location and timezone',
      ],
    },

    recognition: {
      name: 'Recognition System',
      description: 'Peer kudos, badges, points system, and leaderboards for employee appreciation',
      howTo: [
        'Navigate to Recognition section',
        'Click "Give Kudos" to recognize a colleague',
        'Select the person and recognition type',
        'Write a meaningful message',
        'Choose a badge (optional)',
        'Submit - recipient gets notified',
        'View leaderboard to see top contributors',
        'Check your own points and badges in profile',
      ],
      features: [
        'Peer-to-peer kudos system',
        'Achievement badges',
        'Points and rewards tracking',
        'Monthly and all-time leaderboards',
        'Recognition categories (Teamwork, Innovation, Leadership, etc.)',
        'Public recognition feed',
        'Manager endorsements',
        'Redeemable rewards (if configured)',
      ],
      recognitionTypes: [
        'Teamwork - Collaborating effectively',
        'Innovation - Creative problem solving',
        'Leadership - Guiding and mentoring',
        'Customer Focus - Exceptional service',
        'Excellence - Outstanding work quality',
        'Helping Hand - Supporting colleagues',
      ],
    },

    events: {
      name: 'Events & Calendar',
      description: 'Team activities, RSVP tracking, and calendar integration',
      howTo: [
        'Go to Events from sidebar',
        'View upcoming events in calendar or list view',
        'Click event to see details',
        'RSVP by clicking "Attend", "Maybe", or "Decline"',
        'Add events to your personal calendar',
        'Create new events (if you have permission)',
        'Set reminders for important events',
        'Join virtual meetings directly from event page',
      ],
      features: [
        'Calendar view (month, week, day)',
        'RSVP tracking and attendee lists',
        'Virtual meeting integration (Zoom, Teams)',
        'Event categories (Meeting, Social, Training, etc.)',
        'Recurring events support',
        'Email and push notifications',
        'iCal export',
        'Event photos and recaps',
      ],
      eventTypes: [
        'Company Meetings',
        'Team Building Activities',
        'Training Sessions',
        'Social Events',
        'Town Halls',
        'Workshops',
        'Celebrations',
      ],
    },

    admin: {
      name: 'Admin Panel',
      description: 'Content moderation, user management, and analytics dashboard',
      howTo: [
        'Access Admin Panel (admin role required)',
        'Manage users: create, edit, deactivate accounts',
        'Moderate content: review flagged posts and comments',
        'View analytics: engagement metrics, user activity',
        'Configure settings: permissions, features, integrations',
        'Manage departments and teams',
        'Export reports and audit logs',
      ],
      features: [
        'User management (CRUD operations)',
        'Role and permission management',
        'Content moderation queue',
        'Analytics and reporting',
        'System configuration',
        'Audit logs and activity tracking',
        'Bulk operations',
        'Data export',
      ],
      roles: {
        admin: 'Full system access, all permissions',
        manager: 'Department management, content moderation',
        employee: 'Standard user access',
        guest: 'Limited read-only access',
      },
    },

    aiAssistant: {
      name: 'AI Customer Support',
      description: 'Intelligent assistant with full application knowledge and NLP capabilities',
      howTo: [
        'Click on AI Customer Support in sidebar',
        'Type your question in natural language',
        'Ask about any feature, process, or issue',
        'Use quick prompts for common questions',
        'Have a conversation - I remember context',
        'Ask follow-up questions for clarification',
        'Clear chat to start fresh conversation',
      ],
      capabilities: [
        'Answer questions about all features',
        'Provide step-by-step guidance',
        'Explain company policies and procedures',
        'Troubleshoot common issues',
        'Summarize recent activity and announcements',
        'Suggest relevant features and content',
        'Understand context and conversation history',
        'Natural language processing (NLP)',
      ],
      exampleQuestions: [
        'How do I create a post?',
        'What is the recognition system?',
        'How can I upload documents?',
        'Where do I find the org chart?',
        'How do I give kudos to a colleague?',
        'What are all the features available?',
        'How do I RSVP to an event?',
        'Can you explain the dashboard widgets?',
      ],
    },
  },

  commonTasks: {
    'Create a post': {
      steps: [
        'Navigate to Feed section',
        'Click "Create Post" button',
        'Write your content',
        'Add hashtags with # symbol',
        'Attach files if needed (optional)',
        'Choose visibility setting',
        'Click "Post" to publish',
      ],
      tips: ['Use hashtags for better discoverability', 'Add images to increase engagement', 'Tag colleagues with @ mention'],
    },
    'Give recognition': {
      steps: [
        'Go to Recognition section',
        'Click "Give Kudos"',
        'Select colleague from dropdown',
        'Choose recognition type',
        'Write meaningful message',
        'Select badge (optional)',
        'Submit recognition',
      ],
      tips: ['Be specific about what you\'re recognizing', 'Public recognition motivates others', 'Regular recognition builds culture'],
    },
    'Upload documents': {
      steps: [
        'Navigate to Documents',
        'Click "Upload" button',
        'Select files or drag & drop',
        'Choose destination folder',
        'Set permissions if needed',
        'Click "Upload"',
      ],
      tips: ['Organize files in folders', 'Use descriptive names', 'Set appropriate permissions'],
    },
    'Search for content': {
      steps: [
        'Use global search bar at top',
        'Type your search query',
        'Filter by content type (posts, articles, documents)',
        'Click result to view',
      ],
      tips: ['Use specific keywords', 'Try different search terms', 'Use filters to narrow results'],
    },
  },

  troubleshooting: {
    'Cannot login': [
      'Verify your email and password are correct',
      'Check if Caps Lock is on',
      'Try "Forgot Password" to reset',
      'Clear browser cache and cookies',
      'Try a different browser',
      'Contact IT support if issue persists',
    ],
    'Page not loading': [
      'Refresh the page (F5 or Ctrl+R)',
      'Clear browser cache',
      'Check internet connection',
      'Try incognito/private mode',
      'Disable browser extensions temporarily',
      'Contact support if problem continues',
    ],
    'Upload failing': [
      'Check file size (max 10MB for most files)',
      'Verify file format is supported',
      'Check internet connection stability',
      'Try uploading one file at a time',
      'Clear browser cache',
      'Try different browser',
    ],
    'Notifications not working': [
      'Check notification settings in profile',
      'Allow browser notifications',
      'Check if notifications are enabled for the app',
      'Refresh the page',
      'Log out and log back in',
    ],
    'Search not finding results': [
      'Try different keywords',
      'Check spelling',
      'Use filters to narrow search',
      'Ensure content exists and you have permission',
      'Try global search vs section-specific search',
    ],
  },

  bestPractices: {
    posting: [
      'Write clear, concise content',
      'Use hashtags for categorization',
      'Add relevant images or files',
      'Engage with comments on your posts',
      'Post regularly but not excessively',
    ],
    collaboration: [
      'Respond to messages promptly',
      'Give constructive feedback',
      'Recognize colleagues\' contributions',
      'Share knowledge and resources',
      'Participate in discussions',
    ],
    contentCreation: [
      'Use proper formatting for readability',
      'Include relevant tags and categories',
      'Proofread before publishing',
      'Update outdated content',
      'Link to related resources',
    ],
  },

  technicalDetails: {
    stack: {
      frontend: 'Next.js 15, TypeScript, Tailwind CSS, Framer Motion',
      backend: 'NestJS 10, TypeScript, Prisma ORM',
      database: 'PostgreSQL 16, Redis 7',
      ai: 'Grok AI (xAI) with NLP capabilities',
      realtime: 'Socket.IO WebSocket',
    },
    security: [
      'JWT authentication with refresh tokens',
      'Role-based access control (RBAC)',
      'Multi-tenant data isolation',
      'Rate limiting per route',
      'Secure HttpOnly cookies',
      'Input validation and sanitization',
      'Comprehensive audit logging',
    ],
    performance: [
      'Redis caching for frequent queries',
      'Optimistic UI updates',
      'Lazy loading and code splitting',
      'Image optimization',
      'Database query optimization',
      'CDN for static assets',
    ],
  },
};

/**
 * Get relevant knowledge based on user query
 */
export function getRelevantKnowledge(query: string): string {
  const lowerQuery = query.toLowerCase();
  const relevantSections: string[] = [];

  // Feature-specific knowledge
  Object.entries(APPLICATION_KNOWLEDGE.features).forEach(([key, feature]) => {
    if (
      lowerQuery.includes(key) ||
      lowerQuery.includes(feature.name.toLowerCase()) ||
      feature.description.toLowerCase().includes(lowerQuery)
    ) {
      relevantSections.push(`\n📌 **${feature.name}**\n${JSON.stringify(feature, null, 2)}`);
    }
  });

  // Common tasks
  Object.entries(APPLICATION_KNOWLEDGE.commonTasks).forEach(([task, details]) => {
    if (lowerQuery.includes(task.toLowerCase())) {
      relevantSections.push(`\n✅ **How to: ${task}**\n${JSON.stringify(details, null, 2)}`);
    }
  });

  // Troubleshooting
  Object.entries(APPLICATION_KNOWLEDGE.troubleshooting).forEach(([issue, solutions]) => {
    if (lowerQuery.includes(issue.toLowerCase())) {
      relevantSections.push(`\n🔧 **Troubleshooting: ${issue}**\n${solutions.join('\n')}`);
    }
  });

  // Always include a compact feature list as baseline
  const featureList = Object.values(APPLICATION_KNOWLEDGE.features)
    .map((f) => `• ${f.name}: ${f.description}`)
    .join('\n');

  const baseline = `**Available Features:**\n${featureList}`;

  return relevantSections.length > 0
    ? relevantSections.join('\n\n').substring(0, 2000)
    : baseline;
}
