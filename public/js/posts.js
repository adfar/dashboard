// Fetch and display posts with more details
async function fetchPosts() {
    try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        // Check if we have posts and they're in an array
        const posts = Array.isArray(data) ? data : [];
        console.log('Posts array:', posts); // Debug log
        
        const postsList = document.querySelector('.posts-list');
        if (posts.length === 0) {
            postsList.innerHTML = '<p class="no-posts">No posts found.</p>';
            return;
        }
        
        postsList.innerHTML = posts.map((post, index) => `
            <article class="post-item" style="animation-delay: ${index * 0.1}s">
                <div class="post-header">
                    <h2 class="post-title">${post.title}</h2>
                    <span class="post-date">${new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</span>
                </div>
                <p class="post-description">${post.description}</p>
                <a href="/post.html?id=${post.id}" class="read-more">Read More →</a>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error fetching posts:', error);
        const postsList = document.querySelector('.posts-list');
        postsList.innerHTML = '<p class="error-message">Error loading posts. Please try again later.</p>';
    }
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', fetchPosts);