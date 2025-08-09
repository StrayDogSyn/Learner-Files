# Advanced Portfolio Features - Implementation Guide

## 1. Overview

This guide provides step-by-step instructions for implementing advanced portfolio features including 3D visualizations, live collaboration, achievement systems, and comprehensive monitoring.

## 2. Prerequisites

### 2.1 Required Dependencies

```bash
# Core 3D and Animation
npm install three @react-three/fiber @react-three/drei
npm install framer-motion lottie-react

# Collaboration and Real-time
npm install socket.io-client monaco-editor @monaco-editor/react
npm install @tanstack/react-query axios

# PDF Generation and File Handling
npm install jspdf html2canvas react-pdf
npm install file-saver jszip

# Testing and Quality
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm install --save-dev playwright @axe-core/playwright
npm install --save-dev @storybook/react @storybook/addon-essentials

# Performance and Monitoring
npm install @sentry/react workbox-webpack-plugin
npm install web-vitals intersection-observer

# PWA and Service Worker
npm install vite-plugin-pwa workbox-window

# WebAssembly (optional)
npm install --save-dev @assemblyscript/loader
```

### 2.2 Environment Setup

```bash
# .env.local
VITE_GITHUB_TOKEN=your_github_token
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SENTRY_DSN=your_sentry_dsn
VITE_SOCKET_URL=ws://localhost:3001
VITE_CLAUDE_API_KEY=your_claude_api_key
```

## 3. 3D Project Visualization Implementation

### 3.1 Three.js Scene Setup

```typescript
// src/components/3D/Scene3D.tsx
import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Text, Html } from '@react-three/drei'
import { Vector3 } from 'three'
import { motion } from 'framer-motion'

interface Project3DProps {
  projects: Project[]
  onProjectSelect: (project: Project) => void
}

export const Scene3D: React.FC<Project3DProps> = ({ projects, onProjectSelect }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <ProjectGrid 
            projects={projects} 
            onSelect={(project) => {
              setSelectedProject(project)
              onProjectSelect(project)
            }}
          />
          
          {selectedProject && (
            <ProjectDetails project={selectedProject} />
          )}
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={20}
            minDistance={5}
          />
        </Suspense>
      </Canvas>
      
      <UI3D selectedProject={selectedProject} />
    </div>
  )
}

// 3D Project Grid Component
const ProjectGrid: React.FC<{ projects: Project[], onSelect: (project: Project) => void }> = ({ projects, onSelect }) => {
  return (
    <group>
      {projects.map((project, index) => {
        const position = new Vector3(
          (index % 3 - 1) * 4,
          Math.floor(index / 3) * 3,
          0
        )
        
        return (
          <ProjectCube 
            key={project.id}
            project={project}
            position={position}
            onClick={() => onSelect(project)}
          />
        )
      })}
    </group>
  )
}

// Individual Project Cube
const ProjectCube: React.FC<{ project: Project, position: Vector3, onClick: () => void }> = ({ project, position, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={hovered ? '#00D9FF' : '#2D3748'}
        metalness={0.8}
        roughness={0.2}
      />
      
      <Html distanceFactor={10}>
        <div className="bg-black/80 text-white p-2 rounded text-sm max-w-32">
          <h3 className="font-bold">{project.name}</h3>
          <p className="text-xs">{project.description}</p>
        </div>
      </Html>
    </mesh>
  )
}
```

### 3.2 Tech Stack Visualization

