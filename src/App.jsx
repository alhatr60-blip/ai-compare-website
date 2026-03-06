import { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/compare';

const SUGGESTIONS = [
  'Explain quantum computing',
  'Write a haiku about coding',
  'What is machine learning?',
  'Compare React vs Vue',
];

function App() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponses(null);
    setCurrentQuery(query.trim());

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResponses(data.responses);
    } catch (err) {
      setError(err.message || 'Failed to fetch responses. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setQuery(suggestion);
  };

  const copyToClipboard = (text, model) => {
    navigator.clipboard.writeText(text).then(() => {
      // Brief visual feedback could be added here
    });
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo-badge">
          <span className="dot"></span>
          AI Comparator
        </div>
        <h1>AI Response Comparator</h1>
        <p className="subtitle">
          Enter a prompt and compare responses from ChatGPT, Claude, and Gemini side by side
        </p>
      </header>

      {/* Search */}
      <section className="search-container">
        <form onSubmit={handleSubmit}>
          <div className="search-wrapper">
            <input
              id="query-input"
              type="text"
              className="search-input"
              placeholder="Ask anything... e.g., 'Explain quantum computing in simple terms'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button
              id="submit-btn"
              type="submit"
              className="search-btn"
              disabled={loading || !query.trim()}
            >
              <span className="icon">⚡</span>
              {loading ? 'Comparing...' : 'Compare'}
            </button>
          </div>
        </form>
      </section>

      {/* Results */}
      <main className="results-container">
        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="loading-text">Fetching responses from AI models...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-message">
            <h3>⚠️ Connection Error</h3>
            <p>{error}</p>
            <p style={{ marginTop: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
              Make sure the backend server is running on port 5000
            </p>
          </div>
        )}

        {/* Results */}
        {responses && !loading && (
          <>
            <div className="query-badge">
              <span>
                <span className="label">Query:</span>
                {currentQuery}
              </span>
            </div>

            <div className="results-grid">
              {/* ChatGPT Card */}
              <div className="response-card chatgpt" id="chatgpt-card">
                <div className="card-header">
                  <div className="card-icon">G</div>
                  <div>
                    <div className="card-title">ChatGPT</div>
                    <div className="card-subtitle">OpenAI</div>
                  </div>
                </div>
                <div className="card-body">{responses.chatgpt}</div>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(responses.chatgpt, 'ChatGPT')}
                >
                  📋 Copy Response
                </button>
              </div>

              {/* Claude Card */}
              <div className="response-card claude" id="claude-card">
                <div className="card-header">
                  <div className="card-icon">C</div>
                  <div>
                    <div className="card-title">Claude</div>
                    <div className="card-subtitle">Anthropic</div>
                  </div>
                </div>
                <div className="card-body">{responses.claude}</div>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(responses.claude, 'Claude')}
                >
                  📋 Copy Response
                </button>
              </div>

              {/* Gemini Card */}
              <div className="response-card gemini" id="gemini-card">
                <div className="card-header">
                  <div className="card-icon">G</div>
                  <div>
                    <div className="card-title">Gemini</div>
                    <div className="card-subtitle">Google</div>
                  </div>
                </div>
                <div className="card-body">{responses.gemini}</div>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(responses.gemini, 'Gemini')}
                >
                  📋 Copy Response
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!responses && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h2>Ready to Compare</h2>
            <p>
              Enter a prompt above to see how ChatGPT, Claude, and Gemini
              respond differently to the same question.
            </p>
            <div className="suggestion-chips">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="chip"
                  onClick={() => handleSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>AI Response Comparator &mdash; Compare AI Models Side by Side</p>
      </footer>
    </div>
  );
}

export default App;
