import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Webcam from "react-webcam";
import * as faceapi from '@vladmandic/face-api';
import Sentiment from 'sentiment'; 
import { Brain, MessageSquareHeart, Camera, Zap, Trash2, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import FocusCore from "@/components/FocusCore";

// --- Configuration ---
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
const LOFI_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"; 

const initialChartData = [{ time: 'Start', score: 60 }];

export default function Dashboard() {
  // --- State ---
  const [chartData, setChartData] = useState(() => JSON.parse(localStorage.getItem("mindSyncHistory")) || initialChartData);
  const [focusScore, setFocusScore] = useState(60);
  const [mood, setMood] = useState("Initializing...");
  
  // Text & Voice State
  const [textSentiment, setTextSentiment] = useState("Neutral"); 
  const [userText, setUserText] = useState("");
  const [sentimentScore, setSentimentScore] = useState(0); 
  const [isListening, setIsListening] = useState(false);
  
  const [suggestion, setSuggestion] = useState("Let's get to work!");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // --- Refs ---
  const webcamRef = useRef(null);
  const audioRef = useRef(new Audio(LOFI_URL));
  const sentimentAnalyzer = useRef(new Sentiment());

  // --- 1. PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem("mindSyncHistory", JSON.stringify(chartData));
  }, [chartData]);

  const clearHistory = () => {
    setChartData(initialChartData);
    setFocusScore(60);
    localStorage.removeItem("mindSyncHistory");
  };

  // --- 2. SENTIMENT & VOICE LOGIC ---
  const analyzeSentiment = (text) => {
    const result = sentimentAnalyzer.current.analyze(text);
    setSentimentScore(result.score);
    if (result.score > 0) setTextSentiment("Positive");
    else if (result.score < 0) setTextSentiment("Negative");
    else setTextSentiment("Neutral");
  };

  const handleTextChange = (e) => {
    const txt = e.target.value;
    setUserText(txt);
    analyzeSentiment(txt);
  };

  // VOICE RECOGNITION FEATURE
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser does not support Voice Recognition. Try Chrome.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      setSuggestion("Listening... Speak now 🎙️");
    };

    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const newText = userText ? userText + " " + transcript : transcript;
      setUserText(newText);
      analyzeSentiment(newText);
      setSuggestion("Got it! 📝");
    };

    recognition.start();
  };

  // --- 3. REAL AI (Face API) ---
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setIsModelLoaded(true);
        setMood("Camera Ready");
      } catch (err) {
        console.error("AI Load Error:", err);
        setMood("AI Error (Sim)");
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!isModelLoaded) return;
    const interval = setInterval(async () => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        if (detections) {
          const expressions = detections.expressions;
          const maxEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
          const moodMap = { neutral: "Neutral", happy: "Happy", sad: "Stressed", angry: "Stressed", fearful: "Anxious", disgusted: "Tired", surprised: "Focused" };
          setMood(moodMap[maxEmotion] || "Neutral");
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isModelLoaded]);

  // --- 4. SMART MUSIC ---
  useEffect(() => {
    audioRef.current.loop = true;
    if (audioEnabled) {
      if (audioRef.current.paused) audioRef.current.play().catch(e => console.error(e));
      // Volume Logic: Lower volume when highly focused
      audioRef.current.volume = focusScore > 80 ? 0.2 : 0.5;
    } else {
      audioRef.current.pause();
    }
  }, [focusScore, audioEnabled]);

  // --- 5. SCORING LOGIC ---
  useEffect(() => {
    let baseScore = 60;
    
    if (mood === "Focused") baseScore += 20;
    if (mood === "Happy") baseScore += 10;
    if (mood === "Stressed") baseScore -= 20;
    if (mood === "Tired") baseScore -= 10;

    if (sentimentScore > 0) baseScore += Math.min(20, sentimentScore * 5); 
    if (sentimentScore < 0) baseScore += Math.max(-20, sentimentScore * 5);

    const finalScore = Math.min(100, Math.max(0, baseScore));
    setFocusScore(prev => Math.round((prev + finalScore) / 2));

    // Suggestions
    if (sentimentScore < -2) setSuggestion("You seem stressed. Take a real break. 🌿");
    else if (sentimentScore > 3) setSuggestion("Incredible energy! Keep going! 🚀");
    else if (finalScore > 80) setSuggestion("Flow state detected. 🔥");
    else setSuggestion("Steady progress. Stay hydrated 💧");

    const updateInterval = setInterval(() => {
        const now = new Date();
        const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        setChartData(prev => {
            const newData = [...prev, { time: timeLabel, score: finalScore }];
            if (newData.length > 20) newData.shift(); 
            return newData;
        });
    }, 5000);

    return () => clearInterval(updateInterval);
  }, [mood, sentimentScore]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                Good Morning <span className="text-blue-500">Creator</span> 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400">AI Mind Journal & Focus Tracker</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setAudioEnabled(!audioEnabled)} className={audioEnabled ? "text-blue-500 border-blue-200" : "text-gray-400"}>
            {audioEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
            {audioEnabled ? "Music On" : "Music Off"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: VISUALS */}
        <div className="space-y-6">
            
            {/* 3D NEURO CORE */}
            <FocusCore score={focusScore} />

            {/* AI CAMERA */}
            <Card className="overflow-hidden border-blue-100 dark:border-zinc-800 shadow-sm relative">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between text-gray-500">
                        BIOMETRIC SCAN
                        <Camera className="w-4 h-4"/>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center group">
                        <Webcam 
                            ref={webcamRef} 
                            audio={false} 
                            // FIXED: Removed 'grayscale' and 'opacity' so it's colorful
                            className="w-full h-full object-cover" 
                            mirrored={true} 
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${isModelLoaded ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                           {isModelLoaded ? "AI ACTIVE" : "INITIALIZING..."}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Detected Mood:</span>
                        <div className="font-bold text-blue-500">{mood}</div>
                    </div>
                </CardContent>
            </Card>

            {/* SUGGESTION BOX */}
            <Card className="border-purple-100 dark:border-zinc-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
                <CardContent className="p-4 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <p className="text-sm text-purple-900 dark:text-purple-200 font-medium">"{suggestion}"</p>
                </CardContent>
            </Card>
        </div>

        {/* RIGHT COLUMN: DATA & JOURNAL */}
        <div className="md:col-span-2 space-y-6">
            
            {/* STATS ROW */}
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
                                <div className="h-full bg-white/90 rounded-full transition-all duration-1000 ease-out" style={{ width: `${focusScore}%` }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-zinc-800">
                     <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-muted-foreground font-medium mb-1">Journal Vibe</p>
                                <h2 className={`text-3xl font-extrabold tracking-tighter ${textSentiment === 'Positive' ? 'text-green-500' : textSentiment === 'Negative' ? 'text-red-500' : 'text-gray-500'}`}>
                                    {textSentiment}
                                </h2>
                                <span className="text-sm text-gray-400">Score: {sentimentScore}</span>
                            </div>
                            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                                <MessageSquareHeart className="w-8 h-8 text-pink-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* CHART */}
            <Card className="border-gray-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Session Flow</CardTitle>
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

            {/* JOURNAL INPUT (VOICE ENABLED) */}
            <Card className="border-gray-200 dark:border-zinc-800 relative">
                <CardHeader className="pb-2">
                    <CardTitle>Mind Journal</CardTitle>
                    <CardDescription>Type your thoughts or use Voice Mode.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 px-6 pb-6 relative">
                    <textarea 
                        className="w-full h-32 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-blue-500 transition-all resize-none pr-16"
                        placeholder="How are you feeling? Speak or type..."
                        value={userText}
                        onChange={handleTextChange}
                    ></textarea>
                    
                    {/* MIC BUTTON */}
                    <Button 
                        size="icon"
                        variant={isListening ? "destructive" : "secondary"}
                        onClick={toggleListening}
                        className={`absolute bottom-8 right-8 rounded-full shadow-lg transition-all ${isListening ? 'animate-pulse scale-110' : ''}`}
                    >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}