// Selecting all elements
let btn = document.querySelectorAll('.song #play_btn');
let song = document.querySelectorAll('#music');

/* Popup music player part */
let p_m_player = document.querySelector('.popup_music_player');
let down_player = document.querySelector('#down_player');
let current_track_name = document.querySelector('#current_track_name');
let current_singer_name = document.querySelector('#current_singer_name');
let song_img = document.querySelector('.song_img');

/* Controls part */
let play_pause_btn = document.querySelector('#play_pause_btn');
let slider = document.querySelector('#slider');
let forward_btn = document.querySelector('#forward_btn');
let backward_btn = document.querySelector('#backward_btn');

/* Songs duration */
let current_duration = document.querySelector('.controlls .progress_part #current_duration');
let total_duration = document.querySelector('.controlls .progress_part #total_duration');

/* Small music player part */
let s_m_player = document.querySelector('.small_music_player');
let playing_img = document.querySelector('.playing_img');
let wave_animation = document.querySelector('.wave_animation');
let up_player = document.querySelector('#up_player');
let song_name = document.querySelector('#song_name');
let artist_name = document.querySelector('#artist_name');

/* Default values */
let is_song_played = false;
let song_status = false;
let index_no = 0;
let update_interval; // To store the interval ID

// Define the togglePlayBack function
function togglePlayBack(action, index) {
    if (action === "play") {
        song[index].play();
        song_status = true;
        wave_animation.style.opacity = '1';
        play_pause_btn.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
        update_interval = setInterval(update_second, 1000);
    } else if (action === "pause") {
        song[index].pause();
        song_status = false;
        clearInterval(update_interval);
        wave_animation.style.opacity = '0';
        play_pause_btn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    }
}

// Set up event listener for play buttons to handle individual song selection
btn.forEach((btn, index) => {
    btn.addEventListener('click', function () {
        s_m_player.style.transform = 'translateY(0px)'; // Show small music player

        // Stop previous song if a different song is selected
        if (song_status && index !== index_no) {
            togglePlayBack("pause", index_no);
            song[index_no].classList.remove('active_song');
        }

        index_no = index; // Update the index for the selected song
        song[index_no].currentTime = 0; // Reset song time

        play_song(); // Play Selected Song
    });
});

// Define play_song function to start a song and update the UI
function play_song() {
    if (document.querySelector(".active_song")) {
        document.querySelector(".active_song").pause(); // Pause the current active song
        document.querySelector(".active_song").classList.remove("active_song"); // Remove active class
    }

    togglePlayBack("play", index_no); // Play the selected song
    song[index_no].classList.add("active_song"); // Add active class to the song

    // Update song details in UI
    song_img.innerHTML = `<img src="${All_song[index_no].img}" />`;
    playing_img.innerHTML = `<img src="${All_song[index_no].img}" />`;
    song_name.innerHTML = All_song[index_no].name;
    artist_name.innerHTML = All_song[index_no].singer;
    current_track_name.innerHTML = All_song[index_no].name;
    current_singer_name.innerHTML = All_song[index_no].singer;

    setInterval(update_second, 1000); // Start updating song progress every second
    p_m_player.style.transform = 'translateY(0%)'; // Show popup player
}

// Define the update_second function to handle the song progress and display duration
function update_second() {
    let position = 0;

    // Update the slider value only if the song duration is valid
    if (song[index_no].duration > 0) {
        position = song[index_no].currentTime * (100 / song[index_no].duration);
        slider.value = position; // Update slider position
    }

    // Display total duration
    let durationMinutes = Math.floor(song[index_no].duration / 60);
    let durationSeconds = Math.floor(song[index_no].duration - durationMinutes * 60);
    total_duration.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;

    // Display current playback time
    let curr_minutes = Math.floor(song[index_no].currentTime / 60);
    let curr_seconds = Math.floor(song[index_no].currentTime - curr_minutes * 60);
    current_duration.textContent = `${curr_minutes}:${curr_seconds < 10 ? '0' : ''}${curr_seconds}`;

    // Handle when the song ends
    if (song[index_no].ended) {
        clearInterval(update_interval); // Reset when song ends
        wave_animation.style.opacity = '0';
        play_pause_btn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    }
}

// Add event listener for the pop up player
up_player.addEventListener('click', function () {
    p_m_player.style.transform = 'translateY(0%)'; // Show pop up player
});

down_player.addEventListener('click', function () {
    p_m_player.style.transform = 'translateY(110%)'; // Hide pop up player
});

// Add event listener for the play/pause button
play_pause_btn.addEventListener("click", function () {
    if (song_status) {
        togglePlayBack("pause", index_no);
    } else {
        togglePlayBack("play", index_no);
    }
});

// Define the change duration
function change_duration() {
    let slider_position = song[index_no].duration * (slider.value / 100);
    song[index_no].currentTime = slider_position;
}

// Add functionality to forward and back arrows
forward_btn.addEventListener('click', function () {
    index_no = (index_no + 1) % All_song.length; // Move to next song
    song[index_no].currentTime = 0;
    play_song();
});

backward_btn.addEventListener('click', function () {
    index_no = (index_no - 1 + All_song.length) % All_song.length; // Move to previous song
    song[index_no].currentTime = 0;
    play_song();
});

// Start song progress
setInterval(update_second, 1000);
