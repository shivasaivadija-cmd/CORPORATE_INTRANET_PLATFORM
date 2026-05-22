// ============================================================
// CORE ENTITY TYPES
// ============================================================

export type UUID = string;
export type ISODateString = string;

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  DEPARTMENT_ADMIN: 'DEPARTMENT_ADMIN',
  MODERATOR: 'MODERATOR',
  EMPLOYEE: 'EMPLOYEE',
  GUEST: 'GUEST',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export const OnlineStatus = {
  ONLINE: 'ONLINE',
  AWAY: 'AWAY',
  BUSY: 'BUSY',
  OFFLINE: 'OFFLINE',
} as const;

export type OnlineStatus = typeof OnlineStatus[keyof typeof OnlineStatus];

export interface Tenant {
  id: UUID;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  primaryColor?: string;
  plan: TenantPlan;
  settings: TenantSettings;
  createdAt: ISODateString;
}

export const TenantPlan = {
  STARTER: 'STARTER',
  PROFESSIONAL: 'PROFESSIONAL',
  ENTERPRISE: 'ENTERPRISE',
} as const;

export type TenantPlan = typeof TenantPlan[keyof typeof TenantPlan];

export interface TenantSettings {
  allowGuestAccess: boolean;
  enableAI: boolean;
  enableRecognition: boolean;
  enableEvents: boolean;
  maxStorageGB: number;
  maxUsers: number;
  customBranding: boolean;
  ssoEnabled: boolean;
}

