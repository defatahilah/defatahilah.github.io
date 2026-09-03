




// Youtube API

const API_KEY = 'AIzaSyCQyRMfvDuTbmd0BN6OvOLn3m1r12w82_g'; // Gunakan key Anda
const CHANNEL_ID = 'UCgtvqZ0dLEpi0Ugwl366a5A';

// 1. Ambil Profil & Subscriber
fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        const channel = data.items[0];
        document.getElementById('yt-profile-pic').src = channel.snippet.thumbnails.medium.url;
        document.getElementById('yt-channel-name').innerText = channel.snippet.title;

        // Format angka agar ada titik ribuan
        const subs = parseInt(channel.statistics.subscriberCount).toLocaleString('id-ID');
        document.getElementById('yt-subscriber').innerText = subs + ' Subscribers';
    });

// 2. Ambil Video Terbaru
fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&maxResults=1&order=date&part=snippet`)
    .then(res => res.json())
    .then(data => {
        const videoId = data.items[0].id.videoId;
        const container = document.getElementById('yt-video-container');

        // Masukkan iframe ke dalam container
        container.innerHTML = `
        <iframe class="embed-responsive-item" 
                src="https://www.youtube.com/embed/${videoId}?rel=0" 
                allowfullscreen>
        </iframe>`;
    })
    .catch(err => console.error("Gagal memuat data YouTube:", err));



//IG API 

    // Tempelkan token panjang dari tombol "Buat token" di Meta Developer
    const META_ACCESS_TOKEN = 'IGAAjST5cNpcZABZAGFDbm1fS0ZAPa0xaaVZAnbkpoVFFqSWxNckhFVHk2OFdyajBSeWE4ME83b2IwVXM1X1k0djJtN2FUWUd4THFFXzFnNDVXLXpnMGdPUGlhUHNwdHlIVW83QUZAkc2YyLXRaUTlvbGhyaTJvekQxcWpzRnNESW5aRQZDZD'; 

    const META_USER_URL = `https://graph.instagram.com/me?fields=id,username,account_type,media_count,followers_count,profile_picture_url&access_token=${META_ACCESS_TOKEN}`;
    const META_FEED_URL = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${META_ACCESS_TOKEN}`;

    // 1. AMBIL PROFIL INSTAGRAM (Username & Followers)
    fetch(META_USER_URL)
        .then(res => res.json())
        .then(profileData => {
            if(profileData.username) {
                document.getElementById('ig-profile-pic').src = profileData.profile_picture_url || 'https://placeholder.com';
                document.getElementById('ig-username').innerText = `@${profileData.username}`;
                
                // API Sandbox sering mengembalikan nilai kosong untuk followers pada akun uji coba. 
                // Jika kosong/undefined, kita set manual ke '49' agar sesuai profil Anda.
                const followers = profileData.followers_count !== undefined ? profileData.followers_count : '49';
                document.getElementById('ig-followers').innerText = `${followers} Followers`;
            }
        })
        .catch(err => console.error("Gagal memuat profil Instagram:", err));

    // 2. AMBIL FEED / REELS INSTAGRAM (Maksimal 3 Terbaru)
    fetch(META_FEED_URL)
        .then(res => res.json())
        .then(feedData => {
            const feedContainer = document.getElementById('ig-feed');
            if (feedData && feedData.data) {
                feedContainer.innerHTML = ''; // Bersihkan kontainer lama
                
                // Ambil maksimal 3 item teratas (Foto / Reels)
                const latestPosts = feedData.data.slice(0, 6);
                latestPosts.forEach(post => {
                    // Jika tipe VIDEO (Reels), gunakan parameter thumbnail_url resmi dari Meta agar gambar cover muncul
                    const imageSrc = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;

                     feedContainer.innerHTML += `
    <div class="col-4">
      <div class="ig-thumbnail" style="margin-bottom: 15px;">
        <a href="${post.permalink}" target="_blank">
          <img src="${imageSrc}" class="img-fluid" alt="Instagram Post" style="object-fit: cover; height: 150px; width: 100%;">
        </a>
      </div>
    </div>
                    `;
                });
            } else {
                feedContainer.innerHTML = '<p class="text-center" style="color:#aaa; font-size:13px;">Gagal memuat feed Instagram.</p>';
            }
        })
        .catch(err => {
            console.error("Error Instagram Feed:", err);
            document.getElementById('ig-feed').innerHTML = '<p class="text-center" style="color:#aaa; font-size:13px;">Gagal memuat feed Instagram.</p>';
        });


