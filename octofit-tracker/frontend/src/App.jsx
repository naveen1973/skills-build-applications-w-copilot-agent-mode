import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Alert } from 'react-bootstrap';
import Users from './components/Users';
import Activities from './components/Activities';
import Teams from './components/Teams';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';
import { API_BASE_URL } from './api';
import './App.css';

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const isProperlyConfigured = codespaceName || API_BASE_URL.includes('localhost');

  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        {/* Navigation Bar */}
        <Navbar bg="dark" data-bs-theme="dark" sticky="top" expand="lg">
          <Container>
            <Navbar.Brand href="/">
              🐙 OctoFit Tracker
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">Users</Nav.Link>
                <Nav.Link as={Link} to="/activities">Activities</Nav.Link>
                <Nav.Link as={Link} to="/leaderboard">Leaderboard</Nav.Link>
                <Nav.Link as={Link} to="/teams">Teams</Nav.Link>
                <Nav.Link as={Link} to="/workouts">Workouts</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Configuration Alert */}
        {!isProperlyConfigured && (
          <Container className="mt-3">
            <Alert variant="warning">
              ⚠️ <strong>Configuration Issue:</strong> VITE_CODESPACE_NAME is not set.
              <br />
              For Codespaces: Add <code>VITE_CODESPACE_NAME=your-codespace-name</code> to <code>.env.local</code>
              <br />
              For localhost: Using fallback URL {API_BASE_URL}
            </Alert>
          </Container>
        )}

        {/* API Base URL Info */}
        <Container className="mt-2 mb-2">
          <small className="text-muted">
            API: {API_BASE_URL}/api
            {codespaceName && ` (Codespaces: ${codespaceName})`}
            {!codespaceName && ' (Localhost)'}
          </small>
        </Container>

        {/* Main Content */}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-4 mt-5">
          <Container>
            <p className="mb-2">🐙 OctoFit Tracker - Multi-tier Fitness Application</p>
            <small>
              React 19 + Vite | Bootstrap | Express.js API | MongoDB
            </small>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
