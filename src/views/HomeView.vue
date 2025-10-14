<template>
  <div class="home-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Keepr</h1>
        <div class="header-actions">
          <span class="user-email">{{ userEmail }}</span>
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Welcome Section -->
        <section class="welcome-section">
          <h2>Welcome back!</h2>
          <p>Keep your thoughts, ideas, and notes organized in one place.</p>
        </section>

        <!-- Quick Actions -->
        <section class="quick-actions">
          <div class="action-card" @click="handleNewNote">
            <div class="action-icon">📝</div>
            <h3>New Note</h3>
            <p>Create a new note</p>
          </div>

          <div class="action-card" @click="handleViewNotes">
            <div class="action-icon">📚</div>
            <h3>My Notes</h3>
            <p>View all your notes</p>
          </div>

          <div class="action-card" @click="handleCategories">
            <div class="action-icon">🏷️</div>
            <h3>Categories</h3>
            <p>Organize by category</p>
          </div>

          <div class="action-card" @click="handleSearch">
            <div class="action-icon">🔍</div>
            <h3>Search</h3>
            <p>Find your notes</p>
          </div>
        </section>

        <!-- Recent Notes Section -->
        <section class="recent-section">
          <h2>Recent Notes</h2>
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else-if="recentNotes.length === 0" class="empty-state">
            <p>📭 No notes yet. Create your first note to get started!</p>
          </div>
          <div v-else class="notes-grid">
            <div
              v-for="note in recentNotes"
              :key="note.id"
              class="note-card"
              @click="handleNoteClick(note)"
            >
              <h3>{{ note.title }}</h3>
              <p>{{ note.preview }}</p>
              <div class="note-footer">
                <span class="note-date">{{ formatDate(note.created_at) }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter();
    const userEmail = ref('');
    const loading = ref(true);
    const recentNotes = ref([]);

    onMounted(async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      userEmail.value = user.email;

      // Fetch recent notes (placeholder - you'll need to create the notes table)
      try {
        // This is a placeholder. You'll need to create the notes table in Supabase
        // const { data, error } = await supabase
        //   .from('notes')
        //   .select('*')
        //   .order('created_at', { ascending: false })
        //   .limit(6);
        
        // if (error) throw error;
        // recentNotes.value = data;

        // For now, just show empty state
        recentNotes.value = [];
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        loading.value = false;
      }
    });

    const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push('/login');
    };

    const handleNewNote = () => {
      alert('New Note feature coming soon!');
    };

    const handleViewNotes = () => {
      alert('View Notes feature coming soon!');
    };

    const handleCategories = () => {
      alert('Categories feature coming soon!');
    };

    const handleSearch = () => {
      alert('Search feature coming soon!');
    };

    const handleNoteClick = (note) => {
      alert(`Opening note: ${note.title}`);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    };

    return {
      userEmail,
      loading,
      recentNotes,
      handleLogout,
      handleNewNote,
      handleViewNotes,
      handleCategories,
      handleSearch,
      handleNoteClick,
      formatDate,
    };
  },
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.app-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-email {
  font-size: 14px;
  color: #666;
}

.btn-logout {
  padding: 8px 16px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #667eea;
  color: white;
}

.main-content {
  padding: 40px 24px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-section h2 {
  font-size: 32px;
  color: #333;
  margin: 0 0 8px 0;
}

.welcome-section p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.action-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.action-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.action-card h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
}

.action-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.recent-section {
  margin-top: 40px;
}

.recent-section h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 24px 0;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state {
  background: white;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-state p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.note-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.note-card h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-card p {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-date {
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .welcome-section h2 {
    font-size: 24px;
  }

  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
