class AudioManager {
	
    constructor() {

        // effects or quick noises
        this.sounds = {
        	0: new Audio('src/assets/audio/sounds/grenade.mp3'),
        	1: new Audio('src/assets/audio/sounds/shot.wav')
        };

        // game music
        this.music = {
            0: new Audio('src/assets/audio/music/menu.mp3'),
            1: new Audio('src/assets/audio/music/heman.mp3')
        };
        
        // List of actively playing music (excludes sounds)
        this.activeMusic = [];
        
    }

    load() {
        return new Promise((resolve, reject) => {
            let start = Date.now();

            for (const audio of this.sounds) {
                if(!audio.readyState == 4) {
                    console.log(`${audio} is not ready, state: ${audio.readyState} src: ${audio.src}`);
                    reject();
                }
            }
            for (const audio of this.sounds) {
                if(!audio.readyState == 4) {
                    console.log(`${audio} is not ready, state: ${audio.readyState} src: ${audio.src}`);
                    reject();
                }
            }

            resolve(Date.now() - start);
        })
    }
    
    /**
     * This will play the audio (sound effect) of the given name.
     * It will look through the registered sound effects and compare
     * the audio paths with the given name; if they match (not case
     * sensitive), it will attempt to play the sound if its readyState
     * is equal to 4. If the method is looped, it will loop the audio
     * file.
     * 
     * @param {string} name
     * The name of the desired sound effect
     */
    playSound(name) {
    	
    	let baseSound = this.getAudioTrack(0, name); // To get the path from
    	let soundOutput = new Audio(); // The audio that will actually be played
    	soundOutput.src = baseSound.src;
    	soundOutput.play();
    	
//    	if(baseSound.readyState == 4) {
//    		soundOutput.play();
//    		
//    		// If the sound has ended, reset the playback cursor
//    		// and play it again
//    	} else if((baseSound.readyState == 2) && (baseSound.ended)) {
//    		baseSound.pause();
//    		baseSound.currentTime = 0;
//    		baseSound.play();
//    	} else {
//    		console.log("Audio (" + name + ") was not ready to be played. Cannot play!");
//    	}
    	
    }
    
    
    /**
     * Plays the audio (music) of the given name. This method
     * is preferred as it will check to make sure that the audio
     * has been fully loaded into memory.
     * 
     * @param {string} name
     * The name of the desired music audio file
     */
    playMusic(name) {
    	
    	let audio = this.getAudioTrack(1, name);
    	if(audio.readyState == 4) {
    		
    		// If the array already contains the audio file name, don't re-add it
    		if(this.activeMusic.toString().indexOf(name) == -1) {
        		audio.play();
        		this.activeMusic.push(name);
    		}    		
    		
    	} else {
    		console.log("Audio (" + name + ") is not ready yet! Cannot play!");
    	}
    }
    
    /**
     * This method will pause the music based on the given name provided.
     * If the audio file has not been loaded, it will print to the console
     * stating so. It will also remove the audio name from the activeMusic
     * array. NOTE: This does not reset the play-back cursor. When play() is
     * called on the same audio file, it will resume where it left off.
     * 
     * @param {string} name
     * The name of the audio file to pause
     */
    pauseMusic(name) {
    	
    	let audio = this.getAudioTrack(1, name);
    	let audioGroup = this.music;
    	
    	if(audio.readyState == 4) {
    		
    		audio.pause();
    		// Remove it from the activeMusic array
    		for(let a = 0; a < this.activeMusic.length; a++) {
    			if(this.activeMusic[a] == name) {
    				// Since the audio is paused, it is no longer active and
    				// can be spliced to remove it from the array
    				this.activeMusic.splice(a, 1);
    			}
    		}
    		
    	} else {
    		console.log("Audio (" + name + ") is not ready yet! Cannot pause!");
    	}
    }
    
    /**
     * Stops all of the music (not sound effects) playing and sets their
     * play-back cursor to the beginning. This means that when play() is called,
     * the audio will resume from the beginning of the track.
     */
    stopAllMusic() {
    	
    	let currentAudio;
    	
    	for(let a = 0; a < this.activeMusic.length; a++) {
    		currentAudio = this.getAudioTrack(1, this.activeMusic[a]);
    		currentAudio.pause();
    		currentAudio.currentTime = 0; // Resets play-back to the beginning
    	}
    	
    }
    
    /**
     * Gets the audio track from the audio object based on the
     * name of the audio file ".../menu.mp3" and the string name
     * provided "menu". If there is a matching (non-case sensitive)
     * file to the string, it will return the audio object. If no matching
     * audio file was found, it will print a log statement and return
     * the audio file of the first index for the group (sound effects or
     * music)
     * 
     * @param {number} groupIndex
     * The group of the desired sound (sound effects = 0, music = 1)
     * @param {string} name
     * The name of the desired audio file ("menu")
     */
    getAudioTrack(groupIndex, name) {
    	
    	let audioName = ""; // For parsing stored audio names
    	let group = (groupIndex == 0) ? this.sounds : this.music;
    	
    	name = name.toLowerCase();
    	
    	for(let m = 0; m < Object.keys(group).length; m++) {
    		
    		// Isolate the end name of the file.      +1 to remove the /
    		audioName = group[m].src.substring(group[m].src.lastIndexOf("/") + 1);
    		// If the audio name contains the given name
    		if(audioName.indexOf(name) == 0) {
    			return group[m];
    		}
    		
    	}
    	
    	console.log("Game music file not found for \"" + name + "\".");
    	return group[0]; // To prevent errors
    }
    
    
    
    
}
