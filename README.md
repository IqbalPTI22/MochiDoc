# MochiDoc

> AI-powered text document analyzer with General and CompScience analysis modes.

MochiDoc allows users to upload or paste text-based documents and analyze them using Gemini AI.

## Features

* Upload text-based documents
* Paste text directly
* Text documents only — no image/OCR support
* General analysis mode
* CompScience analysis mode
* Document summary and key points
* Technical analysis for configs, logs, settings, and related files
* Ask questions about the provided document
* Copy analysis results
* Responsive single-page interface
* Gemini API integration through Netlify Functions

## Analysis Modes

### General

For normal text documents such as:

* `.txt`
* `.md`
* Articles
* Notes
* Documentation
* Essays
* README files

Provides:

* Summary
* Key points
* Important information
* Simple explanations
* Key takeaways
* Document Q&A

### CompScience

For computer-related text such as:

* `.json`
* `.yaml` / `.yml`
* `.xml`
* `.ini`
* `.cfg`
* `.conf`
* `.toml`
* `.log`
* Game configuration
* System settings
* Server configuration
* Error logs
* Technical documentation

Provides:

* Technical overview
* Important settings
* Errors
* Warnings
* Potential issues
* Technical explanations
* Troubleshooting suggestions

## Tech Stack

* React
* TypeScript
* Vite
* Gemini API
* Netlify Functions
* GitHub

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd mochidoc
```

Install dependencies:

```bash
npm install
```

## Environment Variable

MochiDoc uses the Gemini API through a Netlify server-side function.

Create/configure:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Do **not** hard-code the API key in the source code.

Do **not** commit `.env` files containing the API key.

## Deployment

1. Push the project to GitHub.
2. Import the repository.
3. Add the environment variable:

```text
GEMINI_API_KEY
```

4. Set its value to your Gemini API key.
5. Deploy the project.
