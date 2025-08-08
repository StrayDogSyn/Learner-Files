# 🔧 Portfolio Transformation Technical Specifications
## Detailed Implementation Guide

### Table of Contents
1. [Project Structure](#project-structure)
2. [Component Specifications](#component-specifications)
3. [API Definitions](#api-definitions)
4. [Type Definitions](#type-definitions)
5. [Configuration Files](#configuration-files)
6. [Styling System](#styling-system)
7. [Performance Optimizations](#performance-optimizations)

---

## 📁 Project Structure

```text
portfolio-nextjs/
├── app/
│   ├── (pages)/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   ├── github/
│   │   │   └── route.ts
│   │   └── contact/
│   │       └── route.ts
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   └── Button.module.css
│   │   │   ├── Typography/
│   │   │   │   ├── Typography.tsx
│   │   │   │   └── Typography.types.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Input.types.ts
│   │   │   └── Icon/
│   │   │       ├── Icon.tsx
│   │   │       └── Icon.types.ts
│   │   ├── molecules/
│   │   │   ├── SearchBox/
│   │   │   │   ├── SearchBox.tsx
│   │   │   │   └── SearchBox.types.ts
│   │   │   ├── ProjectCard/
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   └── ProjectCard.types.ts
│   │   │   ├── SkillBadge/
│   │   │   │   ├── SkillBadge.tsx
│   │   │   │   └── SkillBadge.types.ts
│   │   │   └── ThemeToggle/
│   │   │       ├── ThemeToggle.tsx
│   │   │       └── ThemeToggle.types.ts
│   │   ├── organisms/
│   │   │   ├── Navigation/
│   │   │   │   ├── Navigation.tsx
│   │   │   │   └── Navigation.types.ts
│   │   │   ├── ProjectGrid/
│   │   │   │   ├── ProjectGrid.tsx
│   │   │   │   └── ProjectGrid.types.ts
│   │   │   ├── ContactForm/
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   └── ContactForm.types.ts
│   │   │   ├── AIChat/
│   │   │   │   ├── AIChat.tsx
│   │   │   │   └── AIChat.types.ts
│   │   │   └── GitHubStats/
│   │   │       ├── GitHubStats.tsx
│   │   │       └── GitHubStats.types.ts
│   │   └── templates/
│   │       ├── MainLayout/
│   │       │   ├── MainLayout.tsx
│   │       │   └── MainLayout.types.ts
│   │       └── ProjectLayout/
│   │           ├── ProjectLayout.tsx
│   │           └── ProjectLayout.types.ts
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useProjectFilter.ts
│   │   ├── useGitHubStats.ts
│   │   ├── useAIChat.ts
│   │   └── useLocalStorage.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── analytics.ts
│   │   ├── github.ts
│   │   ├── ai.ts
│   │   └── validations.ts
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   └── AnalyticsProvider.tsx
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── animations.css
│   ├── types/
│   │   ├── portfolio.ts
│   │   ├── github.ts
│   │   ├── ai.ts
│   │   └── global.ts
│   ├── data/
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   └── personal.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── public/
│   ├── images/
│   │   ├── projects/
│   │   ├── profile/
│   │   └── icons/
│   ├── videos/
│   ├── sw.js
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🧩 Component Specifications

### Atoms

#### Button Component
```typescript
// components/atoms/Button/Button.types.ts
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'glass'
  size: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

// components/atoms/Button/Button.tsx
import { motion } from 'framer-motion'
import { ButtonProps } from './Button.types'

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 focus:ring-amber-500',
    secondary: 'bg-navy-500 text-white hover:bg-navy-600 focus:ring-navy-500',
    ghost: 'text-navy-500 hover:bg-navy-50 focus:ring-navy-500',
    glass: 'glass-card text-white hover:bg-white/20 focus:ring-white/50'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </motion.button>
  )
}

export default Button
```

#### Typography Component
```typescript
// components/atoms/Typography/Typography.types.ts
export interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'code'
  children: React.ReactNode
  className?: string
  gradient?: boolean
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right'
  color?: 'primary' | 'secondary' | 'accent' | 'muted'
}

// components/atoms/Typography/Typography.tsx
import { TypographyProps } from './Typography.types'

const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className = '',
  gradient = false,
  weight = 'normal',
  align = 'left',
  color = 'primary'
}) => {
  const baseClasses = 'transition-colors duration-200'
  
  const variantClasses = {
    h1: 'text-5xl md:text-6xl lg:text-7xl font-display leading-tight',
    h2: 'text-4xl md:text-5xl lg:text-6xl font-display leading-tight',
    h3: 'text-3xl md:text-4xl lg:text-5xl font-display leading-tight',
    h4: 'text-2xl md:text-3xl lg:text-4xl font-display leading-tight',
    h5: 'text-xl md:text-2xl lg:text-3xl font-display leading-tight',
    h6: 'text-lg md:text-xl lg:text-2xl font-display leading-tight',
    body1: 'text-base md:text-lg font-body leading-relaxed',
    body2: 'text-sm md:text-base font-body leading-relaxed',
    caption: 'text-xs md:text-sm font-body leading-normal',
    code: 'text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded'
  }
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  const colorClasses = {
    primary: 'text-navy-900 dark:text-white',
    secondary: 'text-navy-600 dark:text-gray-300',
    accent: 'text-amber-500',
    muted: 'text-gray-500 dark:text-gray-400'
  }
  
  const gradientClass = gradient ? 'bg-gradient-to-r from-amber-500 to-blue-500 bg-clip-text text-transparent' : ''
  
  const Tag = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p'
  
  return (
    <Tag className={`
      ${baseClasses}
      ${variantClasses[variant]}
      ${weightClasses[weight]}
      ${alignClasses[align]}
      ${gradient ? gradientClass : colorClasses[color]}
      ${className}
    `}>
      {children}
    </Tag>
  )
}

export default Typography
```

### Molecules

#### ProjectCard Component
```typescript
// components/molecules/ProjectCard/ProjectCard.types.ts
export interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    image: string
    video?: string
    technologies: string[]
    category: string
    featured: boolean
    liveUrl?: string
    githubUrl?: string
    complexity: 'beginner' | 'intermediate' | 'advanced'
  }
  onView?: (projectId: string) => void
}

