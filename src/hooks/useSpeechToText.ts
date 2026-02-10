import { useState, useCallback, useRef, useEffect } from 'react';

// Interfaces for Web Speech API
interface SpeechRecognitionEvent {
    resultIndex: number;
    results: {
        [key: number]: {
            [key: number]: {
                transcript: string;
            };
        };
        length: number;
    };
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

export const useSpeechToText = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionClass) {
            recognitionRef.current = new SpeechRecognitionClass();
            if (recognitionRef.current) {
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                    let currentTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(currentTranscript);
                };

                recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error('Speech recognition error:', event.error);
                    setIsRecording(false);
                };

                recognitionRef.current.onend = () => {
                    setIsRecording(false);
                };
            }
        }
    }, []);

    const startRecording = useCallback(() => {
        if (recognitionRef.current) {
            setTranscript('');
            recognitionRef.current.start();
            setIsRecording(true);
        } else {
            alert('Speech recognition not supported in this browser.');
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    }, []);

    return { isRecording, transcript, startRecording, stopRecording };
};
