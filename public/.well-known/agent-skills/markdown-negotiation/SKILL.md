# Markdown Negotiation

This site supports Markdown for agents on all public HTML pages.

- Send `Accept: text/markdown`
- HTML remains the default for browsers and standard clients
- Markdown responses return `Content-Type: text/markdown; charset=utf-8`
- Markdown responses return `Vary: Accept`
- Markdown responses return `X-Markdown-Tokens`

Supported pages include the homepage, paginated homepage routes, the archive index, the about page, and individual article pages.
