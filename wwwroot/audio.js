class AudioHandler {
    constructor() {
        this.activate = document.getElementById("open");
        this.activate.volume = 0.3;
        this.music = document.getElementById("music");
        this.music.volume = 0.02;
        this.bones = document.getElementById("bones");
        this.bones.volume = 0.3;
        this.rustle = document.getElementById("rustle");
        this.rustle.volume = 0.05;
        this.mud = document.getElementById("mud");
        this.mud.volume = 0.4;
        this.audioOn = true;

        this.playedActivate = false;
        this.startedMusic = false;
        this.canPlayRustleAgain = true;
        this.canPlayMudAgain = true;
    }

    FirstStartMusic() {
        if (!this.startedMusic) {
            this.startedMusic = true;
            this.PlayMusic();
        }
    }

    Mute() {
        this.audioOn = false;
        this.musicOn = false;
        this.music.pause();
        //this.music.currentTime = 0;
    }

    MusicOff() {
        this.musicOn = false;
        this.music.pause();
    }

    MusicOn() {
        if (this.audioOn) {
            this.musicOn = true;
            this.PlayMusic();
        }
    }

    UnMute() {
        this.audioOn = true;
        this.musicOn = true;
        this.PlayMusic();
    }

    PlayActivate() {
        if (this.audioOn && !this.playedActivate) {
            this.playedActivate = true;
            this.activate.play();
        }
    }

    PlayBones() {
        if (this.audioOn) {
            this.bones.play();
        }
    }

    PlayMusic() {
        if (this.audioOn) {
            this.music.currentTime = 0;
            this.music.play();
        }
    }

    PlayRustle() {
        if (this.canPlayRustleAgain && this.startedMusic && this.audioOn) {
            this.rustle.play();
            this.canPlayRustleAgain = false;
            setTimeout(function (audio) { audio.canPlayRustleAgain = true; }, 5000, this);
        }
    }

    PlayMud() {
        if (this.canPlayMudAgain && this.startedMusic && this.audioOn) {
            this.mud.play();
            this.canPlayMudAgain = false;
            setTimeout(function (audio) { audio.canPlayMudAgain = true; }, 350, this);
        }
    }
}
