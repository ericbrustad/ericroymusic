'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaMusic,
  FaNewspaper,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaImage,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaEye,
  FaArrowLeft,
} from 'react-icons/fa';

type Tab = 'dashboard' | 'hero' | 'singles' | 'artists' | 'posts' | 'settings';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: FaHome },
    { id: 'hero' as Tab, label: 'Hero', icon: FaImage },
    { id: 'singles' as Tab, label: 'Singles', icon: FaMusic },
    { id: 'artists' as Tab, label: 'Artists', icon: FaUsers },
    { id: 'posts' as Tab, label: 'Blog Posts', icon: FaNewspaper },
    { id: 'settings' as Tab, label: 'Settings', icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Nav */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <FaMusic className="text-red-600 text-xl" />
            <h1 className="text-lg font-bold text-gray-900">Eric Roy Music - Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
              <FaEye /> View Site
            </a>
            <span className="text-sm text-gray-500">{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="text-gray-500 hover:text-red-600 transition-colors"
              title="Sign out"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'hero' && <HeroTab />}
        {activeTab === 'singles' && <SinglesTab />}
        {activeTab === 'artists' && <ArtistsTab />}
        {activeTab === 'posts' && <PostsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

/* ===== DASHBOARD TAB ===== */
function DashboardTab() {
  const [stats, setStats] = useState({ singles: 0, artists: 0, posts: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/singles').then(r => r.json()),
      fetch('/api/admin/artists').then(r => r.json()),
      fetch('/api/admin/posts').then(r => r.json()),
    ]).then(([singles, artists, posts]) => {
      setStats({
        singles: singles.length,
        artists: artists.length,
        posts: posts.length,
      });
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FaMusic className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.singles}</p>
              <p className="text-sm text-gray-500">Singles / Releases</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.artists}</p>
              <p className="text-sm text-gray-500">Artists</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaNewspaper className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.posts}</p>
              <p className="text-sm text-gray-500">Blog Posts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 admin-card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <p className="text-sm text-gray-500">Use the tabs above to manage your content. Each section allows you to create, edit, and delete items.</p>
        </div>
      </div>
    </div>
  );
}

