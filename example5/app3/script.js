document.addEventListener('DOMContentLoaded', () => {
    const postInput = document.getElementById('postInput');
    const postButton = document.getElementById('postButton');
    const feed = document.getElementById('feed');
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    function savePosts() {
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        const randomColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        const initials = post.author.charAt(0).toUpperCase();
        
        postElement.innerHTML = `
            <div class="post-header">
                <div class="avatar" style="background: ${randomColor}">${initials}</div>
                <div>
                    <div class="author">${post.author}</div>
                    <div class="timestamp">${post.timestamp}</div>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-footer">
                <span class="like-button ${post.liked ? 'liked' : ''}" data-id="${post.id}">❤️ ${post.likes}</span>
            </div>
        `;
        
        return postElement;
    }

    function renderPosts() {
        feed.innerHTML = '';
        posts.forEach(post => {
            feed.appendChild(createPostElement(post));
        });
        
        // Add event listeners for like buttons
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', () => {
                const postId = parseInt(button.dataset.id);
                toggleLike(postId);
            });
        });
    }

    function addPost() {
        const content = postInput.value.trim();
        if (content) {
            const post = {
                id: Date.now(),
                author: 'You',
                content,
                timestamp: new Date().toLocaleString(),
                likes: 0,
                liked: false
            };
            posts.unshift(post);
            savePosts();
            renderPosts();
            postInput.value = '';
        }
    }

    function toggleLike(postId) {
        posts = posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: post.liked ? post.likes - 1 : post.likes + 1,
                    liked: !post.liked
                };
            }
            return post;
        });
        savePosts();
        renderPosts();
    }

    postButton.addEventListener('click', addPost);
    postInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addPost();
        }
    });

    renderPosts();
}); 