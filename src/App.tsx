import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ReactMarkdown from 'react-markdown'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

// Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

function HomePage() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false) 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      const prompt = `Summarize the article at this URL: ${url}. Provide the summary in markdown format with the following structure:

# {insert article name here}
## Key Points
- Point 1
- Point 2
- Point 3
## Main Ideas
1. First main idea
2. Second main idea
3. Third main idea

## Conclusion`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      setSummary(text)
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      setSummary('An error occurred while summarizing the article.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col">
      {/* Navigation */}
      <nav className="w-full bg-[#252525] p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">ClipNote.ai</span>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="block sm:hidden">
            <button
              className="text-white focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>

          {/* Links - Hidden on Mobile */}
          <div className={`hidden sm:flex space-x-4`}>
            <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
            <a href="https://github.com/himanshumahesh" target="_blank" rel="noopener noreferrer">
    <button className="bg-blue-600 text-white px-4 py-2 rounded-md">GitHub</button>
</a>
          </div>
        </div>

        {/* Mobile Menu (Collapsible) */}
        <div className={`sm:hidden flex flex-col space-y-4 mt-4 transition-all duration-300 ease-in-out ${menuOpen ? 'block' : 'hidden'}`}>
          <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
          <a href="https://github.com/himanshumahesh" target="_blank" rel="noopener noreferrer">
    <button className="bg-blue-600 text-white px-4 py-2 rounded-md">GitHub</button>
</a>

        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full px-4 py-8">
        <div className="bg-gradient-to-r from-[#2c3e50] via-[#4b79a1] to-[#24243e] p-8 mb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">AI-powered Article Summarization</h1>
          <p className="mb-6">Paste a URL or text to get an instant, structured summary of any article</p>
          <form onSubmit={handleSubmit} className="flex justify-center flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a URL or text here"
              className="bg-[#2b2f36] text-white rounded-md py-2 px-4 w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Summarizing...' : 'Summarize'}
            </button>
          </form>
        </div>
        {summary && (
          <div className="bg-[#252525] p-6 rounded-md mb-8 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-2">Here's a brief summary of the article:</h2>
            <div className="text-gray-300 prose prose-invert max-w-none">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4 text-center">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4">
          <FeatureCard
            icon="📄"
            title="Summarize any article"
            description="Copy and paste a URL or text to generate a concise summary"
          />
          <FeatureCard
            icon="🔑"
            title="Extract key points"
            description="Get the most important information from the article"
          />
          <FeatureCard
            icon="📊"
            title="Structured output"
            description="Receive a well-organized summary with main ideas and conclusions"
          />
          <FeatureCard
            icon="⏱️"
            title="Save time"
            description="Quickly grasp the essence of long articles"
          />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-[#252525] p-6 rounded-lg shadow-lg hover:bg-[#303030] transition-all">
      <div className="text-4xl mb-2">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-[#9ca3af]">{description}</p>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}