import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, Camera, Video, Hash, Send, MoreHorizontal } from 'lucide-react'
import { Player, Team, Tournament } from '../../types'

interface SocialPost {
  id: string
  content: string
  media: string[]
  hashtags: string[]
  likes: number
  comments: number
  shares: number
  createdAt: string
  player?: Player
  team?: Team
  tournament?: Tournament
  isLiked?: boolean
}

interface SocialWallProps {
  posts: SocialPost[]
  currentUser?: Player
  onLike?: (postId: string) => void
  onComment?: (postId: string, comment: string) => void
  onShare?: (postId: string) => void
  onCreatePost?: (post: Omit<SocialPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares'>) => void
}

export const SocialWall: React.FC<SocialWallProps> = ({
  posts,
  currentUser,
  onLike,
  onComment,
  onShare,
  onCreatePost
}) => {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostHashtags, setNewPostHashtags] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<File[]>([])
  const [commentText, setCommentText] = useState('')
  const [activePostId, setActivePostId] = useState<string | null>(null)

  const handleCreatePost = () => {
    if (!newPostContent.trim() && selectedMedia.length === 0) return

    const hashtags = newPostHashtags
      .split(' ')
      .filter(tag => tag.startsWith('#'))
      .map(tag => tag.substring(1))

    onCreatePost?.({
      content: newPostContent,
      media: [], // URLs will be handled by backend
      hashtags,
      player: currentUser,
      team: currentUser?.team ? {
        id: currentUser.team.id,
        name: currentUser.team.name,
        logo: currentUser.team.logo || '',
        players: [],
        coach: '',
        coachName: undefined,
        wins: 0,
        draws: 0,
        losses: 0,
        goals: 0,
        goalsAgainst: 0,
        matches: 0,
        createdAt: new Date().toISOString(),
        averageLevel: 0,
        playerLevels: {}
      } : undefined,
      tournament: undefined
    })

    setNewPostContent('')
    setNewPostHashtags('')
    setSelectedMedia([])
    setShowCreatePost(false)
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedMedia(prev => [...prev, ...files])
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`
  }

  const renderMedia = (media: string[]) => {
    if (media.length === 0) return null

    if (media.length === 1) {
      return (
        <div className="rounded-lg overflow-hidden">
          <img src={media[0]} alt="Post media" className="w-full h-64 object-cover" />
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
        {media.slice(0, 4).map((url, index) => (
          <div key={index} className="relative">
            <img src={url} alt={`Post media ${index + 1}`} className="w-full h-32 object-cover" />
            {index === 3 && media.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold">+{media.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Créer un post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {currentUser?.name?.charAt(0) || 'U'}
            </span>
          </div>
          
          <div className="flex-1">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full text-left p-3 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Partagez votre expérience...
            </button>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
            <Camera className="w-5 h-5" />
            <span>Photo</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
            <Video className="w-5 h-5" />
            <span>Vidéo</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-500 transition-colors">
            <Hash className="w-5 h-5" />
            <span>Hashtag</span>
          </button>
        </div>
      </motion.div>

      {/* Modal de création de post */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Créer un post</h3>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Partagez votre expérience..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <input
                type="text"
                value={newPostHashtags}
                onChange={(e) => setNewPostHashtags(e.target.value)}
                placeholder="#GoalOfTheDay #7oumaLigue"
                className="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              {/* Media preview */}
              {selectedMedia.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {selectedMedia.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Selected media ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setSelectedMedia(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                    <Camera className="w-6 h-6 text-gray-500 hover:text-blue-500" />
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                    <Video className="w-6 h-6 text-gray-500 hover:text-green-500" />
                  </label>
                </div>

                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() && selectedMedia.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publier
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts */}
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Header du post */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {post.player?.name?.charAt(0) || post.team?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">
                      {post.player?.name || post.team?.name || 'Utilisateur'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                    </div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenu du post */}
            <div className="p-4">
              <p className="text-gray-800 mb-3">{post.content}</p>
              
              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-blue-500 hover:text-blue-600 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Media */}
              {renderMedia(post.media)}
            </div>

            {/* Actions */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => onLike?.(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                  
                  <button
                    onClick={() => onShare?.(post.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </div>

              {/* Section commentaires */}
              <AnimatePresence>
                {activePostId === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-100"
                  >
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && commentText.trim()) {
                            onComment?.(post.id, commentText)
                            setCommentText('')
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (commentText.trim()) {
                            onComment?.(post.id, commentText)
                            setCommentText('')
                          }
                        }}
                        className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 