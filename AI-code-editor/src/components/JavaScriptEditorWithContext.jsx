import { CodeiumEditor, Document, Language } from "@codeium/react-code-editor";

const JavaScriptEditorWithContext = () => {
  const html = `<html>
  <body>
    <h1>Contact Us</h1>
    <form>
      <label>Name:</label>
      <input id="name" type="text" />
      <label>Email:</label>
      <input id="email" type="text" />
    </form>
  </body>
</html>`;

  return (
    <div>
      <p>
        Online code editor with Powerful Autocomplete provided by Codeium AI
      </p>
      <CodeiumEditor
        language="javascript"
        theme="vs-dark"
        otherDocuments={[
          new Document({
            absolutePath: "/app/index.html",
            relativePath: "index.html",
            text: html,
            editorLanguage: "html",
            language: Language.HTML,
          }),
        ]}
      />
    </div>
  );
};

export default JavaScriptEditorWithContext;
