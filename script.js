require('dotenv').config();
const puppeteer = require('puppeteer');
const path = require('path');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,              // So you can see browser and verify steps
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  try {
    // 1. Go to login page
    await page.goto('https://internshala.com/login/student', { waitUntil: 'networkidle2' });

    // 2. Wait for email input and type email
    await page.waitForSelector('#email', { visible: true });
    const emailToType = String(process.env.EMAIL || '');
    if (!emailToType) throw new Error("EMAIL is not set or empty in .env file");
    await page.type('#email', emailToType, { delay: 50 });

    // 3. Wait for password input and type password
    await page.waitForSelector('#password', { visible: true });
    const passwordToType = String(process.env.PASSWORD || '');
    if (!passwordToType) throw new Error("PASSWORD is not set or empty in .env file");
    await page.type('#password', passwordToType, { delay: 50 });

    // 4. Click login & wait for navigation
    await Promise.all([
      page.click('#login_submit'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);
    console.log('Login successful!');

    // 5. Navigate to internships listing page
    await page.goto('https://internshala.com/internships', { waitUntil: 'networkidle2' });

    // 6. Wait for internships to load
    await page.waitForSelector('.easy_apply', { visible: true, timeout: 15000 });

    const maxToApply = 3;

    for (let i = 0; i < maxToApply; i++) {
      try {
        // Re-fetch internships fresh each loop to avoid stale elements
        await page.waitForSelector('.easy_apply', { visible: true, timeout: 15000 });
        const internships = await page.$$('.easy_apply');

        if (i >= internships.length) {
          console.log('No more internships left to apply.');
          break;
        }

        const internship = internships[i];

        // Scroll into view & click
        await internship.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        await wait(500);
        await internship.click();

        // Wait for possible modal or page change with apply button
        await page.waitForFunction(() => {
          return !!document.querySelector('button#continue_button, button#apply_now_button, button.btn-large');
        }, { timeout: 15000 });

        // Get apply button element
        let applyBtn = await page.$('button#continue_button');
        if (!applyBtn) applyBtn = await page.$('button#apply_now_button');
        if (!applyBtn) applyBtn = await page.$('button.btn-large');

        if (!applyBtn) {
          console.log('Apply button not found, skipping this internship.');
          await page.keyboard.press('Escape').catch(() => {});
          await page.goto('https://internshala.com/internships', { waitUntil: 'networkidle2' });
          continue;
        }

        // Scroll & click apply button
        await applyBtn.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        await wait(500);
        await applyBtn.click();

        // Wait for textareas (application form)
        await page.waitForSelector('textarea', { visible: true, timeout: 15000 });

        // Fill all textareas with a sample answer - replace with your own content or AI-generated text
        const textareas = await page.$$('textarea');
        for (const textarea of textareas) {
          await textarea.focus();
          await textarea.click({ clickCount: 3 });
          await textarea.press('Backspace');
          await textarea.type('I am enthusiastic and motivated to contribute.', { delay: 30 });
          await wait(500);
        }

        // Upload resume
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          const resumeAbsolutePath = path.resolve('./Resume.pdf');
          await fileInput.uploadFile(resumeAbsolutePath);
          console.log('Uploaded resume.');
          await wait(1000);
        }

        // Click submit button
        await page.waitForSelector('input#submit, button[type="submit"], input[type="submit"]', { visible: true, timeout: 15000 });
        let submitBtn = await page.$('input#submit') || await page.$('button[type="submit"]') || await page.$('input[type="submit"]');
        if (submitBtn) {
          await submitBtn.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          await wait(500);
          await Promise.all([
            submitBtn.click(),
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
          ]);
          console.log(`Internship #${i + 1} applied successfully.`);
        } else {
          console.log('Submit button not found, please check manually.');
        }

        // Wait before next iteration and ensure we're on the internships listing page
        await wait(3000);
        await page.goto('https://internshala.com/internships', { waitUntil: 'networkidle2' });
      } catch (err) {
        console.error(`Failed to apply to internship #${i + 1}:`, err.message);
        // Escape and reload listing to reset state
        await page.keyboard.press('Escape').catch(() => {});
        await page.goto('https://internshala.com/internships', { waitUntil: 'networkidle2' });
      }
    }

    console.log('Finished applying to internships.');
  } catch (e) {
    console.error('Error in main flow:', e);
  } finally {
    await browser.close();
  }
})();
