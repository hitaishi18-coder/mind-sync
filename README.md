
# 🧠 MindSync

## AI-Powered Neuro-Productivity & Cognitive State Tracker

MindSync is a next-generation, intelligent productivity dashboard that goes beyond traditional time-tracking tools.
Instead of only measuring **how long** you work, MindSync focuses on **how you feel while working**.

By combining **real-time computer vision**, **sentiment analysis**, and **interactive 3D visualization**, MindSync dynamically adapts to a user’s mental and emotional state — enabling a deeper understanding of **focus, stress, fatigue, and engagement**.

> **Core Idea:** Productivity is not linear — it is cognitive.

---

## 📌 Project Vision & Problem Statement

Traditional productivity tools typically:

* Track hours
* Track tasks
* Track clicks

But they **do not track the human behind the screen**.

### MindSync solves this by:

* Continuously analyzing **facial expressions**
* Interpreting **emotional tone** in speech and text
* Reacting **visually and behaviorally** to mental fatigue and distraction

This transforms productivity from a **static metric** into a **living, adaptive system**.

---

## 🚀 Core Features

### 👁️ Real-Time Biometric Emotion Analysis

* Uses the device **webcam** to capture live video frames
* Runs **on-device AI inference** (no backend/server dependency)
* Classifies emotional states:

  * Neutral
  * Happy
  * Sad
  * Angry
  * Fearful
  * Disgusted
  * Surprised

These raw emotions are further mapped into **productivity-relevant states**:

* Focused
* Stressed
* Tired

The system updates the user’s cognitive state **every few seconds**, ensuring responsiveness without overloading the browser.

---

### 🔮 3D Neuro-Core Visualization (Digital Brain)

* A dynamic **3D sphere** representing the user’s mental state
* Built using **Three.js** with **React-Three-Fiber**

The sphere:

* Changes **color** based on emotional intensity
* Morphs and distorts based on **cognitive load**

Behavior:

* Increased stress → unstable, vibrant distortion
* Deep focus → stable, calm visuals

This creates a **real-time visual feedback loop** between emotion and awareness.

---

### 🗣️ Voice-Activated AI Journal with Sentiment Analysis

* Users can speak directly to the application
* Voice input is converted to text using the **Web Speech API**
* Text is analyzed using **Natural Language Processing (NLP)**

The sentiment engine assigns a **valence score**:

* Positive sentiment
* Negative sentiment

This analysis is **context-aware**, not keyword-based.

**Examples:**

* `"I am not bad today"` → Positive
* `"I feel devastated"` → Strongly negative

This allows the system to understand **emotional nuance**, not just vocabulary.

---

### 🎵 Adaptive Soundscapes

* Background audio is **automatically controlled**
* When focus drops:

  * Flow-state / ambient music is triggered
* When deep focus is detected:

  * Audio is muted automatically

This minimizes **manual interaction** and prevents audio fatigue.

---

### ⚡ Distraction Zapper

Detects:

* Prolonged inattentiveness
* Sudden emotional drops
* Idle or disengaged states

Instead of harsh alerts, it sends **intelligent nudges** designed to restore awareness **without breaking flow**.

---

## 🛠️ Technology Stack

| Category           | Technology                   | Role                                 |
| ------------------ | ---------------------------- | ------------------------------------ |
| Frontend Framework | React + Vite                 | Core SPA architecture                |
| Computer Vision    | `@vladmandic/face-api`       | Face detection & emotion recognition |
| 3D Rendering       | Three.js + React-Three-Fiber | Neuro-core visualization             |
| NLP                | `sentiment`                  | Text & voice sentiment analysis      |
| Speech Recognition | Web Speech API               | Voice-to-text                        |
| UI System          | Tailwind CSS v4 + ShadCN UI  | Glassmorphism UI                     |
| Data Visualization | Recharts                     | Real-time emotion graphs             |
| State Management   | React Hooks + LocalStorage   | Persistent state                     |

---

## ⚡ Installation & Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/mind-sync.git
```

### 2️⃣ Install dependencies

```bash
pnpm install
```

### 3️⃣ Run the development server

```bash
pnpm run dev
```

---

## 🧠 Design Decision: Why face-api.js?

### ❌ Raw TensorFlow.js

* Low-level API
* Requires:

  * Manual tensor lifecycle management (`tf.tidy`)
  * Custom post-processing
  * Large generic models
* High development overhead for browser apps

### ✅ face-api.js (Chosen)

* Built **on top of TensorFlow.js**
* Provides optimized, pre-trained models for:

  * Face detection
  * Emotion recognition
* Faster development with minimal boilerplate

---

### ❌ MediaPipe

* Extremely powerful but:

  * Heavy due to WebAssembly (WASM)
  * Designed for 468-point facial geometry
* Overkill for emotion-only detection

### ✅ MindSync Approach

* Uses **Tiny Face Detector (~200KB)**
* Runs efficiently on **CPU or WebGL**
* Keeps dashboard smooth and responsive

---

## 🧬 How Biometric Emotion Detection Works

### Conceptual Overview

* Emotion detection is a **classification problem**
* Each video frame is passed through a **CNN**
* The model outputs probabilities (0–1) for 7 emotions
* The highest probability emotion is selected

---

### 1️⃣ Model Loading

```js
await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
await faceapi.nets.faceExpressionNet.loadFromUri('/models');
```

* Pre-trained weights are loaded
* No model training occurs in the browser

---

### 2️⃣ Continuous Inference Loop

```js
setInterval(async () => {
  const video = webcamRef.current.video;

  const detections = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (detections) {
    const expressions = detections.expressions;
    const maxEmotion = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );
    setMood(maxEmotion);
  }
}, 2000);
```

**Internally:**

* Webcam frame is captured
* CNN performs inference via WebGL
* Emotion probabilities are returned
* React state updates trigger UI changes

This loop balances **accuracy and performance**.

---

## 🏗️ Tech-to-UI Component Mapping

| UI Element      | Technology                   | File                             |
| --------------- | ---------------------------- | -------------------------------- |
| Digital Brain   | Three.js + @react-three/drei | `src/components/FocusCore.jsx`   |
| Wobble Effect   | MeshDistortMaterial          | `src/components/FocusCore.jsx`   |
| Real-Time Graph | Recharts `<AreaChart />`     | `src/pages/Dashboard.jsx`        |
| Webcam Feed     | react-webcam                 | `src/pages/Dashboard.jsx`        |
| Face Overlay    | face-api.js                  | `src/pages/Dashboard.jsx`        |
| UI Cards        | Tailwind + ShadCN            | `src/components/ui/card.tsx`     |
| Voice Button    | Web Speech API               | `src/pages/Dashboard.jsx`        |
| Theme Toggle    | Tailwind selector            | `src/components/ThemeToggle.jsx` |

---

## 🧩 Sentiment Analysis Design Choice

### ❌ Primitive (Rejected)

```js
if (text.includes("bad")) score--;
```

**Problems:**

* No context awareness
* No negation handling
* No emotional intensity scaling

---

### ✅ NLP-Based (Implemented)

* Lexicon-based sentiment engine
* Each word has a **weighted emotional value**
* Supports:

  * Negation handling
  * Emotional intensity
  * Contextual scoring

Produces **human-like interpretation**, not keyword matching.

---

## 📌 Final Summary

MindSync is not just a productivity tool —
it is a **cognitive companion** that understands, visualizes, and reacts to human emotion in real time.

It combines:

* AI inference
* 3D visualization
* NLP
* Adaptive UX

All running **entirely in the browser**, optimized for performance, and designed for real-world usability.

