// Fetch and display posts
async function fetchPosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        
        const postsGrid = document.querySelector('.posts-grid');
        postsGrid.innerHTML = posts.map((post, index) => `
            <article class="post-card" style="animation-delay: ${index * 0.1}s">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <span class="post-date">${new Date(post.created_at).toLocaleDateString()}</span>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', fetchPosts);