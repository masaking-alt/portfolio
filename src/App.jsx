import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { WorkspaceScreen } from './components/workspace/WorkspaceScreen';
import {
  APP_BOOT_MESSAGE,
  AVAILABLE_COMMANDS_TEXT,
  CLI_BOOT_MESSAGE,
  CLI_COMMANDS_TEXT,
  HELP_COMMAND_LINES,
} from './constants/terminal';
import { getCliPathFromCommand, getOpenTargetFromCommand, getWorkFromCliTarget } from './utils/commands';
import {
  createCliOutputEntries,
  createTerminalEntries,
  createWorkDetailEntries,
} from './utils/threadState';

function App() {
  const navigate = useNavigate();
  const [displayMode, setDisplayMode] = useState('idle');
  const [hasEnteredWorkspace, setHasEnteredWorkspace] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState('');
  const [terminalLog, setTerminalLog] = useState(() => [
    { kind: 'system', text: AVAILABLE_COMMANDS_TEXT },
  ]);

  function appendTerminalEntries(entries) {
    setTerminalLog((currentLog) => [...currentLog, ...entries]);
  }

  function appendTerminalLines(lines, kind = 'system') {
    appendTerminalEntries(createTerminalEntries(lines, kind));
  }

  function handleTerminalSubmit(event) {
    event.preventDefault();
    const rawCommand = terminalCommand.trim();
    const normalizedCommand = rawCommand.toLowerCase().replace(/\s+/g, ' ');
    setTerminalCommand('');

    if (!normalizedCommand) {
      return;
    }

    setTerminalLog((currentLog) => [...currentLog, { kind: 'command', text: rawCommand }]);

    if (normalizedCommand === 'masaking') {
      setHasEnteredWorkspace(true);
      setDisplayMode('cli');
      navigate('/');
      appendTerminalLines([CLI_BOOT_MESSAGE]);
      appendTerminalEntries(createCliOutputEntries('/'));
      return;
    }

    if (normalizedCommand === 'masaking app') {
      setHasEnteredWorkspace(true);
      setDisplayMode('app');
      appendTerminalLines([APP_BOOT_MESSAGE]);
      return;
    }

    if (normalizedCommand === 'help') {
      appendTerminalLines(hasEnteredWorkspace ? [...HELP_COMMAND_LINES, CLI_COMMANDS_TEXT] : HELP_COMMAND_LINES);
      return;
    }

    if (normalizedCommand === 'clear') {
      setTerminalLog([]);
      navigate('/');
      return;
    }

    const cliPath = getCliPathFromCommand(normalizedCommand);
    if (cliPath) {
      if (!hasEnteredWorkspace) {
        appendTerminalLines(['Run "masaking" or "masaking app" first.'], 'error');
        return;
      }

      navigate(cliPath);
      appendTerminalEntries(createCliOutputEntries(cliPath));
      return;
    }

    const openTarget = getOpenTargetFromCommand(normalizedCommand);
    if (openTarget !== null) {
      if (!hasEnteredWorkspace) {
        appendTerminalLines(['Run "masaking" or "masaking app" first.'], 'error');
        return;
      }

      const work = getWorkFromCliTarget(openTarget);
      if (!work) {
        appendTerminalLines([`work not found: ${openTarget}`], 'error');
        return;
      }

      navigate(`/work/${work.id}`);
      appendTerminalEntries(createWorkDetailEntries(work));
      return;
    }

    appendTerminalLines([`command not found: ${rawCommand}`], 'error');
  }

  function renderWorkspaceRoute(threadType) {
    return (
      <WorkspaceScreen
        threadType={threadType}
        displayMode={displayMode}
        terminalCommand={terminalCommand}
        terminalLog={terminalLog}
        onTerminalCommandChange={setTerminalCommand}
        onTerminalSubmit={handleTerminalSubmit}
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
            terminalCommand={terminalCommand}
            terminalLog={terminalLog}
            onTerminalCommandChange={setTerminalCommand}
            onTerminalSubmit={handleTerminalSubmit}
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