export interface User {
  id: UUID;
  tenantId: UUID;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string;
  coverUrl?: string;
  role: UserRole;
  status: UserStatus;
  onlineStatus: OnlineStatus;
  departmentId?: UUID;
  department?: Department;
  jobTitle?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  skills: string[];
  socialLinks: SocialLinks;
  badgeCount: number;
  recognitionPoints: number;
  lastSeenAt?: ISODateString;
  createdAt: ISODateString;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface Department {
  id: UUID;
  tenantId: UUID;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  color?: string;
  parentId?: UUID;
  headId?: UUID;
  memberCount: number;
  createdAt: ISODateString;
}

// ============================================================
// FEED & POSTS
// ============================================================

export const PostType = {
  TEXT: 'TEXT',
  RICH: 'RICH',
  POLL: 'POLL',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  RECOGNITION: 'RECOGNITION',
  EVENT: 'EVENT',
  DOCUMENT: 'DOCUMENT',
} as const;

export type PostType = typeof PostType[keyof typeof PostType];

export const PostVisibility = {
  PUBLIC: 'PUBLIC',
  DEPARTMENT: 'DEPARTMENT',
  TEAM: 'TEAM',
  PRIVATE: 'PRIVATE',
} as const;

export type PostVisibility = typeof PostVisibility[keyof typeof PostVisibility];

export interface Post {
  id: UUID;
  tenantId: UUID;
  authorId: UUID;
  author: User;
  type: PostType;
  visibility: PostVisibility;
  content: string;
  richContent?: Record<string, unknown>;
  mediaUrls: string[];
  hashtags: string[];
  mentions: UUID[];
  departmentId?: UUID;
  isPinned: boolean;
  isModerated: boolean;
  aiSummary?: string;
  reactionCounts: ReactionCounts;
  commentCount: number;
  viewCount: number;
  bookmarkCount: number;
  poll?: Poll;
  publishedAt?: ISODateString;
  expiresAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ReactionCounts {
  like: number;
  love: number;
  celebrate: number;
  insightful: number;
  curious: number;
}

export type ReactionType = keyof ReactionCounts;

export interface Poll {
  id: UUID;
  question: string;
  options: PollOption[];
  endsAt: ISODateString;
  totalVotes: number;
  allowMultiple: boolean;
}

export interface PollOption {
  id: UUID;
  text: string;
  voteCount: number;
  percentage: number;
  hasVoted?: boolean;
}

export interface Comment {
  id: UUID;
  postId: UUID;
  authorId: UUID;
  author: User;
  content: string;
  parentId?: UUID;
  replies?: Comment[];
  reactionCounts: ReactionCounts;
  isEdited: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ============================================================
// ANNOUNCEMENTS
// ============================================================

export const AnnouncementPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export type AnnouncementPriority = typeof AnnouncementPriority[keyof typeof AnnouncementPriority];

export interface Announcement {
  id: UUID;
  tenantId: UUID;
  authorId: UUID;
  author: User;
  title: string;
  content: string;
  richContent?: Record<string, unknown>;
  priority: AnnouncementPriority;
  targetAudience: AnnouncementAudience;
  departmentIds: UUID[];
  isPinned: boolean;
  requiresAck: boolean;
  ackCount: number;
  readCount: number;
  totalTargeted: number;
  aiSummary?: string;
  scheduledAt?: ISODateString;
  expiresAt?: ISODateString;
  publishedAt?: ISODateString;
  createdAt: ISODateString;
}

export const AnnouncementAudience = {
  ALL: 'ALL',
  DEPARTMENTS: 'DEPARTMENTS',
  SPECIFIC_USERS: 'SPECIFIC_USERS',
} as const;

export type AnnouncementAudience = typeof AnnouncementAudience[keyof typeof AnnouncementAudience];

// ============================================================
// KNOWLEDGE HUB
// ============================================================

export interface KnowledgeArticle {
  id: UUID;
  tenantId: UUID;
  authorId: UUID;
  author: User;
  title: string;
  slug: string;
  content: string;
  richContent?: Record<string, unknown>;
  excerpt?: string;
  coverImageUrl?: string;
  categoryId?: UUID;
  category?: KnowledgeCategory;
  tags: string[];
  departmentId?: UUID;
  isPublished: boolean;
  version: number;
  viewCount: number;
  likeCount: number;
  aiSummary?: string;
  aiTags?: string[];
  relatedArticleIds: UUID[];
  publishedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface KnowledgeCategory {
  id: UUID;
  tenantId: UUID;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  color?: string;
  parentId?: UUID;
  articleCount: number;
}

// ============================================================
// DOCUMENTS
// ============================================================

export const DocumentType = {
  FILE: 'FILE',
  FOLDER: 'FOLDER',
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

export interface Document {
  id: UUID;
  tenantId: UUID;
  uploaderId: UUID;
  uploader: User;
  name: string;
  type: DocumentType;
  mimeType?: string;
  size?: number;
  url?: string;
  thumbnailUrl?: string;
  parentId?: UUID;
  departmentId?: UUID;
  tags: string[];
  aiSummary?: string;
  aiTags?: string[];
  version: number;
  downloadCount: number;
  isPublic: boolean;
  expiresAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ============================================================
// RECOGNITION
// ============================================================

export interface Recognition {
  id: UUID;
  tenantId: UUID;
  giverId: UUID;
  giver: User;
  receiverId: UUID;
  receiver: User;
  badgeId: UUID;
  badge: Badge;
  message: string;
  points: number;
  isPublic: boolean;
  reactionCounts: ReactionCounts;
  createdAt: ISODateString;
}

export interface Badge {
  id: UUID;
  tenantId: UUID;
  name: string;
  description: string;
  iconUrl: string;
  color: string;
  points: number;
  category: BadgeCategory;
}

export const BadgeCategory = {
  PERFORMANCE: 'PERFORMANCE',
  COLLABORATION: 'COLLABORATION',
  INNOVATION: 'INNOVATION',
  LEADERSHIP: 'LEADERSHIP',
  CULTURE: 'CULTURE',
  MILESTONE: 'MILESTONE',
} as const;

export type BadgeCategory = typeof BadgeCategory[keyof typeof BadgeCategory];

// ============================================================
// EVENTS
// ============================================================

export interface Event {
  id: UUID;
  tenantId: UUID;
  organizerId: UUID;
  organizer: User;
  title: string;
  description: string;
  coverImageUrl?: string;
  location?: string;
  isVirtual: boolean;
  meetingUrl?: string;
  startAt: ISODateString;
  endAt: ISODateString;
  departmentId?: UUID;
  rsvpCount: number;
  maxAttendees?: number;
  tags: string[];
  status: EventStatus;
  createdAt: ISODateString;
}

export const EventStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type EventStatus = typeof EventStatus[keyof typeof EventStatus];

// ============================================================
// NOTIFICATIONS
// ============================================================

export const NotificationType = {
  POST_REACTION: 'POST_REACTION',
  POST_COMMENT: 'POST_COMMENT',
  COMMENT_REPLY: 'COMMENT_REPLY',
  MENTION: 'MENTION',
  RECOGNITION_RECEIVED: 'RECOGNITION_RECEIVED',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  EVENT_INVITE: 'EVENT_INVITE',
  DOCUMENT_SHARED: 'DOCUMENT_SHARED',
  SYSTEM: 'SYSTEM',
  AI_DIGEST: 'AI_DIGEST',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface Notification {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  actorId?: UUID;
  actor?: User;
  entityId?: UUID;
  entityType?: string;
  createdAt: ISODateString;
}

// ============================================================
// SEARCH
// ============================================================

export const SearchEntityType = {
  USER: 'USER',
  POST: 'POST',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  ARTICLE: 'ARTICLE',
  DOCUMENT: 'DOCUMENT',
  EVENT: 'EVENT',
} as const;

export type SearchEntityType = typeof SearchEntityType[keyof typeof SearchEntityType];

export interface SearchResult {
  id: UUID;
  type: SearchEntityType;
  title: string;
  excerpt?: string;
  avatarUrl?: string;
  url: string;
  score: number;
  highlightedContent?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: ISODateString;
  path: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================
// WEBSOCKET EVENTS
// ============================================================

export const WsEvent = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_TENANT: 'join:tenant',
  JOIN_DEPARTMENT: 'join:department',

  // Presence
  PRESENCE_UPDATE: 'presence:update',
  PRESENCE_BULK: 'presence:bulk',

  // Feed
  POST_CREATED: 'post:created',
  POST_UPDATED: 'post:updated',
  POST_DELETED: 'post:deleted',
  POST_REACTION: 'post:reaction',

  // Comments
  COMMENT_CREATED: 'comment:created',
  COMMENT_UPDATED: 'comment:updated',
  COMMENT_DELETED: 'comment:deleted',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',

  // Notifications
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',

  // Announcements
  ANNOUNCEMENT_PUBLISHED: 'announcement:published',

  // Recognition
  RECOGNITION_GIVEN: 'recognition:given',
} as const;

export type WsEvent = typeof WsEvent[keyof typeof WsEvent];

export interface WsPresencePayload {
  userId: UUID;
  status: OnlineStatus;
  lastSeenAt: ISODateString;
}

export interface WsTypingPayload {
  userId: UUID;
  postId: UUID;
  user: Pick<User, 'id' | 'displayName' | 'avatarUrl'>;
}