```typescript
// src/components/3D/TechStackVisualization.tsx
import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface TechStackProps {
  technologies: string[]
  centerPosition?: [number, number, number]
}

export const TechStackVisualization: React.FC<TechStackProps> = ({ 
  technologies, 
  centerPosition = [0, 0, 0] 
}) => {
  const techNodes = useMemo(() => {
    return technologies.map((tech, index) => {
      const angle = (index / technologies.length) * Math.PI * 2
      const radius = 3
      
      return {
        name: tech,
        position: [
          centerPosition[0] + Math.cos(angle) * radius,
          centerPosition[1] + Math.sin(angle) * radius,
          centerPosition[2]
        ] as [number, number, number],
        color: getTechColor(tech)
      }
    })
  }, [technologies, centerPosition])

  return (
    <group>
      {/* Central hub */}
      <mesh position={centerPosition}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Tech nodes */}
      {techNodes.map((node, index) => (
        <TechNode 
          key={node.name}
          name={node.name}
          position={node.position}
          color={node.color}
          centerPosition={centerPosition}
        />
      ))}
    </group>
  )
}

const TechNode: React.FC<{
  name: string
  position: [number, number, number]
  color: string
  centerPosition: [number, number, number]
}> = ({ name, position, color, centerPosition }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const lineRef = useRef<THREE.BufferGeometry>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02
    }
  })

  const linePoints = useMemo(() => {
    return [new THREE.Vector3(...centerPosition), new THREE.Vector3(...position)]
  }, [centerPosition, position])

  return (
    <group>
      {/* Connection line */}
      <line>
        <bufferGeometry ref={lineRef}>
          <bufferAttribute
            attach="attributes-position"
            count={linePoints.length}
            array={new Float32Array(linePoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} opacity={0.6} transparent />
      </line>
      
      {/* Tech node */}
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} />
        
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </mesh>
    </group>
  )
}

function getTechColor(tech: string): string {
  const colors: Record<string, string> = {
    'React': '#61DAFB',
    'TypeScript': '#3178C6',
    'Three.js': '#000000',
    'Node.js': '#339933',
    'Python': '#3776AB',
    'JavaScript': '#F7DF1E',
    'CSS': '#1572B6',
    'HTML': '#E34F26'
  }
  return colors[tech] || '#888888'
}
```

## 4. Live Collaboration Features

### 4.1 Real-time Code Editor

```typescript
// src/components/Collaboration/CodePlayground.tsx
import React, { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { io, Socket } from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'

interface CodePlaygroundProps {
  initialCode?: string
  language?: string
  sessionId?: string
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode = '',
  language = 'typescript',
  sessionId
}) => {
  const [code, setCode] = useState(initialCode)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const editorRef = useRef<any>(null)

  useEffect(() => {
    if (sessionId) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        query: { sessionId }
      })

      socketRef.current.on('connect', () => setIsConnected(true))
      socketRef.current.on('disconnect', () => setIsConnected(false))
      
      socketRef.current.on('code-change', (data: { code: string, userId: string }) => {
        if (editorRef.current) {
          editorRef.current.setValue(data.code)
        }
      })

      socketRef.current.on('collaborators-update', (users: Collaborator[]) => {
        setCollaborators(users)
      })

      socketRef.current.on('cursor-position', (data: { userId: string, position: any }) => {
        // Update cursor positions in editor
        updateCollaboratorCursor(data.userId, data.position)
      })

      return () => {
        socketRef.current?.disconnect()
      }
    }
  }, [sessionId])

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
      socketRef.current?.emit('code-change', { code: value })
    }
  }

  const handleCursorChange = (position: any) => {
    socketRef.current?.emit('cursor-position', { position })
  }

  const runCode = async () => {
    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      })
      
      const result = await response.json()
      // Handle execution result
    } catch (error) {
      console.error('Code execution failed:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Collaboration Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-white text-sm">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {collaborators.map((collaborator) => (
            <CollaboratorAvatar key={collaborator.id} collaborator={collaborator} />
          ))}
        </div>
        
        <button
          onClick={runCode}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Run Code
        </button>
      </div>

      {/* Code Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          onMount={(editor) => {
            editorRef.current = editor
            
            // Setup cursor tracking
            editor.onDidChangeCursorPosition((e) => {
              handleCursorChange(e.position)
            })
          }}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true
          }}
        />
      </div>
    </div>
  )
}

const CollaboratorAvatar: React.FC<{ collaborator: Collaborator }> = ({ collaborator }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="relative"
    >
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
        style={{ backgroundColor: collaborator.color }}
      >
        {collaborator.name.charAt(0).toUpperCase()}
      </div>
      
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
    </motion.div>
  )
}
```

### 4.2 API Testing Interface

