package com.sliit.paf.smart_campus;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Smart Campus</title>
                <style>
                    :root {
                        color-scheme: light;
                        --bg: #f4efe6;
                        --card: #ffffff;
                        --text: #1f2937;
                        --muted: #6b7280;
                        --accent: #0f766e;
                        --accent-2: #b45309;
                        --border: #e5ded3;
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        min-height: 100vh;
                        font-family: Georgia, "Times New Roman", serif;
                        color: var(--text);
                        background:
                            radial-gradient(circle at top left, rgba(15, 118, 110, 0.14), transparent 34%),
                            radial-gradient(circle at bottom right, rgba(180, 83, 9, 0.14), transparent 28%),
                            var(--bg);
                        display: grid;
                        place-items: center;
                        padding: 32px;
                    }

                    .panel {
                        width: min(860px, 100%);
                        background: rgba(255, 255, 255, 0.86);
                        backdrop-filter: blur(10px);
                        border: 1px solid var(--border);
                        border-radius: 24px;
                        box-shadow: 0 24px 60px rgba(31, 41, 55, 0.12);
                        padding: 40px;
                    }

                    .eyebrow {
                        text-transform: uppercase;
                        letter-spacing: 0.18em;
                        font-size: 0.76rem;
                        color: var(--accent-2);
                        margin-bottom: 14px;
                    }

                    h1 {
                        margin: 0 0 14px;
                        font-size: clamp(2.5rem, 6vw, 4.5rem);
                        line-height: 0.95;
                    }

                    p {
                        margin: 0;
                        font-size: 1.06rem;
                        line-height: 1.7;
                        color: var(--muted);
                        max-width: 62ch;
                    }

                    .grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 16px;
                        margin-top: 28px;
                    }

                    .card {
                        background: var(--card);
                        border: 1px solid var(--border);
                        border-radius: 18px;
                        padding: 18px;
                    }

                    .card h2 {
                        margin: 0 0 8px;
                        font-size: 1rem;
                    }

                    .card a {
                        color: var(--accent);
                        text-decoration: none;
                        word-break: break-word;
                    }

                    .card a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <main class="panel">
                    <div class="eyebrow">Smart Campus</div>
                    <h1>Campus operations, simplified.</h1>
                    <p>
                        This local development build is running successfully. Use the API endpoints below to register,
                        log in, and manage notifications.
                    </p>

                    <section class="grid">
                        <article class="card">
                            <h2>Auth</h2>
                            <a href="/api/auth/register">POST /api/auth/register</a><br>
                            <a href="/api/auth/login">POST /api/auth/login</a>
                        </article>
                        <article class="card">
                            <h2>Notifications</h2>
                            <a href="/api/notifications/test@example.com/unread/count">GET /api/notifications/{email}/unread/count</a>
                        </article>
                        <article class="card">
                            <h2>Dev profile</h2>
                            <span>Uses the local H2 database on port 8082.</span>
                        </article>
                    </section>
                </main>
            </body>
            </html>
            """;
    }
}
