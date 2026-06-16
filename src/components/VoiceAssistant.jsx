import React, { useState, useEffect, useRef } from 'react';
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  useConnectionState, 
  useRoomContext, 
  useLocalParticipant,
  useChat,
  useIsSpeaking
} from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import { Mic, MicOff, PhoneOff, X, Sparkles, AlertCircle, Send, Headset } from 'lucide-react';

// Suggested quick click prompts
const SUGGESTIONS = [
  "What is Awais's background?",
  "Tell me about SheetSense",
  "What are Awais's technical skills?",
  "How can I contact Awais?"
];

/**
 * Split-Pane Voice Assistant Placeholder (Loading/Connecting states)
 */
const VoiceAssistantPlaceholder = ({ onClose, isConnecting, error, onRetry }) => {
  return (
    <div className="voice-assistant-modal-body" style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%' }}>
      {/* Left Profile Pane */}
      <div className="voice-left-pane">
        <button className="voice-left-close-btn" onClick={onClose} title="Close Assistant">
          <X size={20} />
        </button>
        <div className="voice-left-avatar">
          <Headset size={44} />
        </div>
        <h3 className="voice-left-title">Aree</h3>
        <div className="voice-left-status">
          <div className={`status-dot ${isConnecting ? 'connecting' : ''}`}></div>
          <span style={{ color: isConnecting ? '#fbbf24' : '#ef4444' }}>
            {isConnecting ? 'Connecting' : 'Offline'}
          </span>
        </div>
        <p className="voice-left-desc">
          {isConnecting 
            ? "Connecting to the assistant..." 
            : "Assistant is currently offline. Check configuration settings."}
        </p>
      </div>

      {/* Right Content Pane */}
      <div className="voice-right-pane" style={{ justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center' }}>
        {error ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#ef4444' }}>
            <AlertCircle size={40} />
            <h4 style={{ fontWeight: 600 }}>Connection Error</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{error}</p>
            <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem', marginTop: '1rem' }} onClick={onRetry}>
              Retry Connection
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="visualizer-avatar active">
              <Sparkles size={24} />
            </div>
            <h4 style={{ fontWeight: 600, color: 'var(--text-main)' }}>Initializing secure line...</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Establishing WebRTC voice and chat channels</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Inner component that connects to LiveKit Room state.
 * Renders the active voice assistant UI inside <LiveKitRoom>.
 */
const VoiceAssistantInner = ({ onClose, onDisconnect }) => {
  const connectionState = useConnectionState();
  const room = useRoomContext();
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant();
  const { send: sendChatMessage } = useChat();
  
  const [agentParticipant, setAgentParticipant] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [transcripts, setTranscripts] = useState([]);
  
  const logEndRef = useRef(null);

  // Monitor participants to identify the agent
  useEffect(() => {
    if (!room) return;
    
    const updateAgent = () => {
      const participants = Array.from(room.remoteParticipants.values());
      const agent = participants.find(p => p.identity === 'agent' || p.identity?.includes('agent'));
      setAgentParticipant(agent || null);
    };

    updateAgent();
    room.on(RoomEvent.ParticipantConnected, updateAgent);
    room.on(RoomEvent.ParticipantDisconnected, updateAgent);
    
    return () => {
      room.off(RoomEvent.ParticipantConnected, updateAgent);
      room.off(RoomEvent.ParticipantDisconnected, updateAgent);
    };
  }, [room]);

  // Determine speaking states
  const isAgentSpeakingReal = useIsSpeaking(agentParticipant || localParticipant);
  const isAgentSpeaking = agentParticipant ? isAgentSpeakingReal : false;
  const isUserSpeaking = useIsSpeaking(localParticipant);

  // Auto-scroll transcript log to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts]);

  // Listen for real-time transcription segments from the LiveKit agent
  useEffect(() => {
    if (!room) return;

    const onTranscription = (segments, participant) => {
      const isAgent = participant?.identity === 'agent' || participant?.identity?.includes('agent');
      const sender = isAgent ? 'agent' : 'user';

      setTranscripts(prev => {
        const newMap = new Map();
        
        // Keep previous completed transcriptions
        prev.forEach(t => {
          if (t.final || !segments.some(s => s.id === t.id)) {
            newMap.set(t.id, t);
          }
        });

        // Add or update current segments
        segments.forEach(s => {
          newMap.set(s.id, {
            id: s.id,
            sender: sender,
            text: s.text,
            final: s.final,
            timestamp: s.firstReceivedTime || Date.now()
          });
        });

        return Array.from(newMap.values()).sort((a, b) => a.timestamp - b.timestamp);
      });
    };

    room.on(RoomEvent.TranscriptionReceived, onTranscription);
    return () => {
      room.off(RoomEvent.TranscriptionReceived, onTranscription);
    };
  }, [room]);

  // Handle sending typed messages
  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!textInput.trim()) return;

    // Send via LiveKit chat topic (lk-chat) so agent receives it
    sendChatMessage(textInput);

    // Append to visual transcripts immediately
    const messageText = textInput;
    setTranscripts(prev => [
      ...prev,
      { id: `chat-${Date.now()}`, sender: 'user', text: messageText, final: true, timestamp: Date.now() }
    ]);

    setTextInput('');
  };

  const toggleMute = () => {
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    }
  };

  // Determine left pane descriptions
  const getLeftDesc = () => {
    if (connectionState === 'connected') {
      if (agentParticipant) return "Connected to the assistant. Speak or type a message below.";
      return "Establishing call assistant agent...";
    }
    if (connectionState === 'connecting' || connectionState === 'reconnecting') {
      return "Connecting to voice server...";
    }
    return "Call disconnected.";
  };

  return (
    <div className="voice-assistant-modal-body" style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%' }}>
      {/* Left Profile Pane */}
      <div className="voice-left-pane">
        <button className="voice-left-close-btn" onClick={onClose} title="Close Assistant">
          <X size={20} />
        </button>
        <div className="voice-left-avatar">
          <Headset size={44} />
        </div>
        <h3 className="voice-left-title">Aree</h3>
        <div className="voice-left-status">
          <div className={`status-dot ${connectionState === 'connected' ? 'connected' : connectionState === 'connecting' ? 'connecting' : ''}`}></div>
          <span style={{ color: connectionState === 'connected' ? '#22c55e' : connectionState === 'connecting' ? '#fbbf24' : '#ef4444' }}>
            {connectionState === 'connected' ? 'Online' : connectionState === 'connecting' ? 'Connecting' : 'Offline'}
          </span>
        </div>
        <p className="voice-left-desc">{getLeftDesc()}</p>
      </div>

      {/* Right Content Pane */}
      <div className="voice-right-pane">
        {/* Scrollable Conversation Transcripts */}
        <div className="transcripts-log">
          {transcripts.map((t, idx) => (
            <div key={t.id || idx} className={`transcript-bubble ${t.sender}`}>
              <span style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.2rem', opacity: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>
                {t.sender === 'agent' ? 'Aree' : 'You'}
              </span>
              {t.text || "..."}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        {/* Suggested quick clicks (shown only if log is empty/just welcome) */}
        {transcripts.length <= 2 && (
          <div className="voice-prompt-suggestion" style={{ padding: '0 1.5rem', marginBottom: '0.5rem' }}>
            {SUGGESTIONS.map((s, idx) => (
              <button 
                key={idx} 
                className="suggestion-btn"
                onClick={() => {
                  setTextInput(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Right Footer (Controls & Typing input) */}
        <div className="voice-right-footer">
          {/* Controls row */}
          <div className="voice-footer-controls">
            {/* Speaking/Listening status indicator */}
            <div className="voice-speaking-indicator">
              <span style={{ color: isAgentSpeaking ? 'var(--accent-secondary)' : isUserSpeaking ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                {isAgentSpeaking ? "Aree is speaking..." : isUserSpeaking ? "Listening..." : "Connected"}
              </span>
              {/* Visualizer audio waveform bars */}
              <div className={`waveform-bars ${(isAgentSpeaking || isUserSpeaking) ? 'active' : ''}`} style={{ position: 'relative', opacity: 1, height: '24px', display: 'flex', gap: '3px', alignItems: 'center' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="waveform-bar" 
                    style={{ 
                      width: '2px', 
                      height: '4px', 
                      backgroundColor: isAgentSpeaking ? 'var(--accent-secondary)' : isUserSpeaking ? 'var(--accent-primary)' : '#64748b',
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: isAgentSpeaking ? '0.4s' : '0.6s'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                onClick={toggleMute}
                className={`voice-mic-pill ${!isMicrophoneEnabled ? 'muted' : ''}`}
                title={isMicrophoneEnabled ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isMicrophoneEnabled ? (
                  <>
                    <Mic size={14} />
                    <span>Mic On</span>
                  </>
                ) : (
                  <>
                    <MicOff size={14} />
                    <span>Mic Off</span>
                  </>
                )}
              </button>

              <button 
                onClick={onDisconnect}
                className="voice-hangup-btn"
                title="End Call"
              >
                <PhoneOff size={16} />
              </button>
            </div>
          </div>

          {/* Typing input form */}
          <form onSubmit={handleSend} className="voice-input-form">
            <input 
              type="text" 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your message..."
              className="voice-text-input"
            />
            <button type="submit" className="voice-send-btn" title="Send message" disabled={!textInput.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Mandatory renderer for WebRTC audio to be heard */}
      <RoomAudioRenderer />
    </div>
  );
};

/**
 * Main wrapper component for the Voice Assistant widget.
 */
const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [token, setToken] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [error, setError] = useState('');

  const startCall = async () => {
    setError('');
    setCallActive(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_VERCEL_API_URL || '';
      const uniqueRoomName = `portfolio-${Math.random().toString(36).substring(2, 9)}`;
      const res = await fetch(`${apiBaseUrl}/api/token?room=${uniqueRoomName}`);
      if (!res.ok) {
        throw new Error(`Failed to retrieve token. Server returned ${res.status}`);
      }
      const data = await res.json();
      if (!data.token || !data.serverUrl) {
        throw new Error("Invalid response from token generator.");
      }
      
      setToken(data.token);
      setServerUrl(data.serverUrl);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to establish secure session.");
      setCallActive(false);
    }
  };

  const endCall = () => {
    setCallActive(false);
    setToken('');
    setServerUrl('');
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button 
        className={`voice-assistant-fab ${callActive ? 'active' : ''}`}
        onClick={() => {
          setIsOpen(true);
          if (!callActive) {
            startCall();
          }
        }}
        title="Talk to Awais's Voice Assistant"
      >
        {!callActive && <div className="voice-assistant-fab-pulse"></div>}
        <Headset size={26} />
      </button>

      {/* Main Glassmorphic Panel Overlay */}
      <div className={`voice-assistant-modal ${isOpen ? '' : 'hidden'}`}>
        {error ? (
          <VoiceAssistantPlaceholder 
            onClose={() => setIsOpen(false)} 
            isConnecting={false} 
            error={error} 
            onRetry={startCall}
          />
        ) : callActive && token && serverUrl ? (
          <LiveKitRoom
            video={false}
            audio={true}
            token={token}
            serverUrl={serverUrl}
            onDisconnected={endCall}
            style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}
          >
            <VoiceAssistantInner 
              onClose={() => setIsOpen(false)} 
              onDisconnect={endCall} 
            />
          </LiveKitRoom>
        ) : (
          <VoiceAssistantPlaceholder 
            onClose={() => setIsOpen(false)} 
            isConnecting={callActive} 
            error={null} 
            onRetry={startCall}
          />
        )}
      </div>
    </>
  );
};

export default VoiceAssistant;