```typescript
// src/components/Collaboration/APITester.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Copy, Download } from 'lucide-react'

interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers: Record<string, string>
  body?: string
}

interface APIResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  duration: number
}

export const APITester: React.FC = () => {
  const [request, setRequest] = useState<APIRequest>({
    method: 'GET',
    url: 'https://api.github.com/users/octocat',
    headers: { 'Content-Type': 'application/json' }
  })
  const [response, setResponse] = useState<APIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<(APIRequest & { response: APIResponse })[]>([])

  const executeRequest = async () => {
    setLoading(true)
    const startTime = Date.now()
    
    try {
      const fetchOptions: RequestInit = {
        method: request.method,
        headers: request.headers
      }
      
      if (request.body && request.method !== 'GET') {
        fetchOptions.body = request.body
      }
      
      const response = await fetch(request.url, fetchOptions)
      const data = await response.json()
      const duration = Date.now() - startTime
      
      const apiResponse: APIResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        duration
      }
      
      setResponse(apiResponse)
      setHistory(prev => [{ ...request, response: apiResponse }, ...prev.slice(0, 9)])
      
    } catch (error) {
      const apiResponse: APIResponse = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: { error: error.message },
        duration: Date.now() - startTime
      }
      
      setResponse(apiResponse)
    } finally {
      setLoading(false)
    }
  }

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))
    }
  }

  const exportHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'api-test-history.json'
    a.click()
  }

  return (
    <div className="flex h-full">
      {/* Request Panel */}
      <div className="w-1/2 p-4 border-r border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Request</h3>
        
        {/* Method and URL */}
        <div className="flex space-x-2 mb-4">
          <select
            value={request.method}
            onChange={(e) => setRequest(prev => ({ ...prev, method: e.target.value as any }))}
            className="px-3 py-2 bg-gray-800 text-white rounded"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          
          <input
            type="text"
            value={request.url}
            onChange={(e) => setRequest(prev => ({ ...prev, url: e.target.value }))}
            placeholder="Enter API URL"
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded"
          />
          
          <button
            onClick={executeRequest}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Play size={16} />
            <span>{loading ? 'Sending...' : 'Send'}</span>
          </button>
        </div>
        
        {/* Headers */}
        <div className="mb-4">
          <h4 className="text-white font-semibold mb-2">Headers</h4>
          <HeaderEditor 
            headers={request.headers}
            onChange={(headers) => setRequest(prev => ({ ...prev, headers }))}
          />
        </div>
        
        {/* Body */}
        {request.method !== 'GET' && (
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-2">Body</h4>
            <textarea
              value={request.body || ''}
              onChange={(e) => setRequest(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Request body (JSON)"
              className="w-full h-32 px-3 py-2 bg-gray-800 text-white rounded font-mono text-sm"
            />
          </div>
        )}
        
        {/* History */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-semibold">History</h4>
            <button
              onClick={exportHistory}
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.map((item, index) => (
              <HistoryItem
                key={index}
                request={item}
                response={item.response}
                onClick={() => setRequest({ ...item, body: item.body })}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Response Panel */}
      <div className="w-1/2 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Response</h3>
          {response && (
            <button
              onClick={copyResponse}
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
          )}
        </div>
        
        {response ? (
          <ResponseViewer response={response} />
        ) : (
          <div className="text-gray-400 text-center py-8">
            Send a request to see the response
          </div>
        )}
      </div>
    </div>
  )
}

const ResponseViewer: React.FC<{ response: APIResponse }> = ({ response }) => {
  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="flex items-center space-x-4">
        <div className={`px-3 py-1 rounded text-sm font-bold ${
          response.status >= 200 && response.status < 300 
            ? 'bg-green-600 text-white'
            : response.status >= 400
            ? 'bg-red-600 text-white'
            : 'bg-yellow-600 text-white'
        }`}>
          {response.status} {response.statusText}
        </div>
        
        <div className="text-gray-400 text-sm">
          {response.duration}ms
        </div>
      </div>
      
      {/* Headers */}
      <div>
        <h4 className="text-white font-semibold mb-2">Response Headers</h4>
        <div className="bg-gray-800 rounded p-3 text-sm font-mono text-gray-300 max-h-32 overflow-y-auto">
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key}>
              <span className="text-blue-400">{key}:</span> {value}
            </div>
          ))}
        </div>
      </div>
      
      {/* Body */}
      <div>
        <h4 className="text-white font-semibold mb-2">Response Body</h4>
        <div className="bg-gray-800 rounded p-3 text-sm font-mono text-gray-300 max-h-96 overflow-y-auto">
          <pre>{JSON.stringify(response.data, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
```

## 5. Achievement System Implementation

### 5.1 Achievement Engine

