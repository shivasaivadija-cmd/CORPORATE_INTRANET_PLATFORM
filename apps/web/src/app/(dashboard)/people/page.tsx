'use client';

import { useState, useEffect } from 'react';
import { Search, Users, Building2, Award, Mail, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { usePresenceStore } from '@/store/presence.store';
import { apiClient } from '@/lib/api-client';

export default function PeoplePage() {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const { data: users } = useQuery({
    queryKey: ['users', search, departmentFilter],
    queryFn: () => api.get('/users', { params: { search, departmentId: departmentFilter, limit: 50 } }),
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/departments'),
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/users/leaderboard'),
  });

  const { getPresence } = usePresenceStore();

  // Fetch presence for all users
  useEffect(() => {
    if (users?.data?.length) {
      const userIds = users.data.map((u: any) => u.id);
      apiClient.post('/users/presence', { userIds }).catch(() => {});
    }
  }, [users?.data]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">People Directory</h1>
          <p className="text-muted-foreground mt-1">Discover and connect with colleagues</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{users?.data?.length || 0} people</span>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, role, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-w-[200px]"
        >
          <option value="">All Departments</option>
          {Array.isArray(departments?.data) && departments.data.map((dept: any) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {Array.isArray(users?.data) && users.data.length > 0 ? (
            users.data.map((user: any) => (
              <div
                key={user.id}
                className="bg-card border border-border rounded-xl p-5 hover:border-purple-500/50 transition-all"
              >
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <img src={user.avatarUrl || '/default-avatar.png'} alt={user.displayName} className="w-14 h-14 rounded-full object-cover" />
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-card rounded-full ${
                      getPresence(user.id).status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">{user.displayName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      <Briefcase className="w-3 h-3" />
                      <span>{user.jobTitle || 'Employee'}</span>
                    </div>
                    {user.department && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <Building2 className="w-3 h-3" />
                        <span>{user.department.name}</span>
                      </div>
                    )}
                    {user.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {user.skills.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full">{skill}</span>
                        ))}
                        {user.skills.length > 3 && <span className="text-xs text-muted-foreground">+{user.skills.length - 3}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                      <Mail className="w-4 h-4" />
                    </button>
                    {user.recognitionPoints > 0 && (
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <Award className="w-3.5 h-3.5" />
                        <span>{user.recognitionPoints}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No people found</p>
            </div>
          )}
        </div>

        <div>
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold">Top Contributors</h2>
            </div>
            <div className="space-y-3">
              {Array.isArray(leaderboard?.data) && leaderboard.data.length > 0 ? (
                leaderboard.data.slice(0, 5).map((user: any, i: number) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <img src={user.avatarUrl || '/default-avatar.png'} alt={user.displayName} className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.department?.name}</p>
                    </div>
                    <span className="text-sm font-semibold text-amber-400 flex-shrink-0">{user.recognitionPoints}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No leaderboard data</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
