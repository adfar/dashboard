// Check authentication
const storedToken = localStorage.getItem('adminToken');
console.log('Stored token:', storedToken);

if (!storedToken) {
    window.location.href = 'login.html';
}

// DOM Elements
const postForm = document.getElementById('postForm');
const postsList = document.getElementById('postsList');
const logoutBtn = document.getElementById('logoutBtn');
const cancelEditBtn = document.getElementById('cancelEdit');
const submitPostBtn = document.getElementById('submitPost');
const postTemplate = document.getElementById('postTemplate');

// API handlers
async function fetchPosts() {
    try {
        const response = await fetch('http://165.227.64.163/api/posts', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const posts = await response.json();
            renderPosts(posts);
        } else if (response.status === 401) {
            handleUnauthorized();
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function createPost(postData) {
    try {
        const response = await fetch('http://165.227.64.163/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(postData)
        });
        
        if (response.ok) {
            await fetchPosts();
            postForm.reset();
        } else if (response.status === 401) {
            handleUnauthorized();
        }
    } catch (error) {
        console.error('Error creating post:', error);
    }
}

async function updatePost(id, postData) {
    try {
        const response = await fetch(`http://165.227.64.163/api/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(postData)
        });
        
        if (response.ok) {
            await fetchPosts();
            resetForm();
        } else if (response.status === 401) {
            handleUnauthorized();
        }
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
        const response = await fetch(`http://165.227.64.163/api/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            await fetchPosts();
        } else if (response.status === 401) {
            handleUnauthorized();
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// UI handlers
function renderPosts(posts) {
    postsList.innerHTML = '';
    posts.forEach(post => {
        const postElement = postTemplate.content.cloneNode(true);
        
        postElement.querySelector('.post-title').textContent = post.title;
        postElement.querySelector('.post-description').textContent = post.description;
        
        const editBtn = postElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => handleEdit(post));
        
        const deleteBtn = postElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deletePost(post.id));
        
        postsList.appendChild(postElement);
    });
}

function handleEdit(post) {
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postDescription').value = post.description;
    document.getElementById('postContent').value = post.content;
    
    submitPostBtn.textContent = 'Update Post';
    cancelEditBtn.classList.remove('hidden');
}

function resetForm() {
    postForm.reset();
    document.getElementById('postId').value = '';
    submitPostBtn.textContent = 'Create Post';
    cancelEditBtn.classList.add('hidden');
}

function handleUnauthorized() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}

// Event listeners
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const postData = {
        title: document.getElementById('postTitle').value,
        description: document.getElementById('postDescription').value,
        content: document.getElementById('postContent').value
    };
    
    const postId = document.getElementById('postId').value;
    
    if (postId) {
        await updatePost(postId, postData);
    } else {
        await createPost(postData);
    }
});

cancelEditBtn.addEventListener('click', resetForm);

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
});

// Initial load
fetchPosts();