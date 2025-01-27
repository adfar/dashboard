// Fetch and display posts with more details
async function fetchPosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        
        const postsList = document.querySelector('.posts-list');
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
    }
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', fetchPosts);