import React, { useState } from 'react';
import './index.css';

function App() {
  const [classInput, setClassInput] = useState('');
  const [optimizedClasses, setOptimizedClasses] = useState('');

  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const [cssInput, setCssInput] = useState('');
  const [cleanCss, setCleanCss] = useState('');

  const [scssInput, setScssInput] = useState('');
  const [convertedScss, setConvertedScss] = useState('');

  const togetherApiKey = "f254a3472cc125fee6b47c3b83b4b2eef6192323a62169944c1aa951cfc37990";
  const togetherModel = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";

  const callTogetherAI = async (userPrompt) => {
    try {
      const response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${togetherApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: togetherModel,
          messages: [{ role: "user", content: userPrompt }],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      const data = await response.json();
      return data?.choices?.[0]?.message?.content || "❌ No response from Together AI.";
    } catch (error) {
      console.error("Together AI Error:", error);
      return "❌ AI request failed.";
    }
  };

  const convertCssToScss = async () => {
    if (!scssInput.includes('{')) {
      setConvertedScss("⚠️ Please enter valid CSS to convert.");
      return;
    }

    const prompt = `Convert the following plain CSS into clean SCSS. Use nesting where appropriate, remove redundant repetition and use SCSS variable property. Output only the SCSS:

${scssInput}`;
    const result = await callTogetherAI(prompt);
    setConvertedScss(result);
  };

  const cancelScssInput = () => {
    setScssInput('');
    setConvertedScss('');
  };

  const optimizeTailwindWithAI = async () => {
    if (!classInput.trim()) {
      setOptimizedClasses("⚠️ Please enter some Tailwind classes.");
      return;
    }

    const prompt = `Think like you're an excellent frontend engineer. Clean this Tailwind class list by keeping only the effective final rules, removing duplicates, merging redundant declarations, and output only the optimized class list. Also, provide explanation and comments where possible:\n\n${classInput}`;
    const result = await callTogetherAI(prompt);
    setOptimizedClasses(result);
  };

  const cancelClassInput = () => {
    setClassInput('');
    setOptimizedClasses('');
  };

  const generateFromPrompt = async () => {
    if (!prompt.trim() || prompt.trim().split(" ").length < 5) {
      setSuggestion("⚠️ Please enter a meaningful description (at least 5 words).");
      return;
    }

    const nonsenseRegex = /^[a-z]{5,}$/i;
    if (nonsenseRegex.test(prompt.trim()) && prompt.trim().split(" ").length === 1) {
      setSuggestion("⚠️ Please enter a valid prompt, not gibberish.");
      return;
    }

    const userPrompt = `Create a Tailwind CSS component: ${prompt}`;
    const result = await callTogetherAI(userPrompt);
    setSuggestion(result);
  };

  const cancelPrompt = () => {
    setPrompt('');
    setSuggestion('');
  };

  const optimizeCssWithAI = async () => {
    if (!cssInput.includes('{')) {
      setCleanCss("⚠️ Please enter valid CSS with `{}` blocks.");
      return;
    }

    const prompt = `Here is some raw CSS. Clean it up by keeping only the effective final rules, removing duplicates, merging redundant declarations, and output only the optimized CSS with comments or explanations:\n\n${cssInput}`;
    const result = await callTogetherAI(prompt);
    setCleanCss(result);
  };

  const cancelCssInput = () => {
    setCssInput('');
    setCleanCss('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-4">Tailwind & CSS Optimizer (Together.ai) ✨</h1>

      {/* CSS to SCSS Converter */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Convert CSS to SCSS</h2>
        <textarea
          className="w-full p-4 text-black rounded mb-2"
          rows="5"
          value={scssInput}
          onChange={(e) => setScssInput(e.target.value)}
          placeholder={`Paste regular CSS here...\n\n.navbar { color: black; } .navbar .link { color: red; }`}
        />
        <div className="flex gap-4">
          <button
            onClick={convertCssToScss}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Convert to SCSS
          </button>
          <button
            onClick={cancelScssInput}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
        {convertedScss && (
          <div className="mt-4 bg-gray-800 p-4 rounded">
            <strong>Converted SCSS:</strong>
            <pre className="mt-2 text-orange-300 whitespace-pre-wrap">{convertedScss}</pre>
          </div>
        )}
      </div>

      {/* CSS Optimizer */}
      <div>
        <h2 className="text-xl font-semibold mb-2">CSS Optimizer</h2>
        <textarea
          className="w-full p-4 text-black rounded mb-2"
          rows="5"
          value={cssInput}
          onChange={(e) => setCssInput(e.target.value)}
          placeholder={`Paste raw CSS here...\n\n.btn { color: red; color: blue; padding: 10px; padding: 5px; }`}
        />
        <div className="flex gap-4">
          <button
            onClick={optimizeCssWithAI}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Optimize with AI
          </button>
          <button
            onClick={cancelCssInput}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
        {cleanCss && (
          <div className="mt-4 bg-gray-800 p-4 rounded">
            <strong>Optimized CSS:</strong>
            <pre className="mt-2 text-yellow-300 whitespace-pre-wrap">{cleanCss}</pre>
          </div>
        )}
      </div>

      {/* Tailwind Optimizer */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Tailwind Class Optimizer</h2>
        <textarea
          className="w-full p-4 text-black rounded mb-2"
          rows="4"
          value={classInput}
          onChange={(e) => setClassInput(e.target.value)}
          placeholder="Paste Tailwind classes here..."
        />
        <div className="flex gap-4">
          <button
            onClick={optimizeTailwindWithAI}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Optimize with AI
          </button>
          <button
            onClick={cancelClassInput}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
        {optimizedClasses && (
          <div className="mt-4 bg-gray-800 p-4 rounded">
            <strong>Optimized:</strong>
            <pre className="mt-2 text-green-400 whitespace-pre-wrap">{optimizedClasses}</pre>
          </div>
        )}
      </div>

      {/* Prompt to Tailwind Generator */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Prompt to Tailwind Generator</h2>
        <input
          className="w-full p-4 text-black rounded mb-2"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want (e.g., glassmorphism login)..."
        />
        <div className="flex gap-4">
          <button
            onClick={generateFromPrompt}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Generate
          </button>
          <button
            onClick={cancelPrompt}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
        {suggestion && (
          <div className="mt-4 bg-gray-800 p-4 rounded">
            <strong>Generated HTML:</strong>
            <pre className="mt-2 text-pink-400 whitespace-pre-wrap">{suggestion}</pre>
          </div>
        )}
      </div>

      
    </div>
  );
}

export default App;
