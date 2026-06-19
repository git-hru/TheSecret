// ===== EMAILJS INTEGRATION =====
// Sign up at https://www.emailjs.com — it's free for 200 emails/month
// Then replace the three placeholders below with your real values.

const EMAILJS_CONFIG = (typeof window !== 'undefined' && window.EMAILJS_CONFIG) ? window.EMAILJS_CONFIG : {
  publicKey:   'YOUR_EMAILJS_PUBLIC_KEY',   // Account → API Keys
  serviceId:   'YOUR_SERVICE_ID',           // Email Services tab
  templateId:  'YOUR_TEMPLATE_ID',          // Email Templates tab
};

// Initialize EmailJS
(function() {
  if (typeof emailjs === 'undefined') return;
  emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
})();

/**
 * Send the wish-granted email to the user.
 * @param {string} toEmail   - user's email address
 * @param {string} wish      - the wish text (blank content)
 * @param {string} affirmation - full "I am so happy and grateful…" sentence
 */
function sendWishEmail(toEmail, wish, affirmation) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded — email not sent.');
    return Promise.resolve();
  }

  if (
    EMAILJS_CONFIG.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY' ||
    EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID' ||
    EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID'
  ) {
    console.warn('⚠️  EmailJS is not configured yet. See js/email.js to set it up.');
    return Promise.resolve();
  }

  const templateParams = {
    to_email:    toEmail,
    to_name:     toEmail.split('@')[0],
    wish:        wish,
    affirmation: affirmation,
    date:        new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
  };

  return emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    templateParams
  ).then(() => {
    console.log('✦ Email sent to', toEmail);
  }).catch(err => {
    console.error('Email send error:', err);
  });
}
