# Dhanvi YouTube SEO Studio AI

A Telugu-first AI YouTube SEO generator powered by the Gemini API and deployable on Netlify.

## Deploy on Netlify

1. Create a Gemini API key in Google AI Studio: https://aistudio.google.com/app/apikey
2. Keep the key private. Do not paste it into `index.html` or share it publicly.
3. Upload this project folder to a GitHub repository, or deploy the ZIP using Netlify's manual deploy flow (for functions, linking a Git repository is the most reliable option).
4. In Netlify, open **Site configuration → Environment variables**.
5. Add `GEMINI_API_KEY` and paste your Gemini API key as its value.
6. Trigger a fresh deploy.
7. Open your Netlify site URL and generate SEO metadata.

## Important

- The app calls a Netlify serverless function. The API key stays on the server and is not exposed in browser source.
- Gemini API has a free tier for eligible models, but quotas, model availability, and terms can change. Check https://ai.google.dev/gemini-api/docs/pricing
- Google states that content submitted on the free tier may be used to improve its products. Avoid entering confidential or personal information.
- This app creates metadata suggestions; it cannot guarantee YouTube rankings, views, or monetization.
- If the API reports quota or billing errors, check your Google AI Studio project and API usage.
