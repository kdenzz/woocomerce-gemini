import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function PluginGenerator() {
    const [prompt, setPrompt] = useState("");
    const [phpCode, setPhpCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [theme, setTheme] = useState("dark");

    const generatePlugin = async () => {
        setLoading(true);
        setGenerated(false);
        try {
            const res = await axios.post("https://woocomerce-gemini.onrender.com/api/generate", {
                prompt
            });
            setPhpCode(res.data.code);
            setGenerated(true);
        } catch (err) {
            console.error("Plugin generation error:", err);
            setPhpCode("<?php\n// Error generating plugin");
        } finally {
            setLoading(false);
        }
    };

    const downloadPlugin = () => {
        const blob = new Blob([phpCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom-plugin.php';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(phpCode);
            toast.success("✅ Code copied to clipboard");
        } catch {
            toast.error("❌ Failed to copy");
        }
    };

    const suggestions = [
        "Change add to cart button to blue",
        "Add a free shipping notice",
        "Send email to admin on new order"
    ];

    const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    return (
        <div className={`${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white" : "bg-gray-100 text-black"} min-h-screen font-sans p-6 transition-colors duration-300`}>
            <Toaster />
            <div className="max-w-5xl mx-auto space-y-8">
                <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-gray-700 py-4 px-6 rounded-xl shadow">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-blue-400">🧠 Woo Plugin Wizard</h1>
                        <button onClick={toggleTheme} className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600">
                            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
                        </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">Describe your need — get a ready-to-use WooCommerce plugin instantly</p>
                </header>

                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 space-y-4">
                    <label htmlFor="prompt" className="block text-sm font-semibold">Your Request</label>
                    <textarea
                        id="prompt"
                        rows={4}
                        placeholder="e.g. Change add to cart button color to blue"
                        className="w-full p-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((s, i) => (
                            <button key={i} onClick={() => setPrompt(s)} className="text-xs px-3 py-1 bg-blue-700 text-white rounded-full hover:bg-blue-600">
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-4 items-center pt-2">
                        <button
                            onClick={generatePlugin}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                "⚡ Generate Plugin"
                            )}
                        </button>
                        <button
                            onClick={downloadPlugin}
                            disabled={!generated}
                            className={`font-bold px-6 py-2 rounded-lg shadow-md transition-transform transform ${generated ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}
                        >
                            💾 Download PHP
                        </button>
                        <button
                            onClick={copyCode}
                            disabled={!generated}
                            className={`font-bold px-6 py-2 rounded-lg shadow-md transition-transform transform ${generated ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}
                        >
                            📋 Copy Code
                        </button>
                    </div>
                </div>

                {generated && (
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 animate-fade-in">
                        <h2 className="text-xl font-bold text-blue-300 mb-2">🔧 Generated PHP Plugin</h2>
                        <p className="text-sm text-gray-400 italic mb-2">File: <strong>custom-plugin.php</strong></p>
                        <Editor
                            height="500px"
                            defaultLanguage="php"
                            value={phpCode || "<?php\n// Plugin will be generated here"}
                            theme="vs-dark"
                            options={{ readOnly: true, fontSize: 14, minimap: { enabled: false } }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
