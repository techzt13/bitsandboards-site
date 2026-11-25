# Bits & Boards

The official site for Bits & Boards, a student-led hardware and coding Hack Club in Hong Kong.

This is a zero-build static site. Serve the repository with any static file server, for example `python3 -m http.server`, and open `http://localhost:8000`. Tailwind CSS and fonts load from CDNs; the site styling also lives in `styles.css`.

## Publishing

The `CNAME` file specifies `bitsandboards.xyz` for GitHub Pages. Configure Pages and the domain's DNS separately. The HCB donation URL is a placeholder and should be verified before launch.

## Join form

The join form sends submissions to the Formspree endpoint configured in `index.html`. Configure and verify the notification email in Formspree, and check its dashboard for submissions. The form shows confirmation only after Formspree accepts a request; failures remain visible for retry. Review Formspree's data handling and applicable privacy and consent requirements for teenagers before collecting their details.
