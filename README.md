# 🌸 MochiDoc

> Your cute little document analyst.

MochiDoc is a cute anime-inspired AI document analyzer designed to help users understand and analyze text-based documents.

The app provides two analysis modes:

- 🌸 **General Mode** — for ordinary text documents, notes, articles, documentation, and similar content.
- 💻 **CompScience Mode** — for technical text such as configuration files, logs, game settings, system settings, and other computer-related documents.

---

## ✨ Features

### 📄 Text Document Analysis

MochiDoc accepts text-based documents through:

- File upload
- Direct text input / paste

Supported text-oriented formats currently include:

`.txt` `.md` `.json` `.yaml` `.yml` `.xml` `.csv` `.log` `.ini` `.cfg` `.conf` `.toml`

> 🚫 Image files and image-based document analysis are not supported.

---

## 🌸 General Mode

General Mode is intended for ordinary documents and text.

It can provide:

- 📝 Summary
- 🔑 Key Points
- 📌 Important Information
- 💡 Simple Explanations
- 🎯 Key Takeaways
- ❓ Ask questions about the document

The AI is instructed to use the provided document as the primary context and avoid inventing information that is not supported by the document.

---

## 💻 CompScience Mode

CompScience Mode is designed for computer-science and technical text.

Useful examples include:

- Game configuration files
- `.ini` / `.cfg` settings
- JSON configuration
- YAML configuration
- XML configuration
- Application settings
- System settings
- Server configuration
- Console output
- Error logs
- Warning logs
- Debugging information
- Technical README files
- Developer documentation

The analysis can identify and explain:

- Technical overview
- Important settings
- Errors
- Warnings
- Notable information
- Potential issues
- Possible troubleshooting suggestions

The AI should distinguish between information directly found in the document and interpretation or possible causes.

---

## 🤖 AI Features

MochiDoc uses Google's Gemini API for document analysis.

The application supports:

### Analyze Document

The selected document is analyzed according to the selected mode.

### Ask the Document

After analysis, users can ask questions about the provided document.

Example:

> What does this setting do?

or:

> Which errors are most important?

## 🏗️ Architecture

MochiDoc is built as a Vite + TypeScript web application.

The Gemini API integration uses a server-side Netlify Function rather than exposing the API key directly in the browser.

### Production flow

```text
Browser
   │
   │ Document / Question
   ▼
Netlify Function
   │
   │ GEMINI_API_KEY
   ▼
Gemini API
   │
   ▼
AI Response
   │
   ▼
MochiDoc UI