/* ===== HERO TAB ===== */
function HeroTab() {
  const [heroes, setHeroes] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHeroes = useCallback(async () => {
    const res = await fetch('/api/admin/heroes');
    const data = await res.json();
    setHeroes(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchHeroes(); }, [fetchHeroes]);

  const handleSave = async () => {
    const method = editing.id ? 'PUT' : 'POST';
    await fetch('/api/admin/heroes', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    fetchHeroes();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this hero section?')) return;
    await fetch(`/api/admin/heroes?id=${id}`, { method: 'DELETE' });
    fetchHeroes();
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  if (editing) {
    return (
      <div className="admin-card max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-700">
            <FaArrowLeft />
          </button>
          <h2 className="text-xl font-bold text-gray-900">{editing.id ? 'Edit Hero' : 'New Hero'}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              className="admin-input text-gray-900"
              value={editing.title || ''}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              className="admin-input text-gray-900"
              value={editing.subtitle || ''}
              onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
            <input
              className="admin-input text-gray-900"
              value={editing.background_image || ''}
              onChange={(e) => setEditing({ ...editing, background_image: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
            <input
              className="admin-input text-gray-900"
              value={editing.cta_text || ''}
              onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
            <input
              className="admin-input text-gray-900"
              value={editing.cta_link || ''}
              onChange={(e) => setEditing({ ...editing, cta_link: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                className="admin-input text-gray-900"
                value={editing.sort_order || 0}
                onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editing.is_active === true}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                />
                Active
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="admin-btn flex items-center gap-2">
              <FaSave /> Save
            </button>
            <button onClick={() => setEditing(null)} className="admin-btn-secondary flex items-center gap-2">
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hero Sections</h2>
        <button
          onClick={() => setEditing({ title: '', subtitle: '', cta_text: '', cta_link: '', is_active: 1, sort_order: 0 })}
          className="admin-btn flex items-center gap-2"
        >
          <FaPlus /> Add Hero
        </button>
      </div>
      <div className="space-y-4">
        {heroes.map((hero: any) => (
          <div key={hero.id} className="admin-card flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{hero.title}</h3>
              <p className="text-sm text-gray-500">{hero.subtitle}</p>
              <span className={`text-xs px-2 py-1 rounded ${hero.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {hero.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(hero)} className="text-blue-600 hover:text-blue-800 p-2">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(hero.id)} className="text-red-600 hover:text-red-800 p-2">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {heroes.length === 0 && <p className="text-gray-500 text-center py-8">No hero sections yet.</p>}
      </div>
    </div>
  );
}

/* ===== SINGLES TAB ===== */
function SinglesTab() {
  const [singles, setSingles] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSingles = useCallback(async () => {
    const res = await fetch('/api/admin/singles');
    const data = await res.json();
    setSingles(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSingles(); }, [fetchSingles]);

  const handleSave = async () => {
    const method = editing.id ? 'PUT' : 'POST';
    await fetch('/api/admin/singles', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    fetchSingles();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this single?')) return;
    await fetch(`/api/admin/singles?id=${id}`, { method: 'DELETE' });
    fetchSingles();
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  if (editing) {
    return (
      <div className="admin-card max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-700">
            <FaArrowLeft />
          </button>
          <h2 className="text-xl font-bold text-gray-900">{editing.id ? 'Edit Single' : 'New Single'}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              className="admin-input text-gray-900"
              value={editing.title || ''}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="admin-input text-gray-900"
              rows={3}
              value={editing.description || ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input
              className="admin-input text-gray-900"
              value={editing.cover_image || ''}
              onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apple Music Link</label>
            <input
              className="admin-input text-gray-900"
              value={editing.apple_music_link || ''}
              onChange={(e) => setEditing({ ...editing, apple_music_link: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link</label>
            <input
              className="admin-input text-gray-900"
              value={editing.youtube_link || ''}
              onChange={(e) => setEditing({ ...editing, youtube_link: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buy Link (Stripe, etc.)</label>
            <input
              className="admin-input text-gray-900"
              value={editing.buy_link || ''}
              onChange={(e) => setEditing({ ...editing, buy_link: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buy Button Text</label>
            <input
              className="admin-input text-gray-900"
              value={editing.buy_text || ''}
              onChange={(e) => setEditing({ ...editing, buy_text: e.target.value })}
              placeholder="Buy Now"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                className="admin-input text-gray-900"
                value={editing.sort_order || 0}
                onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editing.is_latest === true}
                  onChange={(e) => setEditing({ ...editing, is_latest: e.target.checked })}
                />
                Latest Single
              </label>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editing.is_active === true}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                />
                Active
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="admin-btn flex items-center gap-2">
              <FaSave /> Save
            </button>
            <button onClick={() => setEditing(null)} className="admin-btn-secondary flex items-center gap-2">
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Singles / Releases</h2>
        <button
          onClick={() => setEditing({ title: '', is_active: 1, is_latest: 0, sort_order: 0 })}
          className="admin-btn flex items-center gap-2"
        >
          <FaPlus /> Add Single
        </button>
      </div>
      <div className="space-y-4">
        {singles.map((single: any) => (
          <div key={single.id} className="admin-card flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{single.title}</h3>
              <p className="text-sm text-gray-500">{single.description}</p>
              <div className="flex gap-2 mt-1">
                {single.is_latest === true && (
                  <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Latest</span>
                )}
                <span className={`text-xs px-2 py-1 rounded ${single.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {single.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(single)} className="text-blue-600 hover:text-blue-800 p-2">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(single.id)} className="text-red-600 hover:text-red-800 p-2">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {singles.length === 0 && <p className="text-gray-500 text-center py-8">No singles yet.</p>}
      </div>
    </div>
  );
}

/* ===== ARTISTS TAB ===== */
function ArtistsTab() {
  const [artists, setArtists] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchArtists = useCallback(async () => {
    const res = await fetch('/api/admin/artists');
    const data = await res.json();
    setArtists(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchArtists(); }, [fetchArtists]);

  const handleSave = async () => {
    const method = editing.id ? 'PUT' : 'POST';
    await fetch('/api/admin/artists', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    fetchArtists();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this artist?')) return;
    await fetch(`/api/admin/artists?id=${id}`, { method: 'DELETE' });
    fetchArtists();
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  if (editing) {
    return (
      <div className="admin-card max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-700">
            <FaArrowLeft />
          </button>
          <h2 className="text-xl font-bold text-gray-900">{editing.id ? 'Edit Artist' : 'New Artist'}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              className="admin-input text-gray-900"
              value={editing.name || ''}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Song Title</label>
            <input
              className="admin-input text-gray-900"
              value={editing.song_title || ''}
              onChange={(e) => setEditing({ ...editing, song_title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="admin-input text-gray-900"
              rows={3}
              value={editing.description || ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              className="admin-input text-gray-900"
              value={editing.image || ''}
              onChange={(e) => setEditing({ ...editing, image: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link</label>
            <input
              className="admin-input text-gray-900"
              value={editing.youtube_link || ''}
              onChange={(e) => setEditing({ ...editing, youtube_link: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SoundCloud Link</label>
            <input
              className="admin-input text-gray-900"
              value={editing.soundcloud_link || ''}
              onChange={(e) => setEditing({ ...editing, soundcloud_link: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apple Music Link</label>
            <input
              className="admin-input text-gray-900"
              value={editing.apple_music_link || ''}
              onChange={(e) => setEditing({ ...editing, apple_music_link: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                className="admin-input text-gray-900"
                value={editing.sort_order || 0}
                onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editing.is_active === true}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                />
                Active
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="admin-btn flex items-center gap-2">
              <FaSave /> Save
            </button>
            <button onClick={() => setEditing(null)} className="admin-btn-secondary flex items-center gap-2">
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Artists</h2>
        <button
          onClick={() => setEditing({ name: '', is_active: 1, sort_order: 0 })}
          className="admin-btn flex items-center gap-2"
        >
          <FaPlus /> Add Artist
        </button>
      </div>
      <div className="space-y-4">
        {artists.map((artist: any) => (
          <div key={artist.id} className="admin-card flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{artist.name}</h3>
              <p className="text-sm text-gray-500">{artist.song_title}</p>
              <span className={`text-xs px-2 py-1 rounded ${artist.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {artist.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(artist)} className="text-blue-600 hover:text-blue-800 p-2">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(artist.id)} className="text-red-600 hover:text-red-800 p-2">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {artists.length === 0 && <p className="text-gray-500 text-center py-8">No artists yet.</p>}
      </div>
    </div>
  );
}

/* ===== POSTS TAB ===== */
function PostsTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const res = await fetch('/api/admin/posts');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSave = async () => {
    const method = editing.id ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/posts', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
      return;
    }
    setEditing(null);
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  if (editing) {
    return (
      <div className="admin-card max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-700">
            <FaArrowLeft />
          </button>
          <h2 className="text-xl font-bold text-gray-900">{editing.id ? 'Edit Post' : 'New Post'}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              className="admin-input text-gray-900"
              value={editing.title || ''}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (auto-generated if empty)</label>
            <input
              className="admin-input text-gray-900"
              value={editing.slug || ''}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              placeholder="auto-generated-from-title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              className="admin-input text-gray-900"
              rows={3}
              value={editing.excerpt || ''}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              placeholder="Brief description shown in blog listings"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea
              className="admin-input text-gray-900"
              rows={12}
              value={editing.content || ''}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              placeholder="Full blog post content (use empty lines for paragraphs)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
            <input
              className="admin-input text-gray-900"
              value={editing.featured_image || ''}
              onChange={(e) => setEditing({ ...editing, featured_image: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                className="admin-input text-gray-900"
                value={editing.author || ''}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                className="admin-input text-gray-900"
                value={editing.category || ''}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
              <input
                type="date"
                className="admin-input text-gray-900"
                value={editing.published_at ? editing.published_at.split('T')[0] : ''}
                onChange={(e) => setEditing({ ...editing, published_at: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editing.is_published === true}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                />
                Published
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="admin-btn flex items-center gap-2">
              <FaSave /> Save
            </button>
            <button onClick={() => setEditing(null)} className="admin-btn-secondary flex items-center gap-2">
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
        <button
          onClick={() => setEditing({
            title: '',
            content: '',
            author: 'Erix Coach and Car',
            category: 'Uncategorized',
            is_published: 1,
            published_at: new Date().toISOString().split('T')[0]
          })}
          className="admin-btn flex items-center gap-2"
        >
          <FaPlus /> New Post
        </button>
      </div>
      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post.id} className="admin-card flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{post.title}</h3>
              <p className="text-sm text-gray-500">
                {post.author} &middot; {new Date(post.published_at).toLocaleDateString()} &middot; {post.category}
              </p>
              <div className="flex gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {post.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                className="text-gray-500 hover:text-gray-700 p-2"
                title="View post"
              >
                <FaEye />
              </a>
              <button onClick={() => setEditing(post)} className="text-blue-600 hover:text-blue-800 p-2">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-800 p-2">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-gray-500 text-center py-8">No blog posts yet.</p>}
      </div>
    </div>
  );
}

/* ===== SETTINGS TAB ===== */
function SettingsTab() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const obj: Record<string, string> = {};
        data.forEach((item: any) => { obj[item.key] = item.value; });
        setSettings(obj);
      } else {
        console.error('Settings fetch returned non-array:', data);
      }
    } catch (e) {
      console.error('Settings fetch error:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const items = Object.entries(settings).map(([key, value]) => ({ key, value }));
      console.log('Saving settings:', items.length, 'items');
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(items),
      });
      const text = await res.text();
      console.log('Save response:', res.status, text);
      let data: any = {};
      try { data = JSON.parse(text); } catch {}
      if (res.ok) {
        setMessage(`Settings saved! (${data.count || 0} items updated)`);
        // Re-fetch to verify persistence
        await fetchSettings();
      } else {
        setMessage(`Error ${res.status}: ${data.error || text || res.statusText}`);
        alert(`Save failed!\nStatus: ${res.status}\nResponse: ${text}`);
      }
    } catch (err: any) {
      setMessage(`Network error: ${err.message}`);
      alert(`Save network error: ${err.message}`);
    }
    setSaving(false);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  const settingGroups = [
    {
      title: 'General',
      fields: [
        { key: 'site_name', label: 'Site Name' },
        { key: 'site_tagline', label: 'Tagline' },
        { key: 'site_description', label: 'Site Description', type: 'textarea' },
        { key: 'welcome_text', label: 'Welcome Text (Music Section)' },
      ],
    },
    {
      title: 'Contact',
      fields: [
        { key: 'contact_address', label: 'Address' },
        { key: 'contact_phone', label: 'Phone' },
        { key: 'contact_email', label: 'Email' },
        { key: 'contact_description', label: 'Contact Description', type: 'textarea' },
      ],
    },
    {
      title: 'Social Links',
      fields: [
        { key: 'social_facebook', label: 'Facebook URL' },
        { key: 'social_twitter', label: 'Twitter URL' },
        { key: 'social_youtube', label: 'YouTube URL' },
        { key: 'social_instagram', label: 'Instagram URL' },
        { key: 'social_pinterest', label: 'Pinterest URL' },
        { key: 'social_soundcloud', label: 'SoundCloud URL' },
        { key: 'social_apple_music', label: 'Apple Music URL' },
      ],
    },
    {
      title: 'Music Links',
      fields: [
        { key: 'apple_music_artist_link', label: 'Apple Music Artist Page' },
        { key: 'youtube_channel', label: 'YouTube Channel' },
      ],
    },
    {
      title: 'Newsletter',
      fields: [
        { key: 'newsletter_heading', label: 'Newsletter Heading' },
        { key: 'newsletter_subheading', label: 'Newsletter Subheading' },
      ],
    },
  ];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn flex items-center gap-2"
        >
          <FaSave /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-md text-sm ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="space-y-8">
        {settingGroups.map((group) => (
          <div key={group.title} className="admin-card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{group.title}</h3>
            <div className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label htmlFor={`setting-${field.key}`} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={`setting-${field.key}`}
                      name={field.key}
                      className="admin-input text-gray-900"
                      rows={3}
                      value={settings[field.key] || ''}
                      onChange={(e) => updateSetting(field.key, e.target.value)}
                    />
                  ) : (
                    <input
                      id={`setting-${field.key}`}
                      name={field.key}
                      className="admin-input text-gray-900"
                      value={settings[field.key] || ''}
                      onChange={(e) => updateSetting(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn flex items-center gap-2"
        >
          <FaSave /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
