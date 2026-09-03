




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



//IG API via Behold.so

// URL dari tangkapan layar Behold Anda
const BEHOLD_URL = 'https://feeds.behold.so/tiMyh1grJTKs9SOebml7';

fetch(BEHOLD_URL)
    .then(res => res.json())
    .then(data => {
        // 1. Set Foto Profil & Username
        document.getElementById('ig-profile-pic').src = data.profilePictureUrl;
        document.getElementById('ig-username').innerText = `@${data.username}`;

        // 2. Set Jumlah Followers (Behold bisa menarik data ini)
        document.getElementById('ig-followers').innerText = `${data.followersCount} Followers`;

        // 3. Tampilkan 3 Postingan Terbaru
        const feedContainer = document.getElementById('ig-feed');
        feedContainer.innerHTML = ''; // Kosongkan kontainer lama

        // Ambil hanya 3 post pertama
        const latestPosts = data.posts.slice(0, 3);

        latestPosts.forEach(post => {
            const imageSrc = post.mediaType === 'VIDEO' ? post.thumbnailUrl : post.mediaUrl;

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
    })
    .catch(err => {
        console.error("Gagal memuat Instagram:", err);
        document.getElementById('ig-feed').innerHTML = '<p class="text-center">Gagal memuat feed Instagram.</p>';
    });


