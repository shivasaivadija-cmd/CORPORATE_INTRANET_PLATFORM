'use client';

import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import {
  Mail,
  Briefcase,
  MapPin,
  Clock,
  Award,
  TrendingUp,
  Users,
  MessageSquare,
  Shield,
  Building2,
  Globe,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN:      { label: 'Super Admin',      color: 'from-red-500 to-orange-500' },
  TENANT_ADMIN:     { label: 'Admin',             color: 'from-purple-500 to-indigo-500' },
  DEPARTMENT_ADMIN: { label: 'Dept. Admin',       color: 'from-blue-500 to-cyan-500' },
  MODERATOR:        { label: 'Moderator',         color: 'from-yellow-500 to-orange-500' },
  EMPLOYEE:         { label: 'Employee',          color: 'from-green-500 to-emerald-500' },
  GUEST:            { label: 'Guest',             color: 'from-gray-400 to-gray-500' },
};

export default function ProfilePage() {
  const { user } = useAuthStore();

  // Fetch fresh full profile from API so we always have latest data
  const { data: profile } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users/me');
      return data.data;
    },
    enabled: !!user,
  });

  if (!profile) return null;

  const isAdmin = ['SUPER_ADMIN', 'TENANT_ADMIN', 'MODERATOR'].includes(profile.role);
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const displayName = profile.displayName || fullName || (isAdmin ? 'Admin' : profile.email);
  const roleInfo = ROLE_LABELS[profile.role] ?? ROLE_LABELS.EMPLOYEE;

  const postCount   = profile._count?.posts ?? 0;
  const kudosCount  = profile._count?.recognitionsReceived ?? 0;
  const points      = profile.recognitionPoints ?? 0;

  const stats = [
    { icon: MessageSquare, label: 'Posts',   value: String(postCount),  color: 'from-orange-500 to-red-500' },
    { icon: Award,         label: 'Kudos',   value: String(kudosCount), color: 'from-yellow-500 to-orange-500' },
    { icon: TrendingUp,    label: 'Points',  value: String(points),     color: 'from-green-500 to-emerald-500' },
    { icon: Shield,        label: 'Role',    value: roleInfo.label,     color: roleInfo.color },
  ];

  const skills: string[] = Array.isArray(profile.skills) && profile.skills.length > 0
    ? profile.skills
    : [];

  const social = profile.socialLinks ?? {};

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto max-w-4xl space-y-5 p-6">

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/40 from-background via-background to-muted/30 rounded-3xl border bg-gradient-to-br p-8 backdrop-blur-xl"
        >
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="relative">
              <Avatar className="ring-primary/20 h-28 w-28 shadow-2xl ring-4">
                <AvatarImage src={profile.avatarUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-3xl font-bold text-white">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              {/* Role badge on avatar */}
              <span className={`absolute -bottom-1 -right-1 rounded-full bg-gradient-to-r ${roleInfo.color} px-2 py-0.5 text-[10px] font-bold text-white shadow-lg`}>
                {roleInfo.label}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                {displayName}
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
                {profile.jobTitle || (isAdmin ? 'Administrator' : 'Employee')}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                {profile.department && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>{profile.department.name}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.timezone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{profile.timezone}</span>
                  </div>
                )}
              </div>

              {/* Social links */}
              {(social.linkedin || social.github || social.twitter || social.website) && (
                <div className="mt-3 flex items-center gap-3">
                  {social.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-blue-500 transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {social.github && (
                    <a href={social.github} target="_blank" rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {social.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-sky-500 transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {social.website && (
                    <a href={social.website} target="_blank" rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors">
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="border-border/40 from-background to-muted/20 rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-xl"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="border-border/40 from-background to-muted/20 rounded-3xl border bg-gradient-to-br p-6 backdrop-blur-xl"
        >
          <h2 className="mb-3 text-lg font-bold">About</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {profile.bio || 'No bio available.'}
          </p>
        </motion.div>

        {/* Skills */}
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-border/40 from-background to-muted/20 rounded-3xl border bg-gradient-to-br p-6 backdrop-blur-xl"
          >
            <h2 className="mb-3 text-lg font-bold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-3 py-1 text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Manager info */}
        {(profile as any).manager && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            className="border-border/40 from-background to-muted/20 rounded-3xl border bg-gradient-to-br p-6 backdrop-blur-xl"
          >
            <h2 className="mb-3 text-lg font-bold">Reports To</h2>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={(profile as any).manager.avatarUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-600 text-xs font-bold text-white">
                  {getInitials((profile as any).manager.displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">{(profile as any).manager.displayName}</span>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
