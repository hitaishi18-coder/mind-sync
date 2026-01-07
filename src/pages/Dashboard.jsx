import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Webcam from "react-webcam";
import * as faceapi from '@vladmandic/face-api';
import { Brain, Keyboard, Smile, Frown, Meh, Camera, Zap, Trash2, Volume2, VolumeX, Bell } from "lucide-react";
import { FocusPet } from "@/components/FocusPet";

// --- Configuration ---
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'; // Load models from CDN
const LOFI_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112762.mp3"; // Free Royalty Free Sample

const initialChartData = [{ time: 'Start', score: 60 }];

export default function Dashboard() {
  // --- State ---
  const [chartData, setChartData] = useState(() => JSON.parse(localStorage.getItem("mindSyncHistory")) || initialChartData);
  const [focusScore, setFocusScore] = useState(60);
  const [mood, setMood] = useState("Initializing...");
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [suggestion, setSuggestion] = useState("Let's get to work!");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // --- Refs ---
  const webcamRef = useRef(null);
  const audioRef = useRef(new Audio(LOFI_URL));
  const lastKeystrokeTime = useRef(Date.now());
  const typingIdleTimer = useRef(null);

  // --- 1. PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem("mindSyncHistory", JSON.stringify(chartData));
  }, [chartData]);

  const clearHistory = () => {
    setChartData(initialChartData);
    setFocusScore(60);
    localStorage.removeItem("mindSyncHistory");
  };

  // --- 2. REAL AI (Face API) ---
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setIsModelLoaded(true);
        setMood("Camera Ready");
      } catch (err) {
        console.error("AI Load Error:", err);
        setMood("AI Error (Using Sim)");
      }
    };
    loadModels();
  }, []);

  // AI Detection Loop
  useEffect(() => {
    if (!isModelLoaded) return;
    
    const interval = setInterval(async () => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        
        if (detections) {
          // Get strongest emotion
          const expressions = detections.expressions;
          const maxEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
          
          // Map to our app's terms
          const moodMap = { neutral: "Neutral", happy: "Happy", sad: "Stressed", angry: "Stressed", fearful: "Stressed", disgusted: "Tired", surprised: "Focused" };
          setMood(moodMap[maxEmotion] || "Neutral");
        }
      }
    }, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, [isModelLoaded]);


  // --- 3. AUDIO SOUNDSCAPES ---
  useEffect(() => {
    if (!audioEnabled) {
      audioRef.current.pause();
      return;
    }

    // High focus (>80) = Silence (Flow state)
    // Low focus (<40) = Play Lofi (Help focus)
    if (focusScore < 40) {
      if (audioRef.current.paused) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(e => console.log("Audio autoplay blocked", e));
      }
    } else {
      // Fade out logic could go here, for now just pause
      audioRef.current.pause();
    }
  }, [focusScore, audioEnabled]);


  // --- 4. DISTRACTION ZAPPER (Notifications) ---
  useEffect(() => {
    // Check permission on mount
    if (Notification.permission === "default") Notification.requestPermission();

    const checkIdle = setInterval(() => {
      const timeSinceLastType = Date.now() - lastKeystrokeTime.current;
      // If idle for more than 5 minutes (300000ms) and focus is low
      if (timeSinceLastType > 300000 && focusScore < 50) {
        if (Notification.permission === "granted") {
           new Notification("MindSync Alert 🛑", { body: "You've been idle for a while. Take a deep breath and refocus!" });
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkIdle);
  }, [focusScore]);


  // --- 5. MAIN LOGIC (Score Calculation) ---
  useEffect(() => {
    let baseScore = 60;
    
    if (mood === "Focused") baseScore += 25;
    if (mood === "Happy") baseScore += 15;
    if (mood === "Neutral") baseScore += 5;
    if (mood === "Tired") baseScore -= 10;
    if (mood === "Stressed") baseScore -= 20;

    if (typingSpeed > 30) baseScore += 15;
    else if (typingSpeed > 0) baseScore += 5;

    const finalScore = Math.min(100, Math.max(0, baseScore));
    setFocusScore(prev => Math.round((prev + finalScore) / 2));

    const updateInterval = setInterval(() => {
        const now = new Date();
        const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        setChartData(prev => {
            const newData = [...prev, { time: timeLabel, score: finalScore }];
            if (newData.length > 20) newData.shift(); 
            return newData;
        });
    }, 5000);

    // Dynamic suggestions
    if (finalScore > 80) setSuggestion("Flow State Achieved! 🚀");
    else if (finalScore < 40) setSuggestion("Play some Lofi to focus? 🎧");
    else setSuggestion("Keep steady. Drink water 💧");

    return () => clearInterval(updateInterval);
  }, [mood, typingSpeed]);

  const handleTyping = () => {
    const now = Date.now();
    const diff = now - lastKeystrokeTime.current;
    lastKeystrokeTime.current = now;
    if (diff < 1000 && diff > 0) {
        const instantWPM = Math.round(60000 / diff / 5); 
        setTypingSpeed(prev => Math.round((prev * 0.9) + (instantWPM * 0.1)));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                Good Morning <span className="text-blue-500">Creator</span> 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400">AI-Powered Productivity Tracker</p>
        </div>
        <div className="flex items-center gap-3">
             <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={audioEnabled ? "text-blue-500 border-blue-200" : "text-gray-400"}
             >
                {audioEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                {audioEnabled ? "Sound On" : "Sound Off"}
             </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN --- */}
        <div className="space-y-6">
            <Card className="overflow-hidden border-blue-100 dark:border-zinc-800 shadow-sm relative">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                        Face Analysis
                        <Camera className="w-4 h-4 text-gray-400"/>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center group">
                        <Webcam 
                            ref={webcamRef}
                            audio={false}
                            className="w-full h-full object-cover opacity-90"
                            mirrored={true}
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${isModelLoaded ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                           {isModelLoaded ? "AI ACTIVE" : "LOADING AI..."}
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Emotion:</span>
                        <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                           {mood}
                        </div>
                    </div>
                </CardContent>
                
                {/* Blur Overlay for High Stress */}
                {mood === "Stressed" && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
                        <Bell className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
                        <h3 className="text-2xl font-bold text-red-600">High Stress Detected!</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Take a deep breath. The screen will clear when you relax.</p>
                    </div>
                )}
            </Card>

            {/* Smart Suggestions & Pet */}
            <div className="grid grid-cols-2 gap-4">
                <FocusPet score={focusScore} />
                <Card className="border-purple-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
                    <CardContent className="p-4 text-center">
                        <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                        <p className="text-sm text-purple-900 dark:text-purple-200 font-medium">
                            "{suggestion}"
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* --- MIDDLE & RIGHT COLUMNS --- */}
        <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-lg">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-100 font-medium mb-1">Focus Score</p>
                                <h2 className="text-5xl font-extrabold tracking-tighter">{focusScore}</h2>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Brain className="w-8 h-8 text-blue-100" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white/90 rounded-full transition-all duration-1000 ease-out" 
                                    style={{ width: `${focusScore}%` }}
                                ></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-zinc-800">
                     <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-muted-foreground font-medium mb-1">Typing Velocity</p>
                                <h2 className="text-5xl font-extrabold tracking-tighter text-gray-800 dark:text-gray-100">{typingSpeed}</h2>
                                <span className="text-sm text-gray-400">WPM</span>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                <Keyboard className="w-8 h-8 text-orange-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-gray-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Session History</CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearHistory} className="text-red-500 h-8 text-xs hover:bg-red-50">
                        <Trash2 className="w-3 h-3 mr-1" /> Reset
                    </Button>
                </CardHeader>
                <CardContent className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} domain={[0, 100]}/>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                            <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-zinc-800">
                <CardContent className="p-0">
                    <textarea 
                        className="w-full h-24 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                        placeholder="Start typing to track your flow..."
                        onChange={handleTyping}
                    ></textarea>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}