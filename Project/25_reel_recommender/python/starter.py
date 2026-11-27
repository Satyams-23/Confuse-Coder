"""Reel Recommender - YOUR part. Run: python starter.py"""
from feed import run


def distance(a, b):
    """Do points ki doori: har number ka fark, square karo, jodo, phir square root.  (math.sqrt)"""
    # TODO: ~2 lines
    return 0.0


def my_address(watched, reels):
    """Tumne jo reels dekhe, unke numbers ka average (har position ka alag average). List return karo."""
    # TODO: ~3 lines
    return [0.0, 0.0, 0.0]


def recommend(watched, reels, k=3):
    """
    1. you = my_address(watched, reels)
    2. jo reels dekh liye unhe chhod do
    3. baaki ko distance(you, reel) ke hisaab se sort karo (sabse paas pehle)
    4. pehle k naam return karo
    """
    # TODO: ~4 lines
    return []


if __name__ == "__main__":
    run(distance, my_address, recommend)