```typescript
// src/services/achievementService.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  category: 'exploration' | 'technical' | 'social' | 'milestone'
  unlockConditions: {
    type: 'page_view' | 'interaction' | 'time_spent' | 'api_call' | 'collaboration'
    target?: string
    count?: number
    duration?: number
  }[]
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
  unlockedAt?: Date
  progress: number
}

interface AchievementState {
  achievements: Achievement[]
  totalPoints: number
  unlockedCount: number
  notifications: Achievement[]
  
  // Actions
  initializeAchievements: () => void
  trackEvent: (event: UserEvent) => void
  unlockAchievement: (achievementId: string) => void
  dismissNotification: (achievementId: string) => void
  getAchievementsByCategory: (category: string) => Achievement[]
  getProgressPercentage: () => number
}

export const useAchievementStore = create<AchievementState>()()
  persist(
    (set, get) => ({
      achievements: [],
      totalPoints: 0,
      unlockedCount: 0,
      notifications: [],

      initializeAchievements: () => {
        const defaultAchievements: Achievement[] = [
          {
            id: 'first-visit',
            name: 'Welcome Explorer',
            description: 'Welcome to my portfolio!',
            icon: '👋',
            points: 10,
            category: 'milestone',
            unlockConditions: [{ type: 'page_view', target: 'home' }],
            rarity: 'common',
            unlocked: false,
            progress: 0
          },
          {
            id: '3d-explorer',
            name: '3D Pioneer',
            description: 'Explored the 3D showcase for 30 seconds',
            icon: '🎮',
            points: 25,
            category: 'exploration',
            unlockConditions: [{ type: 'time_spent', target: '3d-showcase', duration: 30000 }],
            rarity: 'common',
            unlocked: false,
            progress: 0
          },
          {
            id: 'api-master',
            name: 'API Master',
            description: 'Successfully tested 5 different API endpoints',
            icon: '🔌',
            points: 50,
            category: 'technical',
            unlockConditions: [{ type: 'api_call', count: 5 }],
            rarity: 'rare',
            unlocked: false,
            progress: 0
          },
          {
            id: 'code-collaborator',
            name: 'Code Collaborator',
            description: 'Participated in live code collaboration',
            icon: '👥',
            points: 75,
            category: 'social',
            unlockConditions: [{ type: 'collaboration', target: 'code-session' }],
            rarity: 'epic',
            unlocked: false,
            progress: 0
          },
          {
            id: 'portfolio-legend',
            name: 'Portfolio Legend',
            description: 'Unlocked all other achievements',
            icon: '👑',
            points: 200,
            category: 'milestone',
            unlockConditions: [{ type: 'milestone', count: 10 }],
            rarity: 'legendary',
            unlocked: false,
            progress: 0
          }
        ]
        
        set({ achievements: defaultAchievements })
      },

      trackEvent: (event: UserEvent) => {
        const { achievements } = get()
        const updatedAchievements = achievements.map(achievement => {
          if (achievement.unlocked) return achievement
          
          const progress = calculateProgress(achievement, event)
          const shouldUnlock = checkUnlockConditions(achievement, event)
          
          if (shouldUnlock && !achievement.unlocked) {
            // Unlock achievement
            const unlockedAchievement = {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date(),
              progress: 100
            }
            
            // Add to notifications
            set(state => ({
              notifications: [...state.notifications, unlockedAchievement]
            }))
            
            // Trigger celebration animation
            triggerAchievementCelebration(unlockedAchievement)
            
            return unlockedAchievement
          }
          
          return { ...achievement, progress }
        })
        
        const totalPoints = updatedAchievements
          .filter(a => a.unlocked)
          .reduce((sum, a) => sum + a.points, 0)
          
        const unlockedCount = updatedAchievements.filter(a => a.unlocked).length
        
        set({ 
          achievements: updatedAchievements,
          totalPoints,
          unlockedCount
        })
      },

      unlockAchievement: (achievementId: string) => {
        set(state => ({
          achievements: state.achievements.map(achievement =>
            achievement.id === achievementId
              ? { ...achievement, unlocked: true, unlockedAt: new Date(), progress: 100 }
              : achievement
          )
        }))
      },

      dismissNotification: (achievementId: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== achievementId)
        }))
      },

      getAchievementsByCategory: (category: string) => {
        return get().achievements.filter(a => a.category === category)
      },

      getProgressPercentage: () => {
        const { achievements } = get()
        const totalAchievements = achievements.length
        const unlockedAchievements = achievements.filter(a => a.unlocked).length
        return totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0
      }
    }),
    {
      name: 'achievement-storage',
      version: 1
    }
  )

// Helper functions
function calculateProgress(achievement: Achievement, event: UserEvent): number {
  // Implementation for calculating progress based on event and conditions
  return achievement.progress
}

function checkUnlockConditions(achievement: Achievement, event: UserEvent): boolean {
  // Implementation for checking if unlock conditions are met
  return false
}

function triggerAchievementCelebration(achievement: Achievement) {
  // Trigger confetti or other celebration effects
  console.log(`🎉 Achievement unlocked: ${achievement.name}!`)
}
```