// components/molecules/ProjectCard/ProjectCard.tsx
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ProjectCardProps } from './ProjectCard.types'
import Button from '../../atoms/Button/Button'
import Typography from '../../atoms/Typography/Typography'

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView }) => {
  const complexityColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  
  return (
    <motion.div
      className="glass-card p-6 group cursor-pointer"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={() => onView?.(project.id)}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <Image
          src={project.image}
          alt={project.title}
          width={400}
          height={240}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {project.featured && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${complexityColors[project.complexity]}`}>
          {project.complexity}
        </div>
      </div>
      
      {/* Project Content */}
      <div className="space-y-3">
        <Typography variant="h5" weight="semibold">
          {project.title}
        </Typography>
        
        <Typography variant="body2" color="secondary" className="line-clamp-2">
          {project.description}
        </Typography>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 rounded-md text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-xs">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {project.liveUrl && (
            <Button variant="primary" size="sm" className="flex-1">
              View Live
            </Button>
          )}
          {project.githubUrl && (
            <Button variant="ghost" size="sm" className="flex-1">
              GitHub
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
```

### Organisms

#### Navigation Component
```typescript
// components/organisms/Navigation/Navigation.types.ts
export interface NavigationProps {
  currentPath: string
}

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

// components/organisms/Navigation/Navigation.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavigationProps, NavItem } from './Navigation.types'
import Button from '../../atoms/Button/Button'
import ThemeToggle from '../../molecules/ThemeToggle/ThemeToggle'

const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' }
  ]
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav py-2' : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-blue-500 rounded-lg" />
            <span className="text-xl font-display font-bold text-navy-900 dark:text-white">
              Portfolio
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-amber-500'
                    : 'text-navy-600 dark:text-gray-300 hover:text-amber-500'
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                    layoutId="activeTab"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>
          
          {/* Theme Toggle & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="primary" size="sm">
              Hire Me
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-navy-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
              }`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
              }`} />
            </div>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                      pathname === item.href
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'text-navy-600 dark:text-gray-300 hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <ThemeToggle />
                  <Button variant="primary" size="sm">
                    Hire Me
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navigation
```

---

## 🔌 API Definitions

### AI Chat API
```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()
    
    const systemPrompt = `You are an AI assistant for a professional web developer's portfolio. 
    You have access to the following context about the developer:
    ${JSON.stringify(context, null, 2)}
    
    Respond helpfully and professionally about the developer's skills, projects, and experience.
    Keep responses concise and engaging.`
    
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: message
      }]
    })
    
    return NextResponse.json({
      success: true,
      message: response.content[0].text
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
```

### GitHub Stats API
```typescript
// app/api/github/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || 'your-username'
    
    // Get user data
    const { data: user } = await octokit.users.getByUsername({ username })
    
    // Get repositories
    const { data: repos } = await octokit.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 100
    })
    
    // Calculate stats
    const totalRepos = repos.length
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const languages = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    // Get recent activity
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username,
      per_page: 10
    })
    
    const stats = {
      user: {
        name: user.name,
        bio: user.bio,
        location: user.location,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following
      },
      repositories: {
        total: totalRepos,
        totalStars,
        languages: Object.entries(languages)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([language, count]) => ({ language, count }))
      },
      recentActivity: events.map(event => ({
        type: event.type,
        repo: event.repo?.name,
        createdAt: event.created_at
      }))
    }
    
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
}
```

### Contact Form API
```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  projectType: z.enum(['web-development', 'mobile-app', 'consulting', 'other']),
  budget: z.enum(['under-5k', '5k-10k', '10k-25k', '25k-plus']),
  timeline: z.enum(['asap', '1-month', '2-3-months', 'flexible'])
})

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)
    
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${validatedData.name}</p>
      <p><strong>Email:</strong> ${validatedData.email}</p>
      <p><strong>Subject:</strong> ${validatedData.subject}</p>
      <p><strong>Project Type:</strong> ${validatedData.projectType}</p>
      <p><strong>Budget:</strong> ${validatedData.budget}</p>
      <p><strong>Timeline:</strong> ${validatedData.timeline}</p>
      <p><strong>Message:</strong></p>
      <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
    `
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_EMAIL,
      subject: `Portfolio Contact: ${validatedData.subject}`,
      html: emailHtml
    })
    
    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: validatedData.email,
      subject: 'Thank you for your message',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${validatedData.name},</p>
        <p>I've received your message and will get back to you within 24 hours.</p>
        <p>Best regards,<br>Your Name</p>
      `
    })
    
    return NextResponse.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Contact API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
```

