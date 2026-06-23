import asyncio
import os
from edge_tts import Communicate

# Ensure output directory exists
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'src', 'remotion', 'assets')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Define voiceover texts for each composition
voice_texts = {
    'AdminDemo': [
        "Integrity audit: Real-time tracking of transaction volume and active escrow flows.",
        "Instant KYC queue moderation to secure trust and safety across the gig economy.",
        "Fully automated ledger audit logs tracking every deposit and release."
    ],
    'HustlerDemo': [
        "Real‑time geofencing radar shows gig providers within your area.",
        "Adjust the radius to expand or narrow your search instantly.",
        "Book the perfect provider with a single tap and confirm via escrow.",
    ],
    'PosterDemo': [
        "Seamless task creation: Hire local verified talent in under a minute.",
        "Define your budget and lock payments securely in a protective escrow vault.",
        "Publish instantly to dispatch nearby gig providers and track job progress."
    ]
}

# Choose a pleasant neural voice (Microsoft's "en-US‑GuyNeural" is a friendly male voice)
VOICE = "en-US-GuyNeural"

async def generate():
    for comp, texts in voice_texts.items():
        # Concatenate with short pauses (500ms) between sentences
        full_text = " ".join(texts)
        communicate = Communicate(full_text, voice=VOICE)
        output_path = os.path.join(OUTPUT_DIR, f"{comp.lower()}_voice.mp3")
        await communicate.save(output_path)
        print(f"Generated voiceover for {comp}: {output_path}")

if __name__ == "__main__":
    asyncio.run(generate())
