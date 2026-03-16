import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, email } = req.body

  if (!userId || !email) {
    return res.status(400).json({ error: 'Missing userId or email' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
      },
      success_url: 'https://qrcrafteasy.vercel.app/dashboard.html?upgraded=1',
      cancel_url: 'https://qrcrafteasy.vercel.app/pricing.html?cancelled=1',
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
}
