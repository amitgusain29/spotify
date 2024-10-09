
console.log("Let's Write Javascript");

const artists = [
    {
        imgSrc: "images/pritam.jpeg",
        name: "Pritam",
        description: "Artist"
    },
    {
        imgSrc: "images/arijitsingh.jpeg",
        name: "Arijit Singh",
        description: "Artist"
    },
    {
        imgSrc: "images/vishal.jpeg",
        name: "Vishal Mishra",
        description: "Artist"
    },
    {
        imgSrc: "images/diljit.jpeg",
        name: "Diljit Dosanjh",
        description: "Artist"
    },
    {
        imgSrc: "images/Shreya.jpeg",
        name: "Shreya Ghoshal",
        description: "Artist"
    },
    {
        imgSrc: "images/Shreya.jpeg",
        name: "Shreya Ghoshal",
        description: "Artist"
    },
    {
        imgSrc: "images/Shreya.jpeg",
        name: "Shreya Ghoshal",
        description: "Artist"
    },
    {
        imgSrc: "images/Shreya.jpeg",
        name: "Shreya Ghoshal",
        description: "Artist"
    },
    {
        imgSrc: "images/Shreya.jpeg",
        name: "Shreya Ghoshal",
        description: "Artist"
    },
    {
        imgSrc: "images/Shreya.jpeg",
        name: "Shreya Ghoshal",
        description: "Artist"
    }
];

function populateArtists(showAll = false) {
    const popContainer = document.querySelector('.popcontainer');
    popContainer.innerHTML = ''; // Clear existing content

    // Determine how many artists to display based on showAll flag
    const displayCount = showAll ? artists.length : 5;

    artists.slice(0, displayCount).forEach(artist => {
        const popCard = document.createElement('div');
        popCard.className = 'popCard';

        popCard.innerHTML = `
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="#1ed760"></circle>
                    <g transform="translate(10, 10)">
                        <polygon points="7,3 17,10 7,17" fill="#000000"></polygon>
                    </g>
                </svg>
            </div>
            <img src="${artist.imgSrc}" alt="">
            <h2>${artist.name}</h2>
            <p>${artist.description}</p>
        `;

        popContainer.appendChild(popCard);
    });

    // Show all button logic
    const showAllButton = document.querySelector('.showAll');
    showAllButton.textContent = showAll ? 'Show less' : 'Show all';
    showAllButton.addEventListener('click', () => {
        populateArtists(!showAll); // Toggle showAll flag
    });
}

// Call the function to populate the artists on page load
document.addEventListener('DOMContentLoaded', () => {
    populateArtists(false); // Initially show only 5 artists
});


let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    displaySongs(songs);
    return songs;
}

function displaySongs(songs) {
    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    if (!songUL) {
        console.error("songUL not found");
        return;
    }
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
        <img class="invert music" src="music.svg" alt="">
        <div class="info">
            <div class="infomain"> ${decodeURIComponent(song).replace(".mp3", "")}</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="play.svg" alt="">
        </div> </li>`;
    }

    // Attach an event listener to each song to play
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            console.log(e.querySelector('.info').firstElementChild.innerHTML);
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim() + ".mp3");
        });
    });
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        document.querySelector("#play").src = "pause.svg";
    } else {
        document.querySelector("#play").src = "play.svg";
    }
    document.querySelector('.songinfo').innerHTML = decodeURI(track).replace(".mp3", "").replace("%2C", ",");
}

async function displayAlbums() {
    console.log("displaying albums");
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".card-container");
    if (!cardContainer) {
        console.error("cardContainer not found");
        return;
    }
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();

            if (response.title.includes("Radio")) {
                continue; // Skip albums with "Radio" in the title
            }
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                <div class="play1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="18" fill="#1ed760"></circle>
                                <g transform="translate(10, 10)">
                                    <polygon points="7,3 17,10 7,17" fill="#000000"></polygon>
                                </g>
                            </svg>
                        </div>

                <img src="/songs/${folder}/cover.jpeg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`;
        }
    }

    Array.from(document.querySelectorAll(".card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs");
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}
async function displayAlbums2() {
    console.log("displaying albums");
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardcontainer");
    if (!cardContainer) {
        console.error("cardContainer not found");
        return;
    }
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();

            if (!response.title.includes("Radio")) {
                continue; // Skip albums with "Radio" in the title
            }

            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
               <div class="play1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="18" fill="#1ed760"></circle>
                                <g transform="translate(10, 10)">
                                    <polygon points="7,3 17,10 7,17" fill="#000000"></polygon>
                                </g>
                            </svg>
                        </div>

                <img src="/songs/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`;
        }
    }

    Array.from(document.querySelectorAll(".card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs");
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

function searchSongs(query) {
    const filteredSongs = songs.filter(song => song.toLowerCase().includes(query.toLowerCase()));
    displaySongs(filteredSongs);
}

async function main() {
    // Get the list of all the songs
    await getsongs('songs/Animal');
    playMusic(songs[0], true);

    // Display all the albums on the page 
    await displayAlbums();
    await displayAlbums2();

    // Attach an event listener to play, previous and next
    document.querySelector("#play").addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            document.querySelector("#play").src = "pause.svg";
        } else {
            currentSong.pause();
            document.querySelector("#play").src = "play.svg";
        }
    });

    // Listen for timeUpdate event
    currentSong.addEventListener('timeupdate', () => {
        document.querySelector('.songtime').innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}`;
        document.querySelector('.songtime2').innerHTML = `${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector('.completed').style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // seekbar
    document.querySelector(".seekbar").addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.completed').style.width = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // shuffle
    document.querySelector("#shuffle").addEventListener('click', () => {
        if (songs.length === 0) return;
        let randomIndex = Math.floor(Math.random() * songs.length);
        playMusic(songs[randomIndex], false);
    });

    // repeat
    loop.addEventListener('click', () => {
        currentSong.play()
    })

    // Add an event Listener for hamburger
    document.querySelector('.hamburger').addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event Listener for close icon
    document.querySelector('.close').addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    // Add an event Listener to previous
    previous.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event Listener to next
    next.addEventListener('click', () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add Event Listener to volumeOn
    document.querySelector('.range input').addEventListener("change", (e) => {
        console.log("Setting value to", e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    // Add Event to show playbar when clicked
    document.querySelector(".songList").addEventListener('click', () => {
        document.querySelector(".playbar").style.display = "block"
    })

    document.querySelector(".card-container").addEventListener('click', () => {
        document.querySelector(".playbar").style.display = "block"
    })

    document.querySelector(".cardcontainer").addEventListener('click', () => {
        document.querySelector(".playbar").style.display = "block"
    })

    // Add event listener to mute the track
    document.querySelector('.volume>img').addEventListener('click', e => {
        if (e.target.src.includes("volumeOn.svg")) {
            e.target.src = e.target.src.replace("volumeOn.svg", "volumeOff.svg");
            currentSong.volume = 0;
            document.querySelector('.range input').value = 0;
        } else {
            e.target.src = e.target.src.replace("volumeOff.svg", "volumeOn.svg");
            currentSong.volume = 1;
            document.querySelector('.range input').value = 100;
        }
    });

    // Add search functionality
    document.querySelector('#searchInput').addEventListener('input', (e) => {
        searchSongs(e.target.value);
    });
}

main();

