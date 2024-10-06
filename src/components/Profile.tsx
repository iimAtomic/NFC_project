import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import { User, Phone, Briefcase, Link, Image } from 'lucide-react'

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    name: '',
    profession: '',
    phone: '',
    image_url: '',
    social_links: { linkedin: '', twitter: '', github: '' }
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      if (data) setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith('social_')) {
      const socialNetwork = name.split('_')[1]
      setProfile(prev => ({
        ...prev,
        social_links: { ...prev.social_links, [socialNetwork]: value }
      }))
    } else {
      setProfile(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...profile })

      if (error) throw error
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile. Please try again.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="profession"
            value={profile.profession}
            onChange={handleChange}
            placeholder="Profession"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="h-5 w-5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Image className="h-5 w-5 text-gray-400" />
          <input
            type="url"
            name="image_url"
            value={profile.image_url}
            onChange={handleChange}
            placeholder="Profile Image URL"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Link className="h-5 w-5 text-gray-400" />
          <input
            type="url"
            name="social_linkedin"
            value={profile.social_links.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Link className="h-5 w-5 text-gray-400" />
          <input
            type="url"
            name="social_twitter"
            value={profile.social_links.twitter}
            onChange={handleChange}
            placeholder="Twitter URL"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Link className="h-5 w-5 text-gray-400" />
          <input
            type="url"
            name="social_github"
            value={profile.social_links.github}
            onChange={handleChange}
            placeholder="GitHub URL"
            className="border p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  )
}

export default Profile