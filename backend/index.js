import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate", async (req, res) => {
    const { prompt } = req.body;

    const fullPrompt = `
You are a professional WordPress developer. Generate a secure, single-file WooCommerce plugin based on the request below.

Request: "${prompt}"
Strict output rules:
    - Always include a properly formatted plugin header using standard WordPress format:
  /*
  Plugin Name: ...
  Description: ...
  Version: ...
  Author: ...
  License: ...
  */

- Plugin headers must start with a single opening /* and each field should use consistent // or no prefix — do not mix asterisks mid-comment.
- Always include \`if (!defined('ABSPATH')) exit;\` at the top for security.
- Only output raw PHP starting with \`<?php\` — no markdown, no explanations, no extra text.
- The plugin must be a valid, installable \`.php\` file and follow WordPress coding standards.

Hooks and usage guidelines:
- For cart notices:
  - Use \`woocommerce_before_cart\` for classic themes.
  - Use \`wp_footer\` for compatibility with block-based themes.
  - Do NOT use \`woocommerce_blocks_cart_block_registration\` to output UI — this is incorrect.

Styling:
- To inject CSS, use \`add_action('wp_head', ...)\` and output a \`<style>\` block inside it.
- Do not enqueue external styles or scripts.
- If using \`wp_add_inline_style\`, only use existing handles like \`woocommerce-general\` or \`woocommerce-inline\`.
- To style add-to-cart buttons, use selectors like \`.single_add_to_cart_button\`, \`.add_to_cart_button\`, and \`.wp-block-button__link\`.

Code correctness:
- Ensure all PHP statements (e.g., \`if\`, \`sprintf\`, \`echo\`) have correctly matched parentheses, quotes, and semicolons.
- Always declare functions using standard syntax: \`function name() { ... }\` — never include stray quotes or extra characters.
- Validate that the function name used in \`add_action()\` exactly matches the declared function.
- Do not enqueue styles using \`wp_enqueue_style()\` without a registered stylesheet — prefer \`wp_add_inline_style()\` or inline \`<style>\`.
- Never use \`woocommerce_general_settings\` to inject frontend styles — it is for admin settings only.
- Never write function declarations inside add_action(). Always declare the function separately first using 'function name() { ... }' and then register it with 'add_action('hook', 'name');'.
- When using printf(), write: printf( __('Text with %s placeholder', 'woocommerce'), wc_price($amount) );
- Never nest wc_price() inside __() — pass formatted values as separate printf arguments.
- Ensure all function calls (e.g., printf, __, sprintf) use properly closed parentheses and correct argument order.

Best practices:
- When using cart totals, use \`WC()->cart->get_subtotal()\` or \`WC()->cart->get_displayed_subtotal()\` — never \`WC()->cart->subtotal\`.
- For price formatting, always use \`wc_price()\`.
- Echo notices using \`<div class="woocommerce-info">...</div>\` or \`<div class="woocommerce-message">...</div>\`.
- Avoid unsafe or unnecessary functions like \`eval\`, \`exec\`, \`system\`, \`base64_decode\`, etc.

Your output must strictly follow all of the above. Output only PHP code — no commentary, explanations, or markdown.`;


    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();

        const cleanCode = text
            .replace(/^[^<]*<\?php/, "<?php") // Remove junk before PHP tag
            .replace(/```php|```/g, "") // Remove markdown block quotes
            .replace(/[“”]/g, '"') // Fix smart quotes
            .replace(/[‘’]/g, "'"); // Fix apostrophes

        res.json({ code: cleanCode.trim() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: "<?php\n// Error generating plugin" });
    }
});

app.listen(port, () => {
    console.log(`🚀 Backend running at http://localhost:${port}`);
});