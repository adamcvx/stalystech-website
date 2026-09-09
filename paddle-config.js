// StalysTech Paddle configuration.
// Paddle client-side tokens are designed to be public in frontend code.
// Do NOT place a Paddle API key or webhook secret in this file.
window.STALYSTECH_PADDLE = {
  environment: 'sandbox', // change to 'production' when your live account is approved
  clientToken: 'PASTE_PADDLE_CLIENT_SIDE_TOKEN_HERE',
  prices: {
    operating_playbook: 'PASTE_PRICE_ID_OPERATING_PLAYBOOK',
    starter_kit: 'PASTE_PRICE_ID_STARTER_KIT',
    agent_ops_briefing: 'PASTE_PRICE_ID_AGENT_OPS_BRIEFING'
  }
};
