"""Reel Recommender - solution. Run: python solution.py"""
import math
from feed import run


def distance(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def my_address(watched, reels):
    vecs = [reels[name] for name in watched]
    return [sum(col) / len(vecs) for col in zip(*vecs)]


def recommend(watched, reels, k=3):
    you = my_address(watched, reels)
    unseen = [name for name in reels if name not in watched]
    return sorted(unseen, key=lambda name: distance(you, reels[name]))[:k]


if __name__ == "__main__":
    run(distance, my_address, recommend)
