'use client';

import { useAuthStore } from '@/store/auth.store';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();

  const sections = [
    { icon: User, title: 'Profile Settings', desc: 'Update your personal information' },
    { icon: Bell, title: 'Notifications', desc: 'Manage notification preferences' },
    { icon: Shield, title: 'Privacy & Security', desc: 'Control your privacy settings' },
    { icon: Palette, title: 'Appearance', desc: 'Customize your theme' },
    { icon: Globe, title: 'Language & Region', desc: 'Set your language preferences' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/20 p-6 backdrop-blur-xl hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
