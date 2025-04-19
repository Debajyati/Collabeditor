import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { Button } from '../components/ui/button';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const RichTextEditor = () => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new WebsocketProvider(
      'ws://localhost:1234',
      'rich-text-editor',
      yDoc
    );

    // Set up user state
    yProvider.awareness.setLocalStateField('user', {
      name: 'User ' + Math.floor(Math.random() * 100),
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      focusing: null,
      focusPos: null,
      anchorPos: null,
    });

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yProvider.destroy();
      yDoc.destroy();
    };
  }, []);

  const initialConfig = {
    namespace: 'RichTextEditor',
    onError: (error: Error) => {
      console.error(error);
    },
  };

  if (!doc || !provider) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Rich Text Editor</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Home
        </Button>
      </div>
      <div className="flex-1 p-4">
        <LexicalComposer initialConfig={initialConfig}>
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-[500px] p-4 border rounded-md focus:outline-none" />
              }
              placeholder={
                <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
                  Start typing...
                </div>
              }
              ErrorBoundary={ErrorBoundary}
            />
            <HistoryPlugin />
            <CollaborationPlugin
              id="rich-text-editor"
              providerFactory={() => provider}
              shouldBootstrap={true}
            />
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
};

export default RichTextEditor;  