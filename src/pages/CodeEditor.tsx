import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { WebglAddon } from 'xterm-addon-webgl';
import { Button } from '../components/ui/button';
import { io, Socket } from 'socket.io-client';

const CodeEditor = () => {
  const [files, setFiles] = useState<{ [key: string]: string }>({});
  const [currentFile, setCurrentFile] = useState<string>('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    // Initialize terminal
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'Consolas, monospace',
      fontSize: 14,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const webglAddon = new WebglAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.loadAddon(webglAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
    }

    termRef.current = term;

    // Initialize socket connection
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      term.write('\r\n\x1B[1;32mConnected to server\x1B[0m\r\n');
    });

    socket.on('output', (data: string) => {
      term.write(data);
    });

    term.onData((data) => {
      socket.emit('input', data);
    });

    return () => {
      term.dispose();
      socket.disconnect();
    };
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && currentFile) {
      setFiles((prev) => ({
        ...prev,
        [currentFile]: value,
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Code Editor</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Home
        </Button>
      </div>
      <div className="flex-1 flex">
        <div className="w-64 border-r p-4">
          <h2 className="text-lg font-semibold mb-4">Files</h2>
          <div className="space-y-2">
            {Object.keys(files).map((file) => (
              <div
                key={file}
                className={`p-2 rounded cursor-pointer ${
                  currentFile === file ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
                onClick={() => setCurrentFile(file)}
              >
                {file}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={currentFile ? files[currentFile] : ''}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                wordWrap: 'on',
              }}
            />
          </div>
          <div
            ref={terminalRef}
            className="h-64 border-t"
            style={{ backgroundColor: '#1e1e1e' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor; 