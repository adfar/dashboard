// Get post ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

async function fetchPost() {
    if (!postId) {
        window.location.href = '/posts.html';
        return;
    }

    try {
        const response = await fetch(`/api/public/posts/${postId}`);
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        const post = await response.json();
        
        // Update the page title
        document.title = `${post.title} | Creative Space`;
        
        // Update the post content
        document.querySelector('.post-title').textContent = post.title;
        document.querySelector('.post-date').textContent = new Date(post.created_at)
            .toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        document.querySelector('.post-description').textContent = post.description;
        document.querySelector('.post-content').innerHTML = formatContent(post.content);
        
    } catch (error) {
        console.error('Error fetching post:', error);
        document.querySelector('.post-detail').innerHTML = `
            <div class="error-message">
                <h2>Post Not Found</h2>
                <p>Sorry, the post you're looking for doesn't exist.</p>
                <a href="/posts.html" class="back-button">← Back to Posts</a>
            </div>
        `;
    }
}

// Format content with paragraphs
function formatContent(content) {
    return content.split('\n')
        .filter(paragraph => paragraph.trim())
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
}

// Load post when the page loads
document.addEventListener('DOMContentLoaded', fetchPost);