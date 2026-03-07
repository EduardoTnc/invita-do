import { create } from "zustand";

interface AudioState {
    isPlaying: boolean;
    isMuted: boolean;
    audioSrc: string | null;
    audioElement: HTMLAudioElement | null;
    setAudioSrc: (src: string) => void;
    play: () => void;
    pause: () => void;
    toggleMute: () => void;
    initAudio: (src: string) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    isPlaying: false,
    isMuted: false,
    audioSrc: null,
    audioElement: null,

    setAudioSrc: (src) => set({ audioSrc: src }),

    initAudio: (src) => {
        const existing = get().audioElement;
        if (existing) {
            existing.pause();
            existing.src = "";
        }

        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = 0.5;
        set({ audioElement: audio, audioSrc: src });
    },

    play: () => {
        const audio = get().audioElement;
        if (audio) {
            audio.play().catch(() => {
                // Browser autoplay policy blocked — user interaction required
            });
            set({ isPlaying: true });
        }
    },

    pause: () => {
        const audio = get().audioElement;
        if (audio) {
            audio.pause();
            set({ isPlaying: false });
        }
    },

    toggleMute: () => {
        const audio = get().audioElement;
        if (audio) {
            audio.muted = !audio.muted;
            set({ isMuted: audio.muted });
        }
    },
}));