---

## 📝 Type Definitions

### Portfolio Types
```typescript
// types/portfolio.ts
export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  images: string[]
  video?: string
  technologies: Technology[]
  category: ProjectCategory
  featured: boolean
  liveUrl?: string
  githubUrl?: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  status: 'completed' | 'in-progress' | 'planned'
  startDate: string
  endDate?: string
  teamSize: number
  role: string
  challenges: string[]
  solutions: string[]
  results: ProjectResult[]
  testimonial?: Testimonial
}

export interface Technology {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'other'
  proficiency: 1 | 2 | 3 | 4 | 5
  icon?: string
}

export interface ProjectCategory {
  id: string
  name: string
  description: string
  color: string
}

export interface ProjectResult {
  metric: string
  value: string
  description: string
}

export interface Testimonial {
  content: string
  author: string
  role: string
  company: string
  avatar?: string
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  proficiency: 1 | 2 | 3 | 4 | 5
  yearsOfExperience: number
  icon?: string
  description?: string
}

export interface SkillCategory {
  id: string
  name: string
  description: string
  color: string
}

export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  description: string
  achievements: string[]
  technologies: string[]
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance'
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  gpa?: number
  achievements: string[]
  location: string
}

export interface PersonalInfo {
  name: string
  title: string
  bio: string
  location: string
  email: string
  phone?: string
  website?: string
  avatar: string
  resume?: string
  social: SocialLink[]
}

export interface SocialLink {
  platform: string
  url: string
  username: string
  icon: string
}
```

### GitHub Types
```typescript
// types/github.ts
export interface GitHubUser {
  name: string
  bio: string
  location: string
  publicRepos: number
  followers: number
  following: number
}

export interface GitHubRepository {
  name: string
  description: string
  language: string
  stargazersCount: number
  forksCount: number
  updatedAt: string
  url: string
}

export interface GitHubLanguage {
  language: string
  count: number
  percentage: number
}

export interface GitHubActivity {
  type: string
  repo: string
  createdAt: string
}

export interface GitHubStats {
  user: GitHubUser
  repositories: {
    total: number
    totalStars: number
    languages: GitHubLanguage[]
  }
  recentActivity: GitHubActivity[]
}
```

### AI Chat Types
```typescript
// types/ai.ts
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface ChatContext {
  projects: Project[]
  skills: Skill[]
  experience: Experience[]
  personalInfo: PersonalInfo
}

export interface ChatResponse {
  success: boolean
  message?: string
  error?: string
}
```

---

## ⚙️ Configuration Files

### Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['github.com', 'raw.githubusercontent.com']
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      }
    ]
  }
}

module.exports = nextConfig
```

### Tailwind Configuration
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#0F172A'
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp')
  ]
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"],
      "@/components/*": ["./app/components/*"],
      "@/lib/*": ["./app/lib/*"],
      "@/types/*": ["./app/types/*"],
      "@/hooks/*": ["./app/hooks/*"]
    },
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

This technical specification provides the detailed implementation guide needed to transform the portfolio into a modern, professional showcase with industry-leading features and performance.