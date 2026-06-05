import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { WorkspaceScreen } from './components/workspace/WorkspaceScreen';

function App() {
  const navigate = useNavigate();
  const [displayMode, setDisplayMode] = useState('home');

  function handleSelectCui() {
    setDisplayMode('cui');
    navigate('/');
  }

  function handleSelectGui() {
    setDisplayMode('app');
  }

  function handleBackHome() {
    setDisplayMode('home');
    navigate('/');
  }

  function renderWorkspaceRoute(threadType) {
    return (
      <WorkspaceScreen
        threadType={threadType}
        displayMode={displayMode}
        onSelectCui={handleSelectCui}
        onSelectGui={handleSelectGui}
        onBackHome={handleBackHome}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <WorkspaceScreen
            threadType="top"
            displayMode={displayMode}
            onSelectCui={handleSelectCui}
            onSelectGui={handleSelectGui}
            onBackHome={handleBackHome}
          />
        }
      />
      <Route
        path="/works"
        element={renderWorkspaceRoute('works')}
      />
      <Route
        path="/work/:id"
        element={renderWorkspaceRoute('works')}
      />
      <Route
        path="/about"
        element={renderWorkspaceRoute('about')}
      />
      <Route
        path="/contact"
        element={renderWorkspaceRoute('contact')}
      />
    </Routes>
  );
}

export default App;
