import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Video, 
  MessageSquare, 
  Plus, 
  Volume2, 
  VolumeX,
  Send, 
  Mic, 
  MicOff, 
  VideoOff, 
  Monitor, 
  X, 
  Clock, 
  Sparkles,
  Volume1,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  statusText: string;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderType: 'user' | 'friend';
  text: string;
  time: string;
}

const CONSTANT_FRIENDS: Friend[] = [
  { id: 'f1', name: 'សុផា (Sophea)', avatar: '👩‍🎓', isOnline: true, statusText: 'កំពុងដោះលំហាត់ថ្នាក់ទី១២' },
  { id: 'f2', name: 'លក្ខិណា (Leakhena)', avatar: '👩‍💻', isOnline: true, statusText: 'រៀនប្រចាំថ្ងៃរួចរាល់ 🔥' },
  { id: 'f3', name: 'វឌ្ឍនៈ (Vattanak)', avatar: '🧑‍🎓', isOnline: false, statusText: 'សម្រាកសិន' },
  { id: 'f4', name: 'ម៉ានី (Manny)', avatar: '🦁', isOnline: true, statusText: 'ត្រៀមឆ្លើយសំនួរគណិត' },
];

export default function FriendsHub() {
  const [activeSubTab, setActiveSubTab] = useState<'zoom' | 'chat'>('zoom');
  const [friendsList] = useState<Friend[]>(CONSTANT_FRIENDS);
  
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('kh_sound_enabled');
    return saved !== 'false';
  });

  // Immersive Fullscreen and audio system enhancements
  const [isZoomFullscreen, setIsZoomFullscreen] = useState<boolean>(false);
  const [ambientMusicOn, setAmbientMusicOn] = useState<boolean>(true);
  const [voiceSynthesisOn, setVoiceSynthesisOn] = useState<boolean>(true);

  // Active simulated speaker track
  const [activeSpeaker, setActiveSpeaker] = useState<'user' | 'f1' | 'f2' | 'f4' | null>('f1');
  
  // ZOOM ROOMS STATES
  const [zoomRooms, setZoomRooms] = useState([
    { id: 'room-1', title: 'រៀនត្រៀមប្រឡងជាតិ គណិតវិទ្យា', host: 'សុផា (Sophea)', participantsCount: 3, code: 'ZOOM-982-110', active: true },
    { id: 'room-2', title: 'ពិភាក្សាលំហាត់ដេរីវេ ថ្នាក់ទី១២', host: 'ម៉ានី (Manny)', participantsCount: 2, code: 'MEET-KHM-2026', active: false }
  ]);
  
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [activeCallRoom, setActiveCallRoom] = useState<any | null>(null);
  
  // LIVE CALL SIMULATOR STATES
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenShared, setIsScreenShared] = useState(false);
  const [timerCount, setTimerCount] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [whiteboardText, setWhiteboardText] = useState('lim (x->0) [sin(x) / x] = 1');
  const [activeCallChats, setActiveCallChats] = useState<ChatMessage[]>([
    { id: 'cc1', senderName: 'សុផា (Sophea)', senderAvatar: '👩‍🎓', senderType: 'friend', text: 'សួស្តីអ្នកទាំងអស់គ្នា! តោះដោះស្រាយរូបមន្តលីមីតនេះ', time: '1 កន្លះ' },
  ]);
  const [newCallChatInput, setNewCallChatInput] = useState('');

  // Web Audio microphone analyser refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sound effects synthesizer
  const playSound = (type: 'join' | 'leave' | 'message' | 'click' | 'toggle') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      if (type === 'join') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now); // E4
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.12); // C5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === 'leave') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392, now); // G4
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.15); // A3
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.41);
      } else if (type === 'message') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'toggle') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.051);
      }
    } catch {
      // Gracefully catch browser audio permissions
    }
  };

  const ambientAudioRef = useRef<{
    ctx: AudioContext | null;
    intervalId: any;
  } | null>(null);

  const startAmbientSynth = () => {
    if (!soundEnabled || !ambientMusicOn) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      stopAmbientSynth();
      
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.02, ctx.currentTime); // Soft, non-disturbing focused volume
      masterGain.connect(ctx.destination);
      
      // Soothing Focus Chord Cycle (Cmaj9 -> Am7 -> Fadd9 -> G6)
      const chordNotes = [
        [130.81, 164.81, 196.00, 246.94, 293.66], 
        [110.00, 130.81, 164.81, 196.00, 246.94], 
        [174.61, 220.00, 261.63, 329.63, 392.00], 
        [196.00, 246.94, 293.66, 329.63, 392.00] 
      ];
      
      let index = 0;
      const playChord = () => {
        if (ctx.state === 'suspended') {
          return;
        }
        const now = ctx.currentTime;
        const notes = chordNotes[index];
        
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.05); // slightly arpeggiated
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.18, now + 1.2); // soft attack
          gainNode.gain.setValueAtTime(0.18, now + 3.0);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 4.8); // gentle release
          
          osc.connect(gainNode);
          gainNode.connect(masterGain);
          
          osc.start(now);
          osc.stop(now + 5.0);
        });
        
        index = (index + 1) % chordNotes.length;
      };
      
      playChord();
      const intervalId = setInterval(playChord, 5200);
      
      ambientAudioRef.current = {
        ctx,
        intervalId
      };
    } catch (e) {
      console.warn("Lo-Fi Synth Pad error", e);
    }
  };

  const stopAmbientSynth = () => {
    if (ambientAudioRef.current) {
      clearInterval(ambientAudioRef.current.intervalId);
      try {
        if (ambientAudioRef.current.ctx) {
          ambientAudioRef.current.ctx.close();
        }
      } catch {}
      ambientAudioRef.current = null;
    }
  };

  const speakKhmerOrEng = (text: string) => {
    if (!soundEnabled || !voiceSynthesisOn) return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel(); // Stop any pending speech
      
      const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      const voices = synth.getVoices();
      const khmerVoice = voices.find(v => v.lang.startsWith('km') || v.lang.startsWith('kh'));
      if (khmerVoice) {
        utterance.voice = khmerVoice;
        utterance.lang = 'km-KH';
      } else {
        utterance.lang = 'km-KH';
        utterance.rate = 0.88;
      }
      
      synth.speak(utterance);
    } catch (e) {
      console.warn("TTS initialization failed or was blocked by browser policies", e);
    }
  };

  const playFriendVoice = (text: string, friendId: string) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      let type: OscillatorType = 'sine';
      let toneHz = 350;
      let spacing = 0.08;
      const lettersToPlay = Math.min(text.length, 6);
      
      if (friendId === 'f1') {
        type = 'sine';
        toneHz = 430;
        spacing = 0.07;
      } else if (friendId === 'f2') {
        type = 'triangle';
        toneHz = 330;
        spacing = 0.08;
      } else if (friendId === 'f4') {
        type = 'triangle';
        toneHz = 210;
        spacing = 0.11;
      }
      
      const startTime = ctx.currentTime;
      for (let i = 0; i < lettersToPlay; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type;
        const variance = 1 + ((text.charCodeAt(i) % 8) - 4) * 0.04;
        osc.frequency.setValueAtTime(toneHz * variance, startTime + i * spacing);
        
        gain.connect(ctx.destination);
        osc.connect(gain);
        
        gain.gain.setValueAtTime(0, startTime + i * spacing);
        gain.gain.linearRampToValueAtTime(0.04, startTime + i * spacing + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * spacing + 0.07);
        
        osc.start(startTime + i * spacing);
        osc.stop(startTime + i * spacing + 0.09);
      }
    } catch {}
  };

  // CHAT STATES
  const [selectedFriendId, setSelectedFriendId] = useState<string>('group'); 
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({
    group: [
      { id: 'm1', senderName: 'សុផា (Sophea)', senderAvatar: '👩‍🎓', senderType: 'friend', text: 'តើមាននរណាអាចជួយដោះស្រាយលំហាត់លីមីតទំព័រទី៥១ បានទេ?', time: '08:20 AM' },
      { id: 'm2', senderName: 'លក្ខិណា (Leakhena)', senderAvatar: '👩‍💻', senderType: 'friend', text: 'ខ្ញុំកំពុងមើលដែរ! ប្រើរូបមន្តទ្រីកោណមាត្រទៅសាកមើលសិន', time: '08:22 AM' }
    ],
    f1: [
      { id: 'm3', senderName: 'សុផា (Sophea)', senderAvatar: '👩‍🎓', senderType: 'friend', text: 'សួស្តី! តើប្អូនបានសាកល្បងចុះឈ្មោះរៀនថ្ងៃនេះនៅ?🔥', time: 'Yesterday' }
    ],
    f2: [
      { id: 'm4', senderName: 'លក្ខិណា (Leakhena)', senderAvatar: '👩‍💻', senderType: 'friend', text: 'សួស្តីមិត្តភក្តិ! យប់នេះមានការបង្កើត Zoom ពិភាក្សាទេ?', time: '07:15 AM' }
    ]
  });
  const [typedMessage, setTypedMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat smoothly
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, selectedFriendId, activeCallChats]);

  // Real voice input integration using Web Audio API
  useEffect(() => {
    if (isMicOn && activeCallRoom) {
      async function setupRealMic() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
          
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const audioContext = new AudioCtx();
          audioContextRef.current = audioContext;
          
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;
        } catch {
          // If denied, fallback to animated sine curves procedurally
        }
      }
      setupRealMic();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isMicOn, activeCallRoom]);

  // Render responsive gorgeous visualizer waves on canvas
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;

    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw faint grid backing
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }

      // Check mic availability
      let frequencyArray: Uint8Array | null = null;
      if (analyserRef.current && isMicOn) {
        const bufferLen = analyserRef.current.frequencyBinCount;
        frequencyArray = new Uint8Array(bufferLen);
        analyserRef.current.getByteTimeDomainData(frequencyArray);
      }

      // 1. Primary glowing emerald soundwave
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = isMicOn ? '#10b981' : '#ef4444'; // Green or red if muted
      ctx.shadowBlur = isMicOn ? 14 : 0;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const points = 100;
      const amplitude = isMicOn ? (frequencyArray ? 40 : 20) : 0;

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        let yOffset = 0;

        if (isMicOn) {
          if (frequencyArray) {
            const idx = Math.floor((i / points) * frequencyArray.length);
            const rawVal = (frequencyArray[idx] - 128) / 128;
            yOffset = rawVal * amplitude * 1.8;
          } else {
            const sinVal = Math.sin(i * 0.12 - phase) * Math.cos(i * 0.05 + phase * 0.6);
            const env = Math.sin((i / points) * Math.PI);
            yOffset = sinVal * amplitude * env;
          }
        }

        const y = h / 2 + yOffset;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // 2. Secondary sleek slate-blue overlay wave
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isMicOn ? 'rgba(59, 130, 246, 0.6)' : 'rgba(100, 116, 139, 0.2)';
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        let yOffset = 0;
        if (isMicOn) {
          if (frequencyArray) {
            const idx = Math.min(frequencyArray.length - 1, Math.floor((i / points) * frequencyArray.length * 0.7));
            const rawVal = (frequencyArray[idx] - 128) / 128;
            yOffset = rawVal * amplitude * 0.9;
          } else {
            const sinVal = Math.sin(i * 0.16 + phase * 1.4);
            const env = Math.sin((i / points) * Math.PI);
            yOffset = sinVal * amplitude * 0.55 * env;
          }
        }
        const y = h / 2 + yOffset;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.14;
      animationId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isMicOn, activeCallRoom]);

  // Simulated Zoom Call Timer
  useEffect(() => {
    let timer: any = null;
    if (activeCallRoom && isTimerActive) {
      timer = setInterval(() => {
        setTimerCount(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCallRoom, isTimerActive]);

  // Peer Speech Interval Simulator (Speech visualizer and tips generator)
  useEffect(() => {
    if (!activeCallRoom) return;
    
    const talkSim = setInterval(() => {
      const speakers: Array<'user' | 'f1' | 'f2' | 'f4'> = ['f1', 'f2', 'f4', 'user'];
      const currentSimSpeaker = speakers[Math.floor(Math.random() * speakers.length)];
      setActiveSpeaker(currentSimSpeaker);
      
      if (currentSimSpeaker !== 'user') {
        playSound('message');

        const peerChats: Record<string, string[]> = {
          f1: [
            "ពិតជាឡូយណាស់! តើដឹងទេថាលីមីតនេះអាចប្រើវិធីដោះស្រាយរហ័សបាន?",
            "ប្អូនៗអាចសាកល្បងចុច Ask AI នៅខាងក្រោមដើម្បីឲ្យពន្យល់ជំហានបាន!",
            "តោះរួមគ្នាប្រឹងប្រែងដើម្បីដណ្ដើមពានរង្វាន់ Level 12 👑"
          ],
          f2: [
            "យោបល់ល្អខ្លាំងណាស់ សាច់ការនេះងាយយល់ណាស់!",
            "ខ្ញុំទើបតែដោះស្រាយលំហាត់ជំពូកទី២ រួច បាន XP កើនឡើងយ៉ាងលឿន!",
            "សាលាគណិតឆ្លាតវៃ (AI Smart School) ពិតជាមានប្រយោជន៍មែន"
          ],
          f4: [
            "មីក្រូហ្វូនរបស់ខ្ញុំដំណើរការច្បាស់ល្អទេអ្នកទាំងអស់គ្នា?",
            "តោះមកផ្ដោតលើរូបមន្តដេរីវេម្ដងទៀត!",
            "ថ្ងៃនេះប្រឹងប្រែងខ្លាំងណាស់!"
          ]
        };
        
        const peerNames: Record<string, string> = { f1: 'សុផា (Sophea)', f2: 'លក្ខិណា', f4: 'ម៉ានី (Manny)' };
        const peerAvatars: Record<string, string> = { f1: '👩‍🎓', f2: '👩‍💻', f4: '🦁' };
        
        const texts = peerChats[currentSimSpeaker] || ["អស្ចារ្យមែន!"];
        const chosenText = texts[Math.floor(Math.random() * texts.length)];
        
        // Audibly speak the dynamic talk!
        playFriendVoice(chosenText, currentSimSpeaker);
        speakKhmerOrEng(chosenText);

        setActiveCallChats(prev => [
          ...prev,
          {
            id: `cc-sim-${Date.now()}`,
            senderName: peerNames[currentSimSpeaker],
            senderAvatar: peerAvatars[currentSimSpeaker],
            senderType: 'friend',
            text: chosenText,
            time: 'មុននេះបន្តិច'
          }
        ]);
        
        // Let user see who is speaking for 3.5 seconds
        setTimeout(() => {
          setActiveSpeaker(null);
        }, 3500);
      }
    }, 7000);
    
    return () => clearInterval(talkSim);
  }, [activeCallRoom, soundEnabled, voiceSynthesisOn]);

  // Start study track when active call room starts, and clean up when leaving
  useEffect(() => {
    if (activeCallRoom) {
      if (soundEnabled && ambientMusicOn) {
        startAmbientSynth();
      }
      
      const timer = setTimeout(() => {
        speakKhmerOrEng("ជំរាបសួរ! ស្វាគមន៍ការចូលរួមបន្ទប់សិក្សាក្រុម!");
        playFriendVoice("ជំរាបសួរ", "f1");
      }, 1000);
      return () => {
        clearTimeout(timer);
        stopAmbientSynth();
      };
    } else {
      stopAmbientSynth();
    }
  }, [activeCallRoom, ambientMusicOn, soundEnabled]);

  // Selected chat list helper
  function getSelectedMessages() {
    return chats[selectedFriendId] || [];
  }

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Toggle Sounds globally
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem('kh_sound_enabled', String(nextVal));
    
    // Play visual feedback
    if (nextVal) {
      setTimeout(() => {
        playSound('toggle');
      }, 50);
    }
  };

  // Create real room simulation
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    playSound('join');
    const zoomCode = `ZOOM-${Math.floor(100 + Math.random() * 899)}-${Math.floor(100 + Math.random() * 899)}`;
    const newRoom = {
      id: `room-${Date.now()}`,
      title: newRoomTitle,
      host: 'ខ្ញុំ (Me - គណនីផ្ទាល់ខ្លួន)',
      participantsCount: 1,
      code: zoomCode,
      active: true
    };

    setZoomRooms([newRoom, ...zoomRooms]);
    setNewRoomTitle('');
    handleJoinCallRoom(newRoom);
  };

  // Enter room call
  const handleJoinCallRoom = (room: any) => {
    playSound('join');
    setActiveCallRoom(room);
    setIsZoomFullscreen(true); // Automatically enter full screen when opening zoom!
    setTimerCount(0);
    setIsTimerActive(true);
    setIsMicOn(true);
    setIsVideoOn(true);
    setIsScreenShared(false);
    setActiveCallChats([
      { id: 'cc1', senderName: 'សុផា (Sophea)', senderAvatar: '👩‍🎓', senderType: 'friend', text: 'ជំរាបសួរ! ស្វាគមន៍ការចូលរួមបន្ទប់សិក្សាក្រុម!', time: 'មុននេះបន្តិច' },
      { id: 'cc2', senderName: 'លក្ខិណា (Leakhena)', senderAvatar: '👩‍💻', senderType: 'friend', text: 'ឡូយណាស់! តោះចាប់រៀនទាំងអស់គ្នា 💪', time: 'មុននេះបន្តិច' }
    ]);
  };

  // Send message inside continuous call simulator chat
  const handleSendCallChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCallChatInput.trim()) return;

    playSound('message');
    const userMsg: ChatMessage = {
      id: `cc-${Date.now()}`,
      senderName: 'ខ្ញុំ (Me)',
      senderAvatar: '🧠',
      senderType: 'user',
      text: newCallChatInput,
      time: 'ទើបតែសរសេរ'
    };

    setActiveCallChats(prev => [...prev, userMsg]);
    setNewCallChatInput('');

    // Quick robotic speech simulator backoff
    setTimeout(() => {
      const answers = [
        "ពិតជាឡូយមែន! រូបមន្តនេះយល់ច្បាស់ហើយ!",
        "តើប្អូនចង់សាកសួរគ្រូ AI /AiHelp ដើម្បីដោះស្រាយលំហាត់នេះទេ?",
        "អស្ចារ្យណាស់! ការពន្យល់នេះច្បាស់ណាស់។",
        "បង្រៀនខ្ញុំពីជំពូកនេះបន្តិចមក!"
      ];
      playSound('message');
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      playFriendVoice(randomAnswer, 'f1');
      speakKhmerOrEng(randomAnswer);

      setActiveCallChats(prev => [
        ...prev,
        {
          id: `cc-rep-${Date.now()}`,
          senderName: 'សុផា (Sophea)',
          senderAvatar: '👩‍🎓',
          senderType: 'friend',
          text: randomAnswer,
          time: 'ទើបតែឆ្លើយ'
        }
      ]);
    }, 1200);
  };

  // Send message in permanent Chat Hub (personal/group)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    playSound('message');
    const targetId = selectedFriendId;
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderName: 'ខ្ញុំ (Me)',
      senderAvatar: '🧠',
      senderType: 'user',
      text: typedMessage,
      time: new Date().toLocaleTimeString('kh-KH', { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), userMsg]
    }));

    const textPayload = typedMessage.trim();
    setTypedMessage('');

    // Simulating auto replies
    setTimeout(() => {
      let reply = 'បាទ/ចាសមិត្តភក្តិ! តោះរួមគ្នាដោះស្រាយលំហាត់គណិតវិទ្យាបន្ថែមទៀត!';
      
      if (targetId === 'group') {
        const groupResponses = [
          "អបអរសាទរ! សកម្មភាពសិក្សាដណ្ដើមបាន XP ច្រើនណាស់ថ្ងៃនេះ!",
          "តោះបង្កើតបន្ទប់សិក្សា Zoom ឥឡូវនេះ ដើម្បីពិភាក្សាគ្នាបន្តផ្ទាល់!",
          "តើប្អូនៗដឹងទេថាអាចប្រើ /AiHelp <សំនួរ> ដើម្បីសួរគ្រូ AI ពីគ្រប់ទំព័របាន?",
          "មេរៀននេះពិតជាងាយយល់ទេ ពេលមានគ្នាជួយពន្យល់គ្នាទៅវិញទៅមក!"
        ];
        reply = groupResponses[Math.floor(Math.random() * groupResponses.length)];
      } else {
        const peer = friendsList.find(f => f.id === targetId);
        const name = peer ? peer.name.split(' ')[0] : 'មិត្តភក្តិ';
        if (textPayload.includes('សួស្តី') || textPayload.includes('hello')) {
          reply = `សួស្តី! ខ្ញុំគឺ ${name} រីករាយណាស់បានជជែកជាមួយគណនីផ្ទាល់ខ្លួនរបស់អ្នក! មានការអ្វីឱ្យខ្ញុំជួយទេក្នុងមេរៀនថ្ងៃនេះ? 🎓`;
        } else {
          const pr = [
            `ល្អណាស់! ខ្ញុំនឹងនៅជួយគាំទ្រអ្នកជានិច្ច។ 💪`,
            `មែនហើយ! កុំភ្លេចរក្សាថ្ងៃសិក្សាស៊េរី (Daily Streak) ឱ្យបានជាប់ៗគ្នាណា!`,
            `គំនិតល្អ! តោះរួមគ្នាបង្កើតបន្ទប់ Zoom សិក្សា ដើម្បីយល់ច្បាស់ឡើង!`,
            `ខ្ញុំចូលចិត្តការគណនាគណិតវិទ្យានេះណាស់ លឿន និងងាយយល់!`
          ];
          reply = pr[Math.floor(Math.random() * pr.length)];
        }
      }

      playSound('message');
      setChats(prev => ({
        ...prev,
        [targetId]: [
          ...(prev[targetId] || []),
          {
            id: `reply-${Date.now()}`,
            senderName: targetId === 'group' ? 'លក្ខិណា (Leakhena)' : (friendsList.find(f => f.id === targetId)?.name || 'មិត្តភក្តិ'),
            senderAvatar: targetId === 'group' ? '👩‍💻' : (friendsList.find(f => f.id === targetId)?.avatar || '👩‍🎓'),
            senderType: 'friend',
            text: reply,
            time: new Date().toLocaleTimeString('kh-KH', { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }));
    }, 1400);
  };

  return (
    <div className="bg-slate-50/40 rounded-3xl border border-slate-200 p-4 min-h-[500px] flex flex-col md:flex-row gap-5">
      
      {/* LEFT PANEL: Contacts and System Control */}
      <div className="w-full md:w-64 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-4 shadow-sm shrink-0">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-blue-600 animate-pulse" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">សហគមន៍ស្និទ្ធស្នាល</h3>
          </div>
          <span className="text-[9px] bg-blue-50 text-blue-700 font-black px-2 py-0.5 rounded-full uppercase">
            {friendsList.filter(f => f.isOnline).length} Active
          </span>
        </div>

        {/* Global Sound FX Toggle Controller */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-150 p-2 rounded-xl text-slate-600 transition-all">
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 size={14} className="text-emerald-500 animate-bounce" />
            ) : (
              <VolumeX size={14} className="text-slate-400" />
            )}
            <span className="text-[10px] font-bold text-slate-700">សំឡេងគាំទ្រ (SFX)</span>
          </div>
          <button
            onClick={handleToggleSound}
            className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer flex ${
              soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <motion.div layout className="w-3 h-3 bg-white rounded-full shadow" />
          </button>
        </div>

        {/* Active Sub Tab toggles */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 rounded-xl p-1 text-[10px] font-black h-9">
          <button
            onClick={() => { playSound('click'); setActiveSubTab('zoom'); }}
            className={`rounded-lg transition-all flex items-center justify-center gap-1 leading-none cursor-pointer ${
              activeSubTab === 'zoom' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video size={12} /> បន្ទប់ Zoom / Meet
          </button>
          <button
            onClick={() => { playSound('click'); setActiveSubTab('chat'); }}
            className={`rounded-lg transition-all flex items-center justify-center gap-1 leading-none cursor-pointer ${
              activeSubTab === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare size={12} /> ប្រអប់ឆាត (Chats)
          </button>
        </div>

        {/* Contacts scrolling list */}
        <div className="space-y-1.5 overflow-y-auto max-h-[220px] md:max-h-none flex-1">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide px-1">ប្រភពជជែកពិភាក្សា</p>
          
          {/* Main group chat button key */}
          <button
            onClick={() => { playSound('click'); setSelectedFriendId('group'); setActiveSubTab('chat'); }}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all relative cursor-pointer border ${
              selectedFriendId === 'group' && activeSubTab === 'chat'
                ? 'bg-blue-50/80 border-blue-200 text-blue-950 font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 border-transparent'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold leading-none select-none">
              👥
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black truncate">ក្រុមគណិតវិទ្យាសរុប</p>
              <p className="text-[9px] text-slate-400 truncate font-semibold">សិស្សទាំងអស់ចូលរួម 💬</p>
            </div>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
          </button>

          {/* Individual friends lists */}
          {friendsList.map((friend) => (
            <button
              key={friend.id}
              onClick={() => { playSound('click'); setSelectedFriendId(friend.id); setActiveSubTab('chat'); }}
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all relative cursor-pointer border ${
                selectedFriendId === friend.id && activeSubTab === 'chat'
                  ? 'bg-blue-50/80 border-blue-200 text-blue-950 font-black shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 border-transparent'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-sm border border-slate-200 select-none relative shrink-0">
                {friend.avatar}
                {friend.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-slate-700">{friend.name}</p>
                <p className="text-[9px] text-slate-400 truncate leading-tight font-medium">{friend.statusText}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Informational Hint Card */}
        <div className="border-t border-slate-100 pt-3 text-center">
          <p className="text-[9px] text-slate-400 leading-normal font-medium">
            💡 ចង់សួរគ្រូបង្គោល AI រហ័ស? គ្រាន់តែវាយ <strong className="text-blue-600 uppercase font-bold">/AiHelp</strong> រួចតាមដោយលំហាត់ណាមួយ គឺ AI នឹងបង្រៀនបានភ្លាម!
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Dynamic switching layouts */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm min-h-[460px]">
        {activeSubTab === 'zoom' ? (
          
          /* ZOOM LAYOUT SECTION */
          <div className="p-5 space-y-5 flex-1 flex flex-col overflow-y-auto">
            
            {activeCallRoom ? (
              
              /* ACTIVE VIDEO MEETING CALL VIEWPORT */
              <div className={isZoomFullscreen 
                ? "fixed inset-0 z-[100] bg-slate-950 p-6 md:p-8 flex flex-col gap-4 overflow-y-auto w-screen h-screen transition-all"
                : "flex-1 flex flex-col gap-4 transition-all"
              }>
                
                {/* Meeting info bar header */}
                <div className={`flex items-center justify-between border-b pb-3 ${isZoomFullscreen ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0"></div>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-black uppercase tracking-wide truncate ${isZoomFullscreen ? 'text-white' : 'text-slate-800'}`}>{activeCallRoom.title}</h4>
                      <p className={`text-[9px] font-bold ${isZoomFullscreen ? 'text-slate-400' : 'text-slate-400'}`}>Meeting Code: {activeCallRoom.code} • ម៉ោងសិក្សា៖ {formatTimer(timerCount)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 select-none">
                    {/* Fullscreen Toggle Buttons */}
                    <button
                      onClick={() => { playSound('click'); setIsZoomFullscreen(!isZoomFullscreen); }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 cursor-pointer active:scale-95 transition-all outline-none border ${
                        isZoomFullscreen 
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-705 hover:bg-slate-100'
                      }`}
                      title={isZoomFullscreen ? "បង្រួមអេក្រង់ (Minimize Screen)" : "ពេញអេក្រង់ (Full Screen)"}
                    >
                      {isZoomFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                      <span>{isZoomFullscreen ? 'បង្រួមតូច (Minimize)' : 'ពង្រីកពេញ (Fullscreen)'}</span>
                    </button>

                    <button
                      onClick={() => { playSound('leave'); setActiveCallRoom(null); setIsZoomFullscreen(false); }}
                      className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-[10px] font-black flex items-center gap-1 relative cursor-pointer active:scale-95 transition-all"
                    >
                      <X size={12} /> ចាកចេញ (Leave)
                    </button>
                  </div>
                </div>

                {/* Primary viewport splitting - Dynamic video feeds & Whiteboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-[220px]">
                  
                  {/* Shared Interactive Whiteboard Screen */}
                  <div className="md:col-span-2 bg-slate-950 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group border border-slate-800">
                    
                    {/* Glowing background matrix effect */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

                    <div className="flex justify-between items-center z-10">
                      <span className="text-[8px] font-black uppercase text-slate-355 bg-slate-900/90 px-2.5 py-1 rounded-full tracking-wider border border-slate-800 flex items-center gap-1 text-slate-300">
                        <Monitor size={10} className="text-emerald-400 animate-pulse" />
                        {isScreenShared ? 'កំពុងចែករំលែកអេក្រង់ (Sharing Screen)' : 'ក្ដារខៀនរួមគ្នា (Active Board)'}
                      </span>
                      
                      <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-0.5 rounded border border-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <span className="text-[9px] text-emerald-400 font-mono font-bold tracking-widest">
                          LIVE SIMULATION
                        </span>
                      </div>
                    </div>

                    {/* Middle Canvas Sound wave or Formula */}
                    <div className="my-5 flex flex-col items-center justify-center text-center space-y-3 px-4 py-3 bg-slate-900/40 rounded-xl border border-white/5 backdrop-blur-xs">
                      <div className="text-[9px] font-black uppercase tracking-widest text-[#10b981] flex items-center gap-1">
                        <Sparkles size={10} className="text-amber-400 animate-spin" />
                        សរសេររូបមន្តគណនាលើក្ដារខៀន (Whiteboard Math)
                      </div>
                      
                      <motion.code 
                        layout
                        className="text-sm md:text-base font-black text-white font-mono bg-black/70 px-4 py-2 rounded-xl border border-slate-800 select-all block break-all w-full truncate"
                      >
                        {whiteboardText}
                      </motion.code>
                      
                      {/* Easy prompt whiteboard input modifier */}
                      <input
                        type="text"
                        value={whiteboardText}
                        onChange={(e) => setWhiteboardText(e.target.value)}
                        placeholder="កែប្រែរូបមន្តនៅលើក្ដារខៀន..."
                        className="w-full text-[10px] bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-center font-bold font-mono"
                      />
                    </div>

                    {/* Interactive Real audio waveforms canvas visualizer */}
                    <div className="space-y-1.5 mt-auto">
                      <div className="flex justify-between items-center text-[8px] text-slate-500 font-black uppercase">
                        <span>សញ្ញាសំឡេងមីក្រូហ្វូន (Real-Time Audio Spectrum Visualizer)</span>
                        <span className={isMicOn ? "text-emerald-400" : "text-red-500"}>
                          {isMicOn ? "Active Spectrum" : "Disabled"}
                        </span>
                      </div>
                      <canvas 
                        ref={canvasRef} 
                        className="w-full h-11 bg-slate-950/90 rounded-xl border border-slate-900 shadow-inner" 
                      />
                    </div>
                  </div>

                  {/* Right hand side participants feeds */}
                  <div className="space-y-3 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 select-none">
                    
                    {/* User primary avatar preview box */}
                    <div className={`p-3 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center text-center relative border transition-all min-w-[125px] md:min-w-0 flex-grow ${
                      activeSpeaker === 'user' 
                        ? 'border-emerald-500 shadow-md shadow-emerald-950/40 ring-2 ring-emerald-500/20' 
                        : 'border-slate-800'
                    }`}>
                      {isVideoOn ? (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2.5xl animate-bounce relative shadow border border-slate-800">
                          🧠
                          {activeSpeaker === 'user' && (
                            <span className="absolute -inset-1 rounded-full border border-emerald-500 animate-ping" />
                          )}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-600 flex items-center justify-center">
                          <VideoOff size={18} />
                        </div>
                      )}
                      
                      <div className="mt-2 text-center">
                        <p className="text-[10px] font-black flex items-center justify-center gap-1">
                          <span>គណនីខ្ញុំ (Me)</span>
                          {activeSpeaker === 'user' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                        </p>
                        <span className="text-[8px] text-slate-400 font-bold block">
                          {!isMicOn ? '🔇 Muted' : '🎙️ Mic Active'}
                        </span>
                      </div>
                    </div>

                    {/* SOPHEA companion video container */}
                    <div className={`p-3 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center text-center relative border transition-all min-w-[125px] md:min-w-0 flex-grow ${
                      activeSpeaker === 'f1' 
                        ? 'border-emerald-505 border-emerald-500 shadow-md shadow-emerald-950/40 ring-2 ring-emerald-500/20' 
                        : 'border-slate-800'
                    }`}>
                      <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-2.5xl relative border border-slate-850">
                        👩‍🎓
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                        {activeSpeaker === 'f1' && (
                          <span className="absolute -inset-1.5 rounded-full border-2 border-emerald-500/40 animate-ping pointer-events-none" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-[10px] font-black text-slate-300">សុផា (Sophea)</p>
                        <span className={`text-[8px] font-black block transition-colors ${
                          activeSpeaker === 'f1' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'
                        }`}>
                          {activeSpeaker === 'f1' ? '🎙️ Speaking...' : '🎙️ Listening'}
                        </span>
                      </div>
                    </div>

                    {/* LEAKHENA companion video container */}
                    <div className={`p-3 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center text-center relative border transition-all min-w-[125px] md:min-w-0 flex-grow ${
                      activeSpeaker === 'f2' 
                        ? 'border-emerald-500 shadow-md shadow-emerald-950/40 ring-2 ring-emerald-500/20' 
                        : 'border-slate-800'
                    }`}>
                      <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-2.5xl relative border border-slate-850">
                        👩‍💻
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                        {activeSpeaker === 'f2' && (
                          <span className="absolute -inset-1.5 rounded-full border-2 border-emerald-500/40 animate-ping pointer-events-none" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-[10px] font-black text-slate-300">លក្ខិណា (Leakhena)</p>
                        <span className={`text-[8px] font-black block transition-colors ${
                          activeSpeaker === 'f2' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'
                        }`}>
                          {activeSpeaker === 'f2' ? '🎙️ Speaking...' : '🎙️ Listening'}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Toolbar containing quick camera/mic action sliders */}
                <div className={`p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 select-none transition-colors duration-200 ${
                  isZoomFullscreen 
                    ? 'bg-slate-900/90 border border-slate-800 text-white' 
                    : 'bg-slate-50 border border-slate-150 text-slate-800'
                }`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => { playSound('toggle'); setIsMicOn(!isMicOn); }}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/10 text-red-500 border border-red-100 hover:bg-red-100'
                      }`}
                      title={isMicOn ? "Disable Mic" : "Enable Mic"}
                    >
                      {isMicOn ? <Mic size={15} /> : <MicOff size={15} />}
                    </button>

                    <button
                      onClick={() => { playSound('toggle'); setIsVideoOn(!isVideoOn); }}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/10 text-red-500 border border-red-100 hover:bg-red-100'
                      }`}
                      title={isVideoOn ? "Disable Video" : "Enable Video"}
                    >
                      {isVideoOn ? <Video size={15} /> : <VideoOff size={15} />}
                    </button>

                    <button
                      onClick={() => { playSound('click'); setIsScreenShared(!isScreenShared); }}
                      className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 text-[10px] font-black cursor-pointer ${
                        isScreenShared ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Monitor size={14} /> {isScreenShared ? 'Stop Screen' : 'Share Space'}
                    </button>

                    {/* Focus Study Ambient Sound Pad Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        const next = !ambientMusicOn;
                        setAmbientMusicOn(next);
                        playSound('click');
                        if (next) startAmbientSynth();
                        else stopAmbientSynth();
                      }}
                      className={`px-3 py-2 flex items-center gap-1 text-[9px] font-black rounded-lg transition-all border outline-none cursor-pointer ${
                        ambientMusicOn 
                          ? 'bg-emerald-605 bg-emerald-600 text-white border-emerald-550' 
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                      title="ភ្លេងផ្ទៃក្រោយផ្ដោតអារម្មណ៍ (Study Ambient Music)"
                    >
                      <Sparkles size={11} className={ambientMusicOn ? "animate-spin text-amber-300" : ""} />
                      <span>{ambientMusicOn ? '🔊 ភ្លេងរៀន៖ បើក' : '🔇 ភ្លេងរៀន៖ បិទ'}</span>
                    </button>

                    {/* Companion speech readouts (TTS) Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        const next = !voiceSynthesisOn;
                        setVoiceSynthesisOn(next);
                        playSound('click');
                        if (next) speakKhmerOrEng("បើកសំឡេងអានមេរៀន");
                      }}
                      className={`px-3 py-2 flex items-center gap-1 text-[9px] font-black rounded-lg transition-all border outline-none cursor-pointer ${
                        voiceSynthesisOn 
                          ? 'bg-indigo-600 text-white border-indigo-500' 
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                      title="អានសារឆាតជាសំឡេង (Text-To-Speech Voices)"
                    >
                      <Volume1 size={11} className={voiceSynthesisOn ? "animate-pulse" : ""} />
                      <span>{voiceSynthesisOn ? '🗣️ អានឆាត៖ បើក' : '🔇 អានឆាត៖ បិទ'}</span>
                    </button>
                  </div>

                  {/* Study Time Counters */}
                  <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[10px] ${
                    isZoomFullscreen ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-200'
                  }`}>
                    <Clock size={12} className="text-blue-500" />
                    <span className="font-mono font-extrabold flex items-center gap-1 text-slate-650">
                      <span>វគ្គសិក្សា៖</span> 
                      <span className="text-blue-600 font-mono">{formatTimer(timerCount)}</span>
                    </span>
                    <button
                      onClick={() => { playSound('click'); setIsTimerActive(!isTimerActive); }}
                      className="text-[9px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-500 font-bold cursor-pointer"
                    >
                      {isTimerActive ? 'Pause' : 'Resume'}
                    </button>
                  </div>

                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100 font-black animate-pulse shrink-0">
                    🚀 រៀនក្រុមគណិតវិទ្យាបាន +XP ខ្ពស់បំផុត
                  </span>
                </div>

                {/* InCall Chat Log Area */}
                <div className={`p-4 rounded-2xl flex flex-col justify-end gap-3.5 max-h-[170px] overflow-y-auto transition-colors duration-200 ${
                  isZoomFullscreen 
                    ? 'bg-slate-900 border border-slate-800 text-slate-100' 
                    : 'bg-slate-50 border border-slate-150 text-slate-700'
                }`}>
                  <p className={`text-[10px] font-extrabold uppercase border-b pb-1.5 tracking-wider ${
                    isZoomFullscreen ? 'text-slate-400 border-slate-800' : 'text-slate-450 border-slate-200'
                  }`}>ប្រអប់សារបណ្ដោះអាសន្នក្នុង Zoom (In-Call Chats)</p>
                  
                  <div className="space-y-2.5">
                    {activeCallChats.map((cc) => (
                      <div key={cc.id} className="text-[11px] leading-relaxed select-text">
                        <strong className={`${isZoomFullscreen ? 'text-slate-300' : 'text-slate-850'} font-extrabold`}>{cc.senderName} ({cc.senderAvatar}): </strong>
                        <span className={isZoomFullscreen ? 'text-slate-200' : 'text-slate-650 font-medium'}>{cc.text}</span>
                        <span className="text-[8px] text-slate-400 font-semibold ml-1.5 font-mono">{cc.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendCallChat} className={`flex gap-2 border-t pt-2 shrink-0 ${isZoomFullscreen ? 'border-slate-800' : 'border-slate-200'}`}>
                    <input
                      type="text"
                      value={newCallChatInput}
                      onChange={(e) => setNewCallChatInput(e.target.value)}
                      placeholder="សរសេរផ្ញើសារក្នុង Zoom..."
                      className={`rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 flex-1 font-semibold ${
                        isZoomFullscreen 
                          ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-700' 
                          : 'bg-white border border-slate-200 text-slate-700 placeholder-slate-405 shadow-inner'
                      }`}
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-blue-600 text-white rounded-xl active:scale-95 transition-all text-xs cursor-pointer shadow hover:bg-blue-700 justify-center items-center flex"
                    >
                      <Send size={13} />
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              
              /* BASE VIEW OF ALL ACTIVE MEETINGS OR CREATE ROOM */
              <div className="space-y-5">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                  <div className="space-y-1.5">
                    <span className="bg-white/20 text-blue-100 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full leading-none">
                      បន្ទប់សិក្សាក្រុម Zoom / Meet Simulator
                    </span>
                    <h3 className="text-base font-black">បង្កើត ឬចូលរួមការរៀនជាក្រុមភ្លាមៗ! 🎥</h3>
                    <p className="text-[11px] text-blue-100/90 max-w-lg leading-relaxed select-text">
                      រួមគ្នាបង្កើតគណនី Zoom/Meet ផ្ទាល់ខ្លួន ជួបជុំគ្នាដោះស្រាយរូបមន្ត សរសេរបង្ហាញលើក្ដារខៀន និងជជែកវែកញែកជាមួយមិត្តភក្តិ ព្រមទាំងដៃគូសិក្សាដើម្បីបង្កើនថ្ងៃស៊េរី និងត្រៀមប្រឡងជាតិ!
                    </p>
                  </div>
                  <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-xl flex flex-col items-center justify-center shrink-0 w-full sm:w-auto font-bold text-center">
                    <p className="text-[9px] text-blue-200 uppercase tracking-widest">រៀនក្រុមសកម្ម</p>
                    <p className="text-lg font-black text-amber-300 font-mono mt-0.5">២ បន្ទប់</p>
                  </div>
                </div>

                {/* Form to spawn rooms */}
                <form onSubmit={handleCreateRoom} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 shadow-inner">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">បង្កើតបន្ទប់សិក្សាផ្ទាល់ខ្លួនរបស់អ្នក (Host New Room)</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs flex-1">
                      <Video size={14} className="text-blue-500 animate-pulse" />
                      <input
                        type="text"
                        required
                        value={newRoomTitle}
                        onChange={(e) => setNewRoomTitle(e.target.value)}
                        placeholder="ឧ. ក្រុមរៀនដោះស្រាយប្រឡងត្រៀមប្រចាំខែ..."
                        className="bg-transparent focus:outline-none w-full font-bold text-slate-700 placeholder-slate-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow shadow-blue-150 cursor-pointer"
                    >
                      <Plus size={15} /> ផ្សាយទិន្នន័យ (Host Call)
                    </button>
                  </div>
                </form>

                {/* Active lists */}
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">កំពុងផ្សាយបន្តផ្ទាល់ (Live Study Rooms)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {zoomRooms.map((room) => (
                      <div
                        key={room.id}
                        className="p-4 rounded-2xl border border-slate-250 hover:border-blue-400 transition-all flex flex-col justify-between gap-4 relative overflow-hidden group shadow-xs hover:shadow"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] bg-red-50 text-red-650 font-black px-2 py-0.5 rounded border border-red-100 uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Live Broadcast
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">{room.code}</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 leading-snug">{room.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">Host: {room.host}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-[10px] text-slate-500 font-extrabold flex items-center gap-1">
                            👥 ចូលរួមសិក្សា៖ {room.participantsCount} នាក់
                          </span>
                          <button
                            onClick={() => handleJoinCallRoom(room)}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center active:scale-95 transition-all shadow-xs cursor-pointer"
                          >
                            <Video size={11} /> ចូលរួមបន្ទប់ (Join Call)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        ) : (
          
          /* MESSAGING CHATS HUB */
          <div className="flex-grow flex flex-col min-h-0 bg-slate-50/10">
            
            {/* Direct chat headers */}
            <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-inner border border-slate-200">
                  {selectedFriendId === 'group' ? '👥' : (friendsList.find(f => f.id === selectedFriendId)?.avatar || '📖')}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-850">
                    {selectedFriendId === 'group' ? 'ក្រុមពិភាក្សាគណិតទូទៅ (Global Chat)' : (friendsList.find(f => f.id === selectedFriendId)?.name || 'មិត្តភក្តិសិក្សា')}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold">
                    {selectedFriendId === 'group' ? 'សមាជិកប្រព័ន្ធសកម្ម ១២ នាក់' : 'សកម្មបច្ចុប្បន្ន • ដៃគូសិក្សាផ្ទាល់ខ្លួន'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const quickRoom = {
                      id: `room-${Date.now()}`,
                      title: `ជជែកពិភាក្សាលឿនជាមួយ ${selectedFriendId === 'group' ? 'ក្រុមសហគមន៍' : (friendsList.find(f => f.id === selectedFriendId)?.name.split(' ')[0] || 'មិត្ត')}`,
                      host: 'ខ្ញុំ (Me)',
                      participantsCount: 2,
                      code: 'ZOOM-FAST',
                      active: true
                    };
                    handleJoinCallRoom(quickRoom);
                    setActiveSubTab('zoom');
                  }}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-[10px] font-black flex items-center gap-1 hover:bg-blue-105 cursor-pointer active:scale-95 transition-all"
                  title="Quick Video Call with speaker"
                >
                  <Video size={11} className="animate-pulse" /> Zoom Call
                </button>
              </div>
            </div>

            {/* Chats scrolling areas with smooth springy motion items */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 max-h-[300px] md:max-h-none min-h-[220px]">
              <AnimatePresence initial={false}>
                {getSelectedMessages().map((msg) => {
                  const isViewer = msg.senderType === 'user';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`flex items-end gap-2.5 ${isViewer ? 'flex-row-reverse' : ''}`}
                    >
                      {!isViewer && (
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-base border border-slate-200 select-none shrink-0 shadow-xs">
                          {msg.senderAvatar}
                        </span>
                      )}
                      
                      <div className="space-y-1 max-w-[70%] text-left select-text">
                        {!isViewer && (
                          <p className="text-[9px] text-slate-400 font-extrabold px-1 uppercase">{msg.senderName}</p>
                        )}
                        
                        <div className={`p-3 rounded-2xl text-[11px] leading-relaxed font-medium ${
                          isViewer
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                        }`}>
                          {msg.text}
                        </div>
                        
                        <span className={`text-[8px] text-slate-400 block px-1 font-semibold ${isViewer ? 'text-right' : ''}`}>
                          {msg.time}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Outgoing Message Submission */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-150 flex gap-2 shrink-0">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="វាយសារផ្ញើទៅកាន់ផ្នែកពិភាក្សា..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-600 flex-1 font-semibold text-slate-700 placeholder-slate-400 shadow-inner"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl active:scale-95 transition-all text-xs font-black flex items-center justify-center gap-1 cursor-pointer shadow shadow-blue-150"
              >
                <span>ផ្ញើ</span>
                <Send size={12} />
              </button>
            </form>

          </div>
        )}
      </div>

    </div>
  );
}