### 5.2 Achievement UI Components

```typescript
// src/components/Achievement/AchievementCenter.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Users, Code, Target } from 'lucide-react'
import { useAchievementStore } from '../../services/achievementService'

export const AchievementCenter: React.FC = () => {
  const { 
    achievements, 
    totalPoints, 
    getAchievementsByCategory,
    getProgressPercentage 
  } = useAchievementStore()
  
  const categories = [
    { id: 'milestone', name: 'Milestones', icon: Trophy, color: 'text-yellow-400' },
    { id: 'exploration', name: 'Exploration', icon: Target, color: 'text-blue-400' },
    { id: 'technical', name: 'Technical', icon: Code, color: 'text-green-400' },
    { id: 'social', name: 'Social', icon: Users, color: 'text-purple-400' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Achievement Center</h1>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{totalPoints}</div>
              <div className="text-gray-400">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {achievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-gray-400">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {Math.round(getProgressPercentage())}%
              </div>
              <div className="text-gray-400">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="bg-gray-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {categories.map(category => {
            const categoryAchievements = getAchievementsByCategory(category.id)
            const Icon = category.icon
            
            return (
              <div key={category.id} className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Icon className={`w-6 h-6 ${category.color}`} />
                  <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                  <div className="text-gray-400">
                    ({categoryAchievements.filter(a => a.unlocked).length}/{categoryAchievements.length})
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const rarityColors = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500'
  }
  
  const rarityGradients = {
    common: 'from-gray-600 to-gray-700',
    rare: 'from-blue-600 to-blue-700',
    epic: 'from-purple-600 to-purple-700',
    legendary: 'from-yellow-600 to-yellow-700'
  }

  return (
    <motion.div
      className={`relative bg-gradient-to-br ${rarityGradients[achievement.rarity]} rounded-lg p-4 border-2 ${
        rarityColors[achievement.rarity]
      } ${achievement.unlocked ? 'opacity-100' : 'opacity-60'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Rarity indicator */}
      <div className="absolute top-2 right-2">
        {Array.from({ length: getRarityStars(achievement.rarity) }).map((_, i) => (
          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current inline" />
        ))}
      </div>
      
      {/* Icon */}
      <div className="text-4xl mb-3">{achievement.icon}</div>
      
      {/* Content */}
      <h3 className="text-lg font-bold text-white mb-2">{achievement.name}</h3>
      <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
      
      {/* Points */}
      <div className="flex items-center justify-between">
        <div className="text-yellow-400 font-bold">{achievement.points} pts</div>
        
        {achievement.unlocked ? (
          <div className="text-green-400 text-sm">
            ✓ Unlocked {achievement.unlockedAt && formatDate(achievement.unlockedAt)}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">
            {achievement.progress}% complete
          </div>
        )}
      </div>
      
      {/* Progress bar for locked achievements */}
      {!achievement.unlocked && achievement.progress > 0 && (
        <div className="mt-3">
          <div className="bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${achievement.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

function getRarityStars(rarity: string): number {
  const stars = { common: 1, rare: 2, epic: 3, legendary: 4 }
  return stars[rarity] || 1
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}
```

## 6. Resume Builder Implementation

### 6.1 Dynamic PDF Generation

```typescript
// src/components/Resume/ResumeBuilder.tsx
import React, { useState, useRef } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { motion } from 'framer-motion'
import { Download, Eye, Edit, Save } from 'lucide-react'

interface ResumeData {
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    website: string
  }
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  customSections: CustomSection[]
}

interface ResumeTemplate {
  id: string
  name: string
  preview: string
  component: React.ComponentType<{ data: ResumeData }>
}

export const ResumeBuilder: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(getDefaultResumeData())
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern')
  const [isGenerating, setIsGenerating] = useState(false)
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const resumeRef = useRef<HTMLDivElement>(null)

  const templates: ResumeTemplate[] = [
    { id: 'modern', name: 'Modern', preview: '/templates/modern.png', component: ModernTemplate },
    { id: 'classic', name: 'Classic', preview: '/templates/classic.png', component: ClassicTemplate },
    { id: 'creative', name: 'Creative', preview: '/templates/creative.png', component: CreativeTemplate },
    { id: 'minimal', name: 'Minimal', preview: '/templates/minimal.png', component: MinimalTemplate }
  ]

  const generatePDF = async () => {
    if (!resumeRef.current) return
    
    setIsGenerating(true)
    
    try {
      // Capture the resume as canvas
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        imgHeight
      )
      
      // Save PDF
      const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
      pdf.save(fileName)
      
      // Save version
      const version: ResumeVersion = {
        id: Date.now().toString(),
        name: `Version ${versions.length + 1}`,
        templateId: selectedTemplate,
        data: resumeData,
        createdAt: new Date(),
        pdfBlob: pdf.output('blob')
      }
      
      setVersions(prev => [version, ...prev])
      
    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const loadTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData(prev => ({ ...prev, [section]: data }))
  }

  const SelectedTemplate = templates.find(t => t.id === selectedTemplate)?.component || ModernTemplate

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Editor Panel */}
        <div className="w-1/3 bg-white border-r border-gray-300 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Resume Builder</h2>
            
            {/* Template Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Choose Template</h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map(template => (
                  <motion.div
                    key={template.id}
                    className={`cursor-pointer border-2 rounded-lg p-2 ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => loadTemplate(template.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <div className="text-sm font-medium text-center">{template.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Data Editor */}
            <ResumeDataEditor 
              data={resumeData}
              onChange={updateResumeData}
            />
            
            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Download size={20} />
                <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
              </button>
              
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Save size={20} />
                <span>Save Version</span>
              </button>
            </div>
            
            {/* Version History */}
            {versions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Version History</h3>
                <div className="space-y-2">
                  {versions.map(version => (
                    <VersionItem key={version.id} version={version} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div 
                ref={resumeRef}
                className="bg-white shadow-lg"
                style={{ minHeight: '297mm', width: '210mm' }} // A4 dimensions
              >
                <SelectedTemplate data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modern Template Component
const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="p-8 font-sans">
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personalInfo.name}</h1>
        <h2 className="text-xl text-blue-600 mb-4">{data.personalInfo.title}</h2>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div>{data.personalInfo.email}</div>
          <div>{data.personalInfo.phone}</div>
          <div>{data.personalInfo.location}</div>
          <div>{data.personalInfo.website}</div>
        </div>
      </div>
      
      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}
      
      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Professional Experience
          </h3>
          
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">{exp.position}</h4>
                  <div className="text-blue-600 font-medium">{exp.company}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </div>
              </div>
              
              {exp.description && (
                <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
              )}
              
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Technical Skills
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(groupSkillsByCategory(data.skills)).map(([category, skills]) => (
              <div key={category}>
                <h4 className="font-semibold text-gray-900 mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Key Projects
          </h3>
          
          {data.projects.slice(0, 3).map((project, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900">{project.name}</h4>
                {project.url && (
                  <a href={project.url} className="text-blue-600 text-sm hover:underline">
                    View Project
                  </a>
                )}
              </div>
              
              <p className="text-gray-700 text-sm mb-2">{project.description}</p>
              
              {project.technologies && (
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 5).map((tech, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Education */}
      {data.education.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Education
          </h3>
          
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                  <div className="text-blue-600">{edu.institution}</div>
                  {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
                </div>
                <div className="text-sm text-gray-600">{edu.year}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getDefaultResumeData(): ResumeData {
  return {
    personalInfo: {
      name: 'Your Name',
      title: 'Software Developer',
      email: 'your.email@example.com',
      phone: '+1 (555) 123-4567',
      location: 'City, State',
      website: 'https://yourportfolio.com'
    },
    summary: 'Passionate software developer with expertise in modern web technologies...',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    customSections: []
  }
}

function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)
}
```

This implementation guide provides comprehensive code examples for implementing advanced portfolio features. The guide covers 3D visualizations, live collaboration, achievement systems, and resume building with detailed TypeScript implementations and best practices.