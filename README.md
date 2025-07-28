# Internshala Automation Script

Automate the process to apply for internships on [Internshala](https://internshala.com) using Puppeteer and Node.js.

---

## Features

- Login to Internshala using your credentials
- Automatically browse and apply to internships with "easy apply"
- Fill application text areas with default or custom answers
- Upload your resume automatically
- Submit applications for multiple internships

---

## Prerequisites

- Node.js (v14 or above recommended)
- A valid Internshala account with email & password
- Puppeteer (included in dependencies)
- Resume in PDF format named `Resume.pdf` placed in project root folder
- [Optional] Google Generative AI API key if you plan to integrate AI for answers

---

## Getting Started

1. **Clone the repository**

```
git clone https://github.com/gayatrishelke2004/InternshalaX-Automation
```

2. **Install dependencies**

```
npm install
```

3. **Create a `.env` file** in the project root with your credentials and config

```
EMAIL=your_email@example.com
PASSWORD=your_password
API_KEY=your_google_generative_api_key   # Optional if using AI features
```

4. **Place your resume file**

Add a file named `Resume.pdf` in the project root directory. This file will be uploaded automatically during applications.

5. **Run the automation script**

```
node script.js
```

---

## Configuration

- **Max internships to apply**: Modify the `maxToApply` variable inside `script.js` to change how many internships are automatically applied to per run.

- **Answer customization**: By default, the script fills text areas with generic or AI-generated answers. You can modify these answers in the script.

---

## Troubleshooting

- **Login errors:**  
  - Confirm your credentials in `.env` are correct and no quotes are used around values.  
  - If there is CAPTCHA or other anti-bot mechanisms, manual intervention might be required.

- **Element not clickable / stale element errors:**  
  - The script refreshes element handles on every interaction to avoid stale elements.

- **Resume upload issues:**  
  - Make sure the path to your `Resume.pdf` is correct and that the file is accessible.

- **Puppeteer errors related to timeout:**  
  - Increase selector wait timeouts in the script if your network is slow.

---

## Dependencies

- [puppeteer](https://www.npmjs.com/package/puppeteer) - Browser automation  
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variable management  
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF resume parsing (optional)  
- [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) - AI content generation (optional)

---


## Disclaimer

Automating applications should comply with Internshala's terms of service. Use responsibly.

---

## Author

[Gayatri Shelke](https://github.com/gayatrishelke2004)

```

### How to add this to your repo?

- Save the above content in a file named `README.md` in your project folder.
- Commit and push it using Git:

```bash
git add README.md
git commit -m "Add README with project overview and usage"
git push
```
