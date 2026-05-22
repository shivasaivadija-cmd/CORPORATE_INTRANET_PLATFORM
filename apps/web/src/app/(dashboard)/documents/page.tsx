'use client';

import { useState } from 'react';
import { FolderOpen, FileText, Upload, Plus, Download, Trash2, Search, Grid3x3, List, File, Folder, Calendar, User, FileImage, FileVideo } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: documentsData, isLoading } = useQuery({
    queryKey: ['documents', currentFolder],
    queryFn: async () => {
      const response = await apiClient.get('/documents', { 
        params: { parentId: currentFolder, limit: 100 } 
      });
      return response.data;
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiClient.post('/documents/folder', { 
        name, 
        parentId: currentFolder 
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setShowCreateFolder(false);
      setFolderName('');
    },
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.startsWith('image/')) return FileImage;
    if (mimeType?.startsWith('video/')) return FileVideo;
    if (mimeType?.includes('pdf')) return FileText;
    return FileText;
  };

  // Safe array access with validation
  const documents = Array.isArray(documentsData?.data) ? documentsData.data : [];
  
  const filteredDocs = documents.filter((doc: any) =>
    doc?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const folders = filteredDocs.filter((d: any) => d.type === 'FOLDER');
  const files = filteredDocs.filter((d: any) => d.type === 'FILE');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Documents</h1>
          <p className="text-muted-foreground mt-1">Employee handbooks, policies, and important files - easily accessible</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateFolder(true)}
            className="px-4 py-2 bg-card border border-border rounded-lg hover:border-blue-500/50 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Folder
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Breadcrumb & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setCurrentFolder(null)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Documents
          </button>
          {currentFolder && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">Current Folder</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-card border border-border'}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-card border border-border'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access - Important Documents */}
      <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Important Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'Employee Handbook 2024.pdf', icon: FileText, color: 'text-red-400' },
            { name: 'Company Policies.pdf', icon: FileText, color: 'text-red-400' },
            { name: 'Code of Conduct.pdf', icon: FileText, color: 'text-red-400' },
          ].map((doc, i) => (
            <motion.button
              key={doc.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-blue-500/50 transition-all text-left"
            >
              <doc.icon className={`w-8 h-8 ${doc.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">Updated recently</p>
              </div>
              <Download className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading documents...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && documents.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
          <p className="text-muted-foreground">Upload files or create folders to get started</p>
        </div>
      )}

      {/* Folders */}
      {!isLoading && folders.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Folders
          </h3>
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
            {folders.map((folder: any, i: number) => (
              <motion.button
                key={folder.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => setCurrentFolder(folder.id)}
                className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-blue-500/50 transition-all group"
              >
                <FolderOpen className="w-12 h-12 text-blue-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-sm font-medium text-center truncate w-full">{folder.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {!isLoading && files.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <File className="w-4 h-4" />
            Files
          </h3>
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
            {files.map((file: any, i: number) => {
              const FileIcon = getFileIcon(file.mimeType);
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-blue-500/50 transition-all group cursor-pointer"
                >
                  <FileIcon className="w-12 h-12 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                  <span className="text-sm font-medium text-center truncate w-full">{file.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(file.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateFolder(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Create New Folder</h2>
            <input
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateFolder(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => createFolderMutation.mutate(folderName)}
                disabled={!folderName || createFolderMutation.isPending}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
