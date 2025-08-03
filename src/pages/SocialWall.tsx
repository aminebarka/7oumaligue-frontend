import React, { useState, useEffect } from 'react'
import { SocialWall as SocialWallComponent } from '../components/Social/SocialWall'
import { Player, Team, Tournament } from '../types'
import { socialService, SocialPost } from '../services/advancedApi'

// Suppression de l'interface locale car elle est maintenant importée

const SocialWall: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentUser: Player = {
    id: 'current',
    name: 'Utilisateur Actuel',
    position: 'Attaquant',
    level: 4,
    age: 26,
    teamId: '1'
  }

  // Charger les posts depuis l'API
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const postsData = await socialService.getPosts()
        setPosts(postsData)
        setError(null)
      } catch (error) {
        console.error('Erreur lors du chargement des posts:', error)
        setError('Erreur lors du chargement des posts')
        // Fallback vers des données de test
        setPosts([
          {
            id: '1',
            content: 'Incroyable match aujourd\'hui ! Notre équipe a gagné 3-1 ! ⚽🔥',
            media: [],
            hashtags: ['GoalOfTheDay', '7oumaLigue', 'Victory'],
            likes: 24,
            comments: 8,
            shares: 3,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const handleLike = async (postId: string) => {
    try {
      await socialService.toggleLike(postId)
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked 
            }
          : post
      ))
    } catch (error) {
      console.error('Erreur lors du like:', error)
    }
  }

  const handleComment = async (postId: string, comment: string) => {
    try {
      await socialService.addComment(postId, comment)
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      ))
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error)
    }
  }

  const handleShare = async (postId: string) => {
    try {
      await socialService.sharePost(postId)
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, shares: post.shares + 1 }
          : post
      ))
    } catch (error) {
      console.error('Erreur lors du partage:', error)
    }
  }

  const handleCreatePost = async (newPost: Omit<SocialPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares'>) => {
    try {
      const post = await socialService.createPost(newPost)
      setPosts(prev => [post, ...prev])
    } catch (error) {
      console.error('Erreur lors de la création du post:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Mur Social - 7ouma Ligue
          </h1>
          <p className="text-gray-600">
            Partagez vos moments forts et suivez la communauté
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <SocialWallComponent
            posts={posts}
            currentUser={currentUser}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onCreatePost={handleCreatePost}
          />
        )}
      </div>
    </div>
  )
}

export default SocialWall 