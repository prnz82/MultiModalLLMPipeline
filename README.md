# Multi-Modal AI Orchestration Assignment

## Project Overview
This project processes **Images** and **Audio** inputs to generate context-aware text responses. Unlike simple API wrappers, this system implements a complex **Multi-Step Reasoning Pipeline** that allows users to guide the AI's output through specific **Intents** (e.g., Technical Analysis, Simplification).

## Core Features

### 1. Dual-Modality Support
The system is built to handle multiple types of unstructured data natively:
*   **Image Processing**: Accepts standard formats (JPG, PNG) and interacts with the model's vision capabilities.
*   **Audio Processing**: Accepts audio files (MP3, WAV) and interacts with the model's listening capabilities.
*   **Unified Interface**: A single drag-and-drop zone automatically detects the file type and routes it to the correct processing logic.

### 2. Multi-Intent Architecture
The user is not passive; they explicitly control *how* the AI processes the data. We implemented four distinct intent pathways:
*   **Describe**: Focuses on a rich, narrative description of the visual or auditory content.
*   **Technical Analysis**: Instructs the pipeline to use precise terminology and focus on specifications or structural details.
*   **Simplify**: Forces the model to explain the content using analogies suitable for a layperson or child.
*   **Summarize**: Constrains the output to a concise executive summary.

### 3. The 3-Stage Reasoning Pipeline
To ensure high accuracy and adherence to the selected intent, we implemented a sophisticated orchestration pipeline rather than a single call.

*   **Stage 1: Modality Reduction**
    *   The raw binary input (image/audio) is first sent to the model to generate a high-fidelity textual representation.
    *   *Goal*: conversion of raw signals into a machine-readable text format.

*   **Stage 2: Analytical Reasoning Layer**
    *   The system takes the raw text from Stage 1 and injects a "Reasoning Prompt".
    *   This step filters out hallucinations, corrects OCR/ASR errors, and identifies the key entities and facts in a neutral manner.

*   **Stage 3: Intent Synthesis**
    *   Finally, the system combines the *validated facts* from Stage 2 with the *User Intent*.
    *   The model synthesizes the final response, adopting the specific tone and vocabulary requested (e.g., technical vs. simple).

### 4. Real-Time Performance Metrics
To interpret the efficiency of the pipeline, we integrated real-time monitoring on the frontend:
*   **Latency Calculator**: Tracks the precise end-to-end time taken for the entire 3-stage pipeline (from upload to final render), allowing us to monitor system bottlenecks.
*   **Token Estimator**: Provides a computed estimate of the tokens used for each transaction. This is crucial for understanding the computational cost of the different "Intent" pathways.

## Technical Implementation
*   **Backend**: Node.js & Express (Orchestration logic)
*   **Frontend**: React + Vite (UI & State Management)
*   **Model**: Google Gemini 1.5 Flash (via unified multimodal API)
*   **Optimization**: In-memory caching prevents redundant processing for identical requests.

## Deployment

This application can be deployed to **Vercel's free tier** for both backend (serverless functions) and frontend (static site).

**Quick Overview:**
- Backend deploys as serverless API with automatic scaling
- Frontend deploys as static site with environment-based API configuration
- Cold starts: ~1-3s after inactivity (expected on free tier)
- File size limit: 4MB (Vercel free tier constraint)

## How to Run

1.  **Backend**:
    ```bash
    cd backend
    npm install
    npm start
    ```
    Runs on `http://localhost:3000`.

2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Runs on `http://localhost:5173`.